import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import type { Sections } from "@/lib/validation/content";

type HeroProps = { content: Sections["hero"]; showCatalogCta: boolean };

/** Primera pantalla: oferta + CTA directo + CTA transicional (FR-002). */
export function Hero({ content, showCatalogCta }: HeroProps) {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="bg-glow relative overflow-hidden text-white">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
      <div className="container-page relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1fr_auto] lg:py-28">
        <div className="max-w-2xl">
          {content.trustLine && (
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm font-bold text-neutral-100 backdrop-blur">
              <span aria-hidden="true" className="size-2 rounded-full bg-verde-400 shadow-[0_0_0_4px_rgb(63_207_106/0.2)]" />
              {content.trustLine}
            </p>
          )}
          <h1 id="hero-title" className="text-[2.25rem] leading-[1.02] sm:text-5xl lg:text-[4rem]">
            {content.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-neutral-300 sm:text-xl">{content.subtitle}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/#cotizar" size="lg">
              {content.primaryCta}
            </ButtonLink>
            {showCatalogCta && (
              <ButtonLink
                href="/#catalogo"
                size="lg"
                variant="secondary"
                className="border-white/25! bg-white/5! text-white! hover:border-white/50! hover:bg-white/10!"
              >
                {content.secondaryCta}
              </ButtonLink>
            )}
          </div>
        </div>
        <div className="relative hidden lg:block">
          <div aria-hidden="true" className="absolute inset-6 rounded-full bg-azul/25 blur-3xl" />
          <Image
            src="/brand/logo-borde@2x.webp"
            alt=""
            width={320}
            height={351}
            priority
            className="relative h-auto w-64 drop-shadow-2xl xl:w-80"
          />
        </div>
      </div>
    </section>
  );
}
