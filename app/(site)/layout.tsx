import { AttributionCapture } from "@/components/site/AttributionCapture";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { getBusinessSettings, getSections } from "@/lib/content/queries";

export default async function SiteLayout({ children, modal }: LayoutProps<"/">) {
  const [sections, settings] = await Promise.all([getSections(), getBusinessSettings()]);

  return (
    <>
      <a
        href="#contenido"
        className="sr-only z-50 rounded bg-white px-4 py-2 font-bold focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Saltar al contenido
      </a>
      <Header ctaLabel={sections.hero.primaryCta} />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <Footer contact={sections.contact} settings={settings} />
      {modal}
      <AttributionCapture />
    </>
  );
}
