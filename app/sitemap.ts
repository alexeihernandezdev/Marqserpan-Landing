import type { MetadataRoute } from "next";
import { getVisibleProductSlugs } from "@/lib/content/products";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getVisibleProductSlugs();
  return [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    ...slugs.map((slug) => ({
      url: `${siteUrl}/productos/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
