/**
 * Carga el catálogo inicial (scripts/catalog): sube las fotos a Cloudinary y crea o
 * actualiza los productos por su slug. Se puede repetir sin duplicar nada.
 *
 * Uso: npm run db:seed-products                 → BD de .env.local, carpeta de pruebas
 *      npm run db:seed-products -- --production → carpeta de producción (maqserpan/products)
 *
 * Si el negocio ocultó un producto en el admin, se respeta: solo se pone visible al crearlo.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import { eq, inArray } from "drizzle-orm";
import { categories, productImages, products } from "../lib/db/schema";
import { productSchema } from "../lib/validation/product";
import { CATALOG_CATEGORIES, CATALOG_PRODUCTS } from "./catalog/products";
import { connect } from "./lib/db";

const IMAGES_DIR = path.join(import.meta.dirname, "catalog", "images");

function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Faltan las credenciales de Cloudinary (CLOUDINARY_*) en el archivo de entorno.");
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
}

// Antes de tocar nada: cada producto pasa la misma validación que el formulario del admin.
function validateCatalog() {
  const slugs = new Set<string>();
  for (const [index, product] of CATALOG_PRODUCTS.entries()) {
    const parsed = productSchema.safeParse({
      name: product.name,
      slug: product.slug,
      categoryId: crypto.randomUUID(),
      shortDescription: product.shortDescription,
      description: product.description,
    });
    if (!parsed.success) {
      throw new Error(`${product.slug}: ${parsed.error.issues.map((i) => i.message).join("; ")}`);
    }
    if (parsed.data.slug !== product.slug) throw new Error(`${product.slug}: el slug no está normalizado`);
    if (slugs.has(product.slug)) throw new Error(`${product.slug}: slug repetido (posición ${index})`);
    slugs.add(product.slug);
    if (!CATALOG_CATEGORIES.some((c) => c.slug === product.categorySlug)) {
      throw new Error(`${product.slug}: la categoría ${product.categorySlug} no existe`);
    }
    product.photos.forEach((_, n) => readFileSync(path.join(IMAGES_DIR, `${product.slug}-${n + 1}.jpg`)));
  }
}

async function main() {
  const production = process.argv.includes("--production");
  const folder = production ? "maqserpan/products" : "maqserpan-test";
  const db = connect();
  validateCatalog();
  configureCloudinary();

  // Categorías: se crean las que falten, sin tocar el orden que el negocio haya elegido.
  const existing = await db.select().from(categories);
  let nextOrder = existing.reduce((max, c) => Math.max(max, c.sortOrder + 1), 0);
  for (const category of CATALOG_CATEGORIES) {
    if (existing.some((c) => c.slug === category.slug)) continue;
    await db.insert(categories).values({ ...category, sortOrder: nextOrder++ }).onConflictDoNothing();
  }
  const categoryIds = new Map(
    (await db.select().from(categories).where(inArray(categories.slug, CATALOG_CATEGORIES.map((c) => c.slug)))).map(
      (c) => [c.slug, c.id],
    ),
  );

  for (const [sortOrder, product] of CATALOG_PRODUCTS.entries()) {
    const values = {
      slug: product.slug,
      name: product.name,
      categoryId: categoryIds.get(product.categorySlug)!,
      shortDescription: product.shortDescription,
      description: product.description,
      isFeatured: product.isFeatured ?? false,
      sortOrder,
    };
    const [row] = await db
      .insert(products)
      .values({ ...values, isVisible: true })
      .onConflictDoUpdate({ target: products.slug, set: { ...values, updatedAt: new Date() } })
      .returning({ id: products.id });

    for (const [n, alt] of product.photos.entries()) {
      const publicId = `${folder}/${product.slug}-${n + 1}`;
      const upload = await cloudinary.uploader.upload(path.join(IMAGES_DIR, `${product.slug}-${n + 1}.jpg`), {
        public_id: publicId,
        overwrite: true,
        invalidate: true,
      });
      const image = { width: upload.width, height: upload.height, alt, sortOrder: n };
      await db
        .insert(productImages)
        .values({ productId: row.id, cloudinaryPublicId: upload.public_id, ...image })
        .onConflictDoUpdate({ target: productImages.cloudinaryPublicId, set: { ...image, updatedAt: new Date() } });
    }
    console.log(`✓ ${product.name} (${product.photos.length} foto${product.photos.length === 1 ? "" : "s"})`);
  }

  const total = await db.$count(products, eq(products.isVisible, true));
  console.log(`\nCatálogo cargado en ${folder}: ${CATALOG_PRODUCTS.length} productos (${total} visibles en total).`);
  console.log(
    "La landing guarda el catálogo en caché: reinicia `next dev` en local; en producción, guarda cualquier producto en el admin o vuelve a desplegar.",
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
