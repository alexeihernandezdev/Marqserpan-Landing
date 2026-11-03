# Contrato: rutas y pantallas

Rutas públicas (prerenderadas, indexables) y del admin (dinámicas, `noindex`, protegidas).

## Públicas

| Ruta | Contenido | Render | Requisitos |
|---|---|---|---|
| `/` | Landing completa en el orden SB7: cabecera fija (logo + «Solicita tu cotización») · `#inicio` primera pantalla · `#problema` · `#guia` · `#plan` · `#servicios` · `#catalogo` (destacados primero, luego por categoría) · `#en-juego` · `#exito` · `#testimonios` (si hay) · `#cotizar` formulario · pie (contacto, WhatsApp, redes, cobertura, entrega, pagos, razón social y RIF) | Estático + `use cache` por etiqueta | FR-001 a FR-010, FR-024 |
| `/?producto=<slug>#cotizar` | Igual que `/`; el formulario preselecciona el producto y el tipo «equipo» | La lectura del parámetro ocurre en el cliente dentro de `<Suspense>` | US2-2 |
| `/productos/<slug>` | Ficha: galería, nombre, categoría, descripción, botón «Solicitar cotización de este equipo» y enlace «Volver al catálogo». Sin precio | Estático (`generateStaticParams`) + bajo demanda | US2, FR-007 |
| `@modal/(.)productos/<slug>` | La misma ficha como ventana sobre la landing al navegar desde el catálogo; cerrar vuelve a la misma posición | Ruta interceptada | Assumptions |
| `/gracias` | No existe: la confirmación se muestra en el lugar del formulario | — | FR-016 |
| `/robots.txt`, `/sitemap.xml` | Indexa `/` y `/productos/*`; bloquea `/admin` | Estático | — |
| `opengraph-image` | Imagen para compartir con logo y titular | Estático | — |

Producto inexistente u oculto en `/productos/<slug>` → página 404 con enlace al catálogo y al
formulario.

## Admin (`/admin`)

Todas, salvo `/admin/login`, requieren sesión válida (comprobación optimista en `proxy.ts` +
`verifySession()` en el servidor). Sin sesión → redirección a `/admin/login?next=<ruta>`.

| Ruta | Pantalla | Historia |
|---|---|---|
| `/admin/login` | Correo + contraseña; mensaje genérico si falla; aviso de bloqueo temporal | US3-1 |
| `/admin` | Resumen: solicitudes nuevas, total por semana (últimas 12) y por origen | US3-5, FR-020 |
| `/admin/solicitudes` | Lista paginada (25) con filtros `estado`, `tipo`, `origen` en la URL; más recientes primero | US3-2, FR-018 |
| `/admin/solicitudes/<id>` | Detalle, botones «WhatsApp» (`https://wa.me/<teléfono sin +>`) y «Correo» (`mailto:`), cambiar estado | US3-3, US3-4, FR-019 |
| `/admin/productos` | Lista con orden, visibilidad y destacado; arrastrar o flechas para ordenar | US4, FR-021 |
| `/admin/productos/nuevo`, `/admin/productos/<id>` | Formulario de producto y gestor de fotos (subir, ordenar, texto alternativo, borrar) | US4 |
| `/admin/categorias` | Crear, renombrar, ordenar y borrar (si está vacía) | US4 |
| `/admin/contenido` | Lista de secciones de la historia | US5, FR-022 |
| `/admin/contenido/<key>` | Formulario de la sección generado desde su esquema, con vista previa del texto | US5 |
| `/admin/testimonios` | CRUD de testimonios | US5 |
| `/admin/negocio` | Contacto, redes (con marca «de prueba»), pagos, cobertura, entrega, datos legales | US5 |
| `/admin/cuenta` | Cambiar contraseña, cerrar sesión | Assumptions |

## Correo de aviso (FR-014)

- **Para**: `business_settings.email`. **Asunto**: `Nueva solicitud: <Tipo> — <Nombre> (<Ciudad>)`.
- **Cuerpo** (texto y HTML simple): tipo, producto (si hay), nombre, teléfono con enlace a
  WhatsApp, correo, negocio, ciudad y país, mensaje, origen y enlace
  `https://<dominio>/admin/solicitudes/<id>`.
- **Responder a**: correo del cliente si lo dejó.
- Fallo de envío → `notification_status = fallido`; el admin muestra la marca.
