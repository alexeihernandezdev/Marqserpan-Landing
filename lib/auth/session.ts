import "server-only";
import { and, eq, ne } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/lib/db/client";
import { adminSessions, adminUsers } from "@/lib/db/schema";
import {
  SESSION_COOKIE,
  SESSION_TTL_MS,
  generateSessionToken,
  hashSessionToken,
  isSessionExpired,
  newExpiry,
  shouldRenewSession,
} from "./session-logic";

export type SessionUser = { id: string; name: string; email: string; sessionId: string };

async function setSessionCookie(token: string, expiresAt: Date) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function createSession(userId: string) {
  const token = generateSessionToken();
  const expiresAt = newExpiry();
  await db.insert(adminSessions).values({ id: hashSessionToken(token), userId, expiresAt });
  await setSessionCookie(token, expiresAt);
}

/** Valida el token contra la BD; renueva la sesión si está por vencer. */
export async function validateSessionToken(token: string): Promise<SessionUser | null> {
  const sessionId = hashSessionToken(token);
  const [row] = await db
    .select({
      sessionId: adminSessions.id,
      expiresAt: adminSessions.expiresAt,
      id: adminUsers.id,
      name: adminUsers.name,
      email: adminUsers.email,
      isActive: adminUsers.isActive,
    })
    .from(adminSessions)
    .innerJoin(adminUsers, eq(adminSessions.userId, adminUsers.id))
    .where(eq(adminSessions.id, sessionId));

  if (!row) return null;
  if (!row.isActive || isSessionExpired(row.expiresAt)) {
    await db.delete(adminSessions).where(eq(adminSessions.id, sessionId));
    return null;
  }
  if (shouldRenewSession(row.expiresAt)) {
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    await db.update(adminSessions).set({ expiresAt }).where(eq(adminSessions.id, sessionId));
    try {
      await setSessionCookie(token, expiresAt);
    } catch {
      // En un Server Component no se pueden escribir cookies; se renovará en la próxima acción.
    }
  }
  return { id: row.id, name: row.name, email: row.email, sessionId: row.sessionId };
}

export async function readSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function deleteSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(adminSessions).where(eq(adminSessions.id, hashSessionToken(token)));
  }
  store.delete(SESSION_COOKIE);
}

/** Al cambiar la contraseña se cierran las demás sesiones del usuario. */
export async function deleteOtherSessions(userId: string, keepSessionId: string) {
  await db
    .delete(adminSessions)
    .where(and(eq(adminSessions.userId, userId), ne(adminSessions.id, keepSessionId)));
}
