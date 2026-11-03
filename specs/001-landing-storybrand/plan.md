# Implementation Plan: Landing StoryBrand de Distribuidora Maqserpan

**Branch**: `001-landing-storybrand` (se trabaja en `main`; no hay hook de ramas) | **Date**: 2026-11-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-landing-storybrand/spec.md`

## Summary

Landing de una sola página que cuenta la historia StoryBrand de Distribuidora Maqserpan
([brandscript.md](./brandscript.md)) y lleva al visitante, que llega desde Instagram y Meta,
a pedir una cotización (equipo, repuesto o servicio técnico), con las rebanadoras de
charcutería destacadas. Incluye un admin para atender solicitudes, ver cuántas llegan por
semana y origen, y editar catálogo, textos, contacto y redes sin redeploy.

Enfoque técnico: Next.js 16 con Cache Components. La landing es un shell estático cuyo
contenido se lee de Neon con `'use cache'` + `cacheTag` y se invalida con `updateTag` desde
las Server Actions del admin. El formulario es una Server Action con validación Zod,
protección antispam en la propia BD y aviso por correo con Resend dentro de `after()`. Las
fotos se suben directo a Cloudinary con firma del servidor. Autenticación propia con
sesiones en BD y Argon2id. Detalle y alternativas en [research.md](./research.md).

## Technical Context

**Language/Version**: TypeScript 5 sobre Node.js 20.9+; React 19.3; Next.js 16.4.3 (App
Router, `cacheComponents` y `partialPrefetching` activos)

**Primary Dependencies**: `drizzle-orm` + `drizzle-kit`, `@neondatabase/serverless`,
`zod`, `@node-rs/argon2`, `resend`, `cloudinary` (firma y borrado en servidor),
Tailwind CSS 4, `server-only`

**Storage**: PostgreSQL en Neon (rama por entorno); imágenes en Cloudinary; fuentes y logo
en el propio sitio

**Testing**: Vitest (unidades) y Playwright (e2e: móvil 360 × 640 y agente de usuario de
Instagram), con `@axe-core/playwright` para accesibilidad

**Target Platform**: Vercel (funciones en `iad1`), navegadores móviles modernos y
navegador interno de Instagram/Facebook

**Project Type**: Aplicación web única de Next.js (sitio público + admin en el mismo
proyecto)

**Performance Goals**: Core Web Vitals en verde en móvil (LCP ≤ 2,5 s, INP ≤ 200 ms,
CLS ≤ 0,1); primera pantalla completa en < 3 s con 3G; cambios del admin visibles en < 1 min

**Constraints**: Solo español; sin precios ni plazos fijos; WhatsApp sin botón flotante;
JS propio de la landing ≤ 50 KB comprimido (el runtime de React 19 + Next 16 suma ~155 KB y no se cuenta; medido en la implementación: ~25 KB propios, 183 KB en total); fotos servidas en WebP/AVIF a su tamaño; sin
servicios extra para antispam

**Scale/Scope**: Hasta ~1.000 visitas/día en campañas, < 100 solicitudes/semana, < 200
productos, 2–5 usuarios del admin; 1 página pública + fichas de producto + ~12 pantallas de
admin

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio / regla | Cómo lo cumple el diseño | Estado |
|---|---|---|
| I. Fidelidad al negocio | Sin campo de precio en el modelo; textos iniciales solo del guion basado en datos confirmados; aviso en el admin si se escriben precios o plazos; redes `isTest` ocultas en producción; dirección y horario vacíos se ocultan | ✅ |
| II. Todo conduce a la cotización | CTA directo en cabecera fija, primera pantalla y final de cada bloque; formulario con 3 tipos; rebanadoras destacadas tras la primera pantalla; producto preseleccionado desde la ficha; UTM y origen guardados en cada solicitud; pagos solo informativos | ✅ |
| III. Contenido administrable | Productos, secciones, testimonios, contacto y redes en BD; `updateTag` tras cada guardado (< 1 min); textos estructurales en código; solicitudes con estado y origen en el admin | ✅ |
| IV. Seguridad y privacidad | `verifySession()` en cada página y acción del admin además de `proxy.ts`; sin registro; Zod en servidor; campo trampa + tiempo mínimo + límite por IP; IP guardada solo como hash; datos de clientes nunca en caché pública ni en registros; secretos en variables de Vercel | ✅ |
| V. Simple, rápido y móvil | Shell estático prerenderado; imágenes de Cloudinary a su tamaño; fuentes WOFF2 locales; probado en 360 × 640 e Instagram; solo español; cada dependencia justificada en research.md | ✅ |
| Identidad visual | Logo optimizado desde `brand/logo/`; colores de marca con contraste AA (amarillo y azul solo en fondos y textos grandes); Archivo Black + Helvetica desde `brand/fonts/` | ✅ |
| Restricciones técnicas | Next.js 16 según docs locales; Neon con migraciones versionadas (`drizzle/`); Vercel con vistas previas; Cloudinary; correo con fallo tolerado | ✅ |
| Puertas de calidad | lint + typecheck + test + build antes de `main`; e2e para formulario, protección del admin y edición de productos; revisión en teléfono en la vista previa | ✅ |

**Resultado (antes de la fase 0)**: sin violaciones.
**Re-verificación tras la fase 1**: el modelo de datos, los contratos y el quickstart
mantienen todas las reglas; sin violaciones nuevas. TODO(PROVEEDOR_CORREO) de la
constitución queda resuelto: Resend (research R4).

## Project Structure

### Documentation (this feature)

```text
specs/001-landing-storybrand/
├── spec.md
├── brandscript.md       # Guion StoryBrand (fuente de los textos iniciales)
├── plan.md              # Este archivo
├── research.md          # Fase 0
├── data-model.md        # Fase 1
├── quickstart.md        # Fase 1
├── contracts/           # Fase 1
│   ├── routes.md
│   ├── server-actions.md
│   └── content-schema.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Fase 2 (/speckit-tasks; no lo crea este comando)
```

### Source Code (repository root)

```text
app/
├── layout.tsx                    # html lang="es", fuentes locales, metadatos base
├── globals.css                   # tokens de marca (colores, tipografía) con Tailwind 4
├── (site)/
│   ├── layout.tsx                # cabecera fija + pie; slot @modal
│   ├── page.tsx                  # landing SB7 (secciones en orden)
│   ├── productos/[slug]/page.tsx # ficha completa
│   ├── @modal/(.)productos/[slug]/page.tsx  # ficha como ventana
│   ├── @modal/default.tsx
│   ├── actions.ts                # submitLead
│   └── not-found.tsx
├── admin/
│   ├── login/page.tsx
│   └── (panel)/
│       ├── layout.tsx            # navegación del admin; sesión dentro de <Suspense>
│       ├── page.tsx              # resumen semanal por origen
│       ├── solicitudes/…
│       ├── productos/…
│       ├── categorias/…
│       ├── contenido/…
│       ├── testimonios/…
│       ├── negocio/…
│       └── cuenta/…
├── robots.ts
├── sitemap.ts
└── opengraph-image.tsx

components/
├── site/                         # Header, Hero, Problem, Guide, Plan, Services,
│                                 # Catalog, ProductCard, ProductGallery, Stakes, Success,
│                                 # Testimonials, QuoteForm, AttributionCapture, Footer
├── admin/                        # tablas, formularios, ImageUploader, SectionEditor
└── ui/                           # botones, campos, diálogos accesibles

lib/
├── db/
│   ├── schema.ts                 # tablas y enums de data-model.md
│   └── client.ts                 # Drizzle + Neon HTTP
├── content/                      # lecturas públicas con 'use cache' + cacheTag
├── dal/                          # lecturas/escrituras del admin; verifySession()
├── auth/                         # sesiones, hash de contraseñas, límite de intentos
├── validation/                   # esquemas Zod (lead, producto, secciones, negocio)
├── leads/                        # normalización de teléfono, origen, límite por IP
├── email/                        # plantilla y envío con Resend
├── cloudinary/                   # firma, borrado y loader de imágenes
└── tags.ts                       # nombres de etiquetas de caché

proxy.ts                          # comprobación optimista de cookie en /admin/*
drizzle/                          # migraciones SQL versionadas
scripts/
├── seed.ts                       # contenido inicial (guion, contacto, redes de prueba)
├── create-admin.ts
└── build-brand-assets.ts         # logo optimizado y fuentes WOFF2 desde brand/
public/brand/                     # salidas de build-brand-assets (logo, íconos)
app/fonts/                        # WOFF2 generados para next/font/local
tests/
├── unit/                         # Vitest
└── e2e/                          # Playwright
```

**Structure Decision**: Un solo proyecto Next.js en la raíz (ya creado). El sitio público
vive en el grupo `(site)` y el admin en `admin/`, para que cada uno tenga su propio layout.
La lógica de servidor se concentra en `lib/` con `server-only`; la DAL es el único punto que
toca datos privados.

## Complexity Tracking

Sin violaciones de la constitución que justificar.
