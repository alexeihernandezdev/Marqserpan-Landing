"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/Select";
import { LEAD_TYPE_LABELS, LEAD_TYPES } from "@/lib/validation/lead-constants";

type Props = { sources: string[] };

/** Filtros como parámetros de la URL (se pueden compartir y recargar). */
export function LeadFilters({ sources }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("pagina");
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <label className="flex flex-col gap-1 text-sm font-bold">
        Estado
        <Select value={searchParams.get("estado") ?? ""} onChange={(e) => update("estado", e.target.value)}>
          <option value="">Todas</option>
          <option value="nueva">Nuevas</option>
          <option value="atendida">Atendidas</option>
        </Select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-bold">
        Tipo
        <Select value={searchParams.get("tipo") ?? ""} onChange={(e) => update("tipo", e.target.value)}>
          <option value="">Todos</option>
          {LEAD_TYPES.map((type) => (
            <option key={type} value={type}>
              {LEAD_TYPE_LABELS[type]}
            </option>
          ))}
        </Select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-bold">
        Origen
        <Select value={searchParams.get("origen") ?? ""} onChange={(e) => update("origen", e.target.value)}>
          <option value="">Todos</option>
          {sources.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </Select>
      </label>
    </div>
  );
}
