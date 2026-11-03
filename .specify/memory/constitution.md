<!--
Sync Impact Report
- Version change: 1.1.0 → 1.2.0 (MINOR: reglas de contenido ampliadas con datos confirmados,
  nueva regla de tráfico desde Instagram/Meta y cambio de la regla de tipografía).
- Principios modificados:
  - I. Fidelidad al negocio: se confirma que fabrican repuestos; los plazos se informan en
    cada cotización.
  - II. Todo conduce a la solicitud de cotización: medición por origen sin meta numérica.
  - V. Simple, rápido y móvil primero: debe funcionar en el navegador interno de Instagram.
- Secciones modificadas: Contexto del negocio (contacto, tráfico, repuestos), Identidad
  visual (Helvetica servida desde el sitio con los archivos del negocio).
- Secciones eliminadas: ninguna.
- TODOs resueltos: TODO(REPUESTOS_FABRICADOS), TODO(PLAZOS_A_PEDIDO), TODO(TRAFICO),
  TODO(META_LEADS) (no hay meta), TODO(DIFERENCIADOR) (descartado por el negocio).
- TODOs diferidos: TODO(DIRECCION_HORARIO), TODO(REDES_REALES), TODO(PROVEEDOR_CORREO).
-->

# Distribuidora Maqserpan — Landing Constitution

## Core Principles

### I. Fidelidad al negocio (contenido verificado)

- La landing MUST publicar solo hechos confirmados por el negocio (Rossibell u otra persona
  autorizada de Distribuidora Maqserpan). Lo que no esté confirmado no se publica, ni
  siquiera como texto de relleno en producción.
- Excepción: las redes sociales se cargan con valores de prueba para desarrollo y vistas
  previas. Antes de salir a producción MUST reemplazarse desde el admin por las reales; una
  red sin enlace real MUST ocultarse en lugar de mostrar un enlace de prueba.
- La landing MUST NOT mostrar precios, paquetes ni planes. Todo se cotiza caso por caso.
- La landing MUST NOT publicar plazos fijos de entrega. Los equipos y repuestos a pedido
  (fabricados o importados) se cotizan y el plazo se informa en cada cotización; eso sí
  puede decirse en el sitio.
- Las condiciones de entrega MUST publicarse tal como las define el negocio: entrega sin
  costo de equipos pequeños dentro de la ciudad que solo requieren enchufarse; traslado e
  instalación fuera de la ciudad con costo adicional.

**Razón**: el negocio cotiza cada pedido y la mayoría de los equipos se fabrican o importan
a pedido; una promesa no confirmada genera reclamos y pérdida de confianza.

### II. Todo conduce a la solicitud de cotización

- La acción principal del sitio es enviar el formulario de contacto. Cada sección MUST
  ofrecer un camino visible hacia él.
- El formulario MUST permitir elegir el tipo de solicitud: **equipo**, **repuesto** o
  **servicio técnico**, y MUST pedir solo los datos necesarios para cotizar y responder.
- Las rebanadoras de charcutería son el producto destacado: MUST aparecer en la primera
  pantalla o en la sección de productos inmediatamente siguiente.
- Desde la ficha de un producto, el formulario MUST llegar con ese producto ya indicado.
- No hay carrito ni pago en línea. Los métodos de pago (transferencia en moneda nacional,
  efectivo en moneda internacional, Banesco Panamá, Binance) se muestran solo como
  información.
- Cada solicitud MUST guardar su origen (parámetros UTM y página de entrada) para poder
  medir qué canal trae clientes. El admin MUST mostrar cuántas solicitudes llegan por semana
  y por origen. No hay una meta numérica definida.

**Razón**: el objetivo de la landing es conseguir clientes potenciales; cualquier elemento
que no ayude a enviar una solicitud compite con ese objetivo.

### III. Contenido administrable sin despliegues

- Los productos (nombre, descripción, categoría, fotos, si es destacado, si está visible),
  los textos editables de la landing, los datos de contacto (teléfono, WhatsApp, correo,
  dirección, horario) y las redes sociales MUST gestionarse desde el admin y guardarse en la
  base de datos.
- Un cambio de contenido MUST verse en el sitio público sin hacer un nuevo despliegue.
- El texto de negocio MUST NOT quedar escrito directamente en el código, salvo textos
  estructurales (etiquetas de formulario, mensajes de error, textos legales).
- El admin MUST mostrar las solicitudes recibidas con su tipo, fecha, estado de atención y
  origen, y MUST permitir marcarlas como atendidas.

**Razón**: el negocio debe poder actualizar su catálogo y sus textos sin depender de un
programador.

### IV. Seguridad y privacidad de las solicitudes

- Todas las rutas y acciones del admin MUST exigir autenticación y verificarse en el
  servidor, no solo en la interfaz.
- El admin lo usan pocas personas con el mismo nivel de acceso; no hay roles. Las cuentas
  las crea un administrador; no hay registro público.
- Los datos del formulario MUST validarse en el servidor y el formulario MUST tener
  protección contra spam (por ejemplo, campo trampa y límite de envíos).
- Los datos de los clientes MUST verse solo dentro del admin y MUST NOT exponerse en
  respuestas públicas, registros ni analítica.
- Las credenciales (Neon, Cloudinary, correo, sesión) MUST vivir en variables de entorno de
  Vercel y MUST NOT subirse al repositorio.

**Razón**: las solicitudes contienen datos personales y comerciales de clientes; una fuga o
un admin abierto daña directamente al negocio.

### V. Simple, rápido y móvil primero

- El sitio MUST diseñarse primero para teléfono y MUST funcionar bien con conexiones lentas
  e inestables, habituales en Venezuela.
- Las páginas públicas MUST cumplir Core Web Vitals en verde en móvil (LCP ≤ 2,5 s,
  INP ≤ 200 ms, CLS ≤ 0,1).
- Las imágenes MUST servirse optimizadas y con tamaño adecuado al dispositivo.
- Las visitas llegan desde Instagram y anuncios de Meta: el sitio y el formulario MUST
  funcionar en el navegador interno de Instagram/Facebook, y los enlaces de los anuncios
  MUST llevar parámetros UTM.
- El sitio está solo en español. No se añade otro idioma sin enmendar esta constitución.
- Se construye solo lo que pide una especificación aprobada; cada dependencia o servicio
  nuevo MUST justificarse en el plan.

**Razón**: la mayoría de los visitantes llegará desde el teléfono; un sitio lento o
complicado pierde solicitudes y es más caro de mantener.

## Contexto del negocio

**Nombre comercial**: Distribuidora Maqserpan. **Razón social**: Distribuidora Maqserpan C.A.
**RIF**: J-31113230-9. **Antigüedad**: 22 años. **Ubicación**: Los Pinos, Puerto Ordaz,
Venezuela. El nombre se escribe siempre "Maqserpan" (sin "r" después de la "a").

**Contacto confirmado** (valores iniciales; se editan desde el admin):

- WhatsApp: +58 416-6873369 (enlace `https://wa.me/584166873369`).
- Correo: distribuidoramaqserpan@hotmail.com.
- Instagram: @distribuidora_maqserpan (`https://www.instagram.com/distribuidora_maqserpan`).
  Los enlaces públicos MUST NOT llevar parámetros de rastreo como `?rpxt=`.

**Qué hacen**: especialistas en equipos y repuestos para panaderías, cafeterías y
restaurantes.

- Venden y distribuyen equipos y repuestos.
- Fabrican repuestos que no tienen en existencia (se cotizan con su plazo).
- Fabrican equipos a la medida.
- Consiguen equipos, incluso importándolos de otro país.
- Reparan equipos con servicio técnico especializado (cada caso se revisa por contacto
  directo).
- Trasladan, buscan e instalan los equipos.

**Cómo trabajan**: 1) el cliente cuenta qué necesita; 2) el negocio envía una cotización;
3) entregan e instalan. Con disponibilidad inmediata, la instalación se planifica para el
día siguiente.

**Cobertura de envíos**: toda Venezuela, Colombia, Brasil y Curaçao.

**Origen de las visitas**: Instagram y anuncios de Meta (Instagram/Facebook).

**Competidores de referencia**: Distribuidora Giorgio (distribuidoragiorgio.com) y Maqven
(@maqven2002 en Instagram).

### Datos pendientes de confirmar

Ninguno de estos datos se publica hasta que el negocio lo confirme:

- TODO(DIRECCION_HORARIO): dirección exacta y horario de atención.
- TODO(REDES_REALES): otras redes sociales además de Instagram (hoy van valores de prueba).

## Identidad visual

- **Logo**: los archivos originales están en `brand/logo/`.
  - `logo-color-transparente.png`: versión principal a color sobre fondo transparente.
  - `logo-color-borde-blanco.png`: a color con borde blanco, para fondos oscuros o fotos.
  - `logo-negro.png` y `logo-blanco-horizontal.png`: versiones de una tinta.
  - `logo-blanco-relieve.png`: blanco con sombra; no apto para fondos claros.
  - El sitio MUST usar versiones optimizadas generadas a partir de estos originales, nunca
    los PNG originales de gran tamaño. El logo MUST NOT deformarse ni recolorearse.
- **Colores de marca** (tomados del logo):
  - Amarillo `#FFD100` (engranajes), verde `#00942B` ("Distribuidora" y letras MSP),
    azul `#0093D3` ("MAQSERPAN"), gris `#616161` (textos secundarios).
  - Todo texto MUST cumplir contraste WCAG AA (4,5:1 en texto normal). El amarillo y el
    azul no alcanzan ese contraste como color de texto sobre blanco: se usan en fondos,
    acentos y textos grandes, no en párrafos.
- **Tipografía**:
  - Títulos: Archivo Black (licencia OFL, archivo en `brand/fonts/archivo-black/`).
  - Textos: Helvetica, servida desde el propio sitio con los archivos entregados por el
    negocio en `brand/fonts/helvetica/` (regular, light, bold y sus itálicas). Respaldo:
    `Arial, sans-serif`. Solo se cargan los pesos que el diseño use.
  - Helvetica es una fuente comercial y los archivos no traen licencia web; el negocio
    decidió usarlos y asume esa responsabilidad.

## Restricciones técnicas

- **Framework**: Next.js 16 (App Router), React 19, TypeScript y Tailwind CSS 4. Esta
  versión de Next.js tiene cambios incompatibles: antes de escribir código MUST consultarse
  la guía en `node_modules/next/dist/docs/` y respetar sus avisos de obsolescencia
  (ver `AGENTS.md`).
- **Base de datos**: PostgreSQL en Neon. Los cambios de esquema MUST hacerse con migraciones
  versionadas en el repositorio.
- **Hosting**: Vercel, con despliegues de vista previa por rama.
- **Imágenes de productos**: Cloudinary, subidas desde el admin.
- **Avisos de solicitudes**: cada solicitud se guarda en la base de datos y además envía un
  correo al negocio. Si el correo falla, la solicitud MUST quedar guardada igual.
  TODO(PROVEEDOR_CORREO): elegir el servicio de envío de correo en el plan.
- **Idioma**: solo español.

## Flujo de desarrollo y puertas de calidad

- Cada funcionalidad sigue el flujo de Spec Kit: especificación → plan → tareas →
  implementación. El plan MUST incluir una verificación contra esta constitución.
- Antes de unir cambios a `main`, MUST pasar: lint, verificación de tipos y `next build`.
- El envío del formulario, la protección del admin y la edición de productos MUST tener
  pruebas automatizadas, porque un fallo ahí hace perder clientes o expone datos.
- Cada cambio visible MUST revisarse en la vista previa de Vercel en un teléfono antes de
  publicarse.

## Governance

- Esta constitución prevalece sobre cualquier otra práctica del proyecto. Si una
  especificación o un plan la contradice, gana la constitución o se enmienda primero.
- Una enmienda MUST documentarse en este archivo con su informe de impacto, nueva versión y
  fecha. Los cambios en los hechos del negocio requieren confirmación del negocio.
- Versionado semántico: MAJOR al quitar o redefinir un principio; MINOR al añadir un
  principio o sección, o ampliar reglas de forma importante; PATCH para aclaraciones y
  correcciones de redacción.
- Al revisar cada plan y cada cambio se MUST comprobar el cumplimiento de los cinco
  principios. Toda excepción MUST justificarse por escrito en el plan.
- La guía de desarrollo en tiempo de ejecución está en `AGENTS.md`.

**Version**: 1.2.0 | **Ratified**: 2026-11-01 | **Last Amended**: 2026-11-01
