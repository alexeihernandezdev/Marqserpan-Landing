import "server-only";
import { asc, eq, max } from "drizzle-orm";
import { DEFAULT_BUSINESS_SETTINGS, DEFAULT_SECTIONS } from "@/lib/content/defaults";
import { db } from "@/lib/db/client";
import { businessSettings, contentSections, testimonials } from "@/lib/db/schema";
import type { BusinessSettingsInput } from "@/lib/validation/business";
import { sectionSchemas, type SectionKey, type Sections } from "@/lib/validation/content";
import { verifySession } from "./session";

// Escrituras y lecturas de contenido para el admin. Cada función verifica la sesión.

export async function listSectionsForAdmin() {
  await verifySession();
  return db
    .select({ key: contentSections.key, updatedAt: contentSections.updatedAt })
    .from(contentSections);
}

export async function getSectionForAdmin<K extends SectionKey>(key: K): Promise<Sections[K]> {
  await verifySession();
  const [row] = await db.select().from(contentSections).where(eq(contentSections.key, key));
  // Los campos que el registro guardado no tiene (añadidos después) toman el texto inicial.
  const parsed = row ? sectionSchemas[key].safeParse({ ...(DEFAULT_SECTIONS[key] as object), ...(row.data as object) }) : null;
  return (parsed?.success ? parsed.data : DEFAULT_SECTIONS[key]) as Sections[K];
}

export async function saveSectionRecord(key: SectionKey, data: unknown) {
  const user = await verifySession();
  await db
    .insert(contentSections)
    .values({ key, data, updatedBy: user.id })
    .onConflictDoUpdate({ target: contentSections.key, set: { data, updatedBy: user.id } });
}

export async function listTestimonialsForAdmin() {
  await verifySession();
  return db.select().from(testimonials).orderBy(asc(testimonials.sortOrder), asc(testimonials.createdAt));
}

type TestimonialInput = {
  id?: string;
  quote: string;
  authorName: string;
  businessName: string | null;
  city: string | null;
  isVisible: boolean;
};

export async function saveTestimonialRecord(input: TestimonialInput) {
  await verifySession();
  const { id, ...values } = input;
  if (id) {
    await db.update(testimonials).set(values).where(eq(testimonials.id, id));
    return;
  }
  const [{ last }] = await db.select({ last: max(testimonials.sortOrder) }).from(testimonials);
  await db.insert(testimonials).values({ ...values, sortOrder: (last ?? -1) + 1 });
}

export async function deleteTestimonialRecord(id: string) {
  await verifySession();
  await db.delete(testimonials).where(eq(testimonials.id, id));
}

export async function reorderTestimonialRecords(ids: string[]) {
  await verifySession();
  await Promise.all(ids.map((id, index) => db.update(testimonials).set({ sortOrder: index }).where(eq(testimonials.id, id))));
}

export async function getBusinessSettingsForAdmin(): Promise<BusinessSettingsInput> {
  await verifySession();
  const [row] = await db.select().from(businessSettings).where(eq(businessSettings.id, 1));
  if (!row) return DEFAULT_BUSINESS_SETTINGS;
  return {
    whatsapp: row.whatsapp,
    email: row.email,
    address: row.address,
    businessHours: row.businessHours,
    socialLinks: row.socialLinks,
    paymentMethods: row.paymentMethods,
    shippingCoverage: row.shippingCoverage,
    deliveryTerms: row.deliveryTerms,
    legalName: row.legalName,
    rif: row.rif,
  };
}

export async function saveBusinessSettingsRecord(input: BusinessSettingsInput) {
  await verifySession();
  await db
    .insert(businessSettings)
    .values({ id: 1, ...input })
    .onConflictDoUpdate({ target: businessSettings.id, set: input });
}
