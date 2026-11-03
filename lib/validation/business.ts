import { z } from "zod";

export const SOCIAL_NETWORKS = ["instagram", "facebook", "tiktok", "youtube", "x"] as const;

export const SOCIAL_LABELS: Record<(typeof SOCIAL_NETWORKS)[number], string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X",
};

const textList = (max: number, label: string) =>
  z.array(z.string().trim().min(1).max(max, `${label}: máximo ${max} caracteres`)).max(12);

export const socialLinkSchema = z.object({
  network: z.enum(SOCIAL_NETWORKS),
  url: z.union([
    z.literal(""),
    z
      .url({ protocol: /^https$/, message: "El enlace debe empezar por https://" })
      .max(300)
      // Los enlaces públicos no llevan parámetros de rastreo como ?rpxt= o ?igsh=.
      .transform((value) => value.split("?")[0]),
  ]),
  isTest: z.boolean(),
});

export const businessSettingsSchema = z.object({
  whatsapp: z
    .string()
    .trim()
    .regex(/^\+\d{8,15}$/, "Escribe el WhatsApp en formato internacional, por ejemplo +584166873369"),
  email: z.email("Correo inválido").max(254),
  address: z.string().trim().max(200),
  businessHours: z.string().trim().max(200),
  socialLinks: z.array(socialLinkSchema).max(SOCIAL_NETWORKS.length),
  paymentMethods: textList(80, "Método de pago"),
  shippingCoverage: textList(80, "Cobertura"),
  deliveryTerms: textList(200, "Condición de entrega"),
  legalName: z.string().trim().max(120),
  rif: z.string().trim().max(20),
});

export type BusinessSettingsInput = z.infer<typeof businessSettingsSchema>;
