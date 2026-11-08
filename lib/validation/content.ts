import { z } from "zod";

// Ver specs/001-landing-storybrand/contracts/content-schema.md
// Ningún campo admite HTML; los saltos de línea se respetan al mostrar.

const text = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label}: máximo ${max} caracteres`)
    .refine((value) => !/<[a-z/!]/i.test(value), `${label}: no se permite HTML`);

const required = (max: number, label: string) =>
  text(max, label).pipe(z.string().min(1, `${label} es obligatorio`));

const list = <T extends z.ZodType>(item: T, min: number, max: number, label: string) =>
  z
    .array(item)
    .min(min, `${label}: mínimo ${min}`)
    .max(max, `${label}: máximo ${max}`);

const titleBody = (titleMax: number, bodyMax: number) =>
  z.object({
    title: required(titleMax, "Título"),
    body: required(bodyMax, "Texto"),
  });

export const heroSchema = z.object({
  title: required(60, "Titular"),
  subtitle: required(160, "Subtítulo"),
  primaryCta: required(30, "Botón principal"),
  secondaryCta: required(30, "Botón secundario"),
  trustLine: text(60, "Línea de confianza"),
});

export const problemSchema = z.object({
  title: required(60, "Título"),
  body: text(280, "Texto"),
  points: list(required(100, "Punto"), 0, 3, "Puntos"),
});

export const guideSchema = z.object({
  empathy: required(120, "Frase de empatía"),
  title: required(60, "Título"),
  authorityPoints: list(required(100, "Punto de autoridad"), 0, 5, "Puntos de autoridad"),
});

export const planSchema = z.object({
  title: required(60, "Título"),
  steps: list(titleBody(40, 140), 3, 3, "Pasos"),
  agreement: list(required(140, "Compromiso"), 0, 3, "Compromisos"),
});

export const servicesSchema = z.object({
  title: required(60, "Título"),
  intro: text(200, "Introducción"),
  items: list(titleBody(40, 140), 1, 6, "Servicios"),
});

export const featuredSchema = z.object({
  title: required(60, "Título"),
  body: text(200, "Texto"),
});

export const stakesSchema = z.object({
  title: required(60, "Título"),
  points: list(required(100, "Consecuencia"), 0, 3, "Consecuencias"),
});

export const successSchema = z.object({
  title: required(60, "Título"),
  points: list(required(100, "Resultado"), 4, 6, "Resultados"),
  identity: text(140, "Transformación"),
});

export const testimonialsSectionSchema = z.object({
  title: required(60, "Título"),
  intro: text(200, "Introducción"),
  stats: list(titleBody(12, 40), 0, 3, "Datos destacados"),
});

export const quoteFormSchema = z.object({
  title: required(60, "Título"),
  intro: text(200, "Introducción"),
  successTitle: required(60, "Título de confirmación"),
  successBody: required(240, "Texto de confirmación"),
});

export const contactSchema = z.object({
  title: required(60, "Título"),
  body: text(200, "Texto"),
});

export const sectionSchemas = {
  hero: heroSchema,
  problem: problemSchema,
  guide: guideSchema,
  plan: planSchema,
  services: servicesSchema,
  featured: featuredSchema,
  stakes: stakesSchema,
  success: successSchema,
  testimonials: testimonialsSectionSchema,
  quote_form: quoteFormSchema,
  contact: contactSchema,
} as const;

export type SectionKey = keyof typeof sectionSchemas;

export type Sections = {
  [K in SectionKey]: z.infer<(typeof sectionSchemas)[K]>;
};

/** Orden de las secciones en la landing (también el orden en el admin). */
export const SECTION_ORDER: SectionKey[] = [
  "hero",
  "problem",
  "guide",
  "plan",
  "services",
  "featured",
  "stakes",
  "success",
  "testimonials",
  "quote_form",
  "contact",
];

export const SECTION_LABELS: Record<SectionKey, string> = {
  hero: "Primera pantalla",
  problem: "Problema",
  guide: "Guía (empatía y autoridad)",
  plan: "Plan de 3 pasos",
  services: "Servicios",
  featured: "Producto destacado",
  stakes: "Lo que está en juego",
  success: "Éxito",
  testimonials: "Testimonios",
  quote_form: "Formulario de cotización",
  contact: "Contacto",
};

export function isSectionKey(value: string): value is SectionKey {
  return value in sectionSchemas;
}
