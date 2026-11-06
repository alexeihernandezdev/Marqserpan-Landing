import Link from "next/link";
import { Badge } from "@/components/shadcn/badge";
import { Card } from "@/components/shadcn/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { formatDateTime } from "@/lib/format";
import {
  COUNTRY_LABELS,
  LEAD_TYPE_LABELS,
  type Country,
  type LeadStatus,
  type LeadType,
} from "@/lib/validation/lead-constants";
import { StatusBadge } from "./StatusBadge";

type Row = {
  id: string;
  type: LeadType | null;
  name: string;
  city: string;
  country: Country;
  source: string;
  status: LeadStatus;
  productName: string | null;
  notificationStatus: "pendiente" | "enviado" | "fallido";
  completedAt: Date | null;
  createdAt: Date;
};

export function LeadsTable({ rows }: { rows: Row[] }) {
  if (rows.length === 0) {
    return (
      <Card className="items-center py-10 text-center text-sm text-muted-foreground">
        No hay solicitudes con estos filtros.
      </Card>
    );
  }
  return (
    <Card className="overflow-hidden py-0">
      <Table className="min-w-[640px]">
        <TableCaption className="sr-only">Solicitudes recibidas</TableCaption>
        <TableHeader className="bg-muted/60">
          <TableRow>
            <TableHead className="px-4">Fecha</TableHead>
            <TableHead className="px-4">Nombre</TableHead>
            <TableHead className="px-4">Tipo</TableHead>
            <TableHead className="px-4">Ciudad</TableHead>
            <TableHead className="px-4">Origen</TableHead>
            <TableHead className="px-4">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((lead) => (
            <TableRow key={lead.id} className={lead.status === "nueva" ? "bg-amarillo-50/50" : undefined}>
              <TableCell className="px-4 py-3 text-muted-foreground">{formatDateTime(lead.createdAt)}</TableCell>
              <TableCell className="px-4 py-3">
                <Link href={`/admin/solicitudes/${lead.id}`} className="font-semibold underline-offset-4 hover:underline">
                  {lead.name}
                </Link>
                {lead.productName && <span className="block text-xs text-muted-foreground">{lead.productName}</span>}
              </TableCell>
              <TableCell className="px-4 py-3">
                {lead.type ? LEAD_TYPE_LABELS[lead.type] : <span className="text-muted-foreground">—</span>}
                {!lead.completedAt && (
                  <Badge variant="outline" className="mt-1 flex border-amber-500/50 bg-amber-50 text-amber-800">
                    Solo contacto
                  </Badge>
                )}
              </TableCell>
              <TableCell className="px-4 py-3">
                {lead.city}
                {lead.country !== "VE" && <span className="text-muted-foreground"> · {COUNTRY_LABELS[lead.country]}</span>}
              </TableCell>
              <TableCell className="px-4 py-3">
                <Badge variant="outline">{lead.source}</Badge>
              </TableCell>
              <TableCell className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <StatusBadge status={lead.status} />
                  {lead.notificationStatus === "fallido" && <Badge variant="destructive">Aviso fallido</Badge>}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
