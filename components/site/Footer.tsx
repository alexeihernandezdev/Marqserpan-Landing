import Image from "next/image";
import {
  ClockIcon,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  SOCIAL_ICONS,
  TruckIcon,
  WalletIcon,
  WhatsAppIcon,
} from "@/components/ui/icons";
import type { PublicBusinessSettings } from "@/lib/content/queries";
import { toWhatsAppLink } from "@/lib/leads/phone";
import { SOCIAL_LABELS } from "@/lib/validation/business";
import type { Sections } from "@/lib/validation/content";

type FooterProps = { contact: Sections["contact"]; settings: PublicBusinessSettings };

const formatPhone = (phone: string) =>
  phone.startsWith("+58") && phone.length === 13
    ? `+58 ${phone.slice(3, 6)}-${phone.slice(6)}`
    : phone;

/** Contacto, cobertura, entrega y pagos. WhatsApp solo aquí y en la confirmación (FR-010). */
export function Footer({ contact, settings }: FooterProps) {
  return (
    <footer id="contacto" aria-labelledby="contacto-title" className="bg-[#121413] text-neutral-200">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Image
            src="/brand/logo-blanco.webp"
            alt="Distribuidora Maqserpan"
            width={240}
            height={120}
            className="h-auto w-44"
          />
          <h2 id="contacto-title" className="mt-6 text-xl text-white">
            {contact.title}
          </h2>
          {contact.body && <p className="mt-2 whitespace-pre-line">{contact.body}</p>}
        </div>

        <ul className="flex flex-col gap-3">
          {settings.whatsapp && (
            <li>
              <a
                href={toWhatsAppLink(settings.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 font-bold text-white hover:text-verde-400"
              >
                <WhatsAppIcon className="size-5 text-[#25d366]" />
                WhatsApp {formatPhone(settings.whatsapp)}
              </a>
            </li>
          )}
          {settings.email && (
            <li>
              <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2.5 break-all hover:text-verde-400">
                <MailIcon className="size-5 shrink-0" />
                {settings.email}
              </a>
            </li>
          )}
          {settings.address && (
            <li className="flex gap-2.5">
              <MapPinIcon className="size-5 shrink-0" />
              <span className="whitespace-pre-line">{settings.address}</span>
            </li>
          )}
          {settings.businessHours && (
            <li className="flex gap-2.5">
              <ClockIcon className="size-5 shrink-0" />
              <span className="whitespace-pre-line">{settings.businessHours}</span>
            </li>
          )}
          {settings.socialLinks.length > 0 && (
            <li className="mt-2 flex gap-3">
              {settings.socialLinks.map(({ network, url }) => {
                const Icon = SOCIAL_ICONS[network as keyof typeof SOCIAL_ICONS];
                const label = SOCIAL_LABELS[network as keyof typeof SOCIAL_LABELS] ?? network;
                return (
                  <a
                    key={network}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-verde-700"
                  >
                    {Icon ? <Icon className="size-5" /> : label}
                  </a>
                );
              })}
            </li>
          )}
        </ul>

        {(settings.shippingCoverage.length > 0 || settings.deliveryTerms.length > 0) && (
          <div>
            <h3 className="flex items-center gap-2 font-body text-base font-bold text-white">
              <TruckIcon className="size-5 text-verde-400" /> Envíos y entrega
            </h3>
            {settings.shippingCoverage.length > 0 && (
              <p className="mt-3 flex gap-2">
                <GlobeIcon className="mt-0.5 size-4 shrink-0" />
                <span>Enviamos a {settings.shippingCoverage.join(", ")}.</span>
              </p>
            )}
            <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5">
              {settings.deliveryTerms.map((term) => (
                <li key={term}>{term}</li>
              ))}
            </ul>
          </div>
        )}

        {settings.paymentMethods.length > 0 && (
          <div>
            <h3 className="flex items-center gap-2 font-body text-base font-bold text-white">
              <WalletIcon className="size-5 text-verde-400" /> Formas de pago
            </h3>
            <ul className="mt-3 flex flex-col gap-1.5">
              {settings.paymentMethods.map((method) => (
                <li key={method}>{method}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-5 text-sm text-neutral-400">
          © {settings.legalName || "Distribuidora Maqserpan"}
          {settings.rif && ` · RIF ${settings.rif}`}
        </p>
      </div>
    </footer>
  );
}
