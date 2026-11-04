"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import { getDummyHash, hashPassword, MIN_PASSWORD_LENGTH, verifyPassword } from "@/lib/auth/password";
import { createPasswordResetToken, resetPasswordWithToken } from "@/lib/auth/password-reset";
import { createSession, deleteOtherSessions, deleteSession } from "@/lib/auth/session";
import { safeAdminRedirect } from "@/lib/auth/session-logic";
import { isLoginLocked, recordLoginAttempt } from "@/lib/auth/throttle";
import { verifySession } from "@/lib/dal/session";
import { db } from "@/lib/db/client";
import { adminUsers } from "@/lib/db/schema";
import { sendPasswordResetEmail } from "@/lib/email/password-reset";
import { env, siteUrl } from "@/lib/env";
import type { ActionState } from "@/lib/forms/action-state";
import { hashIp } from "@/lib/leads/rate-limit";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().max(254),
  password: z.string().min(1).max(200),
  next: z.string().optional(),
});

const GENERIC_ERROR = "Correo o contraseña incorrectos.";

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  const email = typeof formData.get("email") === "string" ? String(formData.get("email")) : "";
  if (!parsed.success) {
    return { status: "error", message: GENERIC_ERROR, values: { email } };
  }

  const { password, next } = parsed.data;
  const normalizedEmail = parsed.data.email;

  if (await isLoginLocked(normalizedEmail)) {
    return {
      status: "error",
      message: "Demasiados intentos. Prueba de nuevo en 15 minutos.",
      values: { email },
    };
  }

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, normalizedEmail));

  // Siempre se verifica un hash (real o ficticio) para no revelar qué correos existen.
  const valid = await verifyPassword(user?.passwordHash ?? (await getDummyHash()), password);
  const ok = Boolean(user && user.isActive && valid);
  await recordLoginAttempt(normalizedEmail, ok, hashIp(ip));

  if (!ok || !user) {
    return { status: "error", message: GENERIC_ERROR, values: { email } };
  }

  await createSession(user.id);
  await db.update(adminUsers).set({ lastLoginAt: new Date() }).where(eq(adminUsers.id, user.id));
  redirect(safeAdminRedirect(next));
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}

const passwordSchema = z
  .object({
    current: z.string().min(1, "Escribe tu contraseña actual"),
    next: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `La nueva contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`)
      .max(200),
    confirm: z.string(),
  })
  .refine((data) => data.next === data.confirm, {
    path: ["confirm"],
    message: "Las contraseñas no coinciden",
  });

export async function changePassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await verifySession();
  const parsed = passwordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Revisa los campos marcados.", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, session.id));
  if (!user || !(await verifyPassword(user.passwordHash, parsed.data.current))) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: { current: ["La contraseña actual no es correcta"] },
    };
  }

  await db
    .update(adminUsers)
    .set({ passwordHash: await hashPassword(parsed.data.next) })
    .where(eq(adminUsers.id, user.id));
  await deleteOtherSessions(user.id, session.sessionId);
  return { status: "success", message: "Contraseña actualizada. Se cerraron tus otras sesiones." };
}

const RESET_REQUESTED =
  "Si el correo pertenece a una cuenta del panel, te enviamos un enlace para elegir una nueva contraseña. Revisa también la carpeta de spam.";

/** Pide el enlace por correo. Responde lo mismo exista o no la cuenta, y envía después de responder. */
export async function requestPasswordReset(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = typeof formData.get("email") === "string" ? String(formData.get("email")) : "";
  const parsed = z.email().max(254).safeParse(email.trim().toLowerCase());
  if (!parsed.success) {
    return { status: "error", message: "Escribe un correo válido.", values: { email } };
  }

  const reset = await createPasswordResetToken(parsed.data);
  if (reset) {
    const config = env();
    const resetUrl = `${siteUrl()}/admin/restablecer?token=${encodeURIComponent(reset.token)}`;
    after(() => sendPasswordResetEmail(reset.user, resetUrl, { from: config.EMAIL_FROM, apiKey: config.RESEND_API_KEY }));
  }
  return { status: "success", message: RESET_REQUESTED };
}

const resetSchema = z
  .object({
    token: z.string().min(1).max(200),
    next: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `La nueva contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`)
      .max(200),
    confirm: z.string(),
  })
  .refine((data) => data.next === data.confirm, {
    path: ["confirm"],
    message: "Las contraseñas no coinciden",
  });

export async function resetPassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = resetSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Revisa los campos marcados.", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }
  if (!(await resetPasswordWithToken(parsed.data.token, parsed.data.next))) {
    return { status: "error", message: "El enlace venció o ya se usó. Pide uno nuevo." };
  }
  redirect("/admin/login?restablecida=1");
}
