/**
 * Genera los recursos optimizados de marca a partir de los originales en brand/.
 * Uso: npm run brand:build
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import subsetFont from "subset-font";

const root = process.cwd();
const brand = (...p: string[]) => path.join(root, "brand", ...p);
const out = (...p: string[]) => path.join(root, ...p);

// Logo a color: ancho 735 px, los engranajes ocupan la parte superior.
const LOGO_COLOR = brand("logo", "logo-color-transparente.png");
const LOGO_WHITE = brand("logo", "logo-blanco-horizontal.png");
// Versión con borde blanco, pensada para fondos oscuros (13601 × 10587 con mucho margen).
const LOGO_BORDER = brand("logo", "logo-color-borde-blanco.png");
const GEARS_CROP = { left: 40, top: 0, width: 620, height: 615 };

async function logos() {
  await mkdir(out("public", "brand"), { recursive: true });

  for (const height of [96, 192]) {
    const suffix = height === 96 ? "" : "@2x";
    await sharp(LOGO_COLOR)
      .resize({ height })
      .webp({ quality: 90 })
      .toFile(out("public", "brand", `logo${suffix}.webp`));
    await sharp(LOGO_COLOR)
      .resize({ height })
      .png({ compressionLevel: 9, palette: true })
      .toFile(out("public", "brand", `logo${suffix}.png`));
  }

  // Para la imagen de compartir (opengraph-image), que no admite WebP.
  await sharp(LOGO_COLOR)
    .resize({ height: 420 })
    .png({ compressionLevel: 9 })
    .toFile(out("public", "brand", "logo-og.png"));

  await sharp(LOGO_WHITE)
    .resize({ width: 480 })
    .webp({ quality: 90 })
    .toFile(out("public", "brand", "logo-blanco.webp"));

  const border = await sharp(LOGO_BORDER, { limitInputPixels: false })
    .resize({ width: 2400 })
    .png()
    .toBuffer();
  const borderTrimmed = await sharp(border).trim().png().toBuffer();
  for (const width of [320, 640]) {
    await sharp(borderTrimmed)
      .resize({ width })
      .webp({ quality: 88 })
      .toFile(out("public", "brand", width === 320 ? "logo-borde.webp" : "logo-borde@2x.webp"));
  }

  const gears = sharp(LOGO_COLOR).extract(GEARS_CROP).trim();
  const gearsBuffer = await gears.png().toBuffer();

  await sharp(gearsBuffer)
    .resize({ height: 96 })
    .webp({ quality: 90 })
    .toFile(out("public", "brand", "engranajes.webp"));

  await sharp(gearsBuffer)
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(out("app", "icon.png"));

  // Apple no admite transparencia: fondo blanco con margen.
  await sharp(gearsBuffer)
    .resize(150, 150, { fit: "contain", background: "#ffffff" })
    .extend({ top: 15, bottom: 15, left: 15, right: 15, background: "#ffffff" })
    .flatten({ background: "#ffffff" })
    .png({ compressionLevel: 9 })
    .toFile(out("app", "apple-icon.png"));
}

const FONTS: Array<[string, string]> = [
  [brand("fonts", "archivo-black", "ArchivoBlack-Regular.ttf"), "ArchivoBlack-Regular.woff2"],
  [brand("fonts", "helvetica", "Helvetica.ttf"), "Helvetica.woff2"],
  [brand("fonts", "helvetica", "Helvetica-Bold.ttf"), "Helvetica-Bold.woff2"],
  [brand("fonts", "helvetica", "Helvetica-Oblique.ttf"), "Helvetica-Oblique.woff2"],
];

// Latín básico + Latín-1 (español, portugués) + puntuación tipográfica y símbolos comunes.
const LATIN_TEXT = (() => {
  let text = "";
  for (let code = 0x20; code <= 0x7e; code++) text += String.fromCharCode(code);
  for (let code = 0xa0; code <= 0xff; code++) text += String.fromCharCode(code);
  return text + "–—‘’“”•…€™«»";
})();

async function fonts() {
  await mkdir(out("app", "fonts"), { recursive: true });
  for (const [src, dest] of FONTS) {
    const woff2 = await subsetFont(await readFile(src), LATIN_TEXT, { targetFormat: "woff2" });
    await writeFile(out("app", "fonts", dest), woff2);
  }
}

async function main() {
  await logos();
  await fonts();
  console.log("Recursos de marca generados en public/brand, app/fonts y app/icon.png");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
