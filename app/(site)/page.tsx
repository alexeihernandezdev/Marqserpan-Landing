import { Suspense } from "react";
import { FeaturedProducts } from "@/components/site/FeaturedProducts";
import { Hero } from "@/components/site/Hero";
import { QuoteSection, QuoteSectionFallback } from "@/components/site/QuoteSection";
import { Brands } from "@/components/site/sections/Brands";
import { Guide } from "@/components/site/sections/Guide";
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

  return (
    <>
      <Hero
        content={sections.hero}
        showCatalogCta={catalog.all.length > 0}
        guarantees={sections.plan.agreement}
      />
      <Problem content={sections.problem} ctaLabel={cta} />
      <Guide content={sections.guide} ctaLabel={cta} />
      <Brands />
      <Services content={sections.services} ctaLabel={cta} />
      <FeaturedProducts catalog={catalog} featured={sections.featured} />
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
