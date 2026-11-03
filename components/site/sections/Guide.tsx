import { CheckIcon } from "@/components/ui/icons";
import type { Sections } from "@/lib/validation/content";
import { SectionCta } from "../SectionCta";

type Props = { content: Sections["guide"]; ctaLabel: string };

/** Guía: empatía + autoridad (StoryBrand). */
export function Guide({ content, ctaLabel }: Props) {
  return (
    <section id="guia" aria-labelledby="guia-title" className="bg-hueso py-20 sm:py-28">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow mb-4 text-verde-700">Quiénes somos</p>
          <blockquote className="font-display text-3xl leading-tight text-carbon sm:text-4xl">
            «{content.empathy}»
          </blockquote>
        </div>
        <div>
          <h2 id="guia-title" className="text-2xl text-azul-700 sm:text-3xl">
            {content.title}
          </h2>
          {content.authorityPoints.length > 0 && (
            <ul className="mt-6 flex flex-col gap-3">
              {content.authorityPoints.map((point) => (
                <li key={point} className="flex gap-3 rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-verde-700 text-white">
                    <CheckIcon className="size-4" />
                  </span>
                  <span className="text-lg">{point}</span>
                </li>
              ))}
            </ul>
          )}
          <SectionCta label={ctaLabel} />
        </div>
      </div>
    </section>
  );
}
