import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { listCategoriesForAdmin } from "@/lib/dal/products";

export const metadata = { title: "Nuevo producto" };

export default async function NewProductPage() {
  const categories = await listCategoriesForAdmin();
  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/productos" className="text-sm font-bold underline">
        ← Volver a productos
      </Link>
      <h1 className="text-3xl">Nuevo producto</h1>
      <p className="text-gris">Guarda los datos y después podrás subir las fotos.</p>
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <ProductForm categories={categories} />
      </section>
    </div>
  );
}
