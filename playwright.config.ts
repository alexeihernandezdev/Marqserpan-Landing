import { config } from "dotenv";
import { defineConfig, devices } from "@playwright/test";

// Las pruebas e2e usan una rama de Neon propia, definida en .env.test.
config({ path: ".env.test" });

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

const mobile = {
  viewport: { width: 360, height: 640 },
  hasTouch: true,
  isMobile: true,
  deviceScaleFactor: 2,
};

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    locale: "es-VE",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "mobile",
      use: { ...devices["Pixel 5"], ...mobile },
    },
    {
      name: "instagram",
      use: {
        ...devices["Pixel 5"],
        ...mobile,
        userAgent:
          "Mozilla/5.0 (Linux; Android 14; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.0.0 Mobile Safari/537.36 Instagram 330.0.0.0.0 Android",
      },
    },
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run build && npm run start",
        url: baseURL,
        timeout: 300_000,
        reuseExistingServer: !process.env.CI,
        // Hereda process.env (cargado desde .env.test arriba); Next no sobrescribe variables ya definidas.
      },
});
