"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { QuoteForm, type QuoteFormProduct } from "@/components/site/QuoteForm";
import type { Sections } from "@/lib/validation/content";

type QuoteSectionProps = {
  content: Sections["quote_form"];
  whatsapp: string;
  /** Productos visibles, para preseleccionar el de ?producto=<slug> (US2). */
  products: QuoteFormProduct[];
  /** Pasos del plan: se repiten junto al formulario para recordar qué pasa después. */
  steps: Sections["plan"]["steps"];
};

function Shell({
  content,
  steps,
  children,
}: Pick<QuoteSectionProps, "content" | "steps"> & { children: ReactNode }) {
  return (
    <section
      id="cotizar"
      aria-labelledby="cotizar-title"
      className="bg-glow relative overflow-hidden py-20 text-white sm:py-28"
    >
      <div aria-hidden="true" className="bg-grid parallax-layer pointer-events-none absolute inset-x-0 -inset-y-16" />
      <div className="container-page relative grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start lg:pt-6">
          <p className="eyebrow mb-4 text-verde-400">Cotización sin compromiso</p>
          <h2 id="cotizar-title" className="text-3xl text-white sm:text-[2.75rem] sm:leading-[1.05]">
            {content.title}
          </h2>
          {content.intro && <p className="mt-5 whitespace-pre-line text-lg text-neutral-300">{content.intro}</p>}
          {steps.length > 0 && (
            <ol className="mt-10 hidden flex-col gap-5 border-l border-white/15 pl-6 lg:flex">
              {steps.map((step, index) => (
                <li key={step.title} className="relative">
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[2.05rem] top-0 flex size-5 items-center justify-center rounded-full text-[0.65rem] font-bold ${
                      index === 0 ? "bg-verde-400 text-carbon" : "bg-carbon-800 text-neutral-300 ring-1 ring-white/20"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <p className={`font-bold ${index === 0 ? "text-white" : "text-neutral-300"}`}>{step.title}</p>
                  <p className="text-sm text-neutral-400">{step.body}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

/** Sección del formulario. Lee ?producto= en el cliente para que la landing siga siendo estática. */
export function QuoteSection({ content, whatsapp, products, steps }: QuoteSectionProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const slug = searchParams.get("producto");
  const product = slug ? (products.find((p) => p.slug === slug) ?? null) : null;

  function clearProduct() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("producto");
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}#cotizar`, { scroll: false });
  }

  return (
    <Shell content={content} steps={steps}>
      <QuoteForm content={content} whatsapp={whatsapp} product={product} onClearProduct={clearProduct} />
    </Shell>
  );
}

/** Versión sin producto preseleccionado: se incluye en el HTML estático mientras carga lo demás. */
export function QuoteSectionFallback({ content, whatsapp, steps }: Omit<QuoteSectionProps, "products">) {
  return (
    <Shell content={content} steps={steps}>
      <QuoteForm content={content} whatsapp={whatsapp} />
    </Shell>
  );
}
