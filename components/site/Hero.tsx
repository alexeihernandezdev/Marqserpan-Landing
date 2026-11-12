import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import type { Sections } from "@/lib/validation/content";

type HeroProps = {
  content: Sections["hero"];
  showCatalogCta: boolean;
  /** Garantías cortas bajo los botones (acuerdo del plan). */
  guarantees: string[];
};

/** Primera pantalla: oferta + CTA directo + CTA transicional (FR-002), sobre la foto del equipo. */
export function Hero({ content, showCatalogCta, guarantees }: HeroProps) {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate min-h-[88svh] overflow-hidden bg-carbon text-white"
    >
      {/* En escritorio la foto se corre a la derecha para que el texto no tape el logo. */}
      <div className="parallax-hero-bg absolute inset-0 -z-10 lg:left-[45%]">
        <Image
          src="/equipo/hero-logo.webp"
          alt="Logo iluminado de Distribuidora Maqserpan en la pared de la tienda"
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover object-[55%_center]"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-carbon via-carbon/75 to-carbon/10 lg:via-carbon/30 lg:to-transparent"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-carbon/80 to-transparent lg:hidden" />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-[45%] -z-10 hidden w-64 bg-linear-to-r from-carbon to-transparent lg:block"
      />

      <div className="parallax-hero-content container-page flex min-h-[88svh] flex-col justify-end pb-12 pt-32 sm:pb-16">
        {content.trustLine && (
          <p className="trust-seal mb-5 flex w-fit items-center gap-3 rounded-full border border-amarillo/40 bg-verde-700 py-1.5 pl-1.5 pr-4 shadow-lg shadow-black/30">
            <GuaranteeSeal />
            <span className="flex flex-col leading-tight">
              <span className="text-xs font-semibold text-amarillo">
                Respaldo garantizado
              </span>
              <span className="text-sm font-bold">{content.trustLine}</span>
            </span>
          </p>
        )}
        <h1 id="hero-title" className="max-w-3xl text-[2.5rem] leading-[1.02] sm:text-6xl lg:text-7xl">
          {content.title}
        </h1>
        <p className="mt-5 max-w-xl text-lg text-neutral-200">{content.subtitle}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/#cotizar" size="lg" className="group">
            {content.primaryCta}
            <ArrowRightIcon className="size-5 transition-transform group-hover:translate-x-0.5" />
          </ButtonLink>
          {showCatalogCta && (
            <ButtonLink
              href="/catalogo"
              size="lg"
              variant="secondary"
              className="border-white/25! bg-white/5! text-white! hover:border-white/50! hover:bg-white/10!"
            >
              {content.secondaryCta}
            </ButtonLink>
          )}
        </div>
        {guarantees.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-2.5 border-t border-white/15 pt-6 text-sm text-white">
            {guarantees.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 py-2 pl-2 pr-4 shadow-sm backdrop-blur-md"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-verde-700">
                  <CheckIcon className="size-3.5 text-white" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/** Sello de garantía animado: anillo que gira, escudo que se dibuja y check que aparece. */
function GuaranteeSeal() {
  return (
    <span aria-hidden="true" className="relative grid size-10 shrink-0 place-items-center">
      <svg viewBox="0 0 40 40" className="trust-seal-ring absolute inset-0 size-full text-amarillo">
        <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3.2" />
      </svg>
      <span className="grid size-8 place-items-center rounded-full bg-amarillo text-verde-800">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
          <path className="trust-seal-shield" pathLength={1} d="M12 3 5 6v5c0 4.4 3 8.3 7 10 4-1.7 7-5.6 7-10V6l-7-3Z" />
          <path className="trust-seal-check" pathLength={1} d="m8.8 12.2 2.2 2.2 4.2-4.4" />
        </svg>
      </span>
    </span>
  );
}
