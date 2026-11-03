# Distribuidora Maqserpan — Landing y admin

Landing de una página que cuenta la historia StoryBrand de **Distribuidora Maqserpan** (equipos y
repuestos para panaderías, cafeterías y charcuterías, Puerto Ordaz) y lleva al visitante a pedir
una cotización. Incluye un admin para atender solicitudes, cargar el catálogo y editar textos,
contacto y redes sin volver a publicar.

- Reglas del proyecto: [`.specify/memory/constitution.md`](.specify/memory/constitution.md)
- Especificación, plan y tareas: [`specs/001-landing-storybrand/`](specs/001-landing-storybrand/)
- Guion de marca: [`specs/001-landing-storybrand/brandscript.md`](specs/001-landing-storybrand/brandscript.md)

## Tecnología

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS 4 · PostgreSQL en
Neon (Drizzle ORM) · Cloudinary (fotos) · Resend (avisos por correo) · Vercel.

> Esta versión de Next.js tiene cambios incompatibles con versiones anteriores. Antes de tocar
> código, lee la guía correspondiente en `node_modules/next/dist/docs/` (ver `AGENTS.md`).

## Requisitos

- Node.js 20.9 o superior
- Docker (para la base de datos local) o una base de datos en Neon

## Puesta en marcha local

```bash
npm install
docker compose up -d                 # Postgres + proxy HTTP que imita a Neon
cp .env.example .env.local           # y completa los valores (ver abajo)
```

En `.env.local`, para la base local:

```
DATABASE_URL=postgres://postgres:postgres@db.localtest.me:5432/maqserpan
SESSION_SECRET=<32+ caracteres aleatorios>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<tu cloud name>
SHOW_TEST_SOCIALS=true
```

Crea las tablas, carga el contenido inicial y un usuario del admin:

```bash
npm run db:migrate        # con Neon. En la base local también puedes aplicar el SQL directo:
                          # docker exec -i marqserpan-landing-postgres-1 psql -U postgres -d maqserpan < drizzle/0000_init.sql
npm run db:seed           # textos del guion, contacto confirmado, redes de prueba, categorías
npm run admin:create -- --name "Rossibell" --email correo@ejemplo.com   # pide la contraseña
npm run dev
```

- Landing: http://localhost:3000
- Admin: http://localhost:3000/admin

`npm run db:seed` no pisa lo editado en el admin. Para restablecer textos y datos del negocio:
`npm run db:seed -- --force`.

## Variables de entorno

| Variable | Uso |
|---|---|
| `DATABASE_URL` | Conexión a Neon (o a la base local) |
| `SESSION_SECRET` | Firma interna de sesiones y hash de IPs; 32+ caracteres |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Subir y borrar fotos de productos |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Mostrar las fotos |
| `RESEND_API_KEY`, `EMAIL_FROM` | Aviso por correo de cada solicitud |
| `NEXT_PUBLIC_SITE_URL` | URL pública (enlaces del correo, metadatos) |
| `SHOW_TEST_SOCIALS` | `true` muestra las redes marcadas «de prueba» (nunca en producción) |
| `E2E_TESTING`, `E2E_TESTING_SECRET` | Solo en `.env.test`, para las pruebas e2e |

### Correo de avisos (Resend)

Mientras no haya dominio propio, Resend solo entrega correos a la dirección dueña de la cuenta.
Crea la cuenta de Resend con **distribuidoramaqserpan@hotmail.com** (que es quien recibe los
avisos) y usa `EMAIL_FROM=onboarding@resend.dev`. Con dominio propio, verifícalo en Resend y usa
algo como `avisos@<dominio>`. Si el correo falla, la solicitud queda guardada igual y el admin la
marca con «Aviso fallido».

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` / `build` / `start` | Desarrollo, compilación y servidor de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | Genera tipos de rutas y ejecuta `tsc` |
| `npm run test` | Pruebas unitarias (Vitest) |
| `npm run test:e2e` | Pruebas e2e (Playwright: móvil 360 × 640, navegador de Instagram y escritorio) |
| `npm run db:generate` / `db:migrate` | Generar y aplicar migraciones (`drizzle/`) |
| `npm run db:seed` | Contenido inicial |
| `npm run admin:create` | Crear un usuario del admin |
| `npm run brand:build` | Regenerar logo, íconos y fuentes optimizados desde `brand/` |

### Pruebas e2e

Usan una base propia definida en `.env.test` (copia de `.env.local` con `E2E_TESTING=true` y un
`E2E_TESTING_SECRET`). La prueba que sube fotos necesita las credenciales de Cloudinary; sin
ellas se omite.

```bash
npm run test:e2e                                   # compila y levanta el servidor
PLAYWRIGHT_BASE_URL=http://localhost:3100 npm run test:e2e   # contra un servidor ya levantado
```

## Puertas de calidad (antes de unir a `main`)

```bash
npm run lint && npm run typecheck && npm run test && npm run test:e2e && npm run build
```

## Despliegue en Vercel

1. Importa el repositorio en Vercel y activa la **integración de Neon** (crea `DATABASE_URL` y una
   rama de Neon por cada vista previa).
2. Agrega las demás variables de entorno. No definas `SHOW_TEST_SOCIALS` en producción.
3. Las migraciones se aplican solas en cada despliegue: `vercel.json` corre `npm run db:migrate`
   antes de `npm run build`, contra la `DATABASE_URL` de ese entorno (producción o la rama de
   Neon de la vista previa). Si la migración falla, el despliegue se detiene y no se publica.
   El seed se corre una vez a mano: `npm run db:seed` con la `DATABASE_URL` de producción.
4. Crea los usuarios del admin con `npm run admin:create`.
5. Revisa cada cambio en la vista previa desde un teléfono antes de publicarlo.

## Marca

- Logos originales: `brand/logo/`. Fuentes: `brand/fonts/` (Archivo Black, OFL; Helvetica,
  archivos entregados por el negocio, sin licencia web).
- Colores: amarillo `#FFD100`, verde `#00942B` (texto: `#007A23`), azul `#0093D3`
  (texto: `#006A9E`), gris `#616161`.
