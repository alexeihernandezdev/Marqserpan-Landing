import Link from "next/link";
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
    return <p className="rounded-lg bg-white p-6 text-gris">No hay solicitudes con estos filtros.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
      <table className="w-full min-w-[640px] text-left text-sm">
        <caption className="sr-only">Solicitudes recibidas</caption>
        <thead className="border-b border-neutral-200 text-xs uppercase tracking-wide text-gris">
          <tr>
            <th scope="col" className="px-4 py-3">Fecha</th>
            <th scope="col" className="px-4 py-3">Nombre</th>
            <th scope="col" className="px-4 py-3">Tipo</th>
            <th scope="col" className="px-4 py-3">Ciudad</th>
            <th scope="col" className="px-4 py-3">Origen</th>
            <th scope="col" className="px-4 py-3">Estado</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((lead) => (
            <tr key={lead.id} className="border-b border-neutral-100 last:border-0 hover:bg-hueso">
              <td className="whitespace-nowrap px-4 py-3 text-gris">{formatDateTime(lead.createdAt)}</td>
              <td className="px-4 py-3">
                <Link href={`/admin/solicitudes/${lead.id}`} className="font-bold underline-offset-4 hover:underline">
                  {lead.name}
                </Link>
                {lead.productName && <span className="block text-xs text-gris">{lead.productName}</span>}
              </td>
              <td className="px-4 py-3">
                {lead.type ? LEAD_TYPE_LABELS[lead.type] : <span className="text-gris">—</span>}
                {!lead.completedAt && (
                  <span className="block text-xs font-bold text-amber-700">Solo contacto</span>
                )}
              </td>
              <td className="px-4 py-3">
                {lead.city}
                {lead.country !== "VE" && <span className="text-gris"> · {COUNTRY_LABELS[lead.country]}</span>}
              </td>
              <td className="px-4 py-3">{lead.source}</td>
              <td className="px-4 py-3">
                <StatusBadge status={lead.status} />
                {lead.notificationStatus === "fallido" && (
                  <span className="ml-2 text-xs font-bold text-red-700">Aviso fallido</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
