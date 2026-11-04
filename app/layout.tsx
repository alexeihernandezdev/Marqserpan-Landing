import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const archivoBlack = localFont({
  src: "./fonts/ArchivoBlack-Regular.woff2",
  variable: "--font-archivo-black",
  weight: "400",
  display: "swap",
  adjustFontFallback: "Arial",
});

const helvetica = localFont({
  src: [
    { path: "./fonts/Helvetica.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Helvetica-Oblique.woff2", weight: "400", style: "italic" },
    { path: "./fonts/Helvetica-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-helvetica",
  display: "swap",
  adjustFontFallback: "Arial",
});

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Distribuidora Maqserpan — Equipos y repuestos para panaderías y cafeterías",
    template: "%s · Distribuidora Maqserpan",
  },
  description:
    "Vendemos, fabricamos, importamos, reparamos e instalamos equipos y repuestos para panaderías, cafeterías y charcuterías. 22 años en el mercado. Envíos a toda Venezuela.",
  applicationName: "Distribuidora Maqserpan",
  openGraph: {
    type: "website",
    locale: "es_VE",
    siteName: "Distribuidora Maqserpan",
  },
};

export const viewport: Viewport = {
  themeColor: "#1c1f1d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${archivoBlack.variable} ${helvetica.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
