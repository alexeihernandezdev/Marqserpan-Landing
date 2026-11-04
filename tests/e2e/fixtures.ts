import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { connect, type ScriptDb } from "../../scripts/lib/db";
import { seedDatabase } from "../../scripts/lib/seed-data";
import type { Page } from "@playwright/test";
import { hashPassword } from "../../lib/auth/password";
import { generateSessionToken, hashSessionToken } from "../../lib/auth/session-logic";
import { adminUsers, categories, leads, passwordResetTokens, productImages, products } from "../../lib/db/schema";

// Las pruebas e2e usan una rama de Neon exclusiva (DATABASE_URL en .env.test).
let db: ScriptDb | undefined;

export function testDb(): ScriptDb {
  db ??= connect(".env.test");
  return db;
}

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

/** La landing está prerenderizada: tras tocar la BD directamente hay que invalidar su caché. */
export async function invalidatePublicCache() {
  const response = await fetch(`${baseURL}/api/test/revalidate`, {
    method: "POST",
    headers: { "x-e2e-secret": process.env.E2E_TESTING_SECRET ?? "" },
  });
  if (!response.ok) {
    throw new Error("No se pudo invalidar la caché: define E2E_TESTING=true y E2E_TESTING_SECRET en .env.test.");
  }
}

/** Deja la base como recién sembrada. */
export async function resetDatabase() {
  const database = testDb();
  await database.execute(sql`
    truncate table leads, product_images, products, testimonials,
      admin_sessions, login_attempts, admin_users restart identity cascade
  `);
  await seedDatabase(database, { overwrite: true });
  await invalidatePublicCache();
}

export async function createProductFixture(
  overrides: Partial<{
    name: string;
    slug: string;
    categorySlug: string;
    isFeatured: boolean;
    isVisible: boolean;
    publicId: string;
  }> = {},
) {
  const database = testDb();
  const name = overrides.name ?? "Rebanadora de prueba 300";
  const slug = overrides.slug ?? `rebanadora-prueba-${randomUUID().slice(0, 8)}`;
  const [category] = await database
    .select()
    .from(categories)
    .where(eq(categories.slug, overrides.categorySlug ?? "rebanadoras"));

  const [product] = await database
    .insert(products)
    .values({
      name,
      slug,
      categoryId: category.id,
      shortDescription: "Rebanadora para charcutería, de prueba.",
      description: "Descripción de prueba.\nSegunda línea.",
      isFeatured: overrides.isFeatured ?? true,
      isVisible: overrides.isVisible ?? true,
    })
    .returning();

  await database.insert(productImages).values({
    productId: product.id,
    // "sample" existe en todas las cuentas de Cloudinary.
    cloudinaryPublicId: overrides.publicId ?? `sample?fixture=${product.id}`,
    width: 864,
    height: 576,
    alt: name,
  });

  await invalidatePublicCache();
  return product;
}

export async function insertLeadFixture(
  overrides: Partial<typeof leads.$inferInsert> = {},
) {
  const [lead] = await testDb()
    .insert(leads)
    .values({
      submissionId: randomUUID(),
      type: "repuesto",
      name: "Cliente de prueba",
      phone: "+584161234567",
      city: "Puerto Ordaz",
      country: "VE",
      message: "Necesito un repuesto para mi amasadora.",
      source: "directo",
      ...overrides,
    })
    .returning();
  return lead;
}

export async function findLeads() {
  return testDb().select().from(leads);
}

export const ADMIN_EMAIL = "admin@prueba.test";
export const ADMIN_PASSWORD = "clave-de-prueba-123";

export async function createAdminFixture() {
  await testDb()
    .insert(adminUsers)
    .values({ name: "Admin de prueba", email: ADMIN_EMAIL, passwordHash: await hashPassword(ADMIN_PASSWORD) })
    .onConflictDoNothing();
}

/** Crea el usuario de prueba e inicia sesión en el navegador. */
export async function loginAsAdmin(page: Page) {
  await createAdminFixture();
  await page.goto("/admin/login");
  await page.getByLabel("Correo").fill(ADMIN_EMAIL);
  await page.getByLabel("Contraseña").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL(/\/admin$/);
}

/** Crea un enlace de restablecimiento para el usuario de prueba y devuelve su token en claro. */
export async function createResetTokenFixture(expiresInMs = 60 * 60 * 1000) {
  const database = testDb();
  const [user] = await database.select().from(adminUsers).where(eq(adminUsers.email, ADMIN_EMAIL));
  const token = generateSessionToken();
  await database.insert(passwordResetTokens).values({
    id: hashSessionToken(token),
    userId: user.id,
    expiresAt: new Date(Date.now() + expiresInMs),
  });
  return token;
}

export async function findResetTokens() {
  return testDb().select().from(passwordResetTokens);
}
