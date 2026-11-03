"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { z } from "zod";
import { getBusinessSettings } from "@/lib/content/queries";
import { sendLeadNotification } from "@/lib/email/lead-notification";
import { env, siteUrl } from "@/lib/env";
import { type ActionState, pickValues } from "@/lib/forms/action-state";
import { createLead, setNotificationStatus } from "@/lib/leads/create-lead";
import { hashIp, isRateLimited } from "@/lib/leads/rate-limit";
import { deriveSource } from "@/lib/leads/source";
import { LEAD_FORM_FIELDS, leadSchema } from "@/lib/validation/lead";

const MIN_FILL_MS = 3_000;

function field(formData: FormData, name: string): string | undefined {
  const value = formData.get(name);
  return typeof value === "string" ? value : undefined;
}

/** Formulario de cotización. Ver contracts/server-actions.md#submitlead. */
export async function submitLead(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const values = pickValues(formData, [...LEAD_FORM_FIELDS, "productSlug", "productName"]);

  try {
    const settings = await getBusinessSettings();
    const success: ActionState = { status: "success", data: { whatsapp: settings.whatsapp } };

    // 1. Antispam: campo trampa con valor o envío demasiado rápido → éxito sin guardar.
    const renderedAt = Number(field(formData, "renderedAt"));
    if (field(formData, "website") || !Number.isFinite(renderedAt) || Date.now() - renderedAt < MIN_FILL_MS) {
      return success;
    }

    // 2. Validación.
    const parsed = leadSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return {
        status: "error",
        message: "Revisa los campos marcados.",
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
        values,
      };
    }

    // 3. Límite de envíos por IP.
    const requestHeaders = await headers();
    const ip =
      requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      requestHeaders.get("x-real-ip") ||
      "unknown";
    const ipHash = hashIp(ip);
    if (await isRateLimited(ipHash)) {
      return {
        status: "error",
        message: "Recibimos varias solicitudes seguidas. Espera unos minutos o escríbenos por WhatsApp.",
        values,
      };
    }

    // 4. Guardar (un submissionId repetido no duplica).
    const source = deriveSource({
      utmSource: parsed.data.utmSource,
      referrer: parsed.data.referrer,
      userAgent: requestHeaders.get("user-agent"),
      siteHost: requestHeaders.get("host") ?? new URL(siteUrl()).host,
    });
    const { lead, created } = await createLead({ ...parsed.data, source, ipHash });

    // 5. Aviso por correo después de responder: si falla, la solicitud ya está guardada.
    if (created && lead) {
      const config = env();
      after(async () => {
        const status = await sendLeadNotification(lead, {
          to: settings.email,
          from: config.EMAIL_FROM,
          apiKey: config.RESEND_API_KEY,
          siteUrl: siteUrl(),
        });
        await setNotificationStatus(lead.id, status);
      });
    }

    return success;
  } catch (error) {
    console.error(`submitLead falló: ${(error as Error).name}`);
    return {
      status: "error",
      message: "No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo.",
      values,
    };
  }
}
