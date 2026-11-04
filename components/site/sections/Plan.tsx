import { CheckIcon } from "@/components/ui/icons";
import type { Sections } from "@/lib/validation/content";
import { SectionCta } from "../SectionCta";
import { SectionHeading } from "./SectionHeading";

type Props = { content: Sections["plan"]; ctaLabel: string };

export function Plan({ content, ctaLabel }: Props) {
  return (
    <section id="plan" aria-labelledby="plan-title" className="bg-white py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="plan-title" eyebrow="Cómo trabajamos" title={content.title} align="center" />
        <div className="relative mt-14">
          {/* Línea que une los pasos: vertical en el teléfono, horizontal desde md. */}
          <span
            aria-hidden="true"
            className="absolute bottom-6 left-6 top-6 w-px bg-linear-to-b from-verde-700 via-azul-700 to-azul-700/20 md:inset-x-[16.6%] md:bottom-auto md:top-7 md:h-px md:w-auto md:bg-linear-to-r"
          />
          <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
            {content.steps.map((step, index) => (
              <li key={step.title} className="reveal relative flex gap-5 md:flex-col md:items-center md:text-center">
                <span
                  aria-hidden="true"
                  className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-white font-display text-xl text-verde-700 ring-2 ring-verde-700 md:size-14 md:text-2xl"
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-xl sm:text-2xl">
                    <span className="sr-only">Paso {index + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="mt-2 text-gris md:mx-auto md:max-w-xs">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        {content.agreement.length > 0 && (
          <ul className="mt-14 flex flex-wrap gap-3 md:justify-center">
            {content.agreement.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 rounded-2xl bg-verde-700/[0.07] md:rounded-full px-4 py-2.5 text-sm font-bold text-verde-800 ring-1 ring-verde-700/15"
              >
                <CheckIcon className="mt-0.5 size-4 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
        <SectionCta label={ctaLabel} align="center" />
      </div>
    </section>
  );
}
