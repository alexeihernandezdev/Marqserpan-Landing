# Quickstart: validar la landing y el admin

Guía para levantar el proyecto y comprobar de punta a punta que la funcionalidad cumple la
[spec](./spec.md). Detalles de datos en [data-model.md](./data-model.md) y de interfaces en
[contracts/](./contracts/).

## Requisitos previos

- Node.js 20.9 o superior y npm.
- Cuenta de Neon con una base de datos (rama `main`) y una rama `dev` para desarrollo.
- Cuenta de Cloudinary (cloud name, API key y secret).
- Cuenta de Resend creada con `distribuidoramaqserpan@hotmail.com` (ver
  [research.md R4](./research.md#r4-aviso-por-correo-de-cada-solicitud-fr-014--resuelve-todoproveedor_correo)).
- Proyecto en Vercel con la integración de Neon activada.

## Variables de entorno (`.env.local`, nunca en el repositorio)

| Variable | Uso |
|---|---|
| `DATABASE_URL` | Cadena de conexión de Neon (rama `dev` en local) |
| `SESSION_SECRET` | 32+ caracteres aleatorios; también sirve de sal para `ip_hash` |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Subida y borrado de fotos |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Construcción de URLs de imagen en el navegador |
| `RESEND_API_KEY`, `EMAIL_FROM` | Aviso de solicitudes (`onboarding@resend.dev` hasta tener dominio) |
| `NEXT_PUBLIC_SITE_URL` | URL base para enlaces del correo y metadatos |
| `SHOW_TEST_SOCIALS` | `true` en local y vistas previas; sin definir en producción |

Debe existir `.env.example` con estas claves y valores vacíos.

## Puesta en marcha

```bash
npm install
npm run db:migrate        # aplica las migraciones de drizzle/
npm run db:seed           # contenido del guion, contacto confirmado, redes de prueba, categorías
npm run admin:create -- --name "Rossibell" --email <correo>   # pide la contraseña
npm run dev
```

## Puertas de calidad (antes de unir a `main`)

```bash
npm run lint
npm run typecheck
npm run test              # Vitest
npm run test:e2e          # Playwright contra la rama de pruebas de Neon
npm run build
```

## Escenarios de validación

Cada escenario indica qué requisito prueba. Los marcados (e2e) deben estar cubiertos por
Playwright; el resto se revisa a mano en la vista previa de Vercel desde un teléfono.

### US1 — Pedir una cotización

1. **Primera pantalla (e2e, móvil 360 × 640)**: abrir `/`. Sin desplazarse se ven logo,
   titular, subtítulo, «Solicita tu cotización» y «Ver el catálogo» (FR-002).
2. **CTA siempre a mano**: desplazarse hasta `#en-juego`; la cabecera fija muestra el botón
   directo (FR-003).
3. **Envío correcto (e2e)**: abrir `/?utm_source=instagram&utm_medium=paid&utm_campaign=rebanadoras`,
   elegir «Repuesto», completar y enviar después de 3 s. Resultado: confirmación con enlace
   de WhatsApp; en `/admin/solicitudes` aparece con tipo «repuesto», origen `instagram` y
   campaña `rebanadoras` (US1-3, US1-4).
4. **Errores (e2e)**: enviar con el teléfono `abc` y el mensaje vacío. Resultado: errores
   junto a cada campo y el resto de lo escrito se conserva (US1-5).
5. **Doble toque (e2e)**: pulsar «Enviar» dos veces rápido. Resultado: una sola solicitud
   (Edge Case).
6. **Spam (e2e)**: rellenar el campo trampa por script. Resultado: confirmación visible y
   ninguna solicitud guardada. Enviar 6 veces seguidas: la sexta muestra el aviso de espera.
7. **Navegador de Instagram (e2e)**: repetir el paso 3 con el agente de usuario de Instagram
   y sin UTM. Resultado: funciona y el origen queda `instagram` (US1-6, FR-027).
8. **Correo**: con `RESEND_API_KEY` válido llega el aviso a
   distribuidoramaqserpan@hotmail.com con el enlace al admin. Con una clave inválida la
   solicitud se guarda igual y el admin la marca «aviso fallido» (FR-014, SC-004).
9. **Teléfono venezolano local**: enviar `0416-1234567`; en el admin el botón de WhatsApp
   abre `wa.me/584161234567`.

### US2 — Producto del catálogo

1. Cargar en el admin una rebanadora destacada con 2 fotos. En `/`, aparece en el catálogo
   antes que el resto (US2-1).
2. **(e2e)** Abrir su ficha desde el catálogo (se abre como ventana), pulsar «Solicitar
   cotización de este equipo»: el formulario muestra el producto y el tipo «equipo»; al
   enviar, la solicitud queda asociada (US2-2).
3. Abrir `/productos/<slug>` directamente: página completa, sin precio (US2-3).
4. Ocultar el producto en el admin y recargar `/`: ya no aparece; su URL da 404 (US2-4).

### US3 — Solicitudes en el admin

1. **(e2e)** Sin sesión, abrir `/admin/solicitudes`: redirige a `/admin/login` (US3-1).
2. **(e2e)** Seis contraseñas incorrectas seguidas: aparece el aviso de bloqueo.
3. Con sesión: la lista muestra tipo, nombre, fecha, estado y origen, lo más reciente
   arriba; filtrar por «nueva» (US3-2).
4. En el detalle, «WhatsApp» abre la conversación con el cliente; «Marcar como atendida»
   cambia el estado (US3-3, US3-4).
5. `/admin` muestra el total por semana y por origen (US3-5).

### US4 — Catálogo

1. **(e2e)** Crear un producto con nombre, categoría y una foto subida desde el teléfono;
   aparece en `/` en menos de 1 minuto (US4-1, FR-023).
2. Intentar publicarlo sin fotos: el admin lo impide con un mensaje claro.
3. Borrar un producto que tiene solicitudes: las solicitudes conservan el nombre (US4-3).

### US5 — Textos, contacto y redes

1. Cambiar el titular en `/admin/contenido/hero`; recargar `/`: se ve el nuevo (US5-1).
2. Vaciar el enlace de una red: desaparece del pie (US5-2).
3. Sin testimonios visibles, `#testimonios` no existe en la página (US5-3).
4. Con dirección y horario vacíos, no aparecen en contacto (US5-4).
5. En producción (`SHOW_TEST_SOCIALS` sin definir), las redes de prueba no se muestran.

### Rendimiento y accesibilidad

1. Lighthouse móvil en la vista previa: LCP ≤ 2,5 s, CLS ≤ 0,1; con perfil 3G lento, la
   primera pantalla completa en menos de 3 s (SC-003).
2. Recorrer la landing y el formulario solo con teclado y con lector de pantalla; axe sin
   errores de contraste (FR-028).
3. Prueba de 5 segundos con 5 personas del rubro (SC-001).
