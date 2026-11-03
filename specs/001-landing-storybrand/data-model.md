# Data Model: Landing StoryBrand de Distribuidora Maqserpan

**Fecha**: 2026-11-01 · **Base de datos**: PostgreSQL (Neon) · **Ver**: [research.md](./research.md)

Convenciones: claves primarias `uuid` (salvo donde se indica), fechas `timestamptz` en UTC,
`created_at` / `updated_at` en todas las tablas editables. Nombres de tablas y columnas en
inglés (`snake_case`); los valores visibles al usuario, en español.

## Diagrama

```text
categories 1──* products 1──* product_images
products   1──* leads            (opcional; se guarda también product_name)
admin_users 1──* admin_sessions
content_sections   (una fila por bloque de la historia)
testimonials
business_settings  (una sola fila)
login_attempts     (límite de intentos de login)
```

## leads (Solicitud)

| Campo | Tipo | Reglas |
|---|---|---|
| id | uuid | PK |
| submission_id | uuid | único; generado por el formulario (evita duplicados) |
| type | enum `lead_type` | `equipo` · `repuesto` · `servicio_tecnico`; obligatorio |
| name | text | obligatorio, 2–100 caracteres |
| phone | text | obligatorio; normalizado a formato internacional `+<código><número>` (8–15 dígitos) |
| email | text | opcional; formato de correo válido, ≤ 254 |
| business_name | text | opcional, ≤ 120 |
| city | text | obligatorio, 2–80 |
| country | enum `country` | `VE` · `CO` · `BR` · `CW` · `OTRO`; obligatorio (por defecto `VE`) |
| message | text | obligatorio, 10–2.000 caracteres |
| product_id | uuid | FK → products, `ON DELETE SET NULL`, opcional |
| product_name | text | copia del nombre al enviar (se conserva si el producto se borra) |
| utm_source / utm_medium / utm_campaign / utm_content / utm_term | text | opcionales, ≤ 200 cada uno |
| source | text | obligatorio; `utm_source` si existe, si no `instagram`, el dominio de referencia o `directo` |
| landing_url | text | opcional, ≤ 2.000 (sin datos personales) |
| referrer | text | opcional, ≤ 2.000 |
| ip_hash | text | SHA-256 de IP + secreto; solo para el límite de envíos |
| status | enum `lead_status` | `nueva` (por defecto) · `atendida` |
| attended_at | timestamptz | se llena al pasar a `atendida`; se vacía al volver a `nueva` |
| notification_status | enum | `pendiente` · `enviado` · `fallido` |
| created_at | timestamptz | por defecto `now()` |

**Índices**: `(status, created_at desc)`, `(created_at)`, `(source)`,
`(ip_hash, created_at)`.

**Transiciones de estado**: `nueva → atendida` y `atendida → nueva` (por error humano).
Solo desde el admin.

**Reglas de validación del formulario** (esquema compartido cliente/servidor):
- Campo trampa `website` debe llegar vacío; si no, se responde «éxito» sin guardar.
- `rendered_at` debe ser al menos 3 s anterior al envío.
- Máximo 5 solicitudes por `ip_hash` en 10 minutos.
- Si `product_id` no existe o está oculto, se guarda igual con `product_name` recibido.

## products (Producto)

| Campo | Tipo | Reglas |
|---|---|---|
| id | uuid | PK |
| slug | text | único; generado del nombre, editable; `[a-z0-9-]`, ≤ 120 |
| name | text | obligatorio, 2–120 |
| category_id | uuid | FK → categories, `ON DELETE RESTRICT`, obligatorio |
| short_description | text | obligatorio, ≤ 200 (tarjeta del catálogo) |
| description | text | opcional, ≤ 5.000 (ficha; texto con saltos de línea, sin HTML) |
| is_featured | boolean | por defecto `false` |
| is_visible | boolean | por defecto `true` |
| sort_order | integer | por defecto 0; menor primero |

**Reglas**: un producto visible MUST tener al menos una foto. No existe campo de precio
(constitución, Principio I).

## product_images

| Campo | Tipo | Reglas |
|---|---|---|
| id | uuid | PK |
| product_id | uuid | FK → products, `ON DELETE CASCADE` |
| cloudinary_public_id | text | obligatorio, único |
| width / height | integer | obligatorios (evitan saltos de diseño) |
| alt | text | obligatorio, ≤ 200; por defecto el nombre del producto |
| sort_order | integer | la primera es la portada |

Al borrar una fila se borra el archivo en Cloudinary.

## categories (Categoría)

| Campo | Tipo | Reglas |
|---|---|---|
| id | uuid | PK |
| name | text | único, 2–60 (ej. «Rebanadoras», «Hornos», «Amasadoras») |
| slug | text | único |
| sort_order | integer | |

No se puede borrar una categoría con productos.

## content_sections (Contenido de sección)

| Campo | Tipo | Reglas |
|---|---|---|
| key | enum `section_key` | PK: `hero` · `problem` · `guide` · `plan` · `services` · `featured` · `stakes` · `success` · `testimonials` · `quote_form` · `contact` |
| data | jsonb | validado por el esquema de esa sección (ver [contracts/content-schema.md](./contracts/content-schema.md)) |
| updated_at | timestamptz | |
| updated_by | uuid | FK → admin_users, `ON DELETE SET NULL` |

## testimonials (Testimonio)

| Campo | Tipo | Reglas |
|---|---|---|
| id | uuid | PK |
| quote | text | obligatorio, 10–400 |
| author_name | text | obligatorio, ≤ 80 |
| business_name | text | opcional, ≤ 120 |
| city | text | opcional, ≤ 80 |
| is_visible | boolean | por defecto `true` |
| sort_order | integer | |

Si no hay testimonios visibles, la sección no se muestra (FR-024).

## business_settings (Datos del negocio)

Una sola fila (`id = 1`, con restricción `CHECK (id = 1)`).

| Campo | Tipo | Reglas |
|---|---|---|
| whatsapp | text | formato internacional; inicial `+584166873369` |
| email | text | inicial `distribuidoramaqserpan@hotmail.com` |
| address | text | opcional; vacío al inicio (TODO de la constitución) |
| business_hours | text | opcional; vacío al inicio |
| social_links | jsonb | lista de `{ network, url, isTest }`; `network` ∈ `instagram` · `facebook` · `tiktok` · `youtube` · `x`. Inicial: Instagram real (`isTest: false`) y Facebook/TikTok de prueba (`isTest: true`) |
| payment_methods | jsonb | lista de textos; inicial: los 4 métodos confirmados |
| shipping_coverage | jsonb | lista de textos; inicial: Venezuela, Colombia, Brasil, Curaçao |
| delivery_terms | jsonb | lista de textos; inicial: las condiciones de entrega confirmadas |
| legal_name | text | inicial `Distribuidora Maqserpan C.A.` |
| rif | text | inicial `J-31113230-9` |
| updated_at | timestamptz | |

**Reglas de visualización**: los enlaces con `isTest: true` solo se muestran fuera de
producción; un campo vacío oculta su elemento.

## admin_users (Usuario del admin)

| Campo | Tipo | Reglas |
|---|---|---|
| id | uuid | PK |
| name | text | obligatorio |
| email | text | único, guardado en minúsculas |
| password_hash | text | Argon2id; contraseña mínima de 10 caracteres |
| is_active | boolean | por defecto `true`; desactivar corta el acceso sin borrar historial |
| created_at / last_login_at | timestamptz | |

## admin_sessions

| Campo | Tipo | Reglas |
|---|---|---|
| id | text | PK = SHA-256 del token de la cookie (el token en claro nunca se guarda) |
| user_id | uuid | FK → admin_users, `ON DELETE CASCADE` |
| expires_at | timestamptz | 7 días; se extiende si quedan menos de 3 días y hay actividad |
| created_at | timestamptz | |

Cambiar la contraseña borra las demás sesiones del usuario.

## login_attempts

| Campo | Tipo | Reglas |
|---|---|---|
| id | bigserial | PK |
| email | text | en minúsculas |
| ip_hash | text | |
| succeeded | boolean | |
| created_at | timestamptz | índice `(email, created_at)` |

Más de 5 intentos fallidos por correo en 15 minutos bloquea el login de ese correo hasta
que pase la ventana. Las filas de más de 30 días se pueden borrar.

## Etiquetas de caché (lecturas públicas)

| Etiqueta | Lecturas | La invalidan |
|---|---|---|
| `content` | `content_sections` | guardar una sección |
| `products` | productos visibles, categorías, imágenes | crear/editar/ocultar/ordenar/borrar productos, imágenes o categorías |
| `testimonials` | testimonios visibles | crear/editar/borrar testimonios |
| `settings` | `business_settings` | guardar los datos del negocio |

Las solicitudes y todo el admin nunca se cachean en el servidor.
