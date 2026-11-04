import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/Button";
import { MailIcon, WhatsAppIcon } from "@/components/ui/icons";
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
      <Link href="/admin/solicitudes" className="text-sm font-bold underline">
        ← Volver a solicitudes
      </Link>
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl">{lead.name}</h1>
        <StatusBadge status={lead.status} />
      </header>

      {lead.notificationStatus === "fallido" && (
        <p role="status" className="rounded-md border-2 border-red-700 bg-red-50 px-4 py-3 text-sm font-bold text-red-800">
          El aviso por correo falló para esta solicitud. Revísala aquí y responde al cliente.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <a
          href={toWhatsAppLink(lead.phone)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-md bg-verde-700 px-4 font-bold text-white hover:bg-verde-800"
        >
          <WhatsAppIcon className="size-5" /> Escribir por WhatsApp
        </a>
        {lead.email && (
          <a
            href={`mailto:${lead.email}?subject=${encodeURIComponent("Tu cotización — Distribuidora Maqserpan")}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-md border-2 border-carbon bg-white px-4 font-bold hover:bg-hueso"
          >
            <MailIcon className="size-5" /> Correo
          </a>
        )}
        <form action={toggleStatus}>
          <Button type="submit" variant="secondary">
            {nextStatus === "atendida" ? "Marcar como atendida" : "Marcar como nueva"}
          </Button>
        </form>
      </div>

      {lead.completedAt ? (
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-xl">Mensaje</h2>
          <p className="whitespace-pre-line">{lead.message}</p>
        </section>
      ) : (
        <p role="status" className="rounded-md border-2 border-amber-600 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
          Esta persona dejó sus datos de contacto pero no terminó la solicitud. Escríbele para saber qué necesita.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-xl">Datos</h2>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            {details
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-gris">{label}</dt>
                  <dd className="break-words font-bold">{value}</dd>
                </div>
              ))}
          </dl>
        </section>
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-xl">Origen</h2>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            {origin
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-gris">{label}</dt>
                  <dd className="break-all">{value}</dd>
                </div>
              ))}
          </dl>
        </section>
      </div>

      <div>
        <ConfirmButton label="Borrar solicitud" question="¿Borrar esta solicitud para siempre?" onConfirm={remove} />
      </div>
    </div>
  );
}
