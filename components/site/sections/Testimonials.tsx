import Image from "next/image";
import type { PublicTestimonial } from "@/lib/content/queries";
import type { Sections } from "@/lib/validation/content";
import { SectionHeading } from "./SectionHeading";

type Props = { content: Sections["testimonials"]; testimonials: PublicTestimonial[] };

/** Se oculta por completo si no hay testimonios visibles (FR-024). */
export function Testimonials({ content, testimonials }: Props) {
  if (testimonials.length === 0) return null;
  return (
    <section id="testimonios" aria-labelledby="testimonios-title" className="bg-hueso py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="testimonios-title" eyebrow="Clientes" title={content.title} />
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.slice(0, 6).map((t) => (
            <li key={t.id}>
              <figure className="flex h-full flex-col rounded-2xl bg-white p-7 shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
                <blockquote className="flex-1 whitespace-pre-line text-lg">«{t.quote}»</blockquote>
                <figcaption className="mt-4 flex items-center gap-3 text-sm">
                  {t.logo && (
                    <Image
                      src={t.logo}
                      alt=""
                      width={48}
                      height={48}
                      className="size-12 shrink-0 rounded-full object-contain ring-1 ring-black/5"
                    />
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
