# Revisión de seguridad: Landing StoryBrand de Distribuidora Maqserpan

**Purpose**: Resultado de la tarea T106 (constitución, Principio IV)
**Created**: 2026-11-02
**Feature**: [spec.md](../spec.md) · [tasks.md](../tasks.md)

## Autorización del admin

- [x] Toda Server Action exportada en `app/admin/**/actions.ts` llama `verifySession()` (salvo `login` y `logout`, que son públicas por diseño). Verificado con un script sobre el código.
- [x] Toda página de `app/admin/(panel)/` usa la DAL (`lib/dal/*`) o `verifySession()`; además el layout del panel envuelve el contenido en `Protected`, que llama `verifySession()`.
- [x] Toda función exportada de `lib/dal/leads.ts`, `lib/dal/products.ts` y `lib/dal/content.ts` llama `verifySession()` (se añadió en `countImages`, la única que faltaba).
- [x] `proxy.ts` solo hace la comprobación optimista de la cookie; no se confía en él para autorizar.
- [x] Los ids que llegan del cliente se validan con Zod (`z.uuid()`) antes de usarlos.
- [x] `next` del login solo acepta rutas `/admin`, `/admin/…`, `/admin?…` (sin redirecciones abiertas; prueba unitaria en `tests/unit/session.test.ts`).

## Sesiones y contraseñas

- [x] Cookie `admin_session`: `HttpOnly`, `SameSite=Lax`, `Secure` en producción, 7 días.
- [x] En la BD solo se guarda el SHA-256 del token; cerrar sesión borra la fila.
- [x] Contraseñas con Argon2id (19 MiB, 2 iteraciones); mínimo 10 caracteres.
- [x] Login con mensaje genérico y verificación contra un hash ficticio si el correo no existe (no revela qué correos tienen cuenta).
- [x] Bloqueo tras 5 intentos fallidos en 15 minutos por correo.
- [x] Cambiar la contraseña cierra las demás sesiones.

## Datos de clientes

- [x] Ningún `console.*` del servidor incluye datos de solicitudes: solo ids, nombres de error o claves de sección.
- [x] Ninguna función con `'use cache'` lee solicitudes ni datos del admin (solo secciones, productos, testimonios y datos del negocio).
- [x] La IP solo se guarda como SHA-256 con el secreto del sitio (`ip_hash`).
- [x] La URL de entrada guardada conserva solo la ruta y los parámetros `utm_*` (se descartan `fbclid` y similares).

## Entradas y superficie pública

- [x] El formulario valida en el servidor con Zod; campo trampa, tiempo mínimo de 3 s y límite de 5 envíos por IP en 10 minutos.
- [x] Los textos editables rechazan HTML; React escapa todo lo que se muestra; el correo de aviso escapa los valores en su HTML.
- [x] La subida de fotos usa firma del servidor, carpeta fija y formatos permitidos; `addProductImage` rechaza `publicId` fuera de la carpeta del sitio.
- [x] `/api/test/revalidate` responde 404 salvo con `E2E_TESTING=true`, fuera de producción y con el secreto correcto.
- [x] Cabeceras: `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy`, `Strict-Transport-Security`; en `/admin`, `X-Frame-Options: DENY` y `X-Robots-Tag: noindex`.
- [x] Secretos solo en variables de entorno (`.env*` ignorado por git; `.env.example` sin valores).

## Pendiente de verificar con credenciales reales

- [ ] Ejecutar `tests/e2e/admin-auth.spec.ts` contra la rama de pruebas de Neon.
- [ ] Confirmar en la vista previa de Vercel que la cookie llega con `Secure` y que las cabeceras están presentes.
