import "server-only";
import { and, eq, gt, gte, isNull } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { adminSessions, adminUsers, passwordResetTokens } from "@/lib/db/schema";
import { hashPassword } from "./password";
import {
  RESET_TTL_MS,
  RESET_WINDOW_MS,
  generateSessionToken,
  hashSessionToken,
  isResetLimited,
  isResetTokenUsable,
} from "./session-logic";

/**
 * Crea un enlace para el usuario activo con ese correo. Devuelve null si no existe, está
 * inactivo o ya pidió 3 enlaces en la última hora (quien llama responde igual en todos los casos).
 */
export async function createPasswordResetToken(email: string) {
  const [user] = await db
    .select({ id: adminUsers.id, name: adminUsers.name, email: adminUsers.email, isActive: adminUsers.isActive })
    .from(adminUsers)
    .where(eq(adminUsers.email, email));
  if (!user?.isActive) return null;

  const recent = await db
    .select({ createdAt: passwordResetTokens.createdAt })
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.userId, user.id),
        gte(passwordResetTokens.createdAt, new Date(Date.now() - RESET_WINDOW_MS)),
      ),
    );
  if (isResetLimited(recent.map((r) => r.createdAt))) return null;

  const token = generateSessionToken();
  await db.insert(passwordResetTokens).values({
    id: hashSessionToken(token),
    userId: user.id,
    expiresAt: new Date(Date.now() + RESET_TTL_MS),
  });
  return { token, user: { name: user.name, email: user.email } };
}

/** Para mostrar el formulario o el aviso de enlace vencido antes de que escriban nada. */
export async function isPasswordResetTokenValid(token: string): Promise<boolean> {
  const [row] = await db
    .select({ expiresAt: passwordResetTokens.expiresAt, usedAt: passwordResetTokens.usedAt })
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.id, hashSessionToken(token)));
  return Boolean(row && isResetTokenUsable(row));
}

/**
 * Cambia la contraseña con un enlace válido. Marcar el enlace como usado es atómico, así que
 * dos envíos con el mismo enlace no pueden pasar ambos. Cierra todas las sesiones del usuario
 * e invalida sus otros enlaces pendientes.
 */
export async function resetPasswordWithToken(token: string, password: string): Promise<boolean> {
  const now = new Date();
  const [used] = await db
    .update(passwordResetTokens)
    .set({ usedAt: now })
    .where(
      and(
        eq(passwordResetTokens.id, hashSessionToken(token)),
        isNull(passwordResetTokens.usedAt),
        gt(passwordResetTokens.expiresAt, now),
      ),
    )
    .returning({ userId: passwordResetTokens.userId });
  if (!used) return false;

  await db
    .update(adminUsers)
    .set({ passwordHash: await hashPassword(password) })
    .where(eq(adminUsers.id, used.userId));
  await db.delete(adminSessions).where(eq(adminSessions.userId, used.userId));
  await db
    .update(passwordResetTokens)
    .set({ usedAt: now })
    .where(and(eq(passwordResetTokens.userId, used.userId), isNull(passwordResetTokens.usedAt)));
  return true;
}
