import { ProductList } from "@/components/admin/ProductList";
import { ButtonLink } from "@/components/ui/Button";
import { listProductsForAdmin } from "@/lib/dal/products";

export const metadata = { title: "Productos" };

export default async function ProductsPage() {
  const items = await listProductsForAdmin();
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl">Productos</h1>
          <p className="mt-1 text-gris">El orden de esta lista es el orden del catálogo. Los destacados van primero.</p>
        </div>
        <ButtonLink href="/admin/productos/nuevo">Nuevo producto</ButtonLink>
      </header>
      <ProductList initialItems={items} />
    </div>
  );
}
