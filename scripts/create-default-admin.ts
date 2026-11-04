/**
 * Crea el usuario predeterminado del admin desde ADMIN_EMAIL y ADMIN_PASSWORD (y ADMIN_NAME,
 * opcional). Lo corre cada despliegue en Vercel antes de compilar (vercel.json).
 * Si el correo ya existe no lo toca: después de entrar, la contraseña se cambia en el admin o
 * con «¿Olvidaste tu contraseña?», y la variable deja de importar.
 *
 * Uso: npm run admin:default
 */
import { createAdminUser } from "./lib/admin";
import { connect } from "./lib/db";

async function main() {
  const db = connect();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email && !password) {
    console.log("ADMIN_EMAIL y ADMIN_PASSWORD no están definidas: no se crea el usuario predeterminado.");
    return;
  }
  if (!email || !password) {
    throw new Error("Define ADMIN_EMAIL y ADMIN_PASSWORD juntas para crear el usuario predeterminado.");
  }

  const name = process.env.ADMIN_NAME?.trim() || "Administrador";
  const created = await createAdminUser(db, { name, email, password });
  console.log(
    created
      ? `Usuario predeterminado del admin creado: ${email}`
      : `El usuario ${email} ya existe: no se cambia su contraseña.`,
  );
}

main().catch((error) => {
  console.error((error as Error).message);
  process.exit(1);
});
