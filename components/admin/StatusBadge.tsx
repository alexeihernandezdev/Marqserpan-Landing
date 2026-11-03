import type { LeadStatus } from "@/lib/validation/lead-constants";

export function StatusBadge({ status }: { status: LeadStatus }) {
  return status === "nueva" ? (
    <span className="inline-block rounded bg-amarillo px-2 py-0.5 text-xs font-bold text-carbon">Nueva</span>
  ) : (
    <span className="inline-block rounded bg-neutral-200 px-2 py-0.5 text-xs font-bold text-carbon">Atendida</span>
  );
}
