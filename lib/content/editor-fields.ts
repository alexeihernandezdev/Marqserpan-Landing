import type { SectionKey } from "@/lib/validation/content";

// Descripción de los campos editables de cada sección, con los mismos límites que
// lib/validation/content.ts (contracts/content-schema.md). El servidor valida con Zod.

export type EditorField =
  | { kind: "text" | "textarea"; name: string; label: string; max: number; required?: boolean; hint?: string }
  | { kind: "list"; name: string; label: string; itemLabel: string; max: number; minItems: number; maxItems: number }
  | {
      kind: "pairs";
      name: string;
      label: string;
      itemLabel: string;
      titleMax: number;
      bodyMax: number;
      minItems: number;
      maxItems: number;
    };

const title: EditorField = { kind: "text", name: "title", label: "Título", max: 60, required: true };

export const EDITOR_FIELDS: Record<SectionKey, EditorField[]> = {
  hero: [
    { kind: "text", name: "title", label: "Titular", max: 60, required: true, hint: "Di qué ofreces en pocas palabras." },
    { kind: "textarea", name: "subtitle", label: "Subtítulo", max: 160, required: true },
    { kind: "text", name: "primaryCta", label: "Botón principal", max: 30, required: true, hint: "Se repite en toda la landing." },
    { kind: "text", name: "secondaryCta", label: "Botón secundario", max: 30, required: true },
    { kind: "text", name: "trustLine", label: "Línea de confianza", max: 60 },
  ],
  problem: [
    title,
    { kind: "textarea", name: "body", label: "Texto", max: 280 },
    { kind: "list", name: "points", label: "Puntos", itemLabel: "Punto", max: 100, minItems: 0, maxItems: 3 },
  ],
  guide: [
    { kind: "text", name: "empathy", label: "Frase de empatía", max: 120, required: true },
    title,
    {
      kind: "list",
      name: "authorityPoints",
      label: "Puntos de autoridad",
      itemLabel: "Punto de autoridad",
      max: 100,
      minItems: 0,
      maxItems: 5,
    },
  ],
  plan: [
    title,
    { kind: "pairs", name: "steps", label: "Pasos", itemLabel: "Paso", titleMax: 40, bodyMax: 140, minItems: 3, maxItems: 3 },
    { kind: "list", name: "agreement", label: "Compromisos", itemLabel: "Compromiso", max: 140, minItems: 0, maxItems: 3 },
  ],
  services: [
    title,
    { kind: "textarea", name: "intro", label: "Introducción", max: 200 },
    { kind: "pairs", name: "items", label: "Servicios", itemLabel: "Servicio", titleMax: 40, bodyMax: 140, minItems: 1, maxItems: 6 },
  ],
  featured: [title, { kind: "textarea", name: "body", label: "Texto", max: 200 }],
  stakes: [
    title,
    { kind: "list", name: "points", label: "Consecuencias", itemLabel: "Consecuencia", max: 100, minItems: 0, maxItems: 3 },
  ],
  success: [
    title,
    { kind: "list", name: "points", label: "Resultados", itemLabel: "Resultado", max: 100, minItems: 4, maxItems: 6 },
    { kind: "textarea", name: "identity", label: "Transformación (de… a…)", max: 140 },
  ],
  testimonials: [title],
  quote_form: [
    title,
    { kind: "textarea", name: "intro", label: "Introducción", max: 200 },
    { kind: "text", name: "successTitle", label: "Título de confirmación", max: 60, required: true },
    { kind: "textarea", name: "successBody", label: "Texto de confirmación", max: 240, required: true },
  ],
  contact: [title, { kind: "textarea", name: "body", label: "Texto", max: 200 }],
};
