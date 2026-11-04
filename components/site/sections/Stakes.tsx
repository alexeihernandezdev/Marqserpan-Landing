import { XMarkIcon } from "@/components/ui/icons";
import type { Sections } from "@/lib/validation/content";
import { SectionCta } from "../SectionCta";
import { SectionHeading } from "./SectionHeading";

type Props = { content: Sections["stakes"]; ctaLabel: string };

/** Lo que está en juego: máximo 3 puntos, tono moderado (FR-005). */
export function Stakes({ content, ctaLabel }: Props) {
  if (content.points.length === 0) return null;
  return (
    <section id="en-juego" aria-labelledby="en-juego-title" className="bg-white pt-20 sm:pt-28">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[2rem] bg-carbon px-6 py-12 text-white sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-red-500/15 blur-3xl"
          />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-16">
            <div>
              <SectionHeading id="en-juego-title" eyebrow="Lo que está en juego" title={content.title} tone="dark" />
              <SectionCta label={ctaLabel} className="mt-8!" />
            </div>
            <ul className="flex flex-col gap-3">
              {content.points.slice(0, 3).map((point) => (
                <li
                  key={point}
                  className="reveal flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-lg font-bold leading-snug sm:p-6"
                >
                  <XMarkIcon className="mt-0.5 size-6 shrink-0 text-red-400" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
