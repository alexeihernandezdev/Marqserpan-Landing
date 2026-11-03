import { AlertIcon } from "@/components/ui/icons";
import type { Sections } from "@/lib/validation/content";
import { SectionCta } from "../SectionCta";
import { SectionHeading } from "./SectionHeading";

type Props = { content: Sections["problem"]; ctaLabel: string };

export function Problem({ content, ctaLabel }: Props) {
  return (
    <section id="problema" aria-labelledby="problema-title" className="bg-white py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="problema-title" eyebrow="El problema" title={content.title} intro={content.body} />
        {content.points.length > 0 && (
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {content.points.map((point) => (
              <li
                key={point}
                className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_1px_2px_rgb(0_0_0/0.04)]"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-red-50 text-red-700">
                  <AlertIcon className="size-6" />
                </span>
                <span className="text-lg font-bold leading-snug">{point}</span>
              </li>
            ))}
          </ul>
        )}
        <SectionCta label={ctaLabel} />
      </div>
    </section>
  );
}
