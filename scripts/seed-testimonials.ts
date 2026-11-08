/**
 * Carga los testimonios reales recibidos por WhatsApp. No duplica: si ya existe uno del
 * mismo cliente y negocio, lo deja como está.
 * Uso: npm run db:seed-testimonials
 *      DOTENV_CONFIG_PATH=.env.prod npm run db:seed-testimonials
 */
import { and, eq, max } from "drizzle-orm";
import { testimonials } from "../lib/db/schema";
import { connect } from "./lib/db";

const TESTIMONIALS = [
  {
    quote:
      "Lo mejor de Maqserpan es su atención completa, que abarca desde la venta e instalación inicial hasta la reparación y el mantenimiento preventivo y correctivo de nuestra maquinaria.",
    authorName: "Grupo Santa María",
    businessName: "Supermercados y Panaderías",
    city: null,
    logo: "/clientes/grupo-santa-maria.webp",
  },
  {
    quote:
      "Panadería Marluis C.A., desde la ciudad de Upata, les ofrece buen servicio, el mejor pan y en especial las famosas catalinas, gracias al servicio y mantenimiento de Distribuidora Maqserpan C.A., ubicada en Puerto Ordaz. Gracias por su servicio ininterrumpido.",
    authorName: "Crisanto Díaz",
    businessName: "Panadería Marluis C.A.",
    city: "Upata",
    logo: null,
  },
];

async function main() {
  const db = connect();
  const [{ last }] = await db.select({ last: max(testimonials.sortOrder) }).from(testimonials);
  let sortOrder = (last ?? -1) + 1;
  let added = 0;

  for (const t of TESTIMONIALS) {
    const [existing] = await db
      .select({ id: testimonials.id })
      .from(testimonials)
      .where(and(eq(testimonials.authorName, t.authorName), eq(testimonials.businessName, t.businessName)));
    if (existing) continue;
    await db.insert(testimonials).values({ ...t, sortOrder: sortOrder++ });
    added++;
  }

  console.log(`Testimonios agregados: ${added} (de ${TESTIMONIALS.length}).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
