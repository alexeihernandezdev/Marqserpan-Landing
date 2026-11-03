import { describe, expect, it } from "vitest";
import { deriveSource } from "@/lib/leads/source";

const instagramUa =
  "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/124 Mobile Safari/537.36 Instagram 330.0.0.0.0 Android";
const chromeUa = "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/124 Mobile Safari/537.36";

describe("deriveSource", () => {
  it("usa utm_source cuando existe, en minúsculas", () => {
    expect(deriveSource({ utmSource: "Instagram", userAgent: chromeUa, siteHost: "maqserpan.com" })).toBe(
      "instagram",
    );
    expect(deriveSource({ utmSource: "facebook", userAgent: instagramUa, siteHost: "maqserpan.com" })).toBe(
      "facebook",
    );
  });

  it("sin UTM, el navegador de Instagram cuenta como instagram", () => {
    expect(deriveSource({ userAgent: instagramUa, siteHost: "maqserpan.com" })).toBe("instagram");
  });

  it("sin UTM, el navegador de Facebook cuenta como facebook", () => {
    expect(deriveSource({ userAgent: `${chromeUa} [FBAN/FB4A;FBAV/450.0]`, siteHost: "x.com" })).toBe(
      "facebook",
    );
  });

  it("con referencia externa, usa su dominio sin www", () => {
    expect(
      deriveSource({ referrer: "https://www.google.com/search?q=x", userAgent: chromeUa, siteHost: "maqserpan.com" }),
    ).toBe("google.com");
  });

  it("ignora la referencia del propio sitio y referencias inválidas", () => {
    expect(
      deriveSource({ referrer: "https://maqserpan.com/productos/a", userAgent: chromeUa, siteHost: "maqserpan.com" }),
    ).toBe("directo");
    expect(deriveSource({ referrer: "no-es-url", userAgent: chromeUa, siteHost: "maqserpan.com" })).toBe("directo");
  });

  it("sin nada, es directo", () => {
    expect(deriveSource({ userAgent: chromeUa, siteHost: "maqserpan.com" })).toBe("directo");
  });
});
