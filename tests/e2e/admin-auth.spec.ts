import { expect, test } from "@playwright/test";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  createAdminFixture,
  createResetTokenFixture,
  findResetTokens,
  resetDatabase,
} from "./fixtures";

// Base del admin — protección y login (constitución: pruebas obligatorias de la protección del admin).
test.skip(({ isMobile }) => isMobile, "Se prueba en escritorio");

test.beforeEach(async () => {
  await resetDatabase();
  await createAdminFixture();
});

async function login(page: import("@playwright/test").Page, password = ADMIN_PASSWORD) {
  await page.getByLabel("Correo").fill(ADMIN_EMAIL);
  await page.getByLabel(/^Contraseña/).fill(password);
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

test.describe("restablecer contraseña", () => {
  const RESET_REQUESTED = /Si el correo pertenece a una cuenta del panel/;

  async function requestReset(page: import("@playwright/test").Page, email: string) {
    await page.getByLabel("Correo").fill(email);
    await Promise.all([
      page.waitForResponse((response) => response.request().method() === "POST"),
      page.getByRole("button", { name: "Enviar enlace" }).click(),
    ]);
  }

  test("desde el login se pide un enlace y se guarda solo su hash", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByRole("link", { name: "¿Olvidaste tu contraseña?" }).click();
    await expect(page).toHaveURL(/\/admin\/recuperar$/);
    await requestReset(page, ADMIN_EMAIL.toUpperCase());
    await expect(page.getByRole("status")).toHaveText(RESET_REQUESTED);
    const tokens = await findResetTokens();
    expect(tokens).toHaveLength(1);
    expect(tokens[0].id).toMatch(/^[a-f0-9]{64}$/);
  });

  test("un correo sin cuenta recibe la misma respuesta y no crea enlaces", async ({ page }) => {
    await page.goto("/admin/recuperar");
    await requestReset(page, "nadie@prueba.test");
    await expect(page.getByRole("status")).toHaveText(RESET_REQUESTED);
    expect(await findResetTokens()).toHaveLength(0);
  });

  test("como mucho 3 enlaces por hora", async ({ page }) => {
    await page.goto("/admin/recuperar");
    for (let i = 0; i < 4; i++) {
      await requestReset(page, ADMIN_EMAIL);
      await expect(page.getByRole("status")).toHaveText(RESET_REQUESTED);
    }
    expect(await findResetTokens()).toHaveLength(3);
  });

  test("con el enlace se elige una contraseña nueva, que sirve para entrar", async ({ page }) => {
    const token = await createResetTokenFixture();
    await page.goto(`/admin/restablecer?token=${token}`);
    await expect(page.getByRole("heading", { name: "Nueva contraseña" })).toBeVisible();
    await page.getByLabel(/^Nueva contraseña/).fill("otra-clave-segura-456");
    await page.getByLabel("Repite la nueva contraseña").fill("otra-clave-segura-456");
    await page.getByRole("button", { name: "Guardar contraseña" }).click();

    await expect(page).toHaveURL(/\/admin\/login\?restablecida=1$/);
    await expect(page.getByRole("status")).toHaveText("Contraseña actualizada. Entra con la nueva.");
    await login(page, ADMIN_PASSWORD);
    await expect(page.locator("main").getByRole("alert")).toHaveText("Correo o contraseña incorrectos.");
    await login(page, "otra-clave-segura-456");
    await expect(page).toHaveURL(/\/admin$/);

    // El enlace ya no sirve una segunda vez.
    await page.goto(`/admin/restablecer?token=${token}`);
    await expect(page.getByRole("heading", { name: "Enlace no válido" })).toBeVisible();
  });

  test("las contraseñas deben coincidir", async ({ page }) => {
    const token = await createResetTokenFixture();
    await page.goto(`/admin/restablecer?token=${token}`);
    await page.getByLabel(/^Nueva contraseña/).fill("otra-clave-segura-456");
    await page.getByLabel("Repite la nueva contraseña").fill("distinta-clave-789");
    await page.getByRole("button", { name: "Guardar contraseña" }).click();
    await expect(page.getByText("Las contraseñas no coinciden")).toBeVisible();
  });

  test("un enlace vencido o inventado no se acepta", async ({ page }) => {
    const token = await createResetTokenFixture(-1000);
    await page.goto(`/admin/restablecer?token=${token}`);
    await expect(page.getByRole("heading", { name: "Enlace no válido" })).toBeVisible();
    await page.goto("/admin/restablecer?token=inventado");
    await expect(page.getByRole("heading", { name: "Enlace no válido" })).toBeVisible();
    await page.getByRole("link", { name: "Pedir un enlace nuevo" }).click();
    await expect(page).toHaveURL(/\/admin\/recuperar$/);
  });
});
