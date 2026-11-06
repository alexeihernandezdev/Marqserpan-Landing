import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { Card, CardContent } from "@/components/shadcn/card";
import { listBrandsForAdmin, listCategoriesForAdmin } from "@/lib/dal/products";

export const metadata = { title: "Nuevo producto" };

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([listCategoriesForAdmin(), listBrandsForAdmin()]);
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        back={{ href: "/admin/productos", label: "Volver a productos" }}
        title="Nuevo producto"
        description="Guarda los datos y después podrás subir las fotos."
      />
      <Card>
        <CardContent>
          <ProductForm categories={categories} brands={brands} />
        </CardContent>
      </Card>
    </div>
  );
}
