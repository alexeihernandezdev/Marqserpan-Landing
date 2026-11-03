import path from "node:path";
import { expect, test } from "@playwright/test";
import { eq } from "drizzle-orm";
import { leads, products } from "../../lib/db/schema";
import { createProductFixture, insertLeadFixture, loginAsAdmin, resetDatabase, testDb } from "./fixtures";

// US4 — El negocio actualiza el catálogo (constitución: pruebas obligatorias de la edición de productos).
// Sube una foto real a la carpeta maqserpan-test de Cloudinary: requiere credenciales en .env.test.
test.skip(({ isMobile }) => isMobile, "Se prueba en escritorio");

test.beforeEach(async ({ page }) => {
  await resetDatabase();
  await loginAsAdmin(page);
});

test("crea un producto con foto y aparece en la landing", async ({ page }) => {
  test.skip(!process.env.CLOUDINARY_API_KEY, "Requiere credenciales de Cloudinary en .env.test");
  test.setTimeout(90_000);
  await page.goto("/admin/productos/nuevo");
  await page.getByRole("textbox", { name: "Nombre", exact: true }).fill("Rebanadora e2e 330");
  await page.getByLabel("Categoría").selectOption({ label: "Rebanadoras" });
  await page.getByLabel("Descripción corta").fill("Rebanadora de prueba para charcutería.");
  await page.getByLabel("Destacado").check();
  await page.getByRole("button", { name: "Guardar producto" }).click();
  await expect(page.getByRole("status")).toContainText("Producto guardado");

  await page.getByLabel("Agregar fotos").setInputFiles(path.join(__dirname, "fixtures", "rebanadora.jpg"));
  await expect(page.getByRole("list", { name: "Fotos del producto" }).getByRole("listitem")).toHaveCount(1, {
    timeout: 30_000,
  });

  await page.getByLabel("Visible en la landing").check();
  await page.getByRole("button", { name: "Guardar producto" }).click();
  await expect(page.getByRole("status")).toContainText("Producto guardado");

  await page.goto("/");
  await expect(page.locator("#catalogo")).toContainText("Rebanadora e2e 330");
});

test("no deja publicar un producto sin fotos", async ({ page }) => {
  await page.goto("/admin/productos/nuevo");
  await page.getByRole("textbox", { name: "Nombre", exact: true }).fill("Producto sin foto");
  await page.getByLabel("Categoría").selectOption({ label: "Repuestos" });
  await page.getByLabel("Descripción corta").fill("Sin foto.");
  await page.getByLabel("Visible en la landing").check();
  await page.getByRole("button", { name: "Guardar producto" }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText("Agrega al menos una foto antes de publicar el producto");
});

test("ocultar un producto lo quita de la landing", async ({ page }) => {
  const product = await createProductFixture({ name: "Rebanadora a ocultar" });
  await page.goto("/");
  await expect(page.locator("#catalogo")).toContainText("Rebanadora a ocultar");

  await page.goto(`/admin/productos/${product.id}`);
  await page.getByLabel("Visible en la landing").uncheck();
  await page.getByRole("button", { name: "Guardar producto" }).click();
  await expect(page.getByRole("status")).toContainText("Producto guardado");

  await page.goto("/");
  await expect(page.getByText("Rebanadora a ocultar")).toHaveCount(0);
});

test("borrar un producto conserva el nombre en sus solicitudes", async ({ page }) => {
  const product = await createProductFixture({ name: "Rebanadora borrada", publicId: "maqserpan-test/no-existe" });
  const lead = await insertLeadFixture({ productId: product.id, productName: product.name });

  await page.goto(`/admin/productos/${product.id}`);
  await page.getByRole("button", { name: "Borrar producto" }).click();
  await page.getByRole("button", { name: "Sí, borrar" }).click();
  await expect(page).toHaveURL(/\/admin\/productos$/);

  const [row] = await testDb().select().from(leads).where(eq(leads.id, lead.id));
  expect(row.productId).toBeNull();
  expect(row.productName).toBe("Rebanadora borrada");
  expect(await testDb().select().from(products).where(eq(products.id, product.id))).toHaveLength(0);
});

test("no deja borrar una categoría con productos", async ({ page }) => {
  await createProductFixture({ categorySlug: "rebanadoras" });
  await page.goto("/admin/categorias");
  // El nombre está dentro de un campo editable, no como texto de la fila.
  const row = page.locator("li", { has: page.locator('input[value="Rebanadoras"]') });
  await row.getByRole("button", { name: "Borrar" }).click();
  await row.getByRole("button", { name: "Sí, borrar" }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText("tiene productos");
});
