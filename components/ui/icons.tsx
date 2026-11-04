import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function Svg({ title, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Svg>
);

export const AlertIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 9v4M12 17h.01" />
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
  </Svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </Svg>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m15 18-6-6 6-6" />
  </Svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9 18 6-6-6-6" />
  </Svg>
);

export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Svg>
);

export const MailIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Svg>
);

export const MapPinIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Svg>
);

export const ClockIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

export const TruckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" />
    <circle cx="7" cy="18" r="1.8" />
    <circle cx="17" cy="18" r="1.8" />
  </Svg>
);

export const WalletIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="6" width="18" height="13" rx="2" />
    <path d="M16 12h2M3 9h18" />
  </Svg>
);

export const TransferIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 8h15l-4-4M20 16H5l4 4" />
  </Svg>
);

export const CashIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M6 12h.01M18 12h.01" />
  </Svg>
);

export const BankIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 10 12 4l9 6H3ZM5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18" />
  </Svg>
);

export const GlobeIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </Svg>
);

export const StoreIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 10v10h16V10M3 6l1.5-3h15L21 6v1.5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0Z" />
    <path d="M10 20v-5h4v5" />
  </Svg>
);

export const FactoryIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 21V10l6 3.5V10l6 3.5V4h5v17Z" />
    <path d="M7 17h2M12 17h2M17 8h1" />
  </Svg>
);

export const ShipIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 15l1.5 5h15l1.5-5-9-3Z" />
    <path d="M6 13.5V7h12v6.5M12 3v4M9 10h.01M15 10h.01" />
  </Svg>
);

export const WrenchIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9Z" />
  </Svg>
);

export const XMarkIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15 9-6 6M9 9l6 6" />
  </Svg>
);

// Íconos de marca: trazos rellenos simples.
function Brand({ title, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

export const WhatsAppIcon = (p: IconProps) => (
  <Brand {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2c.2-.6.2-1.1.1-1.2l-.5-.3Z" />
  </Brand>
);

export const InstagramIcon = (p: IconProps) => (
  <Brand {...p}>
    <path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM21.9 8.2c0-1.6-.4-3-1.6-4.2S17.7 2.4 16 2.3c-1.6-.1-6.5-.1-8.1 0-1.6.1-3 .4-4.2 1.6S2.2 6.5 2.1 8.2c-.1 1.6-.1 6.5 0 8.1.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.6.1 6.5.1 8.1 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.6.1-6.5 0-8.1Zm-2.1 9.9a3.3 3.3 0 0 1-1.9 1.9c-1.3.5-4.3.4-5.7.4s-4.5.1-5.7-.4A3.3 3.3 0 0 1 4.6 18c-.5-1.3-.4-4.3-.4-5.7s-.1-4.5.4-5.7a3.3 3.3 0 0 1 1.9-1.9c1.3-.5 4.3-.4 5.7-.4s4.5-.1 5.7.4a3.3 3.3 0 0 1 1.9 1.9c.5 1.3.4 4.3.4 5.7s.1 4.5-.4 5.7Z" />
  </Brand>
);

export const FacebookIcon = (p: IconProps) => (
  <Brand {...p}>
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z" />
  </Brand>
);

export const TikTokIcon = (p: IconProps) => (
  <Brand {...p}>
    <path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9a7.3 7.3 0 0 0 4.3 1.4V7.3a4.3 4.3 0 0 1-3.2-1.5Z" />
  </Brand>
);

export const YouTubeIcon = (p: IconProps) => (
  <Brand {...p}>
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
  </Brand>
);

export const XIcon = (p: IconProps) => (
  <Brand {...p}>
    <path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.3l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" />
  </Brand>
);

export const BinanceIcon = (p: IconProps) => (
  <Brand {...p}>
    <path d="m12 2.5 2.3 2.3L12 7.1 9.7 4.8 12 2.5Zm0 14.4 2.3 2.3-2.3 2.3-2.3-2.3 2.3-2.3ZM4.8 9.7 7.1 12l-2.3 2.3L2.5 12l2.3-2.3Zm14.4 0 2.3 2.3-2.3 2.3-2.3-2.3 2.3-2.3ZM12 9.2l2.8 2.8-2.8 2.8L9.2 12 12 9.2Z" />
  </Brand>
);

export const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  tiktok: TikTokIcon,
  youtube: YouTubeIcon,
  x: XIcon,
} as const;

/** Engranaje decorativo (motivo del logo). */
export function GearShape(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M43 4h14l2 11a36 36 0 0 1 9 4l9-7 10 10-7 9a36 36 0 0 1 4 9l11 2v14l-11 2a36 36 0 0 1-4 9l7 9-10 10-9-7a36 36 0 0 1-9 4l-2 11H43l-2-11a36 36 0 0 1-9-4l-9 7-10-10 7-9a36 36 0 0 1-4-9L4 57V43l11-2a36 36 0 0 1 4-9l-7-9 10-10 9 7a36 36 0 0 1 9-4l2-11Zm7 28a18 18 0 1 0 0 36 18 18 0 0 0 0-36Z"
      />
    </svg>
  );
}
