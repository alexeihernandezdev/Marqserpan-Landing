/**
 * Crea un usuario del admin (no hay registro público).
 * Uso: npm run admin:create -- --name "Rossibell" --email correo@ejemplo.com
 * La contraseña se pide por consola sin mostrarla (mínimo 10 caracteres).
 */
import { createInterface } from "node:readline";
import { adminUsers } from "../lib/db/schema";
import { hashPassword, MIN_PASSWORD_LENGTH } from "../lib/auth/password";
import { connect } from "./lib/db";

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function askHidden(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    const output = rl as unknown as { _writeToOutput: (s: string) => void; output: NodeJS.WriteStream };
    let muted = false;
    output._writeToOutput = (s: string) => {
      if (!muted) output.output.write(s);
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
    muted = true;
  });
}

async function main() {
  const name = arg("name")?.trim();
  const email = arg("email")?.trim().toLowerCase();
  if (!name || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw new Error('Uso: npm run admin:create -- --name "Nombre" --email correo@ejemplo.com');
  }

  const password = process.env.ADMIN_PASSWORD ?? (await askHidden("Contraseña: "));
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
  }
  if (!process.env.ADMIN_PASSWORD && (await askHidden("Repite la contraseña: ")) !== password) {
    throw new Error("Las contraseñas no coinciden.");
  }

  const db = connect();
  const [user] = await db
    .insert(adminUsers)
    .values({ name, email, passwordHash: await hashPassword(password) })
    .onConflictDoNothing({ target: adminUsers.email })
    .returning({ id: adminUsers.id });

  console.log(user ? `Usuario creado: ${email}` : `Ya existe un usuario con el correo ${email}.`);
}

main().catch((error) => {
  console.error((error as Error).message);
  process.exit(1);
});
