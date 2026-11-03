import { createHash, randomBytes } from "node:crypto";

// Lógica pura de sesiones (sin BD ni cookies), probada en tests/unit/session.test.ts.

export { SESSION_COOKIE } from "./constants";
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const RENEW_WHEN_LESS_THAN_MS = 3 * 24 * 60 * 60 * 1000;

/** Token aleatorio de 32 bytes para la cookie. */
export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

/** En la BD solo se guarda el hash del token. */
export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function isSessionExpired(expiresAt: Date, now = new Date()): boolean {
  return expiresAt.getTime() <= now.getTime();
}

/** Se renueva si quedan menos de 3 días. */
export function shouldRenewSession(expiresAt: Date, now = new Date()): boolean {
  return expiresAt.getTime() - now.getTime() < RENEW_WHEN_LESS_THAN_MS;
}

export function newExpiry(now = new Date()): Date {
  return new Date(now.getTime() + SESSION_TTL_MS);
}

export const LOGIN_WINDOW_MS = 15 * 60 * 1000;
export const LOGIN_MAX_FAILURES = 5;

/**
 * Bloqueado si hay 5 o más intentos fallidos en los últimos 15 minutos. Un acierto no borra
 * los fallos de la ventana: así no se puede alternar una cuenta conocida para seguir probando.
 */
export function isLockedOut(attempts: { succeeded: boolean; createdAt: Date }[], now = new Date()): boolean {
  const since = now.getTime() - LOGIN_WINDOW_MS;
  const failures = attempts.filter((a) => !a.succeeded && a.createdAt.getTime() > since).length;
  return failures >= LOGIN_MAX_FAILURES;
}

/** Solo se aceptan redirecciones internas del admin (evita redirecciones abiertas). */
export function safeAdminRedirect(next: string | null | undefined): string {
  if (!next || !/^\/admin(?:[/?#]|$)/.test(next) || next.includes("\\")) return "/admin";
  if (next.startsWith("/admin/login")) return "/admin";
  return next;
}
