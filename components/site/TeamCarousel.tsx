import Image from "next/image";

const PHOTOS = [
  { src: "/equipo/taller-esmerilado.webp", alt: "Técnico esmerilando una pieza de acero en el taller" },
  { src: "/equipo/taller-reparacion-horno.webp", alt: "Técnico reparando la estructura de un horno" },
  { src: "/equipo/taller-soldadura.webp", alt: "Soldador con careta trabajando en una pieza" },
  { src: "/equipo/taller-corte.webp", alt: "Técnico cortando una lámina de acero inoxidable" },
  { src: "/equipo/taller-puerta-horno.webp", alt: "Técnico ajustando la puerta de un horno industrial" },
  { src: "/equipo/taller-equipo-horno.webp", alt: "Equipo de técnicos desarmando un horno de panadería" },
  { src: "/equipo/taller-bandeja.webp", alt: "Técnico restaurando una bandeja giratoria de horno" },
];

type Photo = (typeof PHOTOS)[number];

/** Una fila que se desplaza sin fin; las copias repetidas se ocultan a lectores de pantalla. */
function Ribbon({ photos, reverse = false }: { photos: Photo[]; reverse?: boolean }) {
  const items = [...photos, ...photos, ...photos, ...photos];
  return (
    <ul
      className={`flex w-max animate-[marquee-x_60s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none ${
        reverse ? "[animation-direction:reverse]" : ""
      }`}
    >
      {items.map((photo, i) => (
        <li key={i} aria-hidden={i >= photos.length || undefined} className="shrink-0 pr-4">
          <div className="relative h-52 w-72 overflow-hidden rounded-2xl sm:h-60 sm:w-80">
            <Image src={photo.src} alt={i < photos.length ? photo.alt : ""} fill sizes="320px" className="object-cover" />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Fotos del taller: dos cintas inclinadas en sentidos opuestos sobre fondo carbón; se pausan al pasar el ratón. */
export function TeamCarousel({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden bg-carbon py-16 sm:py-20 ${className}`}>
      <div className="container-page">
        <p className="eyebrow mb-3 text-verde-400">Nuestro taller</p>
        <h3 className="font-display text-2xl leading-tight text-white sm:text-3xl">Las manos detrás de cada equipo</h3>
      </div>
      <div
        role="group"
        aria-label="Fotos del equipo de Maqserpan en el taller"
        className="group mt-10 flex -rotate-2 flex-col gap-4 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
      >
        <Ribbon photos={PHOTOS.slice(0, 4)} />
        <Ribbon photos={PHOTOS.slice(4)} reverse />
      </div>
    </div>
  );
}
