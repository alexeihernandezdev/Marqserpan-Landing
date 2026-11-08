import Image from "next/image";
import type { PublicTestimonial } from "@/lib/content/queries";
import type { Sections } from "@/lib/validation/content";
import { SectionHeading } from "./SectionHeading";

type Props = { content: Sections["testimonials"]; testimonials: PublicTestimonial[] };

/** Iniciales para el avatar cuando el testimonio no tiene logo. */
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((word) => /^\p{Lu}/u.test(word))
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}

/** Se oculta por completo si no hay testimonios visibles (FR-024). */
export function Testimonials({ content, testimonials }: Props) {
  if (testimonials.length === 0) return null;
  return (
    <section id="testimonios" aria-labelledby="testimonios-title" className="bg-hueso py-20 sm:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading id="testimonios-title" eyebrow="Clientes" title={content.title} intro={content.intro} />
          {content.stats.length > 0 && (
            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-6">
              {content.stats.map((stat) => (
                <div key={stat.title} className="flex flex-col-reverse">
                  <dt className="text-sm text-gris">{stat.body}</dt>
                  <dd className="font-display text-4xl leading-tight text-carbon">{stat.title}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <ul className="divide-y divide-black/10 border-y border-black/10">
          {testimonials.slice(0, 6).map((t) => (
            <li key={t.id}>
              <figure className="flex flex-col gap-5 py-8">
                <blockquote className="whitespace-pre-line text-lg leading-relaxed text-carbon sm:text-xl">
                  «{t.quote}»
                </blockquote>
                <figcaption className="flex items-center gap-3 text-sm">
                  {t.logo ? (
                    <Image
                      src={t.logo}
                      alt=""
                      width={48}
                      height={48}
                      className="size-12 shrink-0 rounded-full bg-white object-contain ring-1 ring-black/5"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="grid size-12 shrink-0 place-items-center rounded-full bg-amarillo font-bold text-carbon"
                    >
                      {initials(t.authorName)}
                    </span>
                  )}
                  <span>
                    <strong className="block text-carbon">{t.authorName}</strong>
                    <span className="text-gris">{[t.businessName, t.city].filter(Boolean).join(" · ")}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
