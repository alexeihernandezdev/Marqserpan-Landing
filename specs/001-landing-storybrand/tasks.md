---

description: "Lista de tareas para la landing StoryBrand de Distribuidora Maqserpan"
---

# Tasks: Landing StoryBrand de Distribuidora Maqserpan

**Input**: Design documents from `specs/001-landing-storybrand/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md),
[brandscript.md](./brandscript.md)

**Tests**: Incluidos. La constitución exige pruebas automatizadas del envío del formulario,
la protección del admin y la edición de productos; se añaden también pruebas unitarias de la
lógica pura y e2e de cada historia. Escribir cada prueba antes de su implementación y
comprobar que falla.

**Organization**: Tareas agrupadas por historia de usuario. Las historias 3, 4 y 5 comparten
la fase «Base del admin» (login y estructura), que va antes de ellas.

**Antes de escribir código de Next.js**: leer la guía correspondiente en
`node_modules/next/dist/docs/` (ver `AGENTS.md`). El proyecto usa `cacheComponents: true`:
leer `cookies()`/`headers()`/`searchParams` fuera de `<Suspense>` es error de compilación y
`'use cache'` no puede leer `cookies()`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Se puede hacer en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: Historia a la que pertenece (US1…US5)
- Rutas relativas a la raíz del repositorio (proyecto Next.js único)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Dependencias, configuración y recursos de marca

- [X] T001 Instalar dependencias en `package.json`: `drizzle-orm`, `@neondatabase/serverless`, `zod`, `@node-rs/argon2`, `resend`, `cloudinary`, `server-only`; y de desarrollo: `drizzle-kit`, `tsx`, `dotenv`, `vitest`, `@playwright/test`, `@axe-core/playwright`, `sharp`, `ttf2woff2`
- [X] T002 Añadir scripts a `package.json`: `typecheck` (`tsc --noEmit`), `test` (`vitest run`), `test:e2e` (`playwright test`), `db:generate` (`drizzle-kit generate`), `db:migrate` (`drizzle-kit migrate`), `db:seed` (`tsx scripts/seed.ts`), `admin:create` (`tsx scripts/create-admin.ts`), `brand:build` (`tsx scripts/build-brand-assets.ts`)
- [X] T003 [P] Crear `.env.example` con las claves vacías listadas en `specs/001-landing-storybrand/quickstart.md` (`DATABASE_URL`, `SESSION_SECRET`, `CLOUDINARY_*`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `RESEND_API_KEY`, `EMAIL_FROM`, `NEXT_PUBLIC_SITE_URL`, `SHOW_TEST_SOCIALS`) y confirmar que `.gitignore` excluye `.env*` salvo `.env.example`
- [X] T004 [P] Crear `drizzle.config.ts` (dialecto `postgresql`, esquema `lib/db/schema.ts`, salida `drizzle/`, credenciales desde `DATABASE_URL` con `dotenv` cargando `.env.local`)
- [X] T005 [P] Crear `vitest.config.ts` (entorno `node`, `include: ['tests/unit/**/*.test.ts']`, alias `@/` a la raíz igual que `tsconfig.json`)
- [X] T006 [P] Crear `playwright.config.ts` con `webServer` (`npm run build && npm run start`), `baseURL` desde `NEXT_PUBLIC_SITE_URL` o `http://localhost:3000`, y tres proyectos: `mobile` (360 × 640, táctil), `instagram` (360 × 640 con agente de usuario que contiene `Instagram`) y `desktop`
- [X] T007 [P] Crear `scripts/build-brand-assets.ts`: con `sharp`, generar desde `brand/logo/logo-color-transparente.png` los archivos `public/brand/logo.webp` y `public/brand/logo.png` (alto 96 px y 192 px para pantallas densas, ≤ 40 KB), `app/icon.png` (512 px, solo los engranajes recortados), `app/apple-icon.png` (180 px); desde `brand/logo/logo-blanco-horizontal.png` generar `public/brand/logo-blanco.webp`; con `ttf2woff2`, convertir `brand/fonts/archivo-black/ArchivoBlack-Regular.ttf` y `brand/fonts/helvetica/Helvetica{,-Bold,-Oblique}.ttf` a `app/fonts/*.woff2`
- [X] T008 Ejecutar `npm run brand:build` y versionar las salidas en `public/brand/`, `app/fonts/`, `app/icon.png` y `app/apple-icon.png`; borrar `app/favicon.ico` de la plantilla
- [X] T009 Actualizar `next.config.ts`: mantener `cacheComponents`, `partialPrefetching`, `experimental.agentFeedback` y la regla de Turbopack existente; añadir `images: { loader: 'custom', loaderFile: './lib/cloudinary/loader.ts' }` (docs: `03-api-reference/02-components/image.md#loaderfile`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Base de datos, lecturas públicas cacheadas, estilos de marca y layout raíz

**⚠️ CRITICAL**: Ninguna historia puede empezar hasta terminar esta fase

- [X] T010 Crear `lib/db/schema.ts` con todas las tablas y enums de `specs/001-landing-storybrand/data-model.md` (`leads`, `products`, `product_images`, `categories`, `content_sections`, `testimonials`, `business_settings` con `CHECK (id = 1)`, `admin_users`, `admin_sessions`, `login_attempts`), sus índices, claves foráneas con las reglas `ON DELETE` indicadas y la restricción única de `leads.submission_id`
- [X] T011 Crear `lib/db/client.ts` (`import 'server-only'`; Drizzle con `drizzle-orm/neon-http` y `neon(DATABASE_URL)`; exporta `db`)
- [X] T012 Generar la migración inicial con `npm run db:generate` en `drizzle/` y aplicarla con `npm run db:migrate` en la rama `dev` de Neon (aplicada en la base local de `docker-compose.yml`; falta aplicarla en Neon cuando haya credenciales)
- [X] T013 [P] Crear `lib/env.ts` (`import 'server-only'`; valida con Zod las variables de servidor y expone `isProduction` y `showTestSocials`)
- [X] T014 [P] Crear `lib/tags.ts` con las constantes de etiquetas `content`, `products`, `testimonials`, `settings`
- [X] T015 [P] Crear `lib/validation/content.ts` con un esquema Zod por sección (`hero`, `problem`, `guide`, `plan`, `services`, `featured`, `stakes`, `success`, `testimonials`, `quote_form`, `contact`) con los campos y límites de `specs/001-landing-storybrand/contracts/content-schema.md`, y un mapa `sectionSchemas` indexado por `key`
- [X] T016 [P] Crear `lib/validation/business.ts` con el esquema Zod de `business_settings` (redes `{ network, url, isTest }`, listas de pagos, cobertura y condiciones de entrega)
- [X] T017 Crear `lib/content/queries.ts` (`import 'server-only'`) con lecturas públicas `'use cache'` + `cacheTag` + `cacheLife('max')` (docs: `01-directives/use-cache.md`, `04-functions/cacheTag.md`): `getSections()` (etiqueta `content`, devuelve cada sección parseada con su esquema), `getBusinessSettings()` (etiqueta `settings`; descarta redes `isTest` salvo `showTestSocials` y redes sin URL), `getVisibleTestimonials()` (etiqueta `testimonials`)
- [X] T018 Crear `scripts/seed.ts` (idempotente, `upsert`): las 11 secciones con los textos de `specs/001-landing-storybrand/brandscript.md` siguiendo `contracts/content-schema.md`; `business_settings` con WhatsApp `+584166873369`, correo `distribuidoramaqserpan@hotmail.com`, Instagram `https://www.instagram.com/distribuidora_maqserpan` (`isTest: false`), Facebook y TikTok de prueba (`isTest: true`), los 4 métodos de pago, la cobertura (Venezuela, Colombia, Brasil, Curaçao), las condiciones de entrega confirmadas, razón social y RIF, dirección y horario vacíos; categorías «Rebanadoras», «Equipos de panadería», «Equipos de cafetería», «Repuestos». Ejecutarlo en la rama `dev` (ejecutado en la base local; falta en Neon)
- [X] T019 Reescribir `app/globals.css` con Tailwind 4 `@theme`: colores `--color-amarillo: #FFD100`, `--color-verde: #00942B`, `--color-azul: #0093D3`, `--color-gris: #616161` más tonos oscuros derivados que cumplan contraste AA para texto (verde y azul oscurecidos), fuentes `--font-display` y `--font-body`; quitar los estilos de la plantilla
- [X] T020 Reescribir `app/layout.tsx`: `<html lang="es">`, `next/font/local` con Archivo Black (`--font-display`) y Helvetica regular/bold/itálica (`--font-body`, `adjustFontFallback: 'Arial'`, `display: 'swap'`) desde `app/fonts/` (docs: `03-api-reference/02-components/font.md`), `metadata` con `metadataBase` desde `NEXT_PUBLIC_SITE_URL`, título «Distribuidora Maqserpan — Equipos y repuestos para panaderías y cafeterías» y descripción del guion; quitar Geist
- [X] T021 [P] Crear `lib/cloudinary/loader.ts` (loader de `next/image`: `https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto,w_<width>/<publicId>`) usando `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- [X] T022 [P] Crear componentes accesibles en `components/ui/`: `Button.tsx` (variantes `primary` verde y `secondary` con borde; mismo color en todo el sitio para el CTA directo), `Field.tsx` (etiqueta, ayuda y error enlazados con `aria-describedby`), `Input.tsx`, `Textarea.tsx`, `Select.tsx`, `RadioGroup.tsx`
- [X] T023 Borrar `app/page.tsx` de la plantilla y los SVG de ejemplo de `public/` que no se usen
- [X] T024 [P] Crear `tests/e2e/fixtures.ts`: conexión a la rama de pruebas de Neon (`DATABASE_URL` de `.env.test`), helpers `resetDatabase()` (vacía `leads`, `products`, `product_images`, `testimonials`, sesiones e intentos, y vuelve a sembrar con la lógica de `scripts/seed.ts`), `createProductFixture()` e `insertLeadFixture()`

**Checkpoint**: Base lista; las historias pueden empezar

---

## Phase 3: User Story 1 - Un dueño de panadería pide una cotización (Priority: P1) 🎯 MVP

**Goal**: Landing completa con la historia SB7 y formulario que guarda la solicitud con su tipo y origen y avisa por correo

**Independent Test**: Abrir `/?utm_source=instagram&utm_campaign=rebanadoras` en móvil, enviar el formulario y comprobar en la BD la solicitud con tipo y origen, y el correo de aviso (quickstart US1)

### Tests for User Story 1 ⚠️

- [X] T025 [P] [US1] Pruebas unitarias en `tests/unit/lead-validation.test.ts`: campos obligatorios y límites de `data-model.md`, correo opcional, país por defecto `VE`, rechazo de teléfonos inválidos
- [X] T026 [P] [US1] Pruebas unitarias en `tests/unit/phone.test.ts`: `0416-1234567` → `+584161234567`, `+57 300 1234567` se conserva normalizado, números con menos de 8 o más de 15 dígitos se rechazan
- [X] T027 [P] [US1] Pruebas unitarias en `tests/unit/lead-source.test.ts`: `utm_source` gana; sin UTM y agente de Instagram → `instagram`; con referencia externa → dominio; nada → `directo`
- [X] T028 [P] [US1] Prueba e2e en `tests/e2e/quote-form.spec.ts` (proyectos `mobile` e `instagram`): primera pantalla con logo, titular, subtítulo y los dos botones sin desplazarse; cabecera con CTA visible en `#en-juego`; envío correcto guarda tipo, `source` y `utm_campaign`; errores junto a los campos conservando lo escrito; doble toque crea una sola solicitud; campo trampa no guarda; sexto envío seguido muestra el aviso de espera (escenarios US1 de `quickstart.md`)

### Implementation for User Story 1

- [X] T029 [P] [US1] Crear `lib/leads/phone.ts` con `normalizePhone(input, country)` (quita espacios y guiones; `0` inicial en Venezuela → `+58`; valida 8–15 dígitos) y `toWhatsAppLink(phone)` → `https://wa.me/<dígitos>`
- [X] T030 [P] [US1] Crear `lib/leads/source.ts` con `deriveSource({ utmSource, referrer, userAgent, siteHost })` según la regla de `data-model.md`
- [X] T031 [P] [US1] Crear `lib/validation/lead.ts` con el esquema Zod compartido cliente/servidor del formulario (`contracts/server-actions.md#submitlead`), mensajes de error en español y transformación del teléfono con `normalizePhone`
- [X] T032 [P] [US1] Crear `lib/leads/rate-limit.ts` (`import 'server-only'`): `hashIp(ip)` con SHA-256 + `SESSION_SECRET` y `isRateLimited(ipHash)` (más de 5 solicitudes en 10 min en `leads`)
- [X] T033 [P] [US1] Crear `lib/email/lead-notification.ts` (`import 'server-only'`): plantilla de texto y HTML simple con asunto, cuerpo y `replyTo` de `contracts/routes.md#correo-de-aviso-fr-014`, y `sendLeadNotification(lead)` con Resend; devuelve `enviado` o `fallido` sin lanzar
- [X] T034 [US1] Crear `lib/leads/create-lead.ts` (`import 'server-only'`): busca el producto por `productSlug` (guarda `product_id` solo si existe y está visible, y siempre `product_name`), inserta con `ON CONFLICT (submission_id) DO NOTHING` y devuelve `{ id, created: boolean }`
- [X] T035 [US1] Crear `app/(site)/actions.ts` con `submitLead(prev, formData)` siguiendo en orden el comportamiento de `contracts/server-actions.md#submitlead` (trampa y 3 s → éxito sin guardar; validación con `values`; límite por IP desde `headers()`; inserción; `after()` que envía el correo y actualiza `notification_status`; mensaje de éxito con enlace de WhatsApp del negocio). Sin datos del cliente en `console.*` (docs: `04-functions/after.md`, `02-guides/forms.md`)
- [X] T036 [P] [US1] Crear `components/site/AttributionCapture.tsx` (cliente): en la primera carga de la sesión guarda en `sessionStorage` (con `try/catch`) `utm_*`, `landingUrl` y `document.referrer`; no sobrescribe si ya existe
- [X] T037 [US1] Crear `components/site/QuoteForm.tsx` (cliente, `useActionState`): `#cotizar`; tipo con `RadioGroup` (Equipo, Repuesto, Servicio técnico); campos de FR-011; `submissionId` con `crypto.randomUUID()` al montar; `renderedAt`; campo trampa `website` oculto a lectores de pantalla; campos ocultos de atribución leídos de `sessionStorage`; validación en el servidor con `lib/validation/lead.ts` (el cliente no carga Zod para mantener el JS liviano; `submissionId` y `renderedAt` viven en refs y se añaden al enviar); botón deshabilitado mientras `pending`; conserva valores ante error o fallo de red; estado de éxito con `successTitle`/`successBody` y enlace a WhatsApp; recibe textos de la sección `quote_form`
- [X] T038 [P] [US1] Crear `components/site/Header.tsx`: cabecera fija con logo (`public/brand/logo.webp`, `priority`) y botón «Solicita tu cotización» que lleva a `#cotizar`
- [X] T039 [P] [US1] Crear `components/site/Hero.tsx` (`#inicio`): titular en Archivo Black, subtítulo, `trustLine`, botón directo y botón secundario «Ver el catálogo» (prop `showCatalogCta`); cabe en 360 × 640 px
- [X] T040 [P] [US1] Crear `components/site/SectionCta.tsx`: CTA directo repetido al final de cada bloque, mismo texto y color que el de la cabecera (FR-003)
- [X] T041 [P] [US1] Crear `components/site/sections/Problem.tsx` (`#problema`) y `components/site/sections/Guide.tsx` (`#guia`, empatía + puntos de autoridad)
- [X] T042 [P] [US1] Crear `components/site/sections/Plan.tsx` (`#plan`, 3 pasos numerados + acuerdo) y `components/site/sections/Services.tsx` (`#servicios`, las 5 líneas de negocio)
- [X] T043 [P] [US1] Crear `components/site/sections/Stakes.tsx` (`#en-juego`, máx. 3 puntos, tono moderado) y `components/site/sections/Success.tsx` (`#exito`, resultados + transformación de identidad)
- [X] T044 [P] [US1] Crear `components/site/sections/Testimonials.tsx` (`#testimonios`; no renderiza nada si la lista está vacía)
- [X] T045 [P] [US1] Crear `components/site/Footer.tsx`: contacto (WhatsApp con `toWhatsAppLink`, correo con `mailto:`, dirección y horario solo si existen), redes visibles, cobertura, condiciones de entrega, métodos de pago como información, razón social y RIF; sin botón flotante de WhatsApp
- [X] T046 [US1] Crear `app/(site)/layout.tsx` con `Header`, `Footer` (lee `getBusinessSettings()`), `AttributionCapture` y `<main>`
- [X] T047 [US1] Crear `app/(site)/page.tsx` que compone, en el orden de FR-001, `Hero`, `Problem`, `Guide`, `Plan`, `Services`, `Stakes`, `Success`, `Testimonials` y `QuoteForm` (envuelto en `<Suspense>` porque leerá `useSearchParams` en US2), con `SectionCta` al final de cada bloque y los textos de `getSections()`
- [X] T048 [US1] Crear `app/(site)/not-found.tsx` con enlaces al inicio y a `#cotizar`

**Checkpoint**: La landing cuenta la historia y recibe solicitudes; MVP desplegable

---

## Phase 4: User Story 2 - Un visitante pide un producto concreto del catálogo (Priority: P2)

**Goal**: Catálogo con rebanadoras destacadas, fichas (página y ventana) y formulario con el producto preseleccionado

**Independent Test**: Con un producto sembrado por fixture, abrir su ficha desde el catálogo, pulsar «Solicitar cotización de este equipo» y comprobar que la solicitud queda asociada (quickstart US2)

### Tests for User Story 2 ⚠️

- [X] T049 [P] [US2] Prueba e2e en `tests/e2e/product-quote.spec.ts`: el destacado aparece primero en `#catalogo`; la ficha se abre como ventana desde el catálogo y cerrar vuelve a la misma posición; «Solicitar cotización de este equipo» preselecciona producto y tipo «equipo» y la solicitud guarda `product_id` y `product_name`; `/productos/<slug>` sin precio; producto oculto no aparece y su URL da 404

### Implementation for User Story 2

- [X] T050 [US2] Crear `lib/content/products.ts` (`import 'server-only'`, `'use cache'` + `cacheTag('products')` + `cacheLife('max')`): `getCatalog()` (productos visibles con imágenes ordenadas, destacados primero, luego por categoría y `sort_order`), `getProductBySlug(slug)` (solo visibles), `getVisibleProductSlugs()`
- [X] T051 [P] [US2] Crear `components/site/ProductCard.tsx`: foto de portada con `next/image` (ancho/alto guardados, `sizes` responsivo), nombre, categoría, descripción corta, enlace a `/productos/<slug>`; sin precio
- [X] T052 [P] [US2] Crear `components/site/ProductGallery.tsx` (cliente): foto principal y miniaturas con navegación por teclado y texto alternativo
- [X] T053 [P] [US2] Crear `components/site/ProductDetail.tsx`: galería, nombre, categoría, descripción con saltos de línea, nota «Cotizamos cada pedido con su precio y su plazo» y botón «Solicitar cotización de este equipo» → `/?producto=<slug>#cotizar`
- [X] T054 [P] [US2] Crear `components/ui/Modal.tsx` (cliente): `<dialog>` accesible con foco atrapado, cierre con Escape y botón; al cerrar llama `router.back()`
- [X] T055 [US2] Crear `components/site/Catalog.tsx` (`#catalogo`): título y texto de la sección `featured`, productos destacados primero y luego agrupados por categoría con `ProductCard`; no renderiza nada si el catálogo está vacío
- [X] T056 [US2] Crear `app/(site)/productos/[slug]/page.tsx` con `generateStaticParams` (desde `getVisibleProductSlugs()`), `generateMetadata` (nombre, descripción corta, foto) y `notFound()` si no existe o está oculto
- [X] T057 [US2] Crear `app/(site)/@modal/(.)productos/[slug]/page.tsx` (ficha dentro de `Modal`) y `app/(site)/@modal/default.tsx` que devuelve `null` (docs: rutas paralelas e interceptadas en `node_modules/next/dist/docs/01-app/`)
- [X] T058 [US2] Actualizar `app/(site)/layout.tsx` para recibir y renderizar el slot `modal`, y `app/(site)/page.tsx` para insertar `Catalog` entre `Services` y `Stakes`, pasar `showCatalogCta` a `Hero` según haya productos y pasar a `QuoteForm` la lista `{ slug, name }` del catálogo
- [X] T059 [US2] Actualizar `components/site/QuoteForm.tsx`: leer `producto` con `useSearchParams`, buscarlo en la lista recibida, mostrar «Producto: <nombre>» con opción de quitarlo, preseleccionar tipo «equipo» y enviar `productSlug` y `productName`
- [X] T060 [P] [US2] Crear `app/sitemap.ts` (inicio y fichas visibles) y `app/robots.ts` (permite todo salvo `/admin`)

**Checkpoint**: US1 y US2 funcionan; la campaña de rebanadoras puede salir con productos cargados por script

---

## Phase 5: Base del admin (Blocking Prerequisites for US3–US5)

**Purpose**: Login, sesiones y estructura del panel. Leer antes `02-guides/authentication.md`, `02-guides/authentication-with-cache-components.md`, `02-guides/data-security.md` y `01-getting-started/16-proxy.md`

**⚠️ CRITICAL**: US3, US4 y US5 dependen de esta fase

- [X] T061 [P] Pruebas unitarias en `tests/unit/session.test.ts` (el token se guarda solo como hash; sesión vencida se rechaza; se renueva si quedan menos de 3 días) y `tests/unit/login-throttle.test.ts` (5 fallos en 15 min bloquean; un acierto no borra el historial de fallos de la ventana)
- [X] T062 [P] Prueba e2e en `tests/e2e/admin-auth.spec.ts`: sin sesión `/admin/solicitudes` redirige a `/admin/login?next=…`; login correcto entra; contraseña incorrecta muestra mensaje genérico; sexto intento fallido muestra bloqueo; `next=https://otro.sitio` se ignora; cerrar sesión impide volver con el botón atrás
- [X] T063 [P] Crear `lib/auth/password.ts` (`import 'server-only'`): `hashPassword` y `verifyPassword` con Argon2id (`@node-rs/argon2`)
- [X] T064 [P] Crear `lib/auth/throttle.ts` (`import 'server-only'`): `recordLoginAttempt` e `isLoginLocked(email)` sobre `login_attempts`
- [X] T065 Crear `lib/auth/session.ts` (`import 'server-only'`): `createSession(userId)` (token de 32 bytes, guarda SHA-256 en `admin_sessions`, cookie `admin_session` `HttpOnly`, `Secure`, `SameSite=Lax`, 7 días), `validateSessionToken(token)` (renovación), `deleteSession()` y `deleteOtherSessions(userId)`
- [X] T066 Crear `lib/dal/session.ts` (`import 'server-only'`): `verifySession()` envuelto en `cache` de React; lee la cookie, valida contra la BD, comprueba `is_active` y redirige a `/admin/login` si falla; devuelve `{ id, name, email }`
- [X] T067 Crear `proxy.ts` en la raíz: para `/admin/:path*` excepto `/admin/login`, si no hay cookie `admin_session` redirige a `/admin/login?next=<ruta>`; sin consultas a la BD
- [X] T068 Crear `app/admin/actions.ts` con `login`, `logout` y `changePassword` según `contracts/server-actions.md#admin--sesión` (`next` solo si empieza por `/admin`; actualiza `last_login_at`)
- [X] T069 Crear `app/admin/login/page.tsx` y `components/admin/LoginForm.tsx` (cliente, `useActionState`), con `metadata.robots = { index: false }`
- [X] T070 Crear `app/admin/(panel)/layout.tsx`: navegación (Resumen, Solicitudes, Productos, Categorías, Contenido, Testimonios, Negocio, Cuenta) y nombre del usuario + botón «Cerrar sesión» dentro de `<Suspense>` usando `verifySession()`; `metadata.robots` `noindex`; diseño usable en teléfono
- [X] T071 Crear `app/admin/(panel)/cuenta/page.tsx` con el formulario de cambio de contraseña (≥ 10 caracteres, confirmación)
- [X] T072 Crear `scripts/create-admin.ts`: argumentos `--name` y `--email`, pide la contraseña por consola sin mostrarla, valida ≥ 10 caracteres y crea el usuario con `hashPassword`
- [X] T073 Añadir a `tests/e2e/fixtures.ts` el helper `loginAsAdmin(page)` que crea un usuario de prueba y guarda el `storageState`

**Checkpoint**: Login y panel protegidos; se pueden construir las pantallas del admin

---

## Phase 6: User Story 3 - El negocio atiende las solicitudes desde el admin (Priority: P3)

**Goal**: Lista, detalle, cambio de estado y resumen semanal por origen

**Independent Test**: Con solicitudes de prueba de varios orígenes, filtrar por estado, marcar una como atendida y ver el conteo semanal por origen (quickstart US3)

### Tests for User Story 3 ⚠️

- [X] T074 [P] [US3] Prueba unitaria en `tests/unit/lead-stats.test.ts` de `buildWeeklyStats(rows, weeks)`: semanas sin solicitudes aparecen con 0, agrupación por origen, semanas de lunes a domingo en hora de Venezuela (`America/Caracas`)
- [X] T075 [P] [US3] Prueba e2e en `tests/e2e/admin-leads.spec.ts`: lista ordenada por fecha con tipo, nombre, estado y origen; filtro por «nueva»; el botón WhatsApp apunta a `https://wa.me/<dígitos>`; marcar como atendida cambia el estado; la marca «aviso fallido» se ve cuando `notification_status = fallido`; el resumen muestra totales por semana y origen

### Implementation for User Story 3

- [X] T076 [P] [US3] Crear `lib/leads/stats.ts` con `buildWeeklyStats(rows, weeks)` (función pura)
- [X] T077 [US3] Crear `lib/dal/leads.ts` (`import 'server-only'`; cada función llama `verifySession()`): `listLeads({ status, type, source, page })` (25 por página), `getLead(id)`, `getLeadStats({ weeks: 12 })` con `date_trunc('week', created_at AT TIME ZONE 'America/Caracas')`, `countNewLeads()`
- [X] T078 [US3] Crear `app/admin/(panel)/solicitudes/actions.ts` con `setLeadStatus(id, status)` (actualiza `attended_at`) y `deleteLead(id)`, ambas con `verifySession()` y validación Zod del id
- [X] T079 [US3] Crear `components/admin/LeadsTable.tsx` y `components/admin/LeadFilters.tsx` (filtros como parámetros de URL, paginación)
- [X] T080 [US3] Crear `app/admin/(panel)/solicitudes/page.tsx` (lee `searchParams` dentro de `<Suspense>`)
- [X] T081 [US3] Crear `app/admin/(panel)/solicitudes/[id]/page.tsx`: todos los datos, producto pedido, origen y UTM, botones «WhatsApp» y «Correo», marca de aviso fallido, botón para cambiar estado y borrar con confirmación
- [X] T082 [US3] Crear `app/admin/(panel)/page.tsx` (resumen): solicitudes nuevas con enlace a la lista filtrada y tabla accesible de las últimas 12 semanas por origen

**Checkpoint**: El negocio da seguimiento y mide qué canal trae clientes

---

## Phase 7: User Story 4 - El negocio actualiza el catálogo (Priority: P4)

**Goal**: CRUD de productos, fotos y categorías desde el admin, visibles en la landing en < 1 minuto

**Independent Test**: Crear un producto con fotos, marcarlo destacado y verlo en `/`; ocultarlo y comprobar que desaparece (quickstart US4)

### Tests for User Story 4 ⚠️

- [X] T083 [P] [US4] Prueba unitaria en `tests/unit/product-validation.test.ts`: `slugify` (acentos, ñ, espacios, símbolos), límites de campos, rechazo de precio inexistente en el esquema
- [X] T084 [P] [US4] Prueba e2e en `tests/e2e/admin-products.spec.ts`: crear producto y subir `tests/e2e/fixtures/rebanadora.jpg` a la carpeta `maqserpan-test` de Cloudinary; publicarlo y verlo en `/`; publicar sin fotos muestra «Agrega al menos una foto antes de publicar el producto»; ocultarlo lo quita de `/`; borrar un producto con solicitudes conserva `product_name`; borrar una categoría con productos falla con mensaje claro

### Implementation for User Story 4

- [X] T085 [P] [US4] Crear `lib/validation/product.ts` con `slugify` y los esquemas Zod de producto, imagen y categoría según `data-model.md`
- [X] T086 [P] [US4] Crear `lib/cloudinary/server.ts` (`import 'server-only'`): `signUpload(folder)` (firma, timestamp, apiKey, cloudName; solo imágenes, 10 MB), `destroyImage(publicId)`, `isAllowedPublicId(publicId)` (carpeta `maqserpan/products`, o `maqserpan-test` fuera de producción)
- [X] T087 [US4] Crear `lib/dal/products.ts` (`import 'server-only'`; `verifySession()` en cada función): listar para el admin, obtener por id, crear/actualizar (slug único), borrar (imágenes de Cloudinary incluidas), reordenar, imágenes (añadir, actualizar alt/orden, borrar) y categorías (crear, renombrar, reordenar, borrar solo si está vacía)
- [X] T088 [US4] Crear `app/admin/(panel)/productos/actions.ts` y `app/admin/(panel)/categorias/actions.ts` con las acciones de `contracts/server-actions.md#admin--catálogo-invalidan-la-etiqueta-products`, cada una con `updateTag('products')` tras guardar y la regla «visible requiere foto» (docs: `04-functions/updateTag.md`)
- [X] T089 [P] [US4] Crear `components/admin/ImageUploader.tsx` (cliente): pide firma con `getUploadSignature`, sube directo a Cloudinary con progreso, registra con `addProductImage`, permite editar texto alternativo, reordenar y borrar; acepta fotos de cámara del teléfono
- [X] T090 [US4] Crear `components/admin/ProductForm.tsx` (cliente, `useActionState`): nombre, slug editable, categoría, descripción corta con contador, descripción, destacado, visible
- [X] T091 [US4] Crear `app/admin/(panel)/productos/page.tsx`: lista con portada, categoría, interruptores de visible y destacado, y ordenar con flechas accesibles
- [X] T092 [US4] Crear `app/admin/(panel)/productos/nuevo/page.tsx` y `app/admin/(panel)/productos/[id]/page.tsx` con `ProductForm` e `ImageUploader`
- [X] T093 [US4] Crear `app/admin/(panel)/categorias/page.tsx`: crear, renombrar, ordenar y borrar categorías

**Checkpoint**: El catálogo se mantiene sin programador

---

## Phase 8: User Story 5 - El negocio edita los textos, el contacto y las redes (Priority: P5)

**Goal**: Editar secciones de la historia, testimonios y datos del negocio desde el admin

**Independent Test**: Cambiar el titular y el enlace de Instagram desde el admin y verlos en la landing sin publicar (quickstart US5)

### Tests for User Story 5 ⚠️

- [X] T094 [P] [US5] Prueba unitaria en `tests/unit/price-warning.test.ts` de `detectPriceOrDeadline(text)`: detecta `$`, `Bs`, `USD`, `€` y frases como «en 5 días» o «en 2 semanas»; no marca «22 años»
- [X] T095 [P] [US5] Prueba e2e en `tests/e2e/admin-content.spec.ts`: cambiar el titular de `hero` se ve en `/`; vaciar una red la quita del pie; sin testimonios visibles no existe `#testimonios` y al crear uno aparece; dirección vacía no se muestra; con `SHOW_TEST_SOCIALS` sin definir, las redes de prueba no aparecen

### Implementation for User Story 5

- [X] T096 [P] [US5] Crear `lib/validation/price-warning.ts` con `detectPriceOrDeadline(text)`
- [X] T097 [US5] Crear `lib/dal/content.ts` (`import 'server-only'`; `verifySession()` en cada función): leer y guardar secciones (validadas con `sectionSchemas`, guarda `updated_by`), CRUD y orden de testimonios, leer y guardar `business_settings`
- [X] T098 [US5] Crear `app/admin/(panel)/contenido/actions.ts` (`saveSection` + `updateTag('content')`), `app/admin/(panel)/testimonios/actions.ts` (+ `updateTag('testimonials')`) y `app/admin/(panel)/negocio/actions.ts` (+ `updateTag('settings')`)
- [X] T099 [US5] Crear `components/admin/SectionEditor.tsx` (cliente): genera el formulario desde el esquema Zod de la sección (texto, área de texto, listas con añadir/quitar respetando mínimos y máximos), contadores de caracteres y aviso no bloqueante de `detectPriceOrDeadline`
- [X] T100 [US5] Crear `app/admin/(panel)/contenido/page.tsx` (lista de secciones en el orden de la landing con fecha de última edición) y `app/admin/(panel)/contenido/[key]/page.tsx` (`SectionEditor`; 404 si la clave no existe)
- [X] T101 [US5] Crear `app/admin/(panel)/testimonios/page.tsx` con crear, editar, ocultar, ordenar y borrar
- [X] T102 [US5] Crear `app/admin/(panel)/negocio/page.tsx` y `components/admin/BusinessSettingsForm.tsx`: WhatsApp, correo, dirección, horario, redes (red, URL, marca «de prueba»), métodos de pago, cobertura, condiciones de entrega, razón social y RIF

**Checkpoint**: Todas las historias funcionan de forma independiente

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Calidad, seguridad, rendimiento y documentación

- [X] T103 [P] Crear `app/opengraph-image.tsx` (1200 × 630, logo y titular, colores de marca) con `ImageResponse`
- [X] T104 [P] Prueba e2e de accesibilidad en `tests/e2e/accessibility.spec.ts` con `@axe-core/playwright` sobre `/`, `/productos/<slug>`, `/admin/login` y `/admin/solicitudes`: sin violaciones de contraste ni de etiquetas
- [X] T105 Añadir cabeceras de seguridad en `next.config.ts` (`headers()`): `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` en `/admin`, `Permissions-Policy` básica
- [X] T106 Revisión de seguridad: confirmar que toda acción y página en `app/admin/` llama `verifySession()` (búsqueda en el código), que ningún dato de solicitudes aparece en `console.*` ni en funciones con `'use cache'`, y que las cookies tienen las banderas correctas; anotar el resultado en `specs/001-landing-storybrand/checklists/security.md`
- [X] T107 Revisión de rendimiento con `npm run build`: la ruta `/` se marca prerenderada, el JS propio de la landing ≤ 50 KB comprimido (medido: ~25 KB propios + ~155 KB del runtime de React/Next, 183 KB en total), el logo de la cabecera usa `priority`, y no hay saltos de diseño por fuentes o imágenes (Lighthouse móvil: LCP ≤ 2,5 s, CLS ≤ 0,1)
- [X] T108 [P] Reescribir `README.md`: qué es el proyecto, requisitos, variables de entorno, scripts, cómo crear usuarios del admin, despliegue en Vercel con la integración de Neon, nota sobre la cuenta de Resend con distribuidoramaqserpan@hotmail.com hasta tener dominio propio
- [X] T109 Ejecutar las puertas de calidad: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e`, `npm run build`, y corregir lo que falle
- [ ] T110 Desplegar una vista previa en Vercel, sembrar su rama de Neon y recorrer todos los escenarios de `specs/001-landing-storybrand/quickstart.md` desde un teléfono real, incluido el navegador de Instagram

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias
- **Foundational (Phase 2)**: depende de Setup; bloquea todas las historias
- **US1 (Phase 3)** y **US2 (Phase 4)**: dependen de Foundational
- **Base del admin (Phase 5)**: depende de Foundational; bloquea US3, US4 y US5
- **US3, US4, US5 (Phases 6–8)**: dependen de la Base del admin; independientes entre sí
- **Polish (Phase 9)**: después de las historias que se vayan a lanzar

### User Story Dependencies

- **US1 (P1)**: solo Foundational
- **US2 (P2)**: solo Foundational para el catálogo y las fichas; T058–T059 modifican archivos de US1 (`app/(site)/layout.tsx`, `app/(site)/page.tsx`, `components/site/QuoteForm.tsx`), así que se hacen después de T046, T047 y T037
- **US3 (P3)**: Base del admin; las solicitudes de prueba se crean con `insertLeadFixture`, sin depender de US1
- **US4 (P4)**: Base del admin; para ver el resultado en la landing necesita `Catalog` de US2
- **US5 (P5)**: Base del admin; las lecturas públicas ya existen desde Foundational

### Within Each User Story

- Pruebas primero, deben fallar antes de implementar
- Validación y lógica pura → DAL / acciones → componentes → páginas
- Cerrar la historia y validarla antes de pasar a la siguiente prioridad

### Parallel Opportunities

- Setup: T003–T007 en paralelo
- Foundational: T013–T016, T021, T022 y T024 en paralelo tras T010–T011
- US1: pruebas T025–T028 juntas; lógica T029–T033 juntas; componentes T038–T045 juntos
- US2: T051–T054 y T060 en paralelo
- Base del admin: T061–T064 en paralelo
- Tras la Base del admin, US3, US4 y US5 pueden avanzar en paralelo

---

## Parallel Example: User Story 1

```bash
# Pruebas de US1 juntas:
Task: "Pruebas unitarias en tests/unit/lead-validation.test.ts"
Task: "Pruebas unitarias en tests/unit/phone.test.ts"
Task: "Pruebas unitarias en tests/unit/lead-source.test.ts"
Task: "Prueba e2e en tests/e2e/quote-form.spec.ts"

# Lógica de US1 junta:
Task: "Crear lib/leads/phone.ts"
Task: "Crear lib/leads/source.ts"
Task: "Crear lib/validation/lead.ts"
Task: "Crear lib/leads/rate-limit.ts"
Task: "Crear lib/email/lead-notification.ts"

# Secciones de la landing juntas:
Task: "Crear components/site/Header.tsx"
Task: "Crear components/site/Hero.tsx"
Task: "Crear components/site/sections/Problem.tsx y Guide.tsx"
Task: "Crear components/site/sections/Plan.tsx y Services.tsx"
Task: "Crear components/site/sections/Stakes.tsx y Success.tsx"
Task: "Crear components/site/Footer.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 (Setup) y Phase 2 (Foundational)
2. Phase 3 (US1)
3. **Parar y validar**: escenarios US1 de `quickstart.md` en la vista previa desde un teléfono
4. Se puede publicar: la landing ya recibe solicitudes y avisa por correo; el contenido se ajusta con `npm run db:seed` hasta tener el admin

### Incremental Delivery

1. Setup + Foundational → base lista
2. US1 → validar → publicar (MVP)
3. US2 → catálogo con rebanadoras → publicar (productos cargados por script si el admin aún no está)
4. Base del admin + US3 → el negocio da seguimiento a las solicitudes
5. US4 → el negocio carga su catálogo
6. US5 → el negocio edita textos, contacto y redes
7. Polish → revisión final y lanzamiento de campañas

---

## Notes

- [P] = archivos distintos, sin dependencias pendientes
- Hacer commit después de cada tarea o grupo lógico
- No añadir precios, plazos fijos ni datos no confirmados en ningún texto (constitución, Principio I)
- Cualquier dependencia nueva fuera de las de T001 debe justificarse en `research.md`
