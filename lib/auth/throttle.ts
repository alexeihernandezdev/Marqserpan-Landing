import "server-only";
import { and, desc, eq, gte } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { loginAttempts } from "@/lib/db/schema";
import { isLockedOut, LOGIN_WINDOW_MS } from "./session-logic";

export async function recordLoginAttempt(email: string, succeeded: boolean, ipHash: string | null) {
  await db.insert(loginAttempts).values({ email, succeeded, ipHash });
}

export async function isLoginLocked(email: string): Promise<boolean> {
  const since = new Date(Date.now() - LOGIN_WINDOW_MS);
  const attempts = await db
    .select({ succeeded: loginAttempts.succeeded, createdAt: loginAttempts.createdAt })
    .from(loginAttempts)
    .where(and(eq(loginAttempts.email, email), gte(loginAttempts.createdAt, since)))
    .orderBy(desc(loginAttempts.createdAt))
    .limit(50);
  return isLockedOut(attempts);
}
