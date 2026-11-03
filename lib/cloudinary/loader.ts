"use client";

import type { ImageLoaderProps } from "next/image";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/**
 * Loader de next/image. Las fotos de productos (publicId de Cloudinary) se piden con el
 * formato (WebP/AVIF) y el ancho justos. Los archivos locales (/brand/…) se sirven tal cual.
 */
export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  if (src.startsWith("/") || src.startsWith("data:")) {
    return `${src}?w=${width}`;
  }
  const transforms = ["f_auto", `q_${quality ?? "auto"}`, "c_limit", `w_${width}`].join(",");
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${src}`;
}
