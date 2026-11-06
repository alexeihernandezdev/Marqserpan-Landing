import { PageHeader } from "@/components/admin/PageHeader";
import { CategoryManager, NewCategory } from "@/components/admin/CategoryManager";
import { listCategoriesForAdmin } from "@/lib/dal/products";

export const metadata = { title: "Categorías" };

export default async function CategoriesPage() {
  const categories = await listCategoriesForAdmin();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Categorías" description="El orden define cómo se agrupan los productos en el catálogo." />
      {/* key: al crear o renombrar, la página se vuelve a renderizar con la lista actualizada. */}
      <CategoryManager
        key={categories.map((c) => `${c.id}:${c.name}`).join("|")}
        initialCategories={categories.map(({ id, name, productCount }) => ({ id, name, productCount }))}
      />
      <NewCategory />
    </div>
  );
}
