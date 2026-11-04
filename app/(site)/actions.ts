"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { z } from "zod";
import { getBusinessSettings } from "@/lib/content/queries";
import { sendLeadNotification } from "@/lib/email/lead-notification";
import { env, siteUrl } from "@/lib/env";
import { type ActionState, pickValues } from "@/lib/forms/action-state";
import { createLead, leadExists, saveLeadContact, setNotificationStatus } from "@/lib/leads/create-lead";
import { hashIp, isRateLimited } from "@/lib/leads/rate-limit";
import { deriveSource } from "@/lib/leads/source";
import { LEAD_CONTACT_FIELDS, LEAD_FORM_FIELDS, leadContactSchema, leadSchema } from "@/lib/validation/lead";

const MIN_FILL_MS = 3_000;

function field(formData: FormData, name: string): string | undefined {
  const value = formData.get(name);
  return typeof value === "string" ? value : undefined;
}

const RATE_LIMITED = {
  status: "error" as const,
  message: "Recibimos varias solicitudes seguidas. Espera unos minutos o escríbenos por WhatsApp.",
};

async function requestContext() {
  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";
  return {
    ipHash: hashIp(ip),
    userAgent: requestHeaders.get("user-agent"),
    siteHost: requestHeaders.get("host") ?? new URL(siteUrl()).host,
  };
}

function isBot(formData: FormData): boolean {
  const renderedAt = Number(field(formData, "renderedAt"));
  return Boolean(field(formData, "website")) || !Number.isFinite(renderedAt) || Date.now() - renderedAt < MIN_FILL_MS;
}

/**
 * Paso 1 del formulario: guarda los datos de contacto en cuanto la persona pulsa «Continuar»,
 * para poder contactarla aunque no termine el paso 2.
 */
export async function submitLeadContact(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const values = pickValues(formData, LEAD_CONTACT_FIELDS);

  try {
    // Antispam: se responde como si se hubiera guardado.
    if (isBot(formData)) return { status: "success" };

    const parsed = leadContactSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return {
        status: "error",
        message: "Revisa los campos marcados.",
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
        values,
      };
    }

    const ctx = await requestContext();
    // Volver al paso 1 y corregir no cuenta como otra solicitud.
    if (!(await leadExists(parsed.data.submissionId)) && (await isRateLimited(ctx.ipHash))) {
      return { ...RATE_LIMITED, values };
    }

    const source = deriveSource({
      utmSource: parsed.data.utmSource,
      referrer: parsed.data.referrer,
      userAgent: ctx.userAgent,
      siteHost: ctx.siteHost,
    });
    await saveLeadContact({ ...parsed.data, source, ipHash: ctx.ipHash });
    return { status: "success" };
  } catch (error) {
    console.error(`submitLeadContact falló: ${(error as Error).name}`);
    return {
      status: "error",
      message: "No pudimos guardar tus datos. Revisa tu conexión e inténtalo de nuevo.",
      values,
    };
  }
}

/** Formulario de cotización. Ver contracts/server-actions.md#submitlead. */
export async function submitLead(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const values = pickValues(formData, [...LEAD_FORM_FIELDS, "productSlug", "productName"]);

  try {
    const settings = await getBusinessSettings();
    const success: ActionState = { status: "success", data: { whatsapp: settings.whatsapp } };

    // 1. Antispam: campo trampa con valor o envío demasiado rápido → éxito sin guardar.
    if (isBot(formData)) return success;

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

    // 3. Límite de envíos por IP (si el paso de contacto ya creó la fila, ya se contó).
    const ctx = await requestContext();
    if (!(await leadExists(parsed.data.submissionId)) && (await isRateLimited(ctx.ipHash))) {
      return { ...RATE_LIMITED, values };
    }

    // 4. Guardar (completa la fila del paso de contacto; un submissionId repetido no duplica).
    const source = deriveSource({
      utmSource: parsed.data.utmSource,
      referrer: parsed.data.referrer,
      userAgent: ctx.userAgent,
      siteHost: ctx.siteHost,
    });
    const { lead, created } = await createLead({ ...parsed.data, source, ipHash: ctx.ipHash });

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
