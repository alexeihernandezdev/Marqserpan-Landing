import { expect, test } from "@playwright/test";
import { insertLeadFixture, loginAsAdmin, resetDatabase } from "./fixtures";

// US3 — El negocio atiende las solicitudes desde el admin (quickstart.md, escenarios US3).
test.skip(({ isMobile }) => isMobile, "Se prueba en escritorio");

test.beforeEach(async ({ page }) => {
  await resetDatabase();
  await insertLeadFixture({ name: "Ana Antigua", source: "directo", createdAt: new Date(Date.now() - 3 * 86_400_000) });
  await insertLeadFixture({
    name: "Bruno Reciente",
    type: "equipo",
    source: "instagram",
    utmCampaign: "rebanadoras",
    phone: "+584161112233",
    productName: "Rebanadora 300",
  });
  await insertLeadFixture({
    name: "Carla Atendida",
    source: "facebook",
    status: "atendida",
    attendedAt: new Date(),
    notificationStatus: "fallido",
  });
  await loginAsAdmin(page);
});

test("la lista muestra las solicitudes, las más recientes primero", async ({ page }) => {
  await page.goto("/admin/solicitudes");
  const rows = page.getByRole("table").getByRole("row");
  await expect(rows).toHaveCount(4); // encabezado + 3
  await expect(rows.nth(1)).toContainText("Carla Atendida");
  await expect(rows.nth(3)).toContainText("Ana Antigua");
  await expect(rows.nth(2)).toContainText("Equipo");
  await expect(rows.nth(2)).toContainText("instagram");
});

test("filtra por estado nueva", async ({ page }) => {
  await page.goto("/admin/solicitudes");
  await page.getByLabel("Estado").selectOption("nueva");
  await expect(page).toHaveURL(/estado=nueva/);
  await expect(page.getByRole("table")).not.toContainText("Carla Atendida");
  await expect(page.getByRole("table")).toContainText("Bruno Reciente");
});

test("el detalle permite escribir por WhatsApp y marcar como atendida", async ({ page }) => {
  await page.goto("/admin/solicitudes");
  await page.getByRole("link", { name: "Bruno Reciente" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Bruno Reciente");
  await expect(page.getByRole("definition").filter({ hasText: "Rebanadora 300" })).toBeVisible();
  await expect(page.getByRole("link", { name: /WhatsApp/ })).toHaveAttribute("href", "https://wa.me/584161112233");

  await page.getByRole("button", { name: "Marcar como atendida" }).click();
  await expect(page.getByRole("button", { name: "Marcar como nueva" })).toBeVisible();
});

test("marca las solicitudes cuyo aviso por correo falló", async ({ page }) => {
  await page.goto("/admin/solicitudes");
  await page.getByRole("link", { name: "Carla Atendida" }).click();
  await expect(page.getByText(/aviso por correo falló/i)).toBeVisible();
});

test("el resumen muestra totales por semana y origen", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByText(/2 solicitudes nuevas/)).toBeVisible();
  const table = page.getByRole("table", { name: /semana/i });
  await expect(table).toContainText("instagram");
  await expect(table).toContainText("facebook");
});
