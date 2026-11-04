import { Suspense } from "react";
import { Catalog } from "@/components/site/Catalog";
import { Hero, type HeroStat } from "@/components/site/Hero";
import { QuoteSection, QuoteSectionFallback } from "@/components/site/QuoteSection";
import { Guide } from "@/components/site/sections/Guide";
import { Plan } from "@/components/site/sections/Plan";
import { Problem } from "@/components/site/sections/Problem";
import { Services } from "@/components/site/sections/Services";
import { Stakes } from "@/components/site/sections/Stakes";
import { Success } from "@/components/site/sections/Success";
import { Testimonials } from "@/components/site/sections/Testimonials";
import { getCatalog } from "@/lib/content/products";
import { getBusinessSettings, getSections, getVisibleTestimonials } from "@/lib/content/queries";

// Landing en el orden de la historia StoryBrand (FR-001).
export default async function HomePage() {
  const [sections, settings, testimonials, catalog] = await Promise.all([
    getSections(),
    getBusinessSettings(),
    getVisibleTestimonials(),
    getCatalog(),
  ]);
  const cta = sections.hero.primaryCta;
  const productOptions = catalog.all.map(({ slug, name }) => ({ slug, name }));
  // Autoridad en la primera pantalla, solo con datos que el negocio mantiene en el admin.
  const stats: HeroStat[] = [
    { value: String(sections.services.items.length), label: "servicios en un solo lugar" },
    { value: String(settings.shippingCoverage.length), label: "países con envíos" },
    { value: String(catalog.all.length), label: "equipos en catálogo" },
  ].filter((stat) => stat.value !== "0");
  const heroProduct = catalog.featured[0] ?? catalog.all[0] ?? null;

  return (
    <>
      <Hero
        content={sections.hero}
        showCatalogCta={catalog.all.length > 0}
        product={heroProduct}
        promise={sections.plan.agreement[0]}
        stats={stats}
      />
      <Problem content={sections.problem} ctaLabel={cta} />
      <Guide content={sections.guide} ctaLabel={cta} />
      <Plan content={sections.plan} ctaLabel={cta} />
      <Services content={sections.services} ctaLabel={cta} />
      <Catalog catalog={catalog} featured={sections.featured} ctaLabel={cta} />
      <Stakes content={sections.stakes} ctaLabel={cta} />
      <Success content={sections.success} ctaLabel={cta} />
      <Testimonials content={sections.testimonials} testimonials={testimonials} />
      <Suspense
        fallback={
          <QuoteSectionFallback content={sections.quote_form} whatsapp={settings.whatsapp} steps={sections.plan.steps} />
        }
      >
        <QuoteSection
          content={sections.quote_form}
          whatsapp={settings.whatsapp}
          products={productOptions}
          steps={sections.plan.steps}
        />
      </Suspense>
    </>
  );
}
