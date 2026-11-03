import { GearShape } from "@/components/ui/icons";
import type { Sections } from "@/lib/validation/content";
import { SectionCta } from "../SectionCta";
import { SectionHeading } from "./SectionHeading";

type Props = { content: Sections["services"]; ctaLabel: string };

/** Líneas de negocio bajo un mensaje paraguas (FR-006). */
export function Services({ content, ctaLabel }: Props) {
  return (
    <section id="servicios" aria-labelledby="servicios-title" className="bg-glow relative overflow-hidden py-20 text-white sm:py-28">
      <div className="container-page relative">
        <SectionHeading id="servicios-title" eyebrow="Servicios" title={content.title} intro={content.intro} tone="dark" />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 transition-colors hover:border-white/20 hover:bg-white/[0.07]"
            >
              <span className="bg-brand-gradient flex size-12 items-center justify-center rounded-xl text-white">
                <GearShape className="size-6" />
              </span>
              <h3 className="mt-5 text-xl text-white">{item.title}</h3>
              <p className="mt-2 text-neutral-300">{item.body}</p>
            </li>
          ))}
        </ul>
        <SectionCta label={ctaLabel} />
      </div>
    </section>
  );
}
