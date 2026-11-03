import { AlertIcon } from "@/components/ui/icons";
import type { Sections } from "@/lib/validation/content";
import { SectionCta } from "../SectionCta";
import { SectionHeading } from "./SectionHeading";

type Props = { content: Sections["stakes"]; ctaLabel: string };

/** Lo que está en juego: máximo 3 puntos, tono moderado (FR-005). */
export function Stakes({ content, ctaLabel }: Props) {
  if (content.points.length === 0) return null;
  return (
    <section id="en-juego" aria-labelledby="en-juego-title" className="bg-white py-20 sm:py-28">
      <div className="container-page">
        <div className="bg-glow relative overflow-hidden rounded-3xl px-6 py-12 text-white sm:px-12 sm:py-16">
          <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
          <div className="relative">
            <SectionHeading id="en-juego-title" title={content.title} tone="dark" />
            <ul className="mt-10 grid gap-4 md:grid-cols-3">
              {content.points.slice(0, 3).map((point) => (
                <li
                  key={point}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-lg font-bold"
                >
                  <AlertIcon className="size-6 text-red-400" />
                  {point}
                </li>
              ))}
            </ul>
            <SectionCta label={ctaLabel} />
          </div>
        </div>
      </div>
    </section>
  );
}
