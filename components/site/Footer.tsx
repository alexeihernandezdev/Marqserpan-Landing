import Image from "next/image";
import {
  BankIcon,
  BinanceIcon,
  CashIcon,
  ClockIcon,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  SOCIAL_ICONS,
  TransferIcon,
  TruckIcon,
  WalletIcon,
  WhatsAppIcon,
} from "@/components/ui/icons";
import type { PublicBusinessSettings } from "@/lib/content/queries";
import { toWhatsAppLink } from "@/lib/leads/phone";
import { SOCIAL_LABELS } from "@/lib/validation/business";
import type { Sections } from "@/lib/validation/content";

type FooterProps = {
  contact: Sections["contact"];
  settings: PublicBusinessSettings;
};

const formatPhone = (phone: string) =>
  phone.startsWith("+58") && phone.length === 13
    ? `+58 ${phone.slice(3, 6)}-${phone.slice(6)}`
    : phone;

/** Ícono según palabras clave del método de pago (texto libre del admin). */
const paymentIcon = (method: string) => {
  const m = method.toLowerCase();
  if (m.includes("binance") || m.includes("usdt") || m.includes("cripto"))
    return BinanceIcon;
  if (m.includes("efectivo")) return CashIcon;
  if (
    m.includes("transferencia") ||
    m.includes("pago móvil") ||
    m.includes("pago movil")
  )
    return TransferIcon;
  if (m.includes("banco") || m.includes("banesco") || m.includes("zelle"))
    return BankIcon;
  return WalletIcon;
};

const headingClass =
  "flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.14em] text-white";

/** Contacto, cobertura, entrega y pagos. WhatsApp solo aquí y en la confirmación (FR-010). */
export function Footer({ contact, settings }: FooterProps) {
  return (
    <footer
      id="contacto"
      aria-labelledby="contacto-title"
      className="bg-[#121413] text-sm leading-relaxed text-neutral-400"
    >
      <div className="container-page grid gap-x-10 gap-y-12 py-16 sm:grid-cols-2 lg:grid-cols-[0.9fr_1.2fr_1.2fr_1fr]">
        <div>
          <Image
            src="/brand/logo-blanco.webp"
            alt="Distribuidora Maqserpan"
            width={240}
            height={120}
            className="h-auto w-36"
          />
          <h2 id="contacto-title" className="mt-6 text-lg text-white">
            {contact.title}
          </h2>
          {contact.body && (
            <p className="mt-2 max-w-xs whitespace-pre-line">{contact.body}</p>
          )}
        </div>

        <div>
          <h3 className={headingClass}>Contacto</h3>
          <ul className="mt-4 flex flex-col gap-3">
            {settings.whatsapp && (
              <li>
                <a
                  href={toWhatsAppLink(settings.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 font-semibold text-white transition-colors hover:text-verde-400"
                >
                  <WhatsAppIcon className="size-4 shrink-0 text-[#25d366]" />
                  {formatPhone(settings.whatsapp)}
                </a>
              </li>
            )}
            {settings.email && (
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex min-w-0 items-center gap-2.5 transition-colors hover:text-verde-400"
                >
                  <MailIcon className="size-4 shrink-0" />
                  <span className="whitespace-nowrap">{settings.email}</span>
                </a>
              </li>
            )}
            {settings.address && (
              <li className="flex gap-2.5">
                <MapPinIcon className="mt-0.5 size-4 shrink-0" />
                <span className="whitespace-pre-line">{settings.address}</span>
              </li>
            )}
            {settings.businessHours && (
              <li className="flex gap-2.5">
                <ClockIcon className="mt-0.5 size-4 shrink-0" />
                <span className="whitespace-pre-line">
                  {settings.businessHours}
                </span>
              </li>
            )}
          </ul>
          {settings.socialLinks.length > 0 && (
            <div className="mt-5 flex gap-2.5">
              {settings.socialLinks.map(({ network, url }) => {
                const Icon = SOCIAL_ICONS[network as keyof typeof SOCIAL_ICONS];
                const label =
                  SOCIAL_LABELS[network as keyof typeof SOCIAL_LABELS] ??
                  network;
                return (
                  <a
                    key={network}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-10 items-center justify-center rounded-full bg-white/[0.07] text-neutral-200 ring-1 ring-white/10 transition-colors hover:bg-verde-700 hover:text-white hover:ring-verde-700"
                  >
                    {Icon ? <Icon className="size-4" /> : label}
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h3 className={headingClass}>
            <TruckIcon className="size-4 text-verde-400" /> Envíos y entrega
          </h3>
          <p className="mt-4 flex gap-2.5">
            <GlobeIcon className="mt-0.5 size-4 shrink-0" />
            <span>Enviamos a toda Venezuela.</span>
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {settings.deliveryTerms.map((term) => (
              <li key={term} className="flex gap-2.5">
                <span
                  aria-hidden
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-verde-400"
                />
                <span>{term}</span>
              </li>
            ))}
          </ul>
        </div>

        {settings.paymentMethods.length > 0 && (
          <div>
            <h3 className={headingClass}>
              <WalletIcon className="size-4 text-verde-400" /> Formas de pago
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {settings.paymentMethods.map((method) => {
                const Icon = paymentIcon(method);
                return (
                  <li
                    key={method}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] py-1 pr-3 pl-2 text-xs text-neutral-300 ring-1 ring-white/10"
                  >
                    <Icon className="size-3.5 shrink-0 text-verde-400" />
                    {method}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-5 text-xs text-neutral-400">
          © {settings.legalName || "Distribuidora Maqserpan"}
          {settings.rif && ` · RIF ${settings.rif}`}
        </p>
      </div>
    </footer>
  );
}
