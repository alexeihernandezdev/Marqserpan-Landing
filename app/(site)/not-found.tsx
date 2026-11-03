import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="container-page flex flex-col items-start gap-5 py-24">
      <p className="eyebrow text-verde-700">Página no encontrada</p>
      <h1 className="text-3xl sm:text-4xl">No encontramos lo que buscas</h1>
      <p className="max-w-xl text-lg text-gris">
        Puede que el producto ya no esté disponible. Cuéntanos qué necesitas y te lo cotizamos, aunque haya
        que fabricarlo o traerlo.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/#cotizar" size="lg">
          Solicita tu cotización
        </ButtonLink>
        <ButtonLink href="/" size="lg" variant="secondary">
          Volver al inicio
        </ButtonLink>
      </div>
    </section>
  );
}
