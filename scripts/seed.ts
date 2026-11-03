/**
 * Carga el contenido inicial (textos del guion, contacto confirmado, redes de prueba, categorías).
 * Uso: npm run db:seed            → no pisa lo editado en el admin
 *      npm run db:seed -- --force → restablece textos y datos del negocio
 */
import { connect } from "./lib/db";
import { seedDatabase } from "./lib/seed-data";

async function main() {
  const overwrite = process.argv.includes("--force");
  const db = connect();
  const result = await seedDatabase(db, { overwrite });
  console.log(
    `Contenido inicial cargado (${result.sections} secciones)${overwrite ? ", valores restablecidos" : ""}.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
