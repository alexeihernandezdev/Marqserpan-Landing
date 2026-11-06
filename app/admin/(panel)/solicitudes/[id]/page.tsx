import { CheckCheck, Mail, RotateCcw } from "lucide-react";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Notice } from "@/components/admin/FormMessage";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { WhatsAppIcon } from "@/components/ui/icons";
import { getLead } from "@/lib/dal/leads";
import { formatDateTime } from "@/lib/format";
import { toWhatsAppLink } from "@/lib/leads/phone";
import { COUNTRY_LABELS, LEAD_TYPE_LABELS } from "@/lib/validation/lead-constants";
import { deleteLead, setLeadStatus } from "../actions";

export const metadata = { title: "Solicitud" };

export default async function LeadDetailPage({ params }: PageProps<"/admin/solicitudes/[id]">) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const lead = await getLead(id);
  if (!lead) notFound();

  const nextStatus = lead.status === "nueva" ? "atendida" : "nueva";
  const toggleStatus = setLeadStatus.bind(null, lead.id, nextStatus);
  const remove = deleteLead.bind(null, lead.id);

  const details: Array<[string, string | null]> = [
    ["Tipo", lead.type ? LEAD_TYPE_LABELS[lead.type] : null],
    ["Producto", lead.productName],
    ["Teléfono", lead.phone],
    ["Correo", lead.email],
    ["Negocio", lead.businessName],
    ["Ciudad", `${lead.city}, ${COUNTRY_LABELS[lead.country]}`],
    ["Recibida", formatDateTime(lead.createdAt)],
    ["Atendida", lead.attendedAt ? formatDateTime(lead.attendedAt) : null],
  ];
  const origin: Array<[string, string | null]> = [
    ["Origen", lead.source],
    ["utm_source", lead.utmSource],
    ["utm_medium", lead.utmMedium],
    ["utm_campaign", lead.utmCampaign],
    ["utm_content", lead.utmContent],
    ["utm_term", lead.utmTerm],
    ["Página de entrada", lead.landingUrl],
    ["Referencia", lead.referrer],
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        back={{ href: "/admin/solicitudes", label: "Volver a solicitudes" }}
        title={lead.name}
        badge={<StatusBadge status={lead.status} />}
        description={`Recibida ${formatDateTime(lead.createdAt)}`}
      />

      {lead.notificationStatus === "fallido" && (
        <Notice tone="error">El aviso por correo falló para esta solicitud. Revísala aquí y responde al cliente.</Notice>
      )}

      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <a href={toWhatsAppLink(lead.phone)} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon className="size-4" /> Escribir por WhatsApp
          </a>
        </Button>
        {lead.email && (
          <Button asChild variant="outline">
            <a href={`mailto:${lead.email}?subject=${encodeURIComponent("Tu cotización — Distribuidora Maqserpan")}`}>
              <Mail /> Correo
            </a>
          </Button>
        )}
        <form action={toggleStatus}>
          <Button type="submit" variant="outline">
            {nextStatus === "atendida" ? <CheckCheck /> : <RotateCcw />}
            {nextStatus === "atendida" ? "Marcar como atendida" : "Marcar como nueva"}
          </Button>
        </form>
      </div>

      {lead.completedAt ? (
        <Card>
          <CardHeader>
            <CardTitle>
              <h2 className="text-xl">Mensaje</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{lead.message}</p>
          </CardContent>
        </Card>
      ) : (
        <Notice tone="warning">
          Esta persona dejó sus datos de contacto pero no terminó la solicitud. Escríbele para saber qué necesita.
        </Notice>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <DetailsCard title="Datos" rows={details} />
        <DetailsCard title="Origen" rows={origin} breakAll />
      </div>

      <div>
        <ConfirmButton label="Borrar solicitud" question="¿Borrar esta solicitud para siempre?" onConfirm={remove} />
      </div>
    </div>
  );
}

function DetailsCard({ title, rows, breakAll }: { title: string; rows: Array<[string, string | null]>; breakAll?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-xl">{title}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="divide-y text-sm">
          {rows
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <div key={label} className="grid grid-cols-[8rem_1fr] gap-3 py-2 first:pt-0 last:pb-0">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className={breakAll ? "break-all" : "font-medium break-words"}>{value}</dd>
              </div>
            ))}
        </dl>
      </CardContent>
    </Card>
  );
}
