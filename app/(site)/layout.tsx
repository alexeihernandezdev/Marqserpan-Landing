import { AttributionCapture } from "@/components/site/AttributionCapture";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { getCatalog } from "@/lib/content/products";
import { getBusinessSettings, getSections } from "@/lib/content/queries";

export default async function SiteLayout({ children, modal }: LayoutProps<"/">) {
  const [sections, settings, catalog] = await Promise.all([getSections(), getBusinessSettings(), getCatalog()]);

  return (
    <>
      <a
        href="#contenido"
        className="sr-only z-50 rounded bg-white px-4 py-2 font-bold focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Saltar al contenido
      </a>
      <Header
        ctaLabel={sections.hero.primaryCta}
        catalogLabel={catalog.all.length > 0 ? sections.hero.secondaryCta : null}
      />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <Footer contact={sections.contact} settings={settings} />
      {modal}
      <AttributionCapture />
    </>
  );
}
