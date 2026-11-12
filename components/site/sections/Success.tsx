import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import type { Sections } from "@/lib/validation/content";
import { SectionCta } from "../SectionCta";
import { SectionHeading } from "./SectionHeading";

type Props = { content: Sections["success"]; ctaLabel: string };

// «De X a Y» → transformación de identidad en dos tarjetas. Si no sigue ese molde, un solo bloque.
function splitIdentity(identity: string) {
  const match = identity.match(/^de\s+(.+?)\s+a\s+(.+?)\.?$/i);
  return match ? { before: match[1], after: match[2] } : null;
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export function Success({ content, ctaLabel }: Props) {
  const identity = content.identity ? splitIdentity(content.identity) : null;

  return (
    <section id="exito" aria-labelledby="exito-title" className="bg-white py-20 sm:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading id="exito-title" eyebrow="El resultado" title={content.title} />
          <ul className="mt-8 flex flex-col gap-4">
            {content.points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-px flex size-6 shrink-0 items-center justify-center rounded-full bg-verde-700/10 text-verde-700 ring-1 ring-verde-700/25">
                  <CheckIcon className="size-3.5" strokeWidth={3} />
                </span>
                <span className="text-lg font-semibold leading-[1.6rem]">{point}</span>
              </li>
            ))}
          </ul>
          <SectionCta label={ctaLabel} />
        </div>

        {content.identity && (
          <div className="reveal flex flex-col justify-center lg:pt-14">
            {identity ? (
              <div className="flex flex-col gap-3">
                <p className="rounded-3xl border border-dashed border-neutral-300 p-6 sm:p-8">
                  <span className="block text-sm font-bold text-gris">Antes</span>
                  <span className="mt-2 block text-xl text-gris">
                    <del className="strike-draw no-underline">{capitalize(identity.before)}</del>
                  </span>
                </p>
                <span
                  aria-hidden="true"
                  className="mx-auto flex size-11 items-center justify-center rounded-full bg-hueso text-carbon"
                >
                  <span className="arrow-nudge-down">
                    <ArrowRightIcon className="size-5 rotate-90" />
                  </span>
                </span>
                <p className="bg-brand-gradient-spin rounded-3xl p-6 text-white shadow-[0_24px_48px_-24px_rgb(0_106_158/0.6)] sm:p-8">
                  <span className="block text-base font-medium text-white sm:text-lg">Con <span className="font-brand font-normal tracking-wide [-webkit-text-stroke:0]">MAQSERPAN</span></span>
                  <span className="mt-2 block font-display text-2xl leading-tight sm:text-3xl">
                    {capitalize(identity.after)}
                  </span>
                </p>
              </div>
            ) : (
              <p className="bg-brand-gradient rounded-3xl p-8 font-display text-2xl leading-tight text-white">
                {content.identity}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
