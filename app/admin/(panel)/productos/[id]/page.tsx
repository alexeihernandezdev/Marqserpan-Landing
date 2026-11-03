import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductForAdmin, listCategoriesForAdmin } from "@/lib/dal/products";
import { deleteProduct } from "../actions";

export const metadata = { title: "Editar producto" };

export default async function EditProductPage({ params, searchParams }: PageProps<"/admin/productos/[id]">) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  if (!z.uuid().safeParse(id).success) notFound();
  const [product, categories] = await Promise.all([getProductForAdmin(id), listCategoriesForAdmin()]);
  if (!product) notFound();

  const remove = deleteProduct.bind(null, product.id);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/productos" className="text-sm font-bold underline">
        ← Volver a productos
      </Link>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl">{product.name}</h1>
        {product.isVisible && (
          <Link href={`/productos/${product.slug}`} target="_blank" className="text-sm font-bold underline">
            Ver en la landing ↗
          </Link>
        )}
      </header>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl">Datos</h2>
        <ProductForm
          key={product.id}
          categories={categories}
          product={product}
          initialMessage={query.guardado === "1" ? "Producto guardado. Ahora agrega las fotos." : undefined}
        />
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl">Fotos</h2>
        <ImageUploader
          productId={product.id}
          productName={product.name}
          initialImages={product.images.map((img) => ({
            id: img.id,
            publicId: img.cloudinaryPublicId,
            width: img.width,
            height: img.height,
            alt: img.alt,
          }))}
        />
      </section>

      <div>
        <ConfirmButton
          label="Borrar producto"
          question="¿Borrar este producto y sus fotos? Las solicitudes conservan su nombre."
          onConfirm={remove}
        />
      </div>
    </div>
  );
}
