import "server-only";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { leads, products } from "@/lib/db/schema";
import type { LeadInput } from "@/lib/validation/lead";

type CreateLeadInput = LeadInput & { source: string; ipHash: string | null };

/**
 * Guarda la solicitud. Un submissionId repetido (doble toque) no crea otra fila.
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

  const [inserted] = await db
    .insert(leads)
    .values({
      submissionId: input.submissionId,
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
    .onConflictDoNothing({ target: leads.submissionId })
    .returning();

  return inserted ? { lead: inserted, created: true as const } : { lead: null, created: false as const };
}

export async function setNotificationStatus(id: string, status: "enviado" | "fallido") {
  await db.update(leads).set({ notificationStatus: status }).where(eq(leads.id, id));
}
