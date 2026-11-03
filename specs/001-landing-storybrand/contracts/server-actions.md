# Contrato: Server Actions y Route Handlers

Todas las entradas se validan en el servidor con Zod, aunque el cliente ya haya validado.
Las acciones del admin empiezan siempre con `await verifySession()` (lanza redirección a
`/admin/login` si no hay sesión) y nunca confían en datos de usuario enviados por el
cliente.

Forma común de respuesta para formularios con `useActionState`:

```ts
type ActionState =
  | { status: 'idle' }
  | { status: 'success'; message?: string; data?: unknown }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string[]>; values?: Record<string, string> }
```

`values` devuelve lo escrito para no perderlo (FR-012).

## Públicas

### `submitLead(prev, formData) → ActionState`

| Campo | Regla |
|---|---|
| `submissionId` | UUID, obligatorio |
| `type` | `equipo` · `repuesto` · `servicio_tecnico` |
| `name`, `phone`, `city`, `country`, `message` | obligatorios (ver [data-model.md](../data-model.md#leads-solicitud)) |
| `email`, `businessName` | opcionales |
| `productSlug`, `productName` | opcionales |
| `utmSource` … `utmTerm`, `landingUrl`, `referrer` | opcionales, recortados a su longitud máxima |
| `website` | campo trampa: debe venir vacío |
| `renderedAt` | marca de tiempo (ms) de cuando se mostró el formulario |

Comportamiento, en orden:
1. Campo trampa con valor o `renderedAt` < 3 s → `success` sin guardar.
2. Validación fallida → `error` con `fieldErrors` y `values`.
3. Más de 5 envíos del mismo `ip_hash` en 10 min → `error`: «Recibimos varias solicitudes
   seguidas. Espera unos minutos o escríbenos por WhatsApp».
4. Inserta con `ON CONFLICT (submission_id) DO NOTHING`; si ya existía → `success` (no
   duplica).
5. `after()`: envía el correo y actualiza `notification_status`.
6. → `success` con el mensaje de confirmación y el enlace de WhatsApp del negocio (FR-016).

Errores inesperados → `error`: «No pudimos enviar tu solicitud. Revisa tu conexión e
inténtalo de nuevo», conservando `values`.

## Admin — sesión

| Acción | Entrada | Resultado |
|---|---|---|
| `login(prev, formData)` | `email`, `password`, `next` (ruta interna `/admin…`) | Correcto: crea sesión, cookie y redirige a `next` o `/admin`. Incorrecto: «Correo o contraseña incorrectos». Bloqueado: «Demasiados intentos. Prueba en 15 minutos» |
| `logout()` | — | Borra la sesión y la cookie; redirige a `/admin/login` |
| `changePassword(prev, formData)` | `current`, `next` (≥ 10), `confirm` | Cambia el hash y borra las demás sesiones |

`next` solo se acepta si empieza por `/admin` (evita redirecciones abiertas).

## Admin — solicitudes

| Acción | Entrada | Resultado |
|---|---|---|
| `setLeadStatus(id, status)` | uuid, `nueva`·`atendida` | Actualiza `status` y `attended_at` |
| `deleteLead(id)` | uuid | Borra la solicitud (con confirmación en la interfaz) |

Lecturas (en la DAL, sin caché de servidor): `listLeads({ status?, type?, source?, page })`,
`getLead(id)`, `getLeadStats({ weeks: 12 })` → `{ week: string; total: number; bySource: Record<string, number> }[]`.

## Admin — catálogo (invalidan la etiqueta `products`)

| Acción | Entrada |
|---|---|
| `saveProduct(prev, formData)` | `id?`, `name`, `slug?`, `categoryId`, `shortDescription`, `description?`, `isFeatured`, `isVisible` |
| `deleteProduct(id)` | borra producto, imágenes y archivos de Cloudinary |
| `reorderProducts(ids[])` | nuevo orden completo |
| `getUploadSignature(productId)` | → `{ signature, timestamp, apiKey, cloudName, folder }` para subir directo a Cloudinary |
| `addProductImage(productId, { publicId, width, height, alt })` | verifica que `publicId` esté en la carpeta del sitio |
| `updateProductImage(id, { alt?, sortOrder? })`, `deleteProductImage(id)` | |
| `saveCategory(prev, formData)`, `deleteCategory(id)`, `reorderCategories(ids[])` | borrar falla si la categoría tiene productos |

Regla: no se puede marcar visible un producto sin fotos → `error`: «Agrega al menos una
foto antes de publicar el producto».

## Admin — contenido

| Acción | Entrada | Etiqueta |
|---|---|---|
| `saveSection(key, prev, formData)` | campos del esquema de la sección ([content-schema.md](./content-schema.md)) | `content` |
| `saveTestimonial(prev, formData)`, `deleteTestimonial(id)`, `reorderTestimonials(ids[])` | ver data-model | `testimonials` |
| `saveBusinessSettings(prev, formData)` | ver data-model | `settings` |

Todas llaman `updateTag(<etiqueta>)` tras guardar, para que el cambio se vea en la
siguiente carga de la landing.

## Route Handlers

Ninguno es necesario en esta versión. Si se integra un webhook (por ejemplo, rebotes de
Resend), debe verificar la firma del proveedor y usar `revalidateTag(tag, 'max')` en lugar
de `updateTag`.
