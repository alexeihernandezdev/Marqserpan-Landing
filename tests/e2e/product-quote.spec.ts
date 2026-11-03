import { expect, test } from "@playwright/test";
import { eq } from "drizzle-orm";
import { products } from "../../lib/db/schema";
import { createProductFixture, findLeads, invalidatePublicCache, resetDatabase, testDb } from "./fixtures";

// US2 — Un visitante pide un producto concreto del catálogo (quickstart.md, escenarios US2).
// La landing se prerenderiza: los fixtures invalidan su caché tras cambiar la BD.

test.beforeEach(async () => {
  await resetDatabase();
});

test("el destacado aparece primero en el catálogo", async ({ page }) => {
  await createProductFixture({ name: "Horno de prueba", categorySlug: "equipos-de-panaderia", isFeatured: false });
  await createProductFixture({ name: "Rebanadora destacada", isFeatured: true });
  await page.goto("/");
  const cards = page.locator("#catalogo").getByRole("heading", { level: 3 });
  await expect(cards.first()).toHaveText("Rebanadora destacada");
});

test("la ficha se abre como ventana y preselecciona el producto en el formulario", async ({ page }) => {
  const product = await createProductFixture({ name: "Rebanadora 300" });
  await page.goto("/");

  await page.locator("#catalogo").getByRole("link", { name: /Rebanadora 300/ }).click();
  const dialog = page.getByRole("dialog", { name: "Rebanadora 300" });
  await expect(dialog).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`/productos/${product.slug}$`));

  await dialog.getByRole("link", { name: "Solicitar cotización de este equipo" }).click();
  const form = page.locator("#cotizar");
  await expect(form.getByText("Rebanadora 300")).toBeVisible();
  await expect(form.getByRole("radio", { name: /^Equipo/ })).toBeChecked();

  await form.getByRole("textbox", { name: "Nombre", exact: true }).fill("Pedro Gómez");
  await form.getByLabel("Teléfono o WhatsApp").fill("+57 300 1234567");
  await form.getByLabel("Ciudad").fill("Cúcuta");
  await form.getByLabel("País").selectOption("CO");
  await form.getByLabel("Cuéntanos qué necesitas").fill("Quiero cotizar esta rebanadora para mi charcutería.");
  await page.waitForTimeout(3_100);
  await form.getByRole("button", { name: "Enviar solicitud" }).click();
  await expect(page.getByRole("heading", { name: "¡Recibimos tu solicitud!" })).toBeVisible();

  const [lead] = await findLeads();
  expect(lead).toMatchObject({ type: "equipo", productId: product.id, productName: "Rebanadora 300", country: "CO" });
});

test("cerrar la ventana vuelve a la landing en el catálogo", async ({ page }) => {
  await createProductFixture({ name: "Rebanadora 250" });
  await page.goto("/#catalogo");
  await page.locator("#catalogo").getByRole("link", { name: /Rebanadora 250/ }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Cerrar" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page).toHaveURL(/\/(#catalogo)?$/);
  await expect(page.locator("#catalogo")).toBeInViewport();
});

test("la página del producto no muestra precios", async ({ page }) => {
  const product = await createProductFixture({ name: "Rebanadora 350" });
  await page.goto(`/productos/${product.slug}`);
  await expect(page.getByRole("heading", { level: 1, name: "Rebanadora 350" })).toBeVisible();
  await expect(page.locator("main")).not.toContainText(/\$|USD|Bs\.?\s?\d|precio:/i);
  await expect(page.getByText("Cotizamos cada pedido con su precio y su plazo")).toBeVisible();
});

test("un producto oculto no aparece y su página da 404", async ({ page }) => {
  const product = await createProductFixture({ name: "Rebanadora oculta" });
  await testDb().update(products).set({ isVisible: false }).where(eq(products.id, product.id));
  await invalidatePublicCache();

  // La ficha se completa dentro de <Suspense>: se muestra la página «no encontrado» (con noindex);
  // el código HTTP de la primera visita puede ser 200 porque la estructura ya se envió.
  await page.goto(`/productos/${product.slug}`);
  await expect(page.getByRole("heading", { name: "No encontramos lo que buscas" })).toBeVisible();
  await page.goto("/");
  await expect(page.locator("#catalogo").getByText("Rebanadora oculta")).toHaveCount(0);
});
