import { CheckIcon } from "@/components/ui/icons";
import type { Sections } from "@/lib/validation/content";
import { SectionCta } from "../SectionCta";
import { TeamCarousel } from "../TeamCarousel";

type Props = { content: Sections["guide"]; ctaLabel: string };

// «22 años equipando…» → cifra grande + resto del titular. Sin cifra, el titular va completo.
function splitFigure(title: string) {
  const match = title.match(/^(\d+)\s+(.+)$/);
  return match ? { figure: match[1], rest: match[2] } : { figure: "", rest: title };
}

/** Guía: empatía + autoridad (StoryBrand). */
export function Guide({ content, ctaLabel }: Props) {
  const { figure, rest } = splitFigure(content.title);

  return (
    <section id="guia" aria-labelledby="guia-title" className="relative overflow-hidden bg-hueso py-20 sm:py-28">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <p className="eyebrow mb-6 text-verde-700">Quiénes somos</p>
          <blockquote>
            <span aria-hidden="true" className="block h-12 font-display text-[6rem] leading-none text-verde-700/30 sm:h-16 sm:text-[8rem]">
              “
            </span>
            <p className="font-display text-3xl leading-[1.12] text-carbon sm:text-[2.75rem]">
              {content.empathy}
            </p>
          </blockquote>
          <div className="hidden lg:block">
            <SectionCta label={ctaLabel} />
          </div>
        </div>

        <div className="reveal rounded-[2rem] bg-white p-7 shadow-[0_24px_60px_-30px_rgb(0_0_0/0.25)] ring-1 ring-black/5 sm:p-10">
          <h2 id="guia-title" className="flex items-end gap-4">
            {figure && (
              <span className="bg-brand-gradient bg-clip-text font-display text-7xl leading-[0.8] text-transparent sm:text-8xl">
                {figure}
              </span>
            )}
            <span className="pb-1 text-xl leading-tight text-azul-700 sm:text-2xl">{rest}</span>
          </h2>
          {content.authorityPoints.length > 0 && (
            <ul className="mt-8 flex flex-col divide-y divide-neutral-200 border-t border-neutral-200">
              {content.authorityPoints.map((point) => (
                <li key={point} className="flex gap-3.5 py-4">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-verde-700 text-white">
                    <CheckIcon className="size-3.5" />
                  </span>
                  <span className="text-lg leading-snug">{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="lg:hidden">
          <SectionCta label={ctaLabel} className="mt-0!" />
        </div>
      </div>
      <TeamCarousel className="mt-20 sm:mt-24" />
    </section>
  );
}
