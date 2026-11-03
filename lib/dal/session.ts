import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { readSessionToken, validateSessionToken, type SessionUser } from "@/lib/auth/session";

/**
 * Punto único de autorización del admin (Data Access Layer). Toda página, Server Action y
 * lectura del admin lo llama. Redirige al login si no hay una sesión válida.
 */
export const verifySession = cache(async (): Promise<SessionUser> => {
  const token = await readSessionToken();
  const user = token ? await validateSessionToken(token) : null;
  if (!user) redirect("/admin/login");
  return user;
});
