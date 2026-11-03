import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Distribuidora Maqserpan — Equipos y repuestos para panaderías y cafeterías";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagen para compartir en WhatsApp, Instagram y Facebook. Textos fijos de marca.
export default async function OpengraphImage() {
  const [font, logo] = await Promise.all([
    readFile(path.join(process.cwd(), "brand/fonts/archivo-black/ArchivoBlack-Regular.ttf")),
    readFile(path.join(process.cwd(), "public/brand/logo-og.png")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#1c1f1d", fontFamily: "Archivo Black" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 430,
            height: "100%",
            background: "#ffffff",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="" height={380} style={{ objectFit: "contain" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px", flex: 1 }}>
          <div style={{ color: "#ffd100", fontSize: 28, letterSpacing: 2 }}>22 AÑOS EN PUERTO ORDAZ</div>
          <div style={{ color: "#ffffff", fontSize: 62, lineHeight: 1.05, marginTop: 20 }}>
            Equipos y repuestos para que tu panadería nunca pare
          </div>
          <div style={{ color: "#d4d4d4", fontSize: 26, marginTop: 28 }}>
            Vendemos · Fabricamos · Importamos · Reparamos · Instalamos
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Archivo Black", data: font, weight: 400, style: "normal" }] },
  );
}
