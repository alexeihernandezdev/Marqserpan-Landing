import { z } from "zod";

/** "Rebanadora Eléctrica 300" → "rebanadora-electrica-300". */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120)
    .replace(/-+$/g, "");
}

// Una casilla sin marcar no viaja en el FormData.
const checkbox = z
  .string()
  .optional()
  .transform((value) => value === "on" || value === "true");

// Sin campo de precio (constitución, Principio I): si llega uno, Zod lo descarta.
export const productSchema = z
  .object({
    id: z.uuid().optional(),
    name: z.string().trim().min(2, "Escribe el nombre del producto").max(120, "Máximo 120 caracteres"),
    slug: z.string().trim().max(160).optional(),
    brand: z
      .string()
      .trim()
      .max(60, "La marca admite hasta 60 caracteres")
      .optional()
      .transform((value) => value || null),
    categoryId: z.uuid("Elige una categoría"),
    shortDescription: z
      .string()
      .trim()
      .min(1, "Escribe una descripción corta")
      .max(200, "La descripción corta admite hasta 200 caracteres"),
    description: z
      .string()
      .trim()
      .max(5000, "La descripción admite hasta 5.000 caracteres")
      .optional()
      .transform((value) => value || null),
    isFeatured: checkbox,
    isVisible: checkbox,
  })
  .transform((data, ctx) => {
    const slug = slugify(data.slug || data.name);
    if (!slug) {
      ctx.addIssue({ code: "custom", path: ["slug"], message: "El enlace del producto no puede quedar vacío" });
      return z.NEVER;
    }
    return { ...data, slug };
  });

export type ProductInput = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(2, "Escribe el nombre de la categoría").max(60, "Máximo 60 caracteres"),
});

export const imageSchema = z.object({
  publicId: z.string().min(1).max(300),
  width: z.number().int().positive().max(20000),
  height: z.number().int().positive().max(20000),
  alt: z.string().trim().max(200),
});

export const imageUpdateSchema = z.object({
  alt: z.string().trim().min(1, "Describe la foto").max(200).optional(),
});
