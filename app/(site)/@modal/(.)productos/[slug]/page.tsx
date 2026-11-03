import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductDetail } from "@/components/site/ProductDetail";
import { Modal } from "@/components/ui/Modal";
import { getProductBySlug, getVisibleProductSlugs } from "@/lib/content/products";

const NO_PRODUCTS = "sin-productos";

export async function generateStaticParams() {
  const slugs = await getVisibleProductSlugs();
  return (slugs.length > 0 ? slugs : [NO_PRODUCTS]).map((slug) => ({ slug }));
}

/** Ficha como ventana sobre la landing al navegar desde el catálogo (ruta interceptada). */
export default function ProductModal({ params }: PageProps<"/productos/[slug]">) {
  return (
    <Suspense fallback={null}>
      <ProductModalContent params={params} />
    </Suspense>
  );
}

async function ProductModalContent({ params }: Pick<PageProps<"/productos/[slug]">, "params">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const headingId = `producto-${product.slug}`;
  return (
    <Modal labelledBy={headingId}>
      <ProductDetail product={product} headingLevel={2} headingId={headingId} />
    </Modal>
  );
}
