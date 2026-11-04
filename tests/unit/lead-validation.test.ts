import { describe, expect, it } from "vitest";
import { z } from "zod";
import { leadContactSchema, leadSchema } from "@/lib/validation/lead";

const valid = {
  submissionId: "3f8a7c1e-2b4d-4f6a-9c8e-1a2b3c4d5e6f",
  type: "repuesto",
  name: "María Pérez",
  phone: "0416-1234567",
  city: "Puerto Ordaz",
  country: "VE",
  message: "Necesito la cuchilla de una rebanadora.",
};

describe("leadSchema", () => {
  it("acepta una solicitud válida y normaliza el teléfono", () => {
    const result = leadSchema.safeParse(valid);
    expect(result.success).toBe(true);
    expect(result.data?.phone).toBe("+584161234567");
  });

  it("exige tipo, nombre, teléfono, ciudad y mensaje", () => {
    const result = leadSchema.safeParse({ submissionId: valid.submissionId });
    expect(result.success).toBe(false);
    const fields = Object.keys(z.flattenError(result.error!).fieldErrors);
    expect(fields).toEqual(expect.arrayContaining(["type", "name", "phone", "city", "message"]));
  });

  it("usa Venezuela como país por defecto", () => {
    const withoutCountry: Partial<typeof valid> = { ...valid };
    delete withoutCountry.country;
    expect(leadSchema.parse(withoutCountry).country).toBe("VE");
  });

  it("acepta correo vacío y rechaza uno inválido", () => {
    expect(leadSchema.safeParse({ ...valid, email: "" }).success).toBe(true);
    expect(leadSchema.safeParse({ ...valid, email: "no-es-correo" }).success).toBe(false);
  });

  it("rechaza teléfonos inválidos", () => {
    expect(leadSchema.safeParse({ ...valid, phone: "abc" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...valid, phone: "123" }).success).toBe(false);
  });

  it("aplica los límites de longitud", () => {
    expect(leadSchema.safeParse({ ...valid, name: "A" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...valid, message: "corto" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...valid, message: "x".repeat(2001) }).success).toBe(false);
  });

  it("rechaza tipos y países fuera de la lista", () => {
    expect(leadSchema.safeParse({ ...valid, type: "otro" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...valid, country: "US" }).success).toBe(false);
  });
});

describe("leadContactSchema", () => {
  const contact = {
    submissionId: valid.submissionId,
    name: valid.name,
    phone: valid.phone,
    city: valid.city,
    country: valid.country,
  };

  it("acepta solo los datos de contacto y normaliza el teléfono", () => {
    const result = leadContactSchema.safeParse(contact);
    expect(result.success).toBe(true);
    expect(result.data?.phone).toBe("+584161234567");
  });

  it("exige nombre, teléfono y ciudad, pero no tipo ni mensaje", () => {
    const result = leadContactSchema.safeParse({ submissionId: valid.submissionId });
    expect(result.success).toBe(false);
    const fields = Object.keys(z.flattenError(result.error!).fieldErrors);
    expect(fields).toEqual(expect.arrayContaining(["name", "phone", "city"]));
    expect(fields).not.toContain("type");
    expect(fields).not.toContain("message");
  });
});
