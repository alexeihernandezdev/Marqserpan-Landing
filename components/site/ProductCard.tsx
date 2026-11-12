import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { CatalogProduct } from "@/lib/content/products";

type Props = {
  product: CatalogProduct;
  featured?: boolean;
  /** Tarjeta reducida para la fila de destacados de la landing (4 por fila). */
  compact?: boolean;
};

/** Tarjeta del catálogo. Nunca muestra precio (FR-007). */
export function ProductCard({ product, featured = false, compact = false }: Props) {
  const cover = product.images[0];
  // Las fotos apaisadas llenan el marco; las verticales se contienen y su fondo claro se funde.
  const landscape = cover && cover.height > 0 && cover.width / cover.height >= 1.2;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-black/5 transition-[box-shadow,transform] duration-200 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgb(0_0_0/0.25)]">
      <div className={`photo-surface relative m-2 overflow-hidden rounded-[1.25rem] ${featured ? "aspect-[16/11]" : "aspect-[4/3]"}`}>
        {cover && (
          <Image
            src={cover.publicId}
            alt={cover.alt}
            fill
            sizes={
              featured
                ? "(min-width: 768px) 50vw, 100vw"
                : compact
                  ? "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            }
            className={`${landscape ? "object-cover" : compact ? "object-contain p-4" : "object-contain p-6"} transition-transform duration-500 group-hover:scale-[1.04]`}
          />
        )}
        {product.brand && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-carbon ring-1 ring-black/10 backdrop-blur-sm">
            {product.brand.name}
          </span>
        )}
        {featured && (
          <span className="absolute left-3 top-3 rounded-full bg-carbon px-3 py-1 text-sm font-bold text-white">
            Destacado
          </span>
        )}
      </div>
      <div className={`flex flex-1 flex-col gap-2 ${compact ? "px-4 pb-4 pt-2" : "px-5 pb-5 pt-3 sm:px-6 sm:pb-6"}`}>
        <p className="self-start rounded-full bg-verde-700/10 px-2.5 py-0.5 text-xs font-bold text-verde-700 ring-1 ring-inset ring-verde-700/20">
          {product.category.name}
        </p>
        <h3 className={featured ? "text-2xl" : compact ? "text-lg leading-snug" : "text-xl"}>
          {/* El enlace cubre toda la tarjeta. */}
          <Link href={`/productos/${product.slug}`} scroll={false} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </h3>
        <p className={compact ? "line-clamp-2 text-sm text-gris" : "text-gris"}>{product.shortDescription}</p>
        <p className={`mt-auto flex items-center justify-between gap-3 border-t border-neutral-100 text-sm font-bold text-azul-700 ${compact ? "pt-3" : "pt-4"}`}>
          Ver detalles y cotizar
          <span
            aria-hidden="true"
            className="flex size-9 items-center justify-center rounded-full bg-hueso text-carbon transition-colors group-hover:bg-verde-700 group-hover:text-white"
          >
            <ArrowRightIcon className="size-4" />
          </span>
        </p>
      </div>
    </article>
  );
}
