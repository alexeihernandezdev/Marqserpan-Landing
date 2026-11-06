"use client";

import { ChevronLeft, ChevronRight, ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useId, useRef, useState } from "react";
import {
  addProductImage,
  deleteProductImage,
  getUploadSignature,
  reorderProductImages,
  updateProductImage,
} from "@/app/admin/(panel)/productos/actions";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";

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
    <div className="flex flex-col gap-5">
      {images.length > 0 ? (
        <ul aria-label="Fotos del producto" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <li key={image.id} className="flex flex-col gap-3 overflow-hidden rounded-lg border bg-card p-3 shadow-xs">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
                <Image src={image.publicId} alt={image.alt} fill sizes="300px" className="object-contain" />
                {index === 0 && <Badge className="absolute top-2 left-2 bg-amarillo font-semibold text-carbon">Portada</Badge>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`alt-${image.id}`} className="text-xs font-semibold">
                  Descripción de la foto
                </Label>
                <Input
                  id={`alt-${image.id}`}
                  defaultValue={image.alt}
                  maxLength={200}
                  onBlur={(e) => e.target.value !== image.alt && saveAlt(image.id, e.target.value)}
                  className="h-8"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Mover foto ${index + 1} antes`}
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => move(index, 1)}
                    disabled={index === images.length - 1}
                    aria-label={`Mover foto ${index + 1} después`}
                  >
                    <ChevronRight />
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => remove(image.id)}
                  aria-label={`Borrar foto ${index + 1}`}
                  className="text-destructive hover:bg-red-50 hover:text-destructive"
                >
                  <Trash2 />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed bg-muted/50 p-4 text-sm text-muted-foreground">
          Todavía no hay fotos. Agrega al menos una para poder publicar el producto.
        </p>
      )}

      <label
        htmlFor={inputId}
        className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-input bg-background px-4 py-8 text-center transition-colors hover:border-primary/60 hover:bg-muted/40 has-[:focus-visible]:border-ring has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50"
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-muted">
          <ImagePlus className="size-5 text-muted-foreground" aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold">Agregar fotos</span>
        <span className="text-xs text-muted-foreground">
          JPG, PNG, WEBP o HEIC, hasta 10 MB. Puedes tomarlas con el teléfono.
        </span>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="sr-only"
        />
      </label>

      {uploads.length > 0 && (
        <ul aria-live="polite" className="flex flex-col gap-2 text-sm">
          {uploads.map((upload) => (
            <li key={upload.name} className="flex flex-col gap-1">
              {upload.error ? (
                <span className="font-medium text-destructive">
                  {upload.name}: {upload.error}
                </span>
              ) : (
                <>
                  <span>
                    Subiendo {upload.name}… {upload.progress}%
                  </span>
                  <span className="h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                    <span className="block h-full bg-primary transition-[width]" style={{ width: `${upload.progress}%` }} />
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      {message && (
        <p role="status" className="text-sm font-medium text-verde-800">
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
