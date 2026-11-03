import type { Catalog as CatalogData } from "@/lib/content/products";
import type { Sections } from "@/lib/validation/content";
import { ProductCard } from "./ProductCard";
import { SectionCta } from "./SectionCta";
import { SectionHeading } from "./sections/SectionHeading";

type Props = { catalog: CatalogData; featured: Sections["featured"]; ctaLabel: string };

/** Catálogo: destacados (rebanadoras) primero y luego por categoría. Oculto si está vacío. */
export function Catalog({ catalog, featured, ctaLabel }: Props) {
  if (catalog.all.length === 0) return null;

  return (
    <section id="catalogo" aria-labelledby="catalogo-title" className="bg-hueso py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="catalogo-title" eyebrow="Catálogo" title={featured.title} intro={featured.body} />

        {catalog.featured.length > 0 && (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {catalog.featured.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} featured />
              </li>
            ))}
          </ul>
        )}

        {catalog.groups.map((group) => (
          <div key={group.slug} className="mt-14">
            <h3 className="font-body text-sm font-bold uppercase tracking-wider text-gris">{group.name}</h3>
            <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.products.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </div>
        ))}

        <SectionCta label={ctaLabel} />
      </div>
    </section>
  );
}
