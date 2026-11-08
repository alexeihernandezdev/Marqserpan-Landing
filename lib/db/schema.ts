import { sql } from "drizzle-orm";
import {
  bigserial,
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// Ver specs/001-landing-storybrand/data-model.md

export const leadType = pgEnum("lead_type", ["equipo", "repuesto", "servicio_tecnico"]);
export const leadStatus = pgEnum("lead_status", ["nueva", "atendida"]);
export const country = pgEnum("country", ["VE", "CO", "BR", "CW", "OTRO"]);
export const notificationStatus = pgEnum("notification_status", [
  "pendiente",
  "enviado",
  "fallido",
]);
export const sectionKey = pgEnum("section_key", [
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
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  ...timestamps,
});

export const adminSessions = pgTable(
  "admin_sessions",
  {
    // SHA-256 del token de la cookie; el token en claro nunca se guarda.
    id: text("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("admin_sessions_user_idx").on(t.userId)],
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    // SHA-256 del token del enlace; el token en claro solo viaja en el correo.
    id: text("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("password_reset_tokens_user_created_idx").on(t.userId, t.createdAt)],
);

export const loginAttempts = pgTable(
  "login_attempts",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    email: text("email").notNull(),
    ipHash: text("ip_hash"),
    succeeded: boolean("succeeded").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("login_attempts_email_created_idx").on(t.email, t.createdAt)],
);

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    // Marca del fabricante (Magister, Senzani…); el catálogo se puede filtrar por ella.
    brand: text("brand"),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    shortDescription: text("short_description").notNull(),
    description: text("description"),
    isFeatured: boolean("is_featured").notNull().default(false),
    isVisible: boolean("is_visible").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("products_visible_order_idx").on(t.isVisible, t.sortOrder)],
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    cloudinaryPublicId: text("cloudinary_public_id").notNull().unique(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    alt: text("alt").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("product_images_product_idx").on(t.productId, t.sortOrder)],
);

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    submissionId: uuid("submission_id").notNull(),
    // type y message quedan vacíos mientras la solicitud solo tiene los datos de contacto (paso 1).
    type: leadType("type"),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    businessName: text("business_name"),
    city: text("city").notNull(),
    country: country("country").notNull().default("VE"),
    message: text("message"),
    productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
    productName: text("product_name"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmContent: text("utm_content"),
    utmTerm: text("utm_term"),
    source: text("source").notNull(),
    landingUrl: text("landing_url"),
    referrer: text("referrer"),
    ipHash: text("ip_hash"),
    status: leadStatus("status").notNull().default("nueva"),
    attendedAt: timestamp("attended_at", { withTimezone: true }),
    notificationStatus: notificationStatus("notification_status").notNull().default("pendiente"),
    /** Null mientras la persona solo envió el paso de contacto. */
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("leads_submission_id_unique").on(t.submissionId),
    index("leads_status_created_idx").on(t.status, t.createdAt.desc()),
    index("leads_created_idx").on(t.createdAt),
    index("leads_source_idx").on(t.source),
    index("leads_ip_created_idx").on(t.ipHash, t.createdAt),
  ],
);

export const contentSections = pgTable("content_sections", {
  key: sectionKey("key").primaryKey(),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  updatedBy: uuid("updated_by").references(() => adminUsers.id, { onDelete: "set null" }),
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  quote: text("quote").notNull(),
  authorName: text("author_name").notNull(),
  businessName: text("business_name"),
  city: text("city"),
  /** Logo del negocio: ruta en /public (p. ej. /clientes/x.webp) o publicId de Cloudinary. */
  logo: text("logo"),
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

export type SocialLink = {
  network: "instagram" | "facebook" | "tiktok" | "youtube" | "x";
  url: string;
  isTest: boolean;
};

export const businessSettings = pgTable(
  "business_settings",
  {
    id: integer("id").primaryKey().default(1),
    whatsapp: text("whatsapp").notNull().default(""),
    email: text("email").notNull().default(""),
    address: text("address").notNull().default(""),
    businessHours: text("business_hours").notNull().default(""),
    socialLinks: jsonb("social_links").$type<SocialLink[]>().notNull().default([]),
    paymentMethods: jsonb("payment_methods").$type<string[]>().notNull().default([]),
    shippingCoverage: jsonb("shipping_coverage").$type<string[]>().notNull().default([]),
    deliveryTerms: jsonb("delivery_terms").$type<string[]>().notNull().default([]),
    legalName: text("legal_name").notNull().default(""),
    rif: text("rif").notNull().default(""),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [check("business_settings_singleton", sql`${t.id} = 1`)],
);

export type Lead = typeof leads.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductImage = typeof productImages.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type BusinessSettings = typeof businessSettings.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
