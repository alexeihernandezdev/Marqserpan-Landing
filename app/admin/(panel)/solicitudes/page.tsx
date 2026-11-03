import Link from "next/link";
import { LeadFilters } from "@/components/admin/LeadFilters";
import { LeadsTable } from "@/components/admin/LeadsTable";
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
      <header>
        <h1 className="text-3xl">Solicitudes</h1>
        <p className="mt-1 text-gris">
          {total} {total === 1 ? "solicitud" : "solicitudes"}
        </p>
      </header>
      <LeadFilters sources={sources} />
      <LeadsTable rows={rows} />
      {pages > 1 && (
        <nav aria-label="Páginas" className="flex items-center gap-3">
          {page > 1 && (
            <Link href={pageHref(page - 1)} className="font-bold underline">
              ← Anteriores
            </Link>
          )}
          <span className="text-sm text-gris">
            Página {page} de {pages}
          </span>
          {page < pages && (
            <Link href={pageHref(page + 1)} className="font-bold underline">
              Siguientes →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
