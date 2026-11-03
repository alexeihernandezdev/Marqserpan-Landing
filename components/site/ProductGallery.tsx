"use client";

import Image from "next/image";
import { useState } from "react";
import type { CatalogImage } from "@/lib/content/products";

type Props = { images: CatalogImage[]; priority?: boolean };

/** Foto principal y miniaturas; las miniaturas son botones accesibles con teclado. */
export function ProductGallery({ images, priority = false }: Props) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  if (!current) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-hueso">
        <Image
          src={current.publicId}
          alt={current.alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain"
        />
      </div>
      {images.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto pb-1" aria-label="Fotos del producto">
          {images.map((image, index) => (
            <li key={image.publicId} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Ver foto ${index + 1} de ${images.length}`}
                aria-current={index === active ? "true" : undefined}
                className={`relative block size-20 overflow-hidden rounded-md border-2 ${
                  index === active ? "border-verde-700" : "border-transparent"
                }`}
              >
                <Image src={image.publicId} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
