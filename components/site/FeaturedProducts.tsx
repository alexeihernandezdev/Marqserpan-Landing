import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { Catalog as CatalogData } from "@/lib/content/products";
import type { Sections } from "@/lib/validation/content";
import { ProductCard } from "./ProductCard";
import { SectionHeading } from "./sections/SectionHeading";

type Props = { catalog: CatalogData; featured: Sections["featured"] };

/** Productos destacados en la landing; el catálogo completo vive en /catalogo. Oculto si está vacío. */
export function FeaturedProducts({ catalog, featured }: Props) {
  // Sin destacados marcados en el panel se muestran los primeros productos del catálogo.
  const products = catalog.featured.length > 0 ? catalog.featured : catalog.all.slice(0, 3);
  if (products.length === 0) return null;

  return (
    <section id="catalogo" aria-labelledby="catalogo-title" className="bg-hueso py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="catalogo-title" eyebrow="Destacados" title={featured.title} intro={featured.body} />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} compact />
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <ButtonLink href="/catalogo" size="lg" variant="secondary" className="group">
            Ver más productos
            <ArrowRightIcon className="size-5 transition-transform group-hover:translate-x-0.5" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
