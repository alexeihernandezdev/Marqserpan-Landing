import "server-only";
import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET debe tener al menos 32 caracteres"),
  CLOUDINARY_CLOUD_NAME: z.string().default(""),
  CLOUDINARY_API_KEY: z.string().default(""),
  CLOUDINARY_API_SECRET: z.string().default(""),
  RESEND_API_KEY: z.string().default(""),
  EMAIL_FROM: z.string().default("onboarding@resend.dev"),
  NEXT_PUBLIC_SITE_URL: z.string().default("http://localhost:3000"),
  SHOW_TEST_SOCIALS: z.string().optional(),
  VERCEL_ENV: z.string().optional(),
});

type Env = z.infer<typeof schema>;

let cached: Env | undefined;

/** Variables de servidor validadas. Lanza un error claro si falta alguna obligatoria. */
export function env(): Env {
  if (!cached) {
    const parsed = schema.safeParse(process.env);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
      throw new Error(`Variables de entorno inválidas:\n${issues.join("\n")}`);
    }
    cached = parsed.data;
  }
  return cached;
}

export function isProduction(): boolean {
  return process.env.VERCEL_ENV === "production";
}

/** Las redes marcadas «de prueba» solo se muestran fuera de producción. */
export function showTestSocials(): boolean {
  return process.env.SHOW_TEST_SOCIALS === "true" && !isProduction();
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
