import { ButtonLink } from "@/components/ui/Button";
import type { CatalogProduct } from "@/lib/content/products";
import { ProductGallery } from "./ProductGallery";

type Props = {
  product: CatalogProduct;
  /** h1 en la página propia; h2 dentro de la ventana sobre la landing. */
  headingLevel?: 1 | 2;
  headingId?: string;
  priority?: boolean;
};

/** Ficha de producto compartida por la página y la ventana. Sin precio (FR-007). */
export function ProductDetail({ product, headingLevel = 1, headingId, priority = false }: Props) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <ProductGallery images={product.images} priority={priority} />
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <p className="eyebrow text-verde-700">{product.category.name}</p>
          {product.brand && (
            <span className="rounded-full bg-hueso px-3 py-1 text-xs font-bold text-carbon ring-1 ring-black/10">
              Marca: {product.brand.name}
            </span>
          )}
        </div>
        <Heading id={headingId} className="text-3xl sm:text-4xl">
          {product.name}
        </Heading>
        <p className="text-lg text-carbon">{product.shortDescription}</p>
        {product.description && <p className="whitespace-pre-line text-gris">{product.description}</p>}
        <p className="rounded-xl border border-verde-700/15 bg-verde-700/5 px-4 py-3 text-sm">
          Cotizamos cada pedido con su precio y su plazo. Si no lo tenemos, lo importamos.
        </p>
        <ButtonLink href={`/?producto=${encodeURIComponent(product.slug)}#cotizar`} size="lg" className="sm:self-start">
          Solicitar cotización de este equipo
        </ButtonLink>
      </div>
    </div>
  );
}

/** Marcador mientras carga la ficha (estructura común de la página). */
export function ProductDetailSkeleton() {
  return (
    <div className="grid animate-pulse gap-8 lg:grid-cols-2" aria-hidden="true">
      <div className="aspect-[4/3] rounded-lg bg-hueso" />
      <div className="flex flex-col gap-4">
        <div className="h-4 w-32 rounded bg-hueso" />
        <div className="h-10 w-3/4 rounded bg-hueso" />
        <div className="h-20 rounded bg-hueso" />
      </div>
    </div>
  );
}
