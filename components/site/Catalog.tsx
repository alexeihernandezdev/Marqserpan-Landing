import { Suspense } from "react";
import type { Catalog as CatalogData } from "@/lib/content/products";
import { CatalogBrowser, CatalogResults } from "./CatalogBrowser";
import { SectionCta } from "./SectionCta";

type Props = { catalog: CatalogData; ctaLabel: string };

/** Catálogo completo (/catalogo): destacados primero y luego por categoría, filtrable por marca. */
export function Catalog({ catalog, ctaLabel }: Props) {
  if (catalog.all.length === 0) {
    return (
      <section className="container-page py-20 sm:py-28">
        <h1 className="text-3xl sm:text-[2.75rem]">Catálogo</h1>
        <p className="mt-5 text-lg text-gris">Pronto publicaremos nuestros equipos. Mientras tanto, cuéntanos qué necesitas.</p>
        <SectionCta label={ctaLabel} />
      </section>
    );
  }

  return (
    <section aria-labelledby="catalogo-title" className="bg-hueso pb-20 pt-10 sm:pb-28 sm:pt-16">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4 text-verde-700">Catálogo</p>
          <h1 id="catalogo-title" className="text-4xl text-carbon sm:text-5xl">
            Equipos para tu negocio
          </h1>
          <p className="mt-5 text-lg text-gris">
            Equipos y repuestos para panaderías, cafeterías y charcuterías. Si no lo ves aquí, lo fabricamos o lo
            traemos: pídelo en tu cotización.
          </p>
        </div>

        <Suspense fallback={<CatalogResults catalog={catalog} brand={null} />}>
          <CatalogBrowser catalog={catalog} />
        </Suspense>

        <SectionCta label={ctaLabel} />
      </div>
    </section>
  );
}
