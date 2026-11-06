import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { LeadFilters } from "@/components/admin/LeadFilters";
import { LeadsTable } from "@/components/admin/LeadsTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/shadcn/button";
import { listLeadSources, listLeads } from "@/lib/dal/leads";
import { LEAD_STATUSES, LEAD_TYPES, type LeadStatus, type LeadType } from "@/lib/validation/lead-constants";

export const metadata = { title: "Solicitudes" };

const pick = <T extends string>(value: unknown, allowed: readonly T[]): T | undefined =>
  typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : undefined;

export default async function LeadsPage({ searchParams }: PageProps<"/admin/solicitudes">) {
  const params = await searchParams;
  const status = pick<LeadStatus>(params.estado, LEAD_STATUSES);
  const type = pick<LeadType>(params.tipo, LEAD_TYPES);
  const source = typeof params.origen === "string" ? params.origen.slice(0, 200) : undefined;
  const page = Number(params.pagina) || 1;

  const [{ rows, total, pages }, sources] = await Promise.all([
    listLeads({ status, type, source, page }),
    listLeadSources(),
  ]);

  const pageHref = (n: number) => {
    const query = new URLSearchParams();
    if (status) query.set("estado", status);
    if (type) query.set("tipo", type);
    if (source) query.set("origen", source);
    if (n > 1) query.set("pagina", String(n));
    const q = query.toString();
    return `/admin/solicitudes${q ? `?${q}` : ""}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Solicitudes" description={`${total} ${total === 1 ? "solicitud" : "solicitudes"}`} />
      <LeadFilters sources={sources} />
      <LeadsTable rows={rows} />
      {pages > 1 && (
        <nav aria-label="Páginas" className="flex items-center justify-between gap-3">
          <span className="text-sm text-muted-foreground">
            Página {page} de {pages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Button asChild variant="outline" size="sm">
                <Link href={pageHref(page - 1)}>
                  <ChevronLeft /> Anteriores
                </Link>
              </Button>
            )}
            {page < pages && (
              <Button asChild variant="outline" size="sm">
                <Link href={pageHref(page + 1)}>
                  Siguientes <ChevronRight />
                </Link>
              </Button>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
