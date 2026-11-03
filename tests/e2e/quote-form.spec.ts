import { expect, test, type Page } from "@playwright/test";
import { findLeads, resetDatabase } from "./fixtures";

// US1 — Un dueño de panadería pide una cotización (quickstart.md, escenarios US1).
test.skip(({ isMobile }) => !isMobile, "Flujo móvil");

test.beforeEach(async () => {
  await resetDatabase();
});

async function fillForm(page: Page, overrides: Partial<Record<string, string>> = {}) {
  const form = page.locator("#cotizar");
  await form.getByRole("radio", { name: new RegExp(`^${overrides.type ?? "Repuesto"}`) }).check();
  await form.getByRole("textbox", { name: "Nombre", exact: true }).fill(overrides.name ?? "María Pérez");
  await form.getByLabel("Teléfono o WhatsApp").fill(overrides.phone ?? "0416-1234567");
  await form.getByLabel("Ciudad").fill(overrides.city ?? "Puerto Ordaz");
  await form
    .getByLabel("Cuéntanos qué necesitas")
    .fill(overrides.message ?? "Necesito la cuchilla de una rebanadora de 30 cm.");
}

async function submit(page: Page) {
  // El servidor descarta envíos hechos en menos de 3 s (antispam).
  await page.waitForTimeout(3_100);
  await page.locator("#cotizar").getByRole("button", { name: "Enviar solicitud" }).click();
}

test("la primera pantalla muestra la oferta y los dos botones sin desplazarse", async ({ page }) => {
  await page.goto("/");
  const viewport = page.viewportSize()!;
  const inView = async (locator: ReturnType<Page["locator"]>) => {
    const box = await locator.boundingBox();
    return !!box && box.y >= 0 && box.y + box.height <= viewport.height;
  };

  await expect(page.getByRole("img", { name: /Distribuidora Maqserpan/ }).first()).toBeVisible();
  const hero = page.locator("#inicio");
  expect(await inView(hero.getByRole("heading", { level: 1 }))).toBe(true);
  expect(await inView(hero.getByRole("link", { name: "Solicita tu cotización" }))).toBe(true);
  expect(await inView(hero.getByRole("link", { name: "Ver el catálogo" }).or(hero.getByText("22 años")))).toBe(
    true,
  );
});

test("la cabecera mantiene el botón de cotizar visible al desplazarse", async ({ page }) => {
  await page.goto("/");
  await page.locator("#en-juego").scrollIntoViewIfNeeded();
  await expect(page.getByRole("banner").getByRole("link", { name: "Solicita tu cotización" })).toBeInViewport();
});

test("envía una solicitud y guarda tipo y origen", async ({ page }) => {
  await page.goto("/?utm_source=instagram&utm_medium=paid&utm_campaign=rebanadoras");
  await fillForm(page);
  await submit(page);

  await expect(page.getByRole("heading", { name: "¡Recibimos tu solicitud!" })).toBeVisible();
  await expect(page.locator("#cotizar").getByRole("link", { name: /WhatsApp/ })).toHaveAttribute(
    "href",
    "https://wa.me/584166873369",
  );

  const [lead] = await findLeads();
  expect(lead).toMatchObject({
    type: "repuesto",
    phone: "+584161234567",
    source: "instagram",
    utmCampaign: "rebanadoras",
    status: "nueva",
  });
});

test("muestra los errores junto a cada campo y conserva lo escrito", async ({ page }) => {
  await page.goto("/");
  await fillForm(page, { phone: "abc", message: "" });
  await submit(page);

  const form = page.locator("#cotizar");
  await expect(form.getByLabel("Teléfono o WhatsApp")).toHaveAttribute("aria-invalid", "true");
  await expect(form.getByText(/teléfono/i).last()).toBeVisible();
  await expect(form.getByRole("textbox", { name: "Nombre", exact: true })).toHaveValue("María Pérez");
  await expect(form.getByLabel("Ciudad")).toHaveValue("Puerto Ordaz");
  expect(await findLeads()).toHaveLength(0);
});

test("un doble toque crea una sola solicitud", async ({ page }) => {
  await page.goto("/");
  await fillForm(page);
  await page.waitForTimeout(3_100);
  const button = page.locator("#cotizar").getByRole("button", { name: "Enviar solicitud" });
  await button.dblclick();
  await expect(page.getByRole("heading", { name: "¡Recibimos tu solicitud!" })).toBeVisible();
  expect(await findLeads()).toHaveLength(1);
});

test("el campo trampa descarta el envío sin avisar al bot", async ({ page }) => {
  await page.goto("/");
  await fillForm(page);
  await page.locator('#cotizar input[name="website"]').evaluate((input: HTMLInputElement) => {
    input.value = "http://spam.example";
  });
  await submit(page);
  await expect(page.getByRole("heading", { name: "¡Recibimos tu solicitud!" })).toBeVisible();
  expect(await findLeads()).toHaveLength(0);
});

test("limita los envíos seguidos desde el mismo origen", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/");
  for (let i = 0; i < 5; i++) {
    await fillForm(page, { name: `Cliente ${i + 1}` });
    await submit(page);
    await expect(page.getByRole("heading", { name: "¡Recibimos tu solicitud!" })).toBeVisible();
    await page.getByRole("button", { name: "Enviar otra solicitud" }).click();
  }
  await fillForm(page, { name: "Cliente 6" });
  await submit(page);
  await expect(page.locator("#cotizar").getByRole("alert")).toContainText("Espera unos minutos");
  expect(await findLeads()).toHaveLength(5);
});
