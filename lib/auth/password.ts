import { hash, verify } from "@node-rs/argon2";

// Argon2id con los parámetros recomendados por OWASP (19 MiB, 2 iteraciones).
// Sin "server-only" para que también lo use scripts/create-admin.ts; el binario nativo nunca
// llega al navegador porque solo lo importa código de servidor.
const OPTIONS = { memoryCost: 19456, timeCost: 2, parallelism: 1 } as const;

export const MIN_PASSWORD_LENGTH = 10;

export function hashPassword(password: string): Promise<string> {
  return hash(password, OPTIONS);
}

export async function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
  try {
    return await verify(passwordHash, password);
  } catch {
    return false;
  }
}

// Hash de una contraseña aleatoria: se verifica contra él cuando el correo no existe, para que
// el tiempo de respuesta no revele qué correos tienen cuenta.
let dummyHash: Promise<string> | undefined;
export function getDummyHash(): Promise<string> {
  dummyHash ??= hashPassword(`dummy-${Math.random()}`);
  return dummyHash;
}
