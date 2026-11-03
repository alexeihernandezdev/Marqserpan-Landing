import { expect, test } from "@playwright/test";
import { ADMIN_EMAIL, ADMIN_PASSWORD, createAdminFixture, resetDatabase } from "./fixtures";

// Base del admin — protección y login (constitución: pruebas obligatorias de la protección del admin).
test.skip(({ isMobile }) => isMobile, "Se prueba en escritorio");

test.beforeEach(async () => {
  await resetDatabase();
  await createAdminFixture();
});

async function login(page: import("@playwright/test").Page, password = ADMIN_PASSWORD) {
  await page.getByLabel("Correo").fill(ADMIN_EMAIL);
  await page.getByLabel("Contraseña").fill(password);
  // Espera la respuesta de la Server Action para no encadenar intentos antes de que se registren.
  await Promise.all([
    page.waitForResponse((response) => response.request().method() === "POST"),
    page.getByRole("button", { name: "Entrar" }).click(),
  ]);
}

test("sin sesión, el admin redirige al login conservando la ruta", async ({ page }) => {
  await page.goto("/admin/solicitudes");
  await expect(page).toHaveURL(/\/admin\/login\?next=%2Fadmin%2Fsolicitudes/);
  await expect(page.getByRole("heading", { name: "Entrar al panel" })).toBeVisible();
});

test("con la contraseña correcta entra y vuelve a la ruta pedida", async ({ page }) => {
  await page.goto("/admin/solicitudes");
  await login(page);
  await expect(page).toHaveURL(/\/admin\/solicitudes$/);
  await expect(page.getByRole("navigation", { name: "Panel" })).toBeVisible();
});

test("una contraseña incorrecta muestra un mensaje genérico", async ({ page }) => {
  await page.goto("/admin/login");
  await login(page, "incorrecta-123");
  await expect(page.locator("main").getByRole("alert")).toHaveText("Correo o contraseña incorrectos.");
});

test("tras 5 intentos fallidos bloquea el login", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/admin/login");
  for (let i = 0; i < 5; i++) {
    await login(page, `incorrecta-${i}`);
    await expect(page.locator("main").getByRole("alert")).toBeVisible();
  }
  await login(page);
  await expect(page.locator("main").getByRole("alert")).toContainText("Demasiados intentos");
  await expect(page).toHaveURL(/\/admin\/login/);
});

test("ignora destinos externos en next", async ({ page }) => {
  await page.goto("/admin/login?next=https://otro.sitio");
  await login(page);
  await expect(page).toHaveURL(/\/admin$/);
});

test("cerrar sesión impide volver con el botón atrás", async ({ page }) => {
  await page.goto("/admin/login");
  await login(page);
  await expect(page).toHaveURL(/\/admin$/);
  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(page).toHaveURL(/\/admin\/login/);
  await page.goBack();
  await page.reload();
  await expect(page).toHaveURL(/\/admin\/login/);
});
