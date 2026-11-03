import { CheckIcon } from "@/components/ui/icons";
import type { Sections } from "@/lib/validation/content";
import { SectionCta } from "../SectionCta";
import { SectionHeading } from "./SectionHeading";

type Props = { content: Sections["plan"]; ctaLabel: string };

export function Plan({ content, ctaLabel }: Props) {
  return (
    <section id="plan" aria-labelledby="plan-title" className="bg-white py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="plan-title" eyebrow="Cómo trabajamos" title={content.title} />
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {content.steps.map((step, index) => (
            <li key={step.title} className="relative rounded-2xl border border-neutral-200 bg-white p-7 shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
              <span
                aria-hidden="true"
                className="bg-brand-gradient flex size-12 items-center justify-center rounded-xl font-display text-xl text-white shadow-lg shadow-azul-700/20"
              >
                {index + 1}
              </span>
              <h3 className="mt-5 text-xl">
                <span className="sr-only">Paso {index + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-2 text-gris">{step.body}</p>
            </li>
          ))}
        </ol>
        {content.agreement.length > 0 && (
          <ul className="mt-6 grid gap-3 rounded-2xl border border-verde-700/15 bg-verde-700/5 p-6 md:grid-cols-3">
            {content.agreement.map((item) => (
              <li key={item} className="flex gap-2.5">
                <CheckIcon className="mt-0.5 size-5 shrink-0 text-verde-700" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
        <SectionCta label={ctaLabel} />
      </div>
    </section>
  );
}
