"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { CatalogBrand, Catalog as CatalogData } from "@/lib/content/products";
import { ProductCard } from "./ProductCard";

type Props = { catalog: CatalogData };

const pill =
  "flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-bold ring-1 transition-colors";
const pillIdle = "bg-white text-carbon ring-black/10 hover:bg-carbon hover:text-white";
const pillActive = "bg-carbon text-white ring-carbon";

/** Lee ?marca= de la URL. Va dentro de <Suspense>: mientras tanto se prerenderiza sin filtro. */
export function CatalogBrowser({ catalog }: Props) {
  const slug = useSearchParams().get("marca");
  const brand = catalog.brands.find((b) => b.slug === slug) ?? null;
  return <CatalogResults catalog={catalog} brand={brand} />;
}

/** Filtro por marca, índice de categorías y productos (destacados primero y luego por categoría). */
export function CatalogResults({ catalog, brand }: Props & { brand: CatalogBrand | null }) {
  const matches = (p: CatalogData["all"][number]) => !brand || p.brand?.slug === brand.slug;
  const featured = catalog.featured.filter(matches);
  const groups = catalog.groups
    .map((group) => ({ ...group, products: group.products.filter(matches) }))
    .filter((group) => group.products.length > 0);
  const total = featured.length + groups.reduce((sum, g) => sum + g.products.length, 0);

  return (
    <>
      <div className="mt-8 flex flex-col gap-4">
        {catalog.brands.length > 1 && (
          <nav aria-label="Filtrar por marca" className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <p className="text-xs font-bold uppercase tracking-wider text-gris">Marca</p>
            <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
              <li className="shrink-0">
                <Link
                  href="/catalogo"
                  replace
                  scroll={false}
                  aria-current={brand ? undefined : "true"}
                  className={`${pill} ${brand ? pillIdle : pillActive}`}
                >
                  Todas
                </Link>
              </li>
              {catalog.brands.map((b) => {
                const active = b.slug === brand?.slug;
                return (
                  <li key={b.slug} className="shrink-0">
                    <Link
                      href={`/catalogo?marca=${encodeURIComponent(b.slug)}`}
                      replace
                      scroll={false}
                      aria-current={active ? "true" : undefined}
                      className={`${pill} ${active ? pillActive : pillIdle}`}
                    >
                      {b.name}
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${active ? "bg-white/15 text-white" : "bg-hueso text-gris"}`}
                      >
                        {b.count}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {groups.length > 1 && (
          <nav aria-label="Categorías del catálogo" className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <p className="text-xs font-bold uppercase tracking-wider text-gris">Categoría</p>
            <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
              {groups.map((group) => (
                <li key={group.slug} className="shrink-0">
                  <a href={`#cat-${group.slug}`} className={`${pill} ${pillIdle}`}>
                    {group.name}
                    <span className="rounded-full bg-hueso px-2 py-0.5 text-xs text-gris">{group.products.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {brand && (
          <p role="status" className="text-gris">
            {total === 1 ? "1 equipo" : `${total} equipos`} de la marca{" "}
            <strong className="text-carbon">{brand.name}</strong>.{" "}
            <Link href="/catalogo" replace scroll={false} className="font-bold text-azul-700 underline underline-offset-4">
              Ver todas las marcas
            </Link>
          </p>
        )}
      </div>

      {featured.length > 0 && <h2 className="sr-only">Destacados</h2>}
      {featured.length > 0 && (
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {featured.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} featured />
            </li>
          ))}
        </ul>
      )}

      {groups.map((group) => (
        <div key={group.slug} id={`cat-${group.slug}`} className="mt-16 scroll-mt-24">
          <div className="flex items-center gap-4">
            <h2 className="font-body text-sm font-bold uppercase tracking-wider text-carbon">{group.name}</h2>
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
    </>
  );
}
