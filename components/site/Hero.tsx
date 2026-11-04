import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import type { CatalogProduct } from "@/lib/content/products";
import type { Sections } from "@/lib/validation/content";

export type HeroStat = { value: string; label: string };

type HeroProps = {
  content: Sections["hero"];
  showCatalogCta: boolean;
  /** Equipo destacado que se muestra como imagen de éxito; sin él se usa el logo. */
  product?: CatalogProduct | null;
  /** Garantía corta junto a la foto (del acuerdo del plan). */
  promise?: string;
  stats: HeroStat[];
};

// Resalta las dos últimas palabras del titular («…nunca pare»): la promesa.
function splitTitle(title: string) {
  const words = title.trim().split(/\s+/);
  if (words.length < 4) return { lead: title, accent: "" };
  return { lead: words.slice(0, -2).join(" "), accent: words.slice(-2).join(" ") };
}

/** Primera pantalla: oferta + CTA directo + CTA transicional (FR-002). */
export function Hero({ content, showCatalogCta, product, promise, stats }: HeroProps) {
  const { lead, accent } = splitTitle(content.title);
  const cover = product?.images[0];

  return (
    <section id="inicio" aria-labelledby="hero-title" className="bg-glow relative overflow-hidden text-white">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="container-page relative grid grid-cols-1 items-center gap-12 pb-10 pt-12 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:pb-14 lg:pt-20">
        <div className="max-w-2xl">
          {content.trustLine && (
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm font-bold text-neutral-100 backdrop-blur">
              <span aria-hidden="true" className="size-2 rounded-full bg-verde-400 shadow-[0_0_0_4px_rgb(63_207_106/0.2)]" />
              {content.trustLine}
            </p>
          )}
          <h1 id="hero-title" className="text-[2.4rem] leading-[1.02] sm:text-6xl lg:text-[4.25rem]">
            {lead} {accent && <span className="text-brand-gradient">{accent}</span>}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-neutral-300 sm:text-xl">{content.subtitle}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/#cotizar" size="lg" className="group">
              {content.primaryCta}
              <ArrowRightIcon className="size-5 transition-transform group-hover:translate-x-0.5" />
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

        {cover ? (
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div aria-hidden="true" className="absolute -inset-6 rounded-[3rem] bg-azul/20 blur-3xl" />
            <figure className="relative overflow-hidden rounded-[2rem] bg-white p-2 shadow-2xl shadow-black/40 ring-1 ring-white/10">
              <div className="photo-surface relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                <Image
                  src={cover.publicId}
                  alt={cover.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="flex items-center justify-between gap-3 px-4 pb-2 pt-4 text-carbon">
                <span className="min-w-0">
                  <span className="block text-xs font-bold uppercase tracking-wider text-verde-700">
                    {product?.category.name}
                  </span>
                  <span className="block truncate font-bold">{product?.name}</span>
                </span>
                <span className="shrink-0 rounded-full bg-carbon px-3 py-1 text-xs font-bold text-white">Destacado</span>
              </figcaption>
            </figure>
            {promise && (
              <p className="absolute -top-4 left-4 flex max-w-[16rem] items-start gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold leading-snug text-carbon shadow-xl sm:-left-6 lg:-left-10">
                <span className="mt-px flex size-5 shrink-0 items-center justify-center rounded-full bg-verde-700 text-white">
                  <CheckIcon className="size-3.5" />
                </span>
                {promise}
              </p>
            )}
          </div>
        ) : (
          <div className="relative hidden lg:block">
            <div aria-hidden="true" className="absolute inset-6 rounded-full bg-azul/25 blur-3xl" />
            <Image
              src="/brand/logo-borde@2x.webp"
              alt=""
              width={320}
              height={351}
              priority
              className="relative mx-auto h-auto w-64 drop-shadow-2xl xl:w-80"
            />
          </div>
        )}
      </div>

      {stats.length > 0 && (
        <div className="relative border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <dl className="container-page grid grid-cols-3 divide-x divide-white/10">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1 px-3 py-5 first:pl-0 sm:flex-row sm:items-baseline sm:gap-3 sm:px-6 sm:py-6">
                <dt className="order-2 text-xs leading-snug text-neutral-400 sm:text-sm">{stat.label}</dt>
                <dd className="order-1 font-display text-2xl text-white sm:text-4xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}
