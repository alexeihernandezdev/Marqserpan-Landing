import { adminUsers } from "../../lib/db/schema";
import { hashPassword, MIN_PASSWORD_LENGTH } from "../../lib/auth/password";
import type { ScriptDb } from "./db";

export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Crea el usuario si su correo no existe. Nunca toca uno existente: su contraseña puede haber
 * cambiado desde el admin o por un enlace de restablecimiento.
 */
export async function createAdminUser(
  db: ScriptDb,
  { name, email, password }: { name: string; email: string; password: string },
): Promise<boolean> {
  if (!EMAIL_PATTERN.test(email)) throw new Error(`El correo ${email} no es válido.`);
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
  }
  const [user] = await db
    .insert(adminUsers)
    .values({ name, email, passwordHash: await hashPassword(password) })
    .onConflictDoNothing({ target: adminUsers.email })
    .returning({ id: adminUsers.id });
  return Boolean(user);
}
