import { CategoryManager, NewCategory } from "@/components/admin/CategoryManager";
import { listCategoriesForAdmin } from "@/lib/dal/products";

export const metadata = { title: "Categorías" };

export default async function CategoriesPage() {
  const categories = await listCategoriesForAdmin();
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl">Categorías</h1>
        <p className="mt-1 text-gris">El orden define cómo se agrupan los productos en el catálogo.</p>
      </header>
      {/* key: al crear o renombrar, la página se vuelve a renderizar con la lista actualizada. */}
      <CategoryManager
        key={categories.map((c) => `${c.id}:${c.name}`).join("|")}
        initialCategories={categories.map(({ id, name, productCount }) => ({ id, name, productCount }))}
      />
      <NewCategory />
    </div>
  );
}
