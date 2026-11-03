import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductDetail, ProductDetailSkeleton } from "@/components/site/ProductDetail";
import { ButtonLink } from "@/components/ui/Button";
import { getProductBySlug, getVisibleProductSlugs } from "@/lib/content/products";

// Con Cache Components hace falta al menos un parámetro; sin productos se usa un marcador que da 404.
const NO_PRODUCTS = "sin-productos";

export async function generateStaticParams() {
  const slugs = await getVisibleProductSlugs();
  return (slugs.length > 0 ? slugs : [NO_PRODUCTS]).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/productos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/productos/${product.slug}` },
    openGraph: { title: product.name, description: product.shortDescription },
  };
}

// Los params se leen dentro de <Suspense>: los productos creados después del build reciben la
// estructura común al instante y la ficha se completa y queda en caché (ISR con Cache Components).
export default function ProductPage({ params }: PageProps<"/productos/[slug]">) {
  return (
    <section className="container-page py-10 sm:py-16">
      <ButtonLink href="/#catalogo" variant="ghost" className="mb-6 px-0">
        ← Volver al catálogo
      </ButtonLink>
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductContent params={params} />
      </Suspense>
    </section>
  );
}

async function ProductContent({ params }: Pick<PageProps<"/productos/[slug]">, "params">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetail product={product} headingLevel={1} priority />;
}
