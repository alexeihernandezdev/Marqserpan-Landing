import { FactoryIcon, GearShape, ShipIcon, StoreIcon, TruckIcon, WrenchIcon } from "@/components/ui/icons";
import type { Sections } from "@/lib/validation/content";
import { SectionCta } from "../SectionCta";
import { SectionHeading } from "./SectionHeading";

type Props = { content: Sections["services"]; ctaLabel: string };

// Ícono según el tema del servicio (los textos se editan en el admin); engranaje si no coincide.
const ICONS = [
  { match: /venta|distribu/i, Icon: StoreIcon },
  { match: /fabrica/i, Icon: FactoryIcon },
  { match: /import/i, Icon: ShipIcon },
  { match: /técnico|tecnico|repara/i, Icon: WrenchIcon },
  { match: /traslado|instala|entrega/i, Icon: TruckIcon },
];

function iconFor(title: string) {
  return ICONS.find(({ match }) => match.test(title))?.Icon ?? GearShape;
}

// Retícula de 6 columnas: los dos primeros servicios ocupan media fila; el resto, un tercio.
const SPAN = ["lg:col-span-3", "lg:col-span-3"];

/** Líneas de negocio bajo un mensaje paraguas (FR-006). */
export function Services({ content, ctaLabel }: Props) {
  return (
    <section id="servicios" aria-labelledby="servicios-title" className="bg-glow relative overflow-hidden py-20 text-white sm:py-28">
      <div aria-hidden="true" className="bg-grid parallax-layer pointer-events-none absolute inset-x-0 -inset-y-16 opacity-50" />
      <div className="container-page relative">
        <SectionHeading id="servicios-title" eyebrow="Servicios" title={content.title} intro={content.intro} tone="dark" />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {content.items.map((item, index) => {
            const Icon = iconFor(item.title);
            const wide = index < 2;
            // En dos columnas, un último servicio impar ocupa la fila entera.
            const lastOdd = index === content.items.length - 1 && content.items.length % 2 === 1;
            return (
              <li
                key={item.title}
                className={`reveal group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition-colors hover:border-white/25 hover:bg-white/[0.07] sm:p-8 ${SPAN[index] ?? "lg:col-span-2"} ${lastOdd ? "sm:col-span-2" : ""}`}
              >
                <Icon
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-8 -right-8 size-40 text-white/[0.035] transition-transform duration-500 group-hover:-rotate-6"
                />
                <div className="relative flex items-start justify-between gap-4">
                  <span className="bg-brand-gradient flex size-12 items-center justify-center rounded-2xl text-white shadow-lg shadow-black/30">
                    <Icon className="size-6" />
                  </span>
                  <span aria-hidden="true" className="font-display text-sm text-white/30">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className={`relative mt-6 text-white ${wide ? "text-2xl" : "text-xl"}`}>{item.title}</h3>
                <p className={`relative mt-2 text-neutral-300 ${wide ? "max-w-md text-lg" : ""}`}>{item.body}</p>
              </li>
            );
          })}
        </ul>
        <SectionCta label={ctaLabel} />
      </div>
    </section>
  );
}
