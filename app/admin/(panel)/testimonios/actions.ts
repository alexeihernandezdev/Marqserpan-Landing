"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { deleteTestimonialRecord, reorderTestimonialRecords, saveTestimonialRecord } from "@/lib/dal/content";
import { verifySession } from "@/lib/dal/session";
import type { ActionState } from "@/lib/forms/action-state";
import { TAGS } from "@/lib/tags";

const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value || null);

const testimonialSchema = z.object({
  id: z.uuid().optional(),
  quote: z
    .string()
    .trim()
    .min(10, "El testimonio debe tener al menos 10 caracteres")
    .max(400, "Máximo 400 caracteres")
    .refine((v) => !/<[a-z/!]/i.test(v), "No se permite HTML"),
  authorName: z.string().trim().min(1, "Escribe el nombre del cliente").max(80),
  businessName: optional(120),
  city: optional(80),
  isVisible: z
    .string()
    .optional()
    .transform((v) => v === "on" || v === "true"),
});

export async function saveTestimonial(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await verifySession();
  const parsed = testimonialSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  await saveTestimonialRecord(parsed.data);
  updateTag(TAGS.testimonials);
  revalidatePath("/admin/testimonios");
  return { status: "success", message: "Testimonio guardado." };
}

export async function deleteTestimonial(id: string) {
  await verifySession();
  await deleteTestimonialRecord(z.uuid().parse(id));
  updateTag(TAGS.testimonials);
  revalidatePath("/admin/testimonios");
}

export async function reorderTestimonials(ids: string[]) {
  await verifySession();
  await reorderTestimonialRecords(z.array(z.uuid()).max(100).parse(ids));
  updateTag(TAGS.testimonials);
}
