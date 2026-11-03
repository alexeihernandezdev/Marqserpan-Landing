import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { createProductFixture, loginAsAdmin, resetDatabase } from "./fixtures";

// FR-028: contraste AA y controles usables con lector de pantalla.
const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

test.beforeEach(async () => {
  await resetDatabase();
});

test("la landing no tiene violaciones de accesibilidad", async ({ page }) => {
  await createProductFixture({ name: "Rebanadora accesible" });
  await page.goto("/");
  const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
  expect(results.violations).toEqual([]);
});

test("la ficha de producto no tiene violaciones", async ({ page }) => {
  const product = await createProductFixture({ name: "Rebanadora ficha" });
  await page.goto(`/productos/${product.slug}`);
  const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
  expect(results.violations).toEqual([]);
});

test("el login y las solicitudes del admin no tienen violaciones", async ({ page, isMobile }) => {
  test.skip(isMobile, "Se prueba en escritorio");
  await page.goto("/admin/login");
  expect((await new AxeBuilder({ page }).withTags(WCAG).analyze()).violations).toEqual([]);

  await loginAsAdmin(page);
  await page.goto("/admin/solicitudes");
  expect((await new AxeBuilder({ page }).withTags(WCAG).analyze()).violations).toEqual([]);
});
