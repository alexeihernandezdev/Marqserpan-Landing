import Image from "next/image";
import Link from "next/link";
import type { CatalogProduct } from "@/lib/content/products";

type Props = { product: CatalogProduct; featured?: boolean };

/** Tarjeta del catálogo. Nunca muestra precio (FR-007). */
export function ProductCard({ product, featured = false }: Props) {
  const cover = product.images[0];
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/5">
      <div className="relative aspect-[4/3] bg-hueso">
        {cover && (
          <Image
            src={cover.publicId}
            alt={cover.alt}
            fill
            sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}
        {featured && (
          <span className="absolute left-3 top-3 rounded-full bg-carbon/85 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur">
            Destacado
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-sm font-bold text-verde-700">{product.category.name}</p>
        <h3 className="text-xl">
          {/* El enlace cubre toda la tarjeta. */}
          <Link href={`/productos/${product.slug}`} scroll={false} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </h3>
        <p className="text-gris">{product.shortDescription}</p>
        <p className="mt-auto pt-2 text-sm font-bold text-azul-700">Ver detalles y cotizar →</p>
      </div>
    </article>
  );
}
