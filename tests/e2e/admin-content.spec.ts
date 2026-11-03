import { expect, test } from "@playwright/test";
import { loginAsAdmin, resetDatabase } from "./fixtures";

// US5 — El negocio edita los textos, el contacto y las redes (quickstart.md, escenarios US5).
test.skip(({ isMobile }) => isMobile, "Se prueba en escritorio");

test.beforeEach(async ({ page }) => {
  await resetDatabase();
  await loginAsAdmin(page);
});

test("cambiar el titular se ve en la landing", async ({ page }) => {
  await page.goto("/admin/contenido/hero");
  await page.getByLabel("Titular").fill("Tu panadería produciendo sin paradas");
  await page.getByRole("button", { name: "Guardar sección" }).click();
  await expect(page.getByRole("status")).toContainText("Sección guardada");

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tu panadería produciendo sin paradas");
});

test("avisa si se escribe un precio, sin bloquear", async ({ page }) => {
  await page.goto("/admin/contenido/hero");
  await page.getByLabel("Subtítulo").fill("Rebanadoras desde $150 con entrega en 5 días.");
  await expect(page.getByText(/precio o un plazo fijo/i)).toBeVisible();
  await page.getByRole("button", { name: "Guardar sección" }).click();
  await expect(page.getByRole("status")).toContainText("Sección guardada");
});

test("vaciar una red la quita del pie de página", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Instagram" })).toBeVisible();

  await page.goto("/admin/negocio");
  await page.getByLabel("Enlace de Instagram").fill("");
  await page.getByRole("button", { name: "Guardar datos del negocio" }).click();
  await expect(page.getByRole("status")).toContainText("Datos guardados");

  await page.goto("/");
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Instagram" })).toHaveCount(0);
});

test("los testimonios aparecen solo cuando hay alguno visible", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#testimonios")).toHaveCount(0);

  await page.goto("/admin/testimonios");
  await page.getByLabel("Testimonio").fill("Nos fabricaron el repuesto que nadie tenía. En una semana estábamos produciendo.");
  await page.getByLabel("Nombre del cliente").fill("Panadería La Espiga");
  await page.getByRole("button", { name: "Agregar testimonio" }).click();
  await expect(page.getByRole("status")).toContainText("Testimonio guardado");

  await page.goto("/");
  await expect(page.locator("#testimonios")).toContainText("Panadería La Espiga");
});

test("la dirección vacía no se muestra y al llenarla aparece", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByText("Calle de prueba")).toHaveCount(0);

  await page.goto("/admin/negocio");
  await page.getByLabel("Dirección").fill("Calle de prueba, Los Pinos, Puerto Ordaz");
  await page.getByRole("button", { name: "Guardar datos del negocio" }).click();
  await expect(page.getByRole("status")).toContainText("Datos guardados");

  await page.goto("/");
  await expect(footer.getByText("Calle de prueba, Los Pinos, Puerto Ordaz")).toBeVisible();
});
