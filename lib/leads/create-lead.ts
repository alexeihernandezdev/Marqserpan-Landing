import "server-only";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { leads, products } from "@/lib/db/schema";
import type { LeadContactInput, LeadInput } from "@/lib/validation/lead";

type CreateLeadInput = LeadInput & { source: string; ipHash: string | null };
type SaveContactInput = LeadContactInput & { source: string; ipHash: string | null };

/** ¿Ya existe una fila para este envío? (p. ej. guardada en el paso de contacto). */
export async function leadExists(submissionId: string): Promise<boolean> {
  const [row] = await db.select({ id: leads.id }).from(leads).where(eq(leads.submissionId, submissionId));
  return Boolean(row);
}

/**
 * Paso 1: guarda los datos de contacto en cuanto la persona los completa, para no perder el contacto
 * si abandona. Repetirlo (volver y corregir) actualiza la misma fila mientras no esté completa.
 */
export async function saveLeadContact(input: SaveContactInput) {
  const contact = {
    name: input.name,
    phone: input.phone,
    email: input.email,
    city: input.city,
    country: input.country,
  };
  await db
    .insert(leads)
    .values({
      submissionId: input.submissionId,
      ...contact,
      utmSource: input.utmSource,
      utmMedium: input.utmMedium,
      utmCampaign: input.utmCampaign,
      utmContent: input.utmContent,
      utmTerm: input.utmTerm,
      source: input.source,
      landingUrl: input.landingUrl,
      referrer: input.referrer,
      ipHash: input.ipHash,
    })
    .onConflictDoUpdate({ target: leads.submissionId, set: contact, where: isNull(leads.completedAt) });
}

/**
 * Guarda la solicitud completa. Si el paso de contacto ya creó la fila, la completa.
 * Una solicitud ya completa no se toca: un submissionId repetido (doble toque) no crea otra fila.
 * El producto se asocia solo si existe y está visible; su nombre se guarda siempre.
 */
export async function createLead(input: CreateLeadInput) {
  let productId: string | null = null;
  let productName = input.productName;

  if (input.productSlug) {
    const [product] = await db
      .select({ id: products.id, name: products.name })
      .from(products)
      .where(and(eq(products.slug, input.productSlug), eq(products.isVisible, true)));
    if (product) {
      productId = product.id;
      productName = product.name;
    }
  }

  const fields = {
    type: input.type,
    name: input.name,
    phone: input.phone,
    email: input.email,
    businessName: input.businessName,
    city: input.city,
    country: input.country,
    message: input.message,
    productId,
    productName,
    completedAt: new Date(),
  };

  const [inserted] = await db
    .insert(leads)
    .values({
      submissionId: input.submissionId,
      ...fields,
      utmSource: input.utmSource,
      utmMedium: input.utmMedium,
      utmCampaign: input.utmCampaign,
      utmContent: input.utmContent,
      utmTerm: input.utmTerm,
      source: input.source,
      landingUrl: input.landingUrl,
      referrer: input.referrer,
      ipHash: input.ipHash,
    })
    .onConflictDoUpdate({ target: leads.submissionId, set: fields, where: isNull(leads.completedAt) })
    .returning();

  // type y message vienen del esquema completo: aquí nunca son null.
  return inserted
    ? { lead: { ...inserted, type: input.type, message: input.message }, created: true as const } : { lead: null, created: false as const };
}

export async function setNotificationStatus(id: string, status: "enviado" | "fallido") {
  await db.update(leads).set({ notificationStatus: status }).where(eq(leads.id, id));
}
