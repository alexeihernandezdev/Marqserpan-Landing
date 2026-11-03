import { CheckIcon } from "@/components/ui/icons";
import type { Sections } from "@/lib/validation/content";
import { SectionCta } from "../SectionCta";
import { SectionHeading } from "./SectionHeading";

type Props = { content: Sections["success"]; ctaLabel: string };

export function Success({ content, ctaLabel }: Props) {
  return (
    <section id="exito" aria-labelledby="exito-title" className="bg-white py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="exito-title" eyebrow="El resultado" title={content.title} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {content.points.map((point) => (
            <li key={point} className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-verde-700 text-white">
                <CheckIcon className="size-5" />
              </span>
              <span className="text-lg font-bold">{point}</span>
            </li>
          ))}
        </ul>
        {content.identity && (
          <p className="mt-8 rounded-2xl bg-hueso p-6 text-xl text-carbon sm:p-8">{content.identity}</p>
        )}
        <SectionCta label={ctaLabel} />
      </div>
    </section>
  );
}
