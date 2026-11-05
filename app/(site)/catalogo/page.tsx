import type { Metadata } from "next";
import { Catalog } from "@/components/site/Catalog";
import { getCatalog } from "@/lib/content/products";
import { getSections } from "@/lib/content/queries";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Equipos y repuestos para panaderías, cafeterías y charcuterías. Pide tu cotización.",
  alternates: { canonical: "/catalogo" },
};

export default async function CatalogPage() {
  const [sections, catalog] = await Promise.all([getSections(), getCatalog()]);
  return <Catalog catalog={catalog} ctaLabel={sections.hero.primaryCta} />;
}
