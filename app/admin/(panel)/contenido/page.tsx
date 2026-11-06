import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card } from "@/components/shadcn/card";
import { listSectionsForAdmin } from "@/lib/dal/content";
import { formatDateTime } from "@/lib/format";
import { SECTION_LABELS, SECTION_ORDER } from "@/lib/validation/content";

export const metadata = { title: "Contenido" };

export default async function ContentPage() {
  const rows = await listSectionsForAdmin();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Contenido" description="Las secciones en el orden en que aparecen en la landing." />
      <Card className="py-0">
      <ol className="divide-y">
        {SECTION_ORDER.map((key, index) => {
          const updatedAt = rows.find((r) => r.key === key)?.updatedAt;
          return (
            <li key={key}>
              <Link
                href={`/admin/contenido/${key}`}
                className="group flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-amarillo-50"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground tabular-nums">
                  {index + 1}
                </span>
                <span className="flex-1 font-semibold">{SECTION_LABELS[key]}</span>
                {updatedAt && (
                  <span className="hidden text-xs text-muted-foreground sm:inline">Editada {formatDateTime(updatedAt)}</span>
                )}
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ol>
      </Card>
    </div>
  );
}
