import type { Sections } from "@/lib/validation/content";
import { SectionCta } from "../SectionCta";
import { SectionHeading } from "./SectionHeading";

type Props = { content: Sections["problem"]; ctaLabel: string };

export function Problem({ content, ctaLabel }: Props) {
  return (
    <section id="problema" aria-labelledby="problema-title" className="bg-white py-20 sm:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading id="problema-title" eyebrow="El problema" title={content.title} intro={content.body} />
          <div className="hidden lg:block">
            <SectionCta label={ctaLabel} />
          </div>
        </div>
        {content.points.length > 0 && (
          <ol className="flex flex-col">
            {content.points.map((point, index) => (
              <li
                key={point}
                className="reveal grid grid-cols-[auto_1fr] items-baseline gap-5 border-t border-neutral-200 py-7 last:border-b sm:gap-8 sm:py-9"
              >
                <span aria-hidden="true" className="num-outline text-4xl text-red-700/60 sm:text-5xl">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-xl font-bold leading-snug text-carbon sm:text-2xl">{point}</span>
              </li>
            ))}
          </ol>
        )}
        <div className="lg:hidden">
          <SectionCta label={ctaLabel} className="mt-0!" />
        </div>
      </div>
    </section>
  );
}
