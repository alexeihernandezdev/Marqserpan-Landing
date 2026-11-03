import Link from "next/link";
import { listSectionsForAdmin } from "@/lib/dal/content";
import { formatDateTime } from "@/lib/format";
import { SECTION_LABELS, SECTION_ORDER } from "@/lib/validation/content";

export const metadata = { title: "Contenido" };

export default async function ContentPage() {
  const rows = await listSectionsForAdmin();
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl">Contenido</h1>
        <p className="mt-1 text-gris">Las secciones en el orden en que aparecen en la landing.</p>
      </header>
      <ol className="flex flex-col gap-2">
        {SECTION_ORDER.map((key, index) => {
          const updatedAt = rows.find((r) => r.key === key)?.updatedAt;
          return (
            <li key={key}>
              <Link
                href={`/admin/contenido/${key}`}
                className="flex items-center justify-between gap-3 rounded-lg bg-white p-4 shadow-sm hover:bg-amarillo-50"
              >
                <span>
                  <span className="mr-2 text-gris">{index + 1}.</span>
                  <strong>{SECTION_LABELS[key]}</strong>
                </span>
                {updatedAt && <span className="text-xs text-gris">Editada {formatDateTime(updatedAt)}</span>}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
