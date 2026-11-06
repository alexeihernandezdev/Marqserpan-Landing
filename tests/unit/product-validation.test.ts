import { describe, expect, it } from "vitest";
import { categorySchema, productSchema, slugify } from "@/lib/validation/product";

describe("slugify", () => {
  it("quita acentos, eñes, espacios y símbolos", () => {
    expect(slugify("Rebanadora Eléctrica 300 mm")).toBe("rebanadora-electrica-300-mm");
    expect(slugify("Señor Panadero / Ñame & Café")).toBe("senor-panadero-name-cafe");
    expect(slugify("  --Horno  de   piso-- ")).toBe("horno-de-piso");
  });

  it("limita la longitud a 120 caracteres sin guion final", () => {
    const slug = slugify(`${"a".repeat(119)} b`);
    expect(slug.length).toBeLessThanOrEqual(120);
    expect(slug.endsWith("-")).toBe(false);
  });
});

const valid = {
  name: "Rebanadora 300",
  categoryId: "3f8a7c1e-2b4d-4f6a-9c8e-1a2b3c4d5e6f",
  shortDescription: "Para charcutería.",
  description: "",
  isFeatured: "on",
};

describe("productSchema", () => {
  it("acepta un producto válido y genera el slug desde el nombre", () => {
    const result = productSchema.parse(valid);
    expect(result.slug).toBe("rebanadora-300");
    expect(result.isFeatured).toBe(true);
    expect(result.isVisible).toBe(false);
    expect(result.description).toBeNull();
  });

  it("respeta un slug escrito a mano, normalizado", () => {
    expect(productSchema.parse({ ...valid, slug: "Mi Rebanadora" }).slug).toBe("mi-rebanadora");
  });

  it("aplica los límites de los campos", () => {
    expect(productSchema.safeParse({ ...valid, name: "A" }).success).toBe(false);
    expect(productSchema.safeParse({ ...valid, shortDescription: "x".repeat(201) }).success).toBe(false);
    expect(productSchema.safeParse({ ...valid, description: "x".repeat(5001) }).success).toBe(false);
    expect(productSchema.safeParse({ ...valid, categoryId: "no-uuid" }).success).toBe(false);
  });

  it("la marca es opcional: vacía queda en null y se recortan los espacios", () => {
    expect(productSchema.parse(valid).brand).toBeNull();
    expect(productSchema.parse({ ...valid, brand: "   " }).brand).toBeNull();
    expect(productSchema.parse({ ...valid, brand: " Magister " }).brand).toBe("Magister");
    expect(productSchema.safeParse({ ...valid, brand: "x".repeat(61) }).success).toBe(false);
  });

  it("no tiene campo de precio: se descarta si llega", () => {
    const result = productSchema.parse({ ...valid, price: "100" });
    expect(result).not.toHaveProperty("price");
  });
});

describe("categorySchema", () => {
  it("exige un nombre de 2 a 60 caracteres", () => {
    expect(categorySchema.safeParse({ name: "Hornos" }).success).toBe(true);
    expect(categorySchema.safeParse({ name: "H" }).success).toBe(false);
  });
});
