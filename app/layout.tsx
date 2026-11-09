import type { Metadata, Viewport } from "next";
import { Montserrat, Righteous } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const archivoBlack = localFont({
  src: "./fonts/ArchivoBlack-Regular.woff2",
  variable: "--font-archivo-black",
  weight: "400",
  display: "swap",
  adjustFontFallback: "Arial",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-montserrat",
  display: "swap",
});

const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-righteous",
  display: "swap",
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
    <html lang="es" className={`${archivoBlack.variable} ${montserrat.variable} ${righteous.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
