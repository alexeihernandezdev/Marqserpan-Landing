"use client";

import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent } from "@/components/shadcn/card";
import { Label } from "@/components/shadcn/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { LEAD_TYPE_LABELS, LEAD_TYPES } from "@/lib/validation/lead-constants";

type Props = { sources: string[] };

const KEYS = ["estado", "tipo", "origen"] as const;
const ALL = "__todos__";

/** Filtros como parámetros de la URL (se pueden compartir y recargar). */
export function LeadFilters({ sources }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = KEYS.some((key) => searchParams.get(key));

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("pagina");
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  }

  // Radix no admite opciones con valor vacío: «todos» equivale a quitar el filtro.
  const filter = (key: (typeof KEYS)[number], label: string, allLabel: string, options: [string, string][]) => (
    <div className="flex flex-col gap-2">
      <Label htmlFor={`filtro-${key}`} className="font-semibold">
        {label}
      </Label>
      <Select value={searchParams.get(key) ?? ALL} onValueChange={(value) => update(key, value === ALL ? "" : value)}>
        <SelectTrigger id={`filtro-${key}`} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{allLabel}</SelectItem>
          {options.map(([value, text]) => (
            <SelectItem key={value} value={value}>
              {text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <Card className="py-4">
      <CardContent className="grid items-end gap-3 px-4 sm:grid-cols-[1fr_1fr_1fr_auto]">
        {filter("estado", "Estado", "Todas", [
          ["nueva", "Nuevas"],
          ["atendida", "Atendidas"],
        ])}
        {filter("tipo", "Tipo", "Todos", LEAD_TYPES.map((type): [string, string] => [type, LEAD_TYPE_LABELS[type]]))}
        {filter("origen", "Origen", "Todos", sources.map((source): [string, string] => [source, source]))}
        <Button type="button" variant="ghost" disabled={!active} onClick={() => router.push(pathname)}>
          <X /> Limpiar
        </Button>
      </CardContent>
    </Card>
  );
}
