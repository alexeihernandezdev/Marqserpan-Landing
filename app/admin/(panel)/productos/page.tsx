import { Plus } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductList } from "@/components/admin/ProductList";
import { Button } from "@/components/shadcn/button";
import { listProductsForAdmin } from "@/lib/dal/products";

export const metadata = { title: "Productos" };

export default async function ProductsPage() {
  const items = await listProductsForAdmin();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Productos"
        description="El orden de esta lista es el orden del catálogo. Los destacados van primero."
        actions={
          <Button asChild>
            <Link href="/admin/productos/nuevo">
              <Plus /> Nuevo producto
            </Link>
          </Button>
        }
      />
      <ProductList initialItems={items} />
    </div>
  );
}
