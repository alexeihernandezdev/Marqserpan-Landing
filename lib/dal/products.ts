import "server-only";
import { and, asc, count, eq, isNotNull, max, ne } from "drizzle-orm";
import { destroyImage } from "@/lib/cloudinary/server";
import { db } from "@/lib/db/client";
import { categories, productImages, products } from "@/lib/db/schema";
import { slugify, type ProductInput } from "@/lib/validation/product";
import { verifySession } from "./session";

// Lecturas y escrituras del catálogo para el admin. Cada función verifica la sesión.

export async function listProductsForAdmin() {
  await verifySession();
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      brand: products.brand,
      isFeatured: products.isFeatured,
      isVisible: products.isVisible,
      sortOrder: products.sortOrder,
      categoryName: categories.name,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(asc(products.sortOrder), asc(products.name));

  const covers = await db
    .select({ productId: productImages.productId, publicId: productImages.cloudinaryPublicId, sortOrder: productImages.sortOrder })
    .from(productImages)
    .orderBy(asc(productImages.sortOrder));

  return rows.map((row) => ({
    ...row,
    cover: covers.find((c) => c.productId === row.id)?.publicId ?? null,
    imageCount: covers.filter((c) => c.productId === row.id).length,
  }));
}

export async function getProductForAdmin(id: string) {
  await verifySession();
  const [product] = await db.select().from(products).where(eq(products.id, id));
  if (!product) return null;
  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, id))
    .orderBy(asc(productImages.sortOrder), asc(productImages.createdAt));
  return { ...product, images };
}

/** Marcas ya usadas, para sugerirlas al escribir y no repetirlas con otra grafía. */
export async function listBrandsForAdmin(): Promise<string[]> {
  await verifySession();
  const rows = await db
    .selectDistinct({ brand: products.brand })
    .from(products)
    .where(isNotNull(products.brand))
    .orderBy(asc(products.brand));
  return rows.map((r) => r.brand!);
}

/** Devuelve un slug libre: si ya existe, añade -2, -3… */
async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let candidate = base;
  for (let i = 2; i < 100; i++) {
    const [taken] = await db
      .select({ id: products.id })
      .from(products)
      .where(and(eq(products.slug, candidate), excludeId ? ne(products.id, excludeId) : undefined));
    if (!taken) return candidate;
    candidate = `${slugify(base).slice(0, 115)}-${i}`;
  }
  throw new Error("No se encontró un enlace libre para el producto.");
}

export async function countImages(productId: string): Promise<number> {
  await verifySession();
  const [row] = await db.select({ total: count() }).from(productImages).where(eq(productImages.productId, productId));
  return row?.total ?? 0;
}

export async function saveProductRecord(input: ProductInput) {
  await verifySession();
  const slug = await uniqueSlug(input.slug, input.id);
  const values = {
    name: input.name,
    slug,
    brand: input.brand,
    categoryId: input.categoryId,
    shortDescription: input.shortDescription,
    description: input.description,
    isFeatured: input.isFeatured,
    isVisible: input.isVisible,
  };

  if (input.id) {
    const [updated] = await db.update(products).set(values).where(eq(products.id, input.id)).returning();
    return updated ?? null;
  }
  const [{ last }] = await db.select({ last: max(products.sortOrder) }).from(products);
  const [created] = await db
    .insert(products)
    .values({ ...values, sortOrder: (last ?? -1) + 1 })
    .returning();
  return created;
}

export async function setProductFlags(id: string, flags: { isVisible?: boolean; isFeatured?: boolean }) {
  await verifySession();
  await db.update(products).set(flags).where(eq(products.id, id));
}

export async function deleteProductRecord(id: string) {
  await verifySession();
  const images = await db
    .select({ publicId: productImages.cloudinaryPublicId })
    .from(productImages)
    .where(eq(productImages.productId, id));
  // Las solicitudes conservan product_name; product_id pasa a NULL (ON DELETE SET NULL).
  await db.delete(products).where(eq(products.id, id));
  await Promise.all(images.map((img) => destroyImage(img.publicId)));
}

export async function reorderProductRecords(ids: string[]) {
  await verifySession();
  await Promise.all(ids.map((id, index) => db.update(products).set({ sortOrder: index }).where(eq(products.id, id))));
}

export async function addImageRecord(
  productId: string,
  image: { publicId: string; width: number; height: number; alt: string },
) {
  await verifySession();
  const [{ last }] = await db
    .select({ last: max(productImages.sortOrder) })
    .from(productImages)
    .where(eq(productImages.productId, productId));
  const [created] = await db
    .insert(productImages)
    .values({
      productId,
      cloudinaryPublicId: image.publicId,
      width: image.width,
      height: image.height,
      alt: image.alt,
      sortOrder: (last ?? -1) + 1,
    })
    .returning();
  return created;
}

export async function updateImageRecord(id: string, values: { alt?: string; sortOrder?: number }) {
  await verifySession();
  const [updated] = await db.update(productImages).set(values).where(eq(productImages.id, id)).returning();
  return updated ?? null;
}

export async function reorderImageRecords(productId: string, ids: string[]) {
  await verifySession();
  await Promise.all(
    ids.map((id, index) =>
      db
        .update(productImages)
        .set({ sortOrder: index })
        .where(and(eq(productImages.id, id), eq(productImages.productId, productId))),
    ),
  );
}

/** Borra la foto. Si era la última de un producto visible, el producto se oculta. */
export async function deleteImageRecord(id: string) {
  await verifySession();
  const [image] = await db.delete(productImages).where(eq(productImages.id, id)).returning();
  if (!image) return null;
  await destroyImage(image.cloudinaryPublicId);
  if ((await countImages(image.productId)) === 0) {
    await db.update(products).set({ isVisible: false }).where(eq(products.id, image.productId));
  }
  return image;
}

// Categorías

export async function listCategoriesForAdmin() {
  await verifySession();
  const rows = await db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name));
  const counts = await db
    .select({ categoryId: products.categoryId, total: count() })
    .from(products)
    .groupBy(products.categoryId);
  return rows.map((row) => ({ ...row, productCount: counts.find((c) => c.categoryId === row.id)?.total ?? 0 }));
}

export async function saveCategoryRecord(input: { id?: string; name: string }) {
  await verifySession();
  const slug = slugify(input.name);
  if (input.id) {
    await db.update(categories).set({ name: input.name, slug }).where(eq(categories.id, input.id));
    return;
  }
  const [{ last }] = await db.select({ last: max(categories.sortOrder) }).from(categories);
  await db.insert(categories).values({ name: input.name, slug, sortOrder: (last ?? -1) + 1 });
}

/** Devuelve false si la categoría tiene productos (no se puede borrar). */
export async function deleteCategoryRecord(id: string): Promise<boolean> {
  await verifySession();
  const [row] = await db.select({ total: count() }).from(products).where(eq(products.categoryId, id));
  if ((row?.total ?? 0) > 0) return false;
  await db.delete(categories).where(eq(categories.id, id));
  return true;
}

export async function reorderCategoryRecords(ids: string[]) {
  await verifySession();
  await Promise.all(ids.map((id, index) => db.update(categories).set({ sortOrder: index }).where(eq(categories.id, id))));
}
