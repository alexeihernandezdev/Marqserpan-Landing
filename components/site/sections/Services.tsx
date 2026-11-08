import { FactoryIcon, GearShape, ShipIcon, StoreIcon, TruckIcon, WrenchIcon } from "@/components/ui/icons";
import type { Sections } from "@/lib/validation/content";
import { SectionCta } from "../SectionCta";
import { SpotlightList } from "../SpotlightList";
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
  return ICONS.find(({ match }) => match.test(title))?.Icon ?? null;
}

// Retícula de 6 columnas: los dos primeros servicios ocupan media fila; el resto, un tercio.
const SPAN = ["lg:col-span-3", "lg:col-span-3"];

/** Líneas de negocio bajo un mensaje paraguas (FR-006). */
export function Services({ content, ctaLabel }: Props) {
  return (
    <section id="servicios" aria-labelledby="servicios-title" className="bg-glow relative overflow-hidden py-20 text-white sm:py-28">
      <div aria-hidden="true" className="bg-grid parallax-layer pointer-events-none absolute inset-x-0 -inset-y-16 opacity-50" />
      {/* Degradado compartido por los trazos de las ilustraciones (en coordenadas del ícono de 24×24). */}
      <svg aria-hidden="true" className="absolute size-0">
        <defs>
          <linearGradient id="services-stroke" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="24">
            <stop offset="0" stopColor="var(--color-verde-400)" />
            <stop offset="1" stopColor="var(--color-azul-400)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="container-page relative">
        <SectionHeading id="servicios-title" eyebrow="Servicios" title={content.title} intro={content.intro} tone="dark" />
        <SpotlightList className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {content.items.map((item, index) => {
            const Icon = iconFor(item.title);
            const wide = index < 2;
            // En dos columnas, un último servicio impar ocupa la fila entera.
            const lastOdd = index === content.items.length - 1 && content.items.length % 2 === 1;
            return (
              <li
                key={item.title}
                className={`reveal spotlight-card group relative overflow-hidden rounded-3xl bg-white/[0.04] transition-transform duration-300 hover:-translate-y-1 ${SPAN[index] ?? "lg:col-span-2"} ${lastOdd ? "sm:col-span-2" : ""}`}
              >
                <div
                  aria-hidden="true"
                  className={`flex items-center justify-center border-b border-white/10 bg-[radial-gradient(120%_90%_at_50%_110%,rgb(0_147_211/0.18),transparent_60%)] ${wide ? "h-40" : "h-32"}`}
                >
                  {Icon ? (
                    <Icon
                      stroke="url(#services-stroke)"
                      strokeWidth={1.4}
                      className={`draw-icon transition-transform duration-500 group-hover:scale-105 ${wide ? "size-28" : "size-24"}`}
                    />
                  ) : (
                    <GearShape className="size-20 text-white/15 transition-transform duration-700 group-hover:rotate-45" />
                  )}
                </div>
                <div className="p-7 sm:p-8">
                  <h3 className={`text-white ${wide ? "text-2xl" : "text-xl"}`}>{item.title}</h3>
                  <p className={`mt-2 text-neutral-300 ${wide ? "max-w-md text-lg" : ""}`}>{item.body}</p>
                </div>
              </li>
            );
          })}
        </SpotlightList>
        <SectionCta label={ctaLabel} />
      </div>
    </section>
  );
}
