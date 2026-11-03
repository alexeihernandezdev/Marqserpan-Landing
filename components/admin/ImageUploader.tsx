"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import {
  addProductImage,
  deleteProductImage,
  getUploadSignature,
  reorderProductImages,
  updateProductImage,
} from "@/app/admin/(panel)/productos/actions";
import { Button } from "@/components/ui/Button";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@/components/ui/icons";

export type UploaderImage = { id: string; publicId: string; width: number; height: number; alt: string };

type Props = { productId: string; productName: string; initialImages: UploaderImage[] };

type Upload = { name: string; progress: number; error?: string };

function uploadToCloudinary(
  file: File,
  signature: Awaited<ReturnType<typeof getUploadSignature>>,
  onProgress: (percent: number) => void,
): Promise<{ public_id: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append("file", file);
    body.append("api_key", signature.apiKey);
    body.append("timestamp", String(signature.timestamp));
    body.append("signature", signature.signature);
    body.append("folder", signature.folder);
    body.append("allowed_formats", signature.allowed_formats);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText));
      else reject(new Error("Cloudinary rechazó la foto. Usa JPG, PNG, WEBP o HEIC."));
    };
    xhr.onerror = () => reject(new Error("Sin conexión. Inténtalo de nuevo."));
    xhr.send(body);
  });
}

/** Sube fotos directo a Cloudinary con firma del servidor; ordena, describe y borra. */
export function ImageUploader({ productId, productName, initialImages }: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState(initialImages);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setMessage(null);
    const list = Array.from(files);
    setUploads(list.map((file) => ({ name: file.name, progress: 0 })));

    for (const [index, file] of list.entries()) {
      const setUpload = (patch: Partial<Upload>) =>
        setUploads((current) => current.map((u, i) => (i === index ? { ...u, ...patch } : u)));
      try {
        const signature = await getUploadSignature(productId);
        if (file.size > signature.maxBytes) throw new Error("La foto pesa más de 10 MB.");
        const result = await uploadToCloudinary(file, signature, (progress) => setUpload({ progress }));
        const created = await addProductImage(productId, {
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          alt: productName,
        });
        setImages((current) => [
          ...current,
          { id: created.id, publicId: created.cloudinaryPublicId, width: created.width, height: created.height, alt: created.alt },
        ]);
        setUpload({ progress: 100 });
      } catch (error) {
        setUpload({ error: (error as Error).message || "No se pudo subir la foto." });
      }
    }
    setUploads((current) => current.filter((u) => u.error));
    if (inputRef.current) inputRef.current.value = "";
  }

  async function move(index: number, delta: -1 | 1) {
    const target = index + delta;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);
    await reorderProductImages(productId, next.map((img) => img.id));
  }

  async function remove(id: string) {
    const remaining = images.filter((img) => img.id !== id);
    setImages(remaining);
    await deleteProductImage(id);
    if (remaining.length === 0) setMessage("Sin fotos, el producto se ocultó de la landing.");
  }

  async function saveAlt(id: string, alt: string) {
    const trimmed = alt.trim();
    if (!trimmed) return;
    await updateProductImage(id, { alt: trimmed });
    setMessage("Descripción de la foto guardada.");
  }

  return (
    <div className="flex flex-col gap-4">
      {images.length > 0 ? (
        <ul aria-label="Fotos del producto" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <li key={image.id} className="flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded bg-hueso">
                <Image src={image.publicId} alt={image.alt} fill sizes="300px" className="object-contain" />
                {index === 0 && (
                  <span className="absolute left-2 top-2 rounded bg-amarillo px-2 py-0.5 text-xs font-bold">Portada</span>
                )}
              </div>
              <label className="flex flex-col gap-1 text-xs font-bold">
                Descripción de la foto
                <input
                  defaultValue={image.alt}
                  maxLength={200}
                  onBlur={(e) => e.target.value !== image.alt && saveAlt(image.id, e.target.value)}
                  className="rounded border-2 border-neutral-300 px-2 py-1.5 text-sm font-normal"
                />
              </label>
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Mover foto ${index + 1} antes`}
                    className="flex size-9 items-center justify-center rounded hover:bg-hueso disabled:opacity-30"
                  >
                    <ChevronLeftIcon className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === images.length - 1}
                    aria-label={`Mover foto ${index + 1} después`}
                    className="flex size-9 items-center justify-center rounded hover:bg-hueso disabled:opacity-30"
                  >
                    <ChevronRightIcon className="size-5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(image.id)}
                  aria-label={`Borrar foto ${index + 1}`}
                  className="flex size-9 items-center justify-center rounded text-red-700 hover:bg-red-50"
                >
                  <CloseIcon className="size-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg bg-white p-4 text-sm text-gris">
          Todavía no hay fotos. Agrega al menos una para poder publicar el producto.
        </p>
      )}

      <div>
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-bold">
          Agregar fotos
        </label>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="block w-full text-sm file:mr-3 file:min-h-11 file:rounded-md file:border-0 file:bg-carbon file:px-4 file:font-bold file:text-white"
        />
        <p className="mt-1 text-xs text-gris">JPG, PNG, WEBP o HEIC, hasta 10 MB. Puedes tomarlas con el teléfono.</p>
      </div>

      {uploads.length > 0 && (
        <ul aria-live="polite" className="flex flex-col gap-2 text-sm">
          {uploads.map((upload) => (
            <li key={upload.name}>
              {upload.error ? (
                <span className="font-bold text-red-700">
                  {upload.name}: {upload.error}
                </span>
              ) : (
                <span>
                  Subiendo {upload.name}… {upload.progress}%
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      {message && (
        <p role="status" className="text-sm font-bold text-verde-800">
          {message}
        </p>
      )}
      {uploads.some((u) => u.error) && (
        <Button type="button" variant="ghost" onClick={() => setUploads([])} className="self-start">
          Ocultar errores
        </Button>
      )}
    </div>
  );
}
