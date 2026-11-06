import "server-only";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db/client";
import { categories, productImages, products } from "@/lib/db/schema";
import { TAGS } from "@/lib/tags";
import { slugify } from "@/lib/validation/product";

export type CatalogImage = { publicId: string; width: number; height: number; alt: string };

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string | null;
  isFeatured: boolean;
  /** Marca del fabricante; slug para el filtro ?marca= del catálogo. */
  brand: { name: string; slug: string } | null;
  category: { name: string; slug: string };
  images: CatalogImage[];
};

export type CatalogGroup = { name: string; slug: string; products: CatalogProduct[] };

export type CatalogBrand = { name: string; slug: string; count: number };

export type Catalog = {
  featured: CatalogProduct[];
  groups: CatalogGroup[];
  /** Todos los visibles, para preseleccionar en el formulario. */
  all: CatalogProduct[];
  /** Marcas con al menos un producto visible, en orden alfabético. */
  brands: CatalogBrand[];
};

async function loadVisibleProducts(slug?: string): Promise<CatalogProduct[]> {
  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      shortDescription: products.shortDescription,
      description: products.description,
      isFeatured: products.isFeatured,
      brand: products.brand,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.isVisible, true), slug ? eq(products.slug, slug) : undefined))
    .orderBy(desc(products.isFeatured), asc(categories.sortOrder), asc(products.sortOrder), asc(products.name));

  if (rows.length === 0) return [];

  const images = await db
    .select()
    .from(productImages)
    .where(
      inArray(
        productImages.productId,
        rows.map((r) => r.id),
      ),
    )
    .orderBy(asc(productImages.sortOrder), asc(productImages.createdAt));

  return rows
    .map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      shortDescription: row.shortDescription,
      description: row.description,
      isFeatured: row.isFeatured,
      brand: row.brand ? { name: row.brand, slug: slugify(row.brand) } : null,
      category: { name: row.categoryName, slug: row.categorySlug },
      images: images
        .filter((img) => img.productId === row.id)
        .map((img) => ({ publicId: img.cloudinaryPublicId, width: img.width, height: img.height, alt: img.alt })),
    }))
    // Un producto visible sin fotos no se muestra (regla del admin; defensa adicional).
    .filter((p) => p.images.length > 0);
}

export async function getCatalog(): Promise<Catalog> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("max");

  const all = await loadVisibleProducts();
  const featured = all.filter((p) => p.isFeatured);
  const groups: CatalogGroup[] = [];
  for (const product of all.filter((p) => !p.isFeatured)) {
    let group = groups.find((g) => g.slug === product.category.slug);
    if (!group) {
      group = { name: product.category.name, slug: product.category.slug, products: [] };
      groups.push(group);
    }
    group.products.push(product);
  }
  const brands: CatalogBrand[] = [];
  for (const product of all) {
    if (!product.brand) continue;
    const brand = brands.find((b) => b.slug === product.brand!.slug);
    if (brand) brand.count++;
    else brands.push({ ...product.brand, count: 1 });
  }
  brands.sort((a, b) => a.name.localeCompare(b.name, "es"));
  return { featured, groups, all, brands };
}

export async function getProductBySlug(slug: string): Promise<CatalogProduct | null> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("max");

  const [product] = await loadVisibleProducts(slug);
  return product ?? null;
}

export async function getVisibleProductSlugs(): Promise<string[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("max");

  const rows = await db.select({ slug: products.slug }).from(products).where(eq(products.isVisible, true));
  return rows.map((r) => r.slug);
}
