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
        <div className="flex flex-col gap-8">
          <SectionHeading id="catalogo-title" eyebrow="Catálogo" title={featured.title} intro={featured.body} />
          {catalog.groups.length > 1 && (
            <nav aria-label="Categorías del catálogo" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <ul className="flex gap-2 sm:flex-wrap">
                {catalog.groups.map((group) => (
                  <li key={group.slug} className="shrink-0">
                    <a
                      href={`#cat-${group.slug}`}
                      className="flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-carbon ring-1 ring-black/10 transition-colors hover:bg-carbon hover:text-white"
                    >
                      {group.name}
                      <span className="rounded-full bg-hueso px-2 py-0.5 text-xs text-gris">{group.products.length}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        {catalog.featured.length > 0 && (
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {catalog.featured.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} featured />
              </li>
            ))}
          </ul>
        )}

        {catalog.groups.map((group) => (
          <div key={group.slug} id={`cat-${group.slug}`} className="mt-16 scroll-mt-24">
            <div className="flex items-center gap-4">
              <h3 className="font-body text-sm font-bold uppercase tracking-wider text-carbon">{group.name}</h3>
              <span aria-hidden="true" className="h-px flex-1 bg-black/10" />
            </div>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
