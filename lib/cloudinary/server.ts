import "server-only";
import { v2 as cloudinary } from "cloudinary";
import { env, isProduction } from "@/lib/env";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED_FORMATS = "jpg,jpeg,png,webp,avif,heic";

function configured() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = env();
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Faltan las credenciales de Cloudinary (CLOUDINARY_*).");
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
  return { cloudName: CLOUDINARY_CLOUD_NAME, apiKey: CLOUDINARY_API_KEY, apiSecret: CLOUDINARY_API_SECRET };
}

/** Las fotos de producción y las de pruebas/vistas previas viven en carpetas separadas. */
export function uploadFolder(): string {
  return isProduction() ? "maqserpan/products" : "maqserpan-test";
}

/** Firma para subir directo desde el navegador (las fotos no pasan por el servidor). */
export function signUpload() {
  const { cloudName, apiKey, apiSecret } = configured();
  const timestamp = Math.round(Date.now() / 1000);
  const params = { timestamp, folder: uploadFolder(), allowed_formats: ALLOWED_FORMATS };
  const signature = cloudinary.utils.api_sign_request(params, apiSecret);
  return { ...params, signature, apiKey, cloudName, maxBytes: MAX_UPLOAD_BYTES };
}

/** Solo se aceptan fotos subidas a la carpeta del sitio. */
export function isAllowedPublicId(publicId: string): boolean {
  return publicId.startsWith(`${uploadFolder()}/`) && !publicId.includes("..");
}

/** Borra la foto en Cloudinary. No lanza: un fallo aquí no debe impedir borrar en la BD. */
export async function destroyImage(publicId: string): Promise<void> {
  if (!isAllowedPublicId(publicId)) return;
  try {
    configured();
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
  } catch (error) {
    console.error(`No se pudo borrar la foto en Cloudinary: ${(error as Error).name}`);
  }
}
