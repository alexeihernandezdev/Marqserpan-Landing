# Research: Landing StoryBrand de Distribuidora Maqserpan

**Fecha**: 2026-11-01 · **Plan**: [plan.md](./plan.md) · **Spec**: [spec.md](./spec.md)

Fuente principal para Next.js: la documentación incluida en `node_modules/next/dist/docs/`
(Next.js 16.4.3), como exige `AGENTS.md`. El proyecto ya tiene `cacheComponents: true` y
`partialPrefetching: true` en `next.config.ts`.

## R1. Cómo se ven los cambios del admin en la landing sin publicar (FR-023)

- **Decision**: La landing es una página estática prerenderada. Cada lectura de contenido
  público es una función con `'use cache'` + `cacheTag` (`content`, `products`,
  `settings`, `testimonials`) y `cacheLife('max')`. Las Server Actions del admin llaman
  `updateTag(tag)` después de guardar.
- **Rationale**: Con Cache Components, lo cacheado entra en el «static shell» y carga al
  instante (Principio V). `updateTag` expira la etiqueta de inmediato y la siguiente visita
  trae datos nuevos (docs: `04-functions/updateTag.md`), lo que cumple «menos de 1 minuto»
  sin redeploy (Principio III). En Vercel, la caché de rutas prerenderadas es persistente y
  se invalida por etiqueta.
- **Alternatives considered**: `revalidateTag(tag, 'max')` sirve contenido viejo mientras
  revalida; aceptable pero la persona del admin no vería su cambio en la primera recarga.
  Render dinámico en cada visita: más lento y más consultas a Neon. `revalidatePath('/')`:
  menos preciso que etiquetas.
- **Nota**: el `use cache` en memoria no persiste entre instancias serverless (docs:
  `use-cache.md`), pero el contenido vive en el shell prerenderado de la ruta, que sí es
  persistente. No se necesita `use cache: remote`.

## R2. Acceso a base de datos y migraciones (Neon)

- **Decision**: Drizzle ORM con el driver `@neondatabase/serverless` (HTTP) y
  `drizzle-kit` para migraciones SQL versionadas en `drizzle/`.
- **Rationale**: El driver HTTP de Neon es el adecuado para funciones serverless (sin pool
  persistente). Drizzle genera migraciones SQL legibles que se suben al repo (constitución:
  «migraciones versionadas»), es tipado y liviano.
- **Alternatives considered**: Prisma (más pesado, motor adicional en serverless); SQL a
  mano con `postgres.js` (sin tipos ni generador de migraciones).
- **Entornos**: integración Neon ↔ Vercel: rama `main` de Neon para producción y una rama
  de Neon por cada despliegue de vista previa. Pruebas e2e contra una rama propia.

## R3. Autenticación del admin (FR-017, Principio IV)

- **Decision**: Autenticación propia y mínima siguiendo la guía oficial
  (`02-guides/authentication.md` y `authentication-with-cache-components.md`):
  - Contraseñas con Argon2id (`@node-rs/argon2`).
  - Sesiones en base de datos: token aleatorio de 32 bytes en una cookie `HttpOnly`,
    `Secure`, `SameSite=Lax`; en la BD solo se guarda su hash SHA-256. Duración 7 días,
    renovada con el uso. Cerrar sesión borra la fila.
  - `proxy.ts` hace solo la comprobación optimista (si no hay cookie en `/admin/*`, redirige
    a `/admin/login`).
  - Capa de acceso a datos (`lib/dal/`) con `verifySession()` en cada página, Server Action
    y Route Handler del admin. Las páginas del admin leen la sesión dentro de `<Suspense>`
    (requisito de Cache Components).
  - Límite de intentos de login: 5 fallidos por correo en 15 minutos.
  - Cuentas creadas por script (`npm run admin:create`); sin registro público.
- **Rationale**: Pocos usuarios, sin roles, sin OAuth: una librería completa añade tablas y
  superficie que no se usan. Sesiones en BD permiten revocar al instante.
- **Alternatives considered**: Auth.js / Better Auth (más funcionalidad de la necesaria);
  `iron-session` o JWT sin estado (no se pueden revocar sin lista negra).

## R4. Aviso por correo de cada solicitud (FR-014) — resuelve TODO(PROVEEDOR_CORREO)

- **Decision**: Resend, enviado con `after()` de Next.js después de guardar la solicitud.
- **Rationale**: API simple, plan gratuito suficiente (≈3.000 correos/mes frente a <100
  solicitudes/semana). `after()` (docs: `04-functions/after.md`) envía el correo después de
  responder al visitante: si el correo falla, la solicitud ya está guardada (Edge Case,
  SC-004). Los fallos se registran en la solicitud (`notificationStatus`).
- **Restricción**: sin dominio propio verificado, Resend solo entrega al correo dueño de la
  cuenta. Por eso la cuenta de Resend se crea con `distribuidoramaqserpan@hotmail.com`,
  que es justo el destinatario. Al tener dominio propio se verifica y se envía desde
  `avisos@<dominio>`.
- **Alternatives considered**: SMTP de Hotmail/Outlook con nodemailer (Microsoft limita y
  bloquea SMTP básico); SendGrid / Postmark (también válidos, más configuración).

## R5. Fotos de productos (Cloudinary)

- **Decision**: Subida directa del navegador a Cloudinary con firma generada por una Server
  Action autenticada (carpeta `maqserpan/products`, solo imágenes, máx. 10 MB). La BD guarda
  `publicId`, ancho, alto y texto alternativo. La landing usa `next/image` con un
  `loaderFile` que construye URLs de Cloudinary (`f_auto,q_auto,w_<ancho>`).
- **Rationale**: Las fotos del teléfono superan el límite de cuerpo de las funciones de
  Vercel (≈4,5 MB), así que no pasan por el servidor. Cloudinary entrega WebP/AVIF del tamaño
  justo para conexiones lentas (Principio V, SC-003) sin consumir la optimización de imágenes
  de Vercel.
- **Alternatives considered**: subir a través de una Server Action (límite de tamaño);
  `remotePatterns` con la optimización de Vercel (doble optimización y coste).
- **Borrado**: al eliminar una foto o un producto se borra también en Cloudinary.

## R6. Formulario de solicitud (FR-011 a FR-016)

- **Decision**: Server Action `submitLead` + `useActionState` (docs: `02-guides/forms.md`),
  validación con Zod compartida entre cliente y servidor.
  - **Spam**: campo trampa oculto, tiempo mínimo de 3 s entre carga y envío, y límite de
    5 solicitudes por IP en 10 minutos, contado en la propia BD con el hash de la IP
    (sin servicio adicional).
  - **Duplicados**: el formulario genera un `submissionId` (UUID) al montarse; la columna
    es única, así que un doble toque no crea dos solicitudes.
  - **Teléfono**: se aceptan formatos con `+` y código de país, y números venezolanos
    locales (`0416…` se normaliza a `+58416…`). Se guarda normalizado para el enlace de
    WhatsApp.
  - **Sin conexión**: si el envío falla en el navegador, se muestra el error y los campos
    se conservan (el estado del formulario vive en el cliente).
- **Alternatives considered**: Route Handler + `fetch` (más código, sin mejora progresiva);
  CAPTCHA (fricción en el navegador interno de Instagram y en conexiones lentas).

## R7. Origen de cada solicitud (FR-013, FR-020, SC-005)

- **Decision**: Un componente cliente guarda en `sessionStorage`, en la primera página que
  ve el visitante, los parámetros `utm_*`, `fbclid` (presencia), la URL de entrada y
  `document.referrer`. El formulario los envía en campos ocultos. Sin UTM: origen
  `directo` o el dominio de referencia. Los visitantes del navegador de Instagram sin UTM
  se marcan `instagram` por el agente de usuario.
- **Rationale**: El prerenderizado impide leer `searchParams` en el servidor sin volver la
  página dinámica; capturarlo en el cliente mantiene la landing estática.
- **Alternatives considered**: cookie desde `proxy.ts` (añade trabajo a cada petición);
  Meta Pixel (fuera de alcance; se puede añadir después).

## R8. Fichas de producto sin perder el lugar (US2, Assumptions)

- **Decision**: Ruta `/productos/[slug]` (página completa, enlazable y buena para SEO) más
  una ruta interceptada `@modal/(.)productos/[slug]` que la muestra como ventana sobre la
  landing. `generateStaticParams` prerenderiza los productos visibles; el resto se
  renderiza bajo demanda y queda cacheado. El botón «Solicitar cotización de este equipo»
  lleva a `/?producto=<slug>#cotizar`; el formulario lee `useSearchParams` dentro de
  `<Suspense>` y preselecciona el producto y el tipo «equipo».
- **Alternatives considered**: modal solo en el cliente (sin enlace propio ni SEO); páginas
  por categoría (fuera de alcance).

## R9. Tipografías y logo (FR-026)

- **Decision**: `next/font/local` con Archivo Black (títulos) y Helvetica regular, bold e
  itálica (textos), convertidas a WOFF2 desde `brand/fonts/`, con `display: 'swap'`.
  Respaldo de Helvetica: Arial (ajuste automático para evitar saltos, CLS). Helvetica Light
  solo si el diseño la usa. El logo se exporta una vez a WebP/PNG optimizados en `public/brand/`
  (≤ 40 KB para la cabecera) y a los íconos del sitio.
- **Rationale**: Las fuentes se sirven desde el propio dominio y sin peticiones a terceros.
  WOFF2 reduce ≈50 % el peso de los TTF entregados.

- **Actualización (implementación)**: las fuentes se recortan a Latín básico + Latín-1 con
  `subset-font` (HarfBuzz en WASM), que también genera WOFF2; reemplaza a `ttf2woff2`. Peso
  total de las 4 fuentes: ~78 KB (antes ~395 KB).

## R10. Contenido editable (FR-022, FR-024, FR-025)

- **Decision**: Tabla `content_sections` con una fila por bloque de la historia y su
  contenido en JSON validado por un esquema Zod por sección. Una fila `business_settings`
  para contacto, redes, pagos y cobertura. El contenido inicial (textos del
  [brandscript.md](./brandscript.md), contacto confirmado, redes de prueba) se carga con
  `npm run db:seed`.
- **Rationale**: Las secciones tienen forma distinta (lista de pasos, lista de servicios,
  titular + subtítulo); JSON validado evita una tabla por sección y el formulario del admin
  se genera desde el esquema.
- **Regla**: un campo vacío oculta su elemento en la landing; las redes marcadas «de
  prueba» no se muestran en producción (constitución, Principio I).

## R11. Pruebas (puerta de calidad de la constitución)

- **Decision**: Vitest para unidades (esquemas de validación, normalización de teléfono,
  límite de envíos, hash de sesión) y Playwright para e2e de los flujos que la constitución
  exige: envío del formulario, protección del admin y edición de productos. Playwright
  incluye un perfil de móvil (360 × 640) y un agente de usuario del navegador de Instagram.
- **Puerta antes de `main`**: `npm run lint`, `npm run typecheck`, `npm run test`,
  `npm run build`.

## R13. Base de datos local para desarrollo y pruebas (añadido en la implementación)

- **Decision**: `docker-compose.yml` con Postgres 17 y `local-neon-http-proxy`, que imita la
  API HTTP de Neon. `lib/db/neon-local.ts` redirige el driver al proxy solo si `DATABASE_URL`
  apunta a `db.localtest.me`.
- **Rationale**: permite migrar, sembrar, compilar y correr toda la suite e2e sin cuenta de Neon,
  usando el mismo driver que en producción.
- **Alternatives considered**: driver `pg` en local y Neon en producción (dos caminos de código);
  una rama de Neon para todo (requiere credenciales para cualquier prueba).

## R12. Región y rendimiento

- **Decision**: Neon en `aws-us-east-1` y funciones de Vercel en `iad1` (misma región; la
  más cercana a Venezuela entre las disponibles en ambos).
- **Rationale**: La página pública se sirve desde la CDN; solo el envío del formulario y el
  admin llegan a la función y a la BD, y conviene que estén juntos.
