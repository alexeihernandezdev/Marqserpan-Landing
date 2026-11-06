"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isAllowedPublicId, signUpload } from "@/lib/cloudinary/server";
import {
  addImageRecord,
  countImages,
  deleteImageRecord,
  deleteProductRecord,
  getProductForAdmin,
  reorderImageRecords,
  reorderProductRecords,
  saveProductRecord,
  setProductFlags,
  updateImageRecord,
} from "@/lib/dal/products";
import { verifySession } from "@/lib/dal/session";
import { type ActionState, pickValues } from "@/lib/forms/action-state";
import { TAGS } from "@/lib/tags";
import { imageSchema, imageUpdateSchema, productSchema } from "@/lib/validation/product";

// Toda acción del catálogo verifica la sesión e invalida la etiqueta "products" para que la
// landing muestre el cambio en la siguiente carga (FR-023).

const NEEDS_PHOTO = "Agrega al menos una foto antes de publicar el producto.";
const idSchema = z.uuid();
const FIELDS = ["name", "slug", "brand", "categoryId", "shortDescription", "description", "isFeatured", "isVisible"] as const;

export async function saveProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await verifySession();
  const values = pickValues(formData, FIELDS);
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  const input = parsed.data;
  if (input.isVisible && (!input.id || (await countImages(input.id)) === 0)) {
    return { status: "error", message: NEEDS_PHOTO, fieldErrors: { isVisible: [NEEDS_PHOTO] }, values };
  }

  let saved;
  try {
    saved = await saveProductRecord(input);
  } catch (error) {
    console.error(`saveProduct falló: ${(error as Error).name}`);
    return { status: "error", message: "No se pudo guardar el producto. Inténtalo de nuevo.", values };
  }
  if (!saved) return { status: "error", message: "El producto ya no existe.", values };

  updateTag(TAGS.products);
  if (!input.id) {
    // Producto nuevo: se pasa a su página de edición para subir las fotos.
    redirect(`/admin/productos/${saved.id}?guardado=1`);
  }
  return { status: "success", message: "Producto guardado.", data: { slug: saved.slug } };
}

export async function deleteProduct(id: string) {
  await verifySession();
  await deleteProductRecord(idSchema.parse(id));
  updateTag(TAGS.products);
  redirect("/admin/productos");
}

export async function reorderProducts(ids: string[]) {
  await verifySession();
  await reorderProductRecords(z.array(idSchema).max(500).parse(ids));
  updateTag(TAGS.products);
}

export async function setProductFlag(
  id: string,
  flag: "isVisible" | "isFeatured",
  value: boolean,
): Promise<{ ok: true } | { ok: false; message: string }> {
  await verifySession();
  const productId = idSchema.parse(id);
  if (flag === "isVisible" && value && (await countImages(productId)) === 0) {
    return { ok: false, message: NEEDS_PHOTO };
  }
  await setProductFlags(productId, { [flag]: value });
  updateTag(TAGS.products);
  return { ok: true };
}

export async function getUploadSignature(productId: string) {
  await verifySession();
  const product = await getProductForAdmin(idSchema.parse(productId));
  if (!product) throw new Error("El producto no existe.");
  return signUpload();
}

export async function addProductImage(productId: string, image: z.input<typeof imageSchema>) {
  await verifySession();
  const id = idSchema.parse(productId);
  const data = imageSchema.parse(image);
  if (!isAllowedPublicId(data.publicId)) throw new Error("Foto fuera de la carpeta del sitio.");
  const product = await getProductForAdmin(id);
  if (!product) throw new Error("El producto no existe.");
  const created = await addImageRecord(id, { ...data, alt: data.alt || product.name });
  updateTag(TAGS.products);
  return created;
}

export async function updateProductImage(id: string, values: z.input<typeof imageUpdateSchema>) {
  await verifySession();
  const updated = await updateImageRecord(idSchema.parse(id), imageUpdateSchema.parse(values));
  updateTag(TAGS.products);
  return updated;
}

export async function reorderProductImages(productId: string, ids: string[]) {
  await verifySession();
  await reorderImageRecords(idSchema.parse(productId), z.array(idSchema).max(50).parse(ids));
  updateTag(TAGS.products);
}

export async function deleteProductImage(id: string) {
  await verifySession();
  await deleteImageRecord(idSchema.parse(id));
  updateTag(TAGS.products);
}
