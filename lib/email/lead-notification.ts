import "server-only";
import { Resend } from "resend";
import { toWhatsAppLink } from "@/lib/leads/phone";
import { COUNTRY_LABELS, LEAD_TYPE_LABELS, type Country, type LeadType } from "@/lib/validation/lead-constants";

export type LeadForEmail = {
  id: string;
  type: LeadType;
  name: string;
  phone: string;
  email: string | null;
  businessName: string | null;
  city: string;
  country: Country;
  message: string;
  productName: string | null;
  source: string;
  utmCampaign: string | null;
};

type SendOptions = {
  to: string;
  from: string;
  apiKey: string;
  siteUrl: string;
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function buildLeadEmail(lead: LeadForEmail, siteUrl: string) {
  const typeLabel = LEAD_TYPE_LABELS[lead.type];
  const adminUrl = `${siteUrl}/admin/solicitudes/${lead.id}`;
  const whatsapp = toWhatsAppLink(lead.phone);
  const origin = lead.utmCampaign ? `${lead.source} (campaña: ${lead.utmCampaign})` : lead.source;

  const rows: Array<[string, string]> = [
    ["Tipo", typeLabel],
    ...(lead.productName ? [["Producto", lead.productName] as [string, string]] : []),
    ["Nombre", lead.name],
    ["Teléfono", lead.phone],
    ...(lead.email ? [["Correo", lead.email] as [string, string]] : []),
    ...(lead.businessName ? [["Negocio", lead.businessName] as [string, string]] : []),
    ["Ciudad", `${lead.city}, ${COUNTRY_LABELS[lead.country]}`],
    ["Origen", origin],
  ];

  const subject = `Nueva solicitud: ${typeLabel} — ${lead.name} (${lead.city})`;

  const text = [
    subject,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Mensaje:",
    lead.message,
    "",
    `Escribir por WhatsApp: ${whatsapp}`,
    `Ver en el admin: ${adminUrl}`,
  ].join("\n");

  const html = `<!doctype html><html lang="es"><body style="font-family:Helvetica,Arial,sans-serif;color:#1c1f1d;line-height:1.5">
<h1 style="font-size:20px;margin:0 0 16px">Nueva solicitud: ${escapeHtml(typeLabel)}</h1>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="color:#616161;font-weight:normal">${escapeHtml(label)}</th><td><strong>${escapeHtml(value)}</strong></td></tr>`,
    )
    .join("")}</table>
<p style="margin:16px 0 4px;color:#616161">Mensaje:</p>
<p style="white-space:pre-wrap;margin:0 0 20px">${escapeHtml(lead.message)}</p>
<p><a href="${whatsapp}" style="background:#007a23;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:bold">Escribir por WhatsApp</a></p>
<p><a href="${adminUrl}">Ver la solicitud en el admin</a></p>
</body></html>`;

  return { subject, text, html };
}

/** Envía el aviso al negocio. Nunca lanza: devuelve el estado para guardarlo en la solicitud. */
export async function sendLeadNotification(
  lead: LeadForEmail,
  { to, from, apiKey, siteUrl }: SendOptions,
): Promise<"enviado" | "fallido"> {
  if (!apiKey || !to) {
    console.warn(`Aviso de solicitud ${lead.id} no enviado: falta RESEND_API_KEY o el correo del negocio.`);
    return "fallido";
  }
  try {
    const { subject, text, html } = buildLeadEmail(lead, siteUrl);
    const { error } = await new Resend(apiKey).emails.send({
      from: `Distribuidora Maqserpan <${from}>`,
      to,
      subject,
      text,
      html,
      ...(lead.email ? { replyTo: lead.email } : {}),
    });
    if (error) {
      console.error(`Aviso de solicitud ${lead.id} rechazado por Resend: ${error.name}`);
      return "fallido";
    }
    return "enviado";
  } catch (error) {
    console.error(`Aviso de solicitud ${lead.id} falló: ${(error as Error).name}`);
    return "fallido";
  }
}
