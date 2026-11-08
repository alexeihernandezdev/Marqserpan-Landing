import "server-only";
import { asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db/client";
import { businessSettings, contentSections, testimonials } from "@/lib/db/schema";
import { showTestSocials } from "@/lib/env";
import { TAGS } from "@/lib/tags";
import { sectionSchemas, type SectionKey, type Sections } from "@/lib/validation/content";
import { DEFAULT_BUSINESS_SETTINGS, DEFAULT_SECTIONS } from "./defaults";

// Lecturas públicas: entran en el shell estático y se invalidan con updateTag desde el admin.

export async function getSections(): Promise<Sections> {
  "use cache";
  cacheTag(TAGS.content);
  cacheLife("max");

  const rows = await db.select().from(contentSections);
  const sections = { ...DEFAULT_SECTIONS } as Record<SectionKey, unknown>;

  for (const row of rows) {
    const parsed = sectionSchemas[row.key].safeParse(row.data);
    if (parsed.success) {
      sections[row.key] = parsed.data;
    } else {
      // Un dato guardado inválido no debe romper la landing: se usa el texto inicial.
      console.error(`Sección "${row.key}" inválida en la base de datos; se usa el texto inicial.`);
    }
  }

  return sections as Sections;
}

export type PublicBusinessSettings = {
  whatsapp: string;
  email: string;
  address: string;
  businessHours: string;
  socialLinks: { network: string; url: string }[];
  paymentMethods: string[];
  shippingCoverage: string[];
  deliveryTerms: string[];
  legalName: string;
  rif: string;
};

export async function getBusinessSettings(): Promise<PublicBusinessSettings> {
  "use cache";
  cacheTag(TAGS.settings);
  cacheLife("max");

  const [row] = await db.select().from(businessSettings).where(eq(businessSettings.id, 1));
  const settings = row ?? DEFAULT_BUSINESS_SETTINGS;
  const includeTest = showTestSocials();

  return {
    whatsapp: settings.whatsapp,
    email: settings.email,
    address: settings.address,
    businessHours: settings.businessHours,
    socialLinks: settings.socialLinks
      .filter((link) => link.url && (includeTest || !link.isTest))
      .map(({ network, url }) => ({ network, url })),
    paymentMethods: settings.paymentMethods,
    shippingCoverage: settings.shippingCoverage,
    deliveryTerms: settings.deliveryTerms,
    legalName: settings.legalName,
    rif: settings.rif,
  };
}

export type PublicTestimonial = {
  id: string;
  quote: string;
  authorName: string;
  businessName: string | null;
  city: string | null;
  logo: string | null;
};

export async function getVisibleTestimonials(): Promise<PublicTestimonial[]> {
  "use cache";
  cacheTag(TAGS.testimonials);
  cacheLife("max");

  return db
    .select({
      id: testimonials.id,
      quote: testimonials.quote,
      authorName: testimonials.authorName,
      businessName: testimonials.businessName,
      city: testimonials.city,
      logo: testimonials.logo,
    })
    .from(testimonials)
    .where(eq(testimonials.isVisible, true))
    .orderBy(asc(testimonials.sortOrder), asc(testimonials.createdAt));
}
