import { Badge } from "@/components/shadcn/badge";
import type { LeadStatus } from "@/lib/validation/lead-constants";

export function StatusBadge({ status }: { status: LeadStatus }) {
  return status === "nueva" ? (
    <Badge className="bg-amarillo font-semibold text-carbon">Nueva</Badge>
  ) : (
    <Badge variant="secondary" className="border-border font-semibold">
      Atendida
    </Badge>
  );
}
