import { z } from "zod";
import { normalizePhone } from "@/lib/leads/phone";
import { COUNTRIES, LEAD_TYPES } from "./lead-constants";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max * 4)
    .optional()
    .transform((value) => (value ? value.slice(0, max) : null));

const PHONE_ERROR = "Revisa el teléfono: escribe el número completo, por ejemplo 0416-1234567";

// Esquema del formulario de cotización (contracts/server-actions.md#submitlead).
export const leadSchema = z
  .object({
    submissionId: z.uuid(),
    type: z.enum(LEAD_TYPES, { error: "Elige qué necesitas: equipo, repuesto o servicio técnico" }),
    name: z
      .string({ error: "Escribe tu nombre" })
      .trim()
      .min(2, "Escribe tu nombre")
      .max(100, "El nombre es demasiado largo"),
    // Revisión por campo (se muestra aunque otros campos fallen); la normalización con el país
    // se hace después, en el transform del objeto.
    phone: z
      .string({ error: "Escribe tu teléfono o WhatsApp" })
      .trim()
      .min(1, "Escribe tu teléfono o WhatsApp")
      .refine((value) => {
        const digits = value.replace(/\D/g, "").length;
        return /^\+?[\d\s().\-/]+$/.test(value) && digits >= 7 && digits <= 15;
      }, PHONE_ERROR),
    email: z
      .union([z.literal(""), z.email("Revisa el correo: parece incompleto").max(254)])
      .optional()
      .transform((value) => value || null),
    businessName: optionalText(120),
    city: z
      .string({ error: "Escribe tu ciudad" })
      .trim()
      .min(2, "Escribe tu ciudad")
      .max(80, "El nombre de la ciudad es demasiado largo"),
    country: z.enum(COUNTRIES).default("VE"),
    message: z
      .string({ error: "Cuéntanos qué necesitas" })
      .trim()
      .min(10, "Cuéntanos un poco más (mínimo 10 caracteres)")
      .max(2000, "El mensaje es demasiado largo (máximo 2.000 caracteres)"),
    productSlug: optionalText(120),
    productName: optionalText(120),
    utmSource: optionalText(200),
    utmMedium: optionalText(200),
    utmCampaign: optionalText(200),
    utmContent: optionalText(200),
    utmTerm: optionalText(200),
    landingUrl: optionalText(2000),
    referrer: optionalText(2000),
  })
  .transform((data, ctx) => {
    const phone = normalizePhone(data.phone, data.country);
    if (!phone) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: PHONE_ERROR,
      });
      return z.NEVER;
    }
    return { ...data, phone };
  });

export type LeadInput = z.infer<typeof leadSchema>;

/** Campos que el formulario muestra y devuelve al visitante si hay un error. */
export const LEAD_FORM_FIELDS = [
  "type",
  "name",
  "phone",
  "email",
  "businessName",
  "city",
  "country",
  "message",
] as const;
