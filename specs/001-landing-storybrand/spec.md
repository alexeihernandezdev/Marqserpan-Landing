# Feature Specification: Landing StoryBrand de Distribuidora Maqserpan

**Feature Branch**: `001-landing-storybrand` (sin rama creada; se trabaja en `main`)

**Created**: 2026-11-01

**Status**: Draft

**Input**: User description: "quiero hacer una landing usando la skill de storybrand"

**Guion de marca**: [brandscript.md](./brandscript.md) — fuente del mensaje y de los textos
iniciales de cada sección.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Un dueño de panadería pide una cotización (Priority: P1)

Un dueño o encargado de panadería, cafetería o charcutería ve un anuncio en Instagram, entra
a la landing desde el teléfono y en 5 segundos entiende qué ofrece Maqserpan, cómo le ayuda
y qué tiene que hacer. Recorre la historia (problema, guía, plan, servicios, producto
destacado, lo que está en juego, éxito) y envía el formulario indicando si necesita un
equipo, un repuesto o servicio técnico. El negocio recibe la solicitud.

**Why this priority**: es el objetivo de la landing (conseguir clientes potenciales). Sin
esto el resto no tiene valor.

**Independent Test**: abrir la landing en un teléfono desde un enlace con parámetros UTM,
enviar el formulario y comprobar que la solicitud queda guardada con su tipo y su origen y
que llega un correo al negocio.

**Acceptance Scenarios**:

1. **Given** un visitante en la primera pantalla, **When** la mira sin desplazarse,
   **Then** ve el logo, un titular que dice qué ofrece Maqserpan, un subtítulo con los
   servicios, el botón «Solicita tu cotización» y el botón secundario «Ver el catálogo».
2. **Given** un visitante en cualquier sección, **When** busca cómo pedir una cotización,
   **Then** encuentra el botón de acción directa visible sin volver al inicio.
3. **Given** un visitante en el formulario, **When** elige el tipo «repuesto», completa los
   datos obligatorios y envía, **Then** ve una confirmación que le indica que el negocio le
   responderá, y la solicitud queda registrada con el tipo «repuesto».
4. **Given** un visitante que llegó desde un anuncio con parámetros UTM, **When** envía el
   formulario, **Then** la solicitud guarda esos parámetros y la página de entrada.
5. **Given** un visitante que deja un campo obligatorio vacío o un teléfono/correo con
   formato inválido, **When** envía, **Then** ve qué campo corregir sin perder lo escrito.
6. **Given** un visitante navegando desde el navegador interno de Instagram, **When** recorre
   la página y envía el formulario, **Then** todo funciona igual que en un navegador normal.

---

### User Story 2 - Un visitante pide un producto concreto del catálogo (Priority: P2)

El visitante ve las rebanadoras de charcutería destacadas y otros productos del catálogo,
abre la ficha de uno (fotos, descripción) y pulsa «Solicitar cotización de este equipo». El
formulario se abre con ese producto ya indicado.

**Why this priority**: las rebanadoras son el producto principal de la campaña; un pedido
con el producto ya identificado se cotiza más rápido.

**Independent Test**: con productos cargados, abrir la ficha de una rebanadora, pulsar el
botón de cotizar y comprobar que la solicitud enviada queda asociada a ese producto.

**Acceptance Scenarios**:

1. **Given** productos marcados como destacados, **When** el visitante llega a la sección
   siguiente a la primera pantalla (o antes), **Then** ve las rebanadoras de charcutería.
2. **Given** la ficha de un producto, **When** pulsa «Solicitar cotización de este equipo»,
   **Then** el formulario muestra el producto elegido y el tipo «equipo» preseleccionado.
3. **Given** un producto, **When** se muestra en el sitio, **Then** no aparece ningún precio.
4. **Given** un producto oculto desde el admin, **When** un visitante recorre el sitio,
   **Then** ese producto no aparece.

---

### User Story 3 - El negocio atiende las solicitudes desde el admin (Priority: P3)

Una persona del negocio entra al admin con su cuenta, ve las solicitudes nuevas ordenadas
por fecha, abre una para ver los datos del cliente y lo que pidió, lo contacta por WhatsApp
o correo y la marca como atendida. Además ve cuántas solicitudes llegaron por semana y de
qué origen.

**Why this priority**: las solicitudes ya llegan por correo desde la historia 1; el admin
permite darles seguimiento y medir qué anuncios funcionan.

**Independent Test**: con solicitudes de prueba de distintos orígenes, entrar al admin,
filtrar por estado, marcar una como atendida y comprobar el conteo semanal por origen.

**Acceptance Scenarios**:

1. **Given** una persona sin sesión, **When** intenta abrir cualquier página del admin,
   **Then** se le pide iniciar sesión y no ve ningún dato.
2. **Given** una persona con sesión, **When** abre el listado, **Then** ve las solicitudes
   con tipo, nombre, fecha, estado y origen, las más recientes primero.
3. **Given** una solicitud abierta, **When** pulsa el botón de WhatsApp del cliente,
   **Then** se abre una conversación con el número del cliente.
4. **Given** una solicitud nueva, **When** la marca como atendida, **Then** cambia su estado
   y deja de contarse como pendiente.
5. **Given** solicitudes de varias semanas, **When** abre el resumen, **Then** ve el total
   por semana y por origen.

---

### User Story 4 - El negocio actualiza el catálogo (Priority: P4)

Una persona del negocio crea, edita, oculta o elimina productos desde el admin: nombre,
categoría, descripción, fotos, si es destacado y el orden en que aparecen. Los cambios se
ven en la landing sin intervención técnica.

**Why this priority**: mantiene el catálogo vivo sin depender de un programador; la landing
puede salir con un catálogo inicial cargado.

**Independent Test**: crear un producto con dos fotos, marcarlo como destacado y verlo en la
landing; luego ocultarlo y comprobar que desaparece.

**Acceptance Scenarios**:

1. **Given** el formulario de producto, **When** se guarda con nombre, categoría y al menos
   una foto, **Then** aparece en la landing en su categoría.
2. **Given** una foto subida desde el teléfono, **When** se muestra en la landing,
   **Then** se ve nítida y carga rápido en conexiones lentas.
3. **Given** un producto con solicitudes asociadas, **When** se elimina, **Then** las
   solicitudes conservan el nombre del producto pedido.

---

### User Story 5 - El negocio edita los textos, el contacto y las redes (Priority: P5)

Una persona del negocio cambia desde el admin los textos de cada sección de la historia
(titular, subtítulo, problema, guía, plan, servicios, fracaso, éxito, testimonios), los
datos de contacto (WhatsApp, correo, dirección, horario), las redes sociales, los métodos de
pago y la cobertura de envíos.

**Why this priority**: la landing sale con los textos del guion de marca; editarlos después
es importante pero no bloquea el lanzamiento.

**Independent Test**: cambiar el titular y el enlace de Instagram desde el admin y ver los
cambios en la landing sin publicar una nueva versión.

**Acceptance Scenarios**:

1. **Given** un texto de sección, **When** se guarda un cambio, **Then** la landing muestra
   el texto nuevo.
2. **Given** una red social sin enlace, **When** se muestra el pie de página, **Then** esa
   red no aparece.
3. **Given** la sección de testimonios sin testimonios cargados, **When** se muestra la
   landing, **Then** la sección no aparece.
4. **Given** el campo dirección u horario vacío, **When** se muestra la sección de
   contacto, **Then** ese dato no aparece (sin textos de relleno).

---

### Edge Cases

- El correo de aviso al negocio falla: la solicitud queda guardada igual y aparece en el
  admin.
- Un bot envía el formulario repetidas veces: los envíos sospechosos se descartan y los
  envíos excesivos desde un mismo origen se limitan, sin bloquear a visitantes reales.
- Un visitante envía el formulario dos veces seguidas por doble toque: se registra una sola
  solicitud.
- El visitante pierde la conexión al enviar: ve un mensaje claro y puede reintentar sin
  volver a escribir.
- No hay productos destacados o el catálogo está vacío: la sección del producto destacado y
  el catálogo se ocultan y la historia sigue teniendo sentido.
- El visitante llega sin parámetros UTM: el origen se guarda como «directo» o con el sitio
  de referencia si existe.
- Un cliente internacional (Colombia, Brasil, Curaçao) escribe su teléfono con su código de
  país: se acepta.
- Un producto se oculta mientras un visitante tiene su ficha abierta: la solicitud se envía
  igual y conserva el nombre del producto.

## Requirements *(mandatory)*

### Functional Requirements

**Mensaje y estructura (StoryBrand SB7)**

- **FR-001**: La landing MUST seguir el orden de la historia del guion de marca: primera
  pantalla (oferta + CTA directo + CTA transicional), problema, guía (empatía y autoridad),
  plan de 3 pasos, líneas de servicio, producto destacado y catálogo, lo que está en juego
  (fracaso), éxito, testimonios, formulario, y pie con contacto, cobertura y pagos.
- **FR-002**: La primera pantalla MUST mostrar el logo, un titular que diga qué ofrece el
  negocio, un subtítulo con sus servicios, el botón directo «Solicita tu cotización» y el
  botón transicional, todo visible sin desplazarse en un teléfono de 360 × 640 px.
- **FR-003**: El botón directo MUST aparecer en la cabecera fija, en la primera pantalla y
  al final de cada bloque de la historia, siempre con el mismo texto y el mismo color.
- **FR-004**: El CTA transicional MUST ser «Ver el catálogo», llevar a la sección de
  productos y verse menos destacado que el directo. Si el catálogo está vacío, el botón
  transicional se oculta.
- **FR-005**: La sección de lo que está en juego MUST tener como máximo 3 consecuencias,
  sin tono alarmista.
- **FR-006**: La sección de servicios MUST presentar las cinco líneas de negocio bajo un
  mensaje paraguas: venta y distribución; fabricación a la medida (equipos y repuestos);
  importación; servicio técnico; traslado e instalación.
- **FR-007**: El sitio MUST NOT mostrar precios ni plazos fijos; MUST indicar que cada
  pedido se cotiza con su precio y su plazo.
- **FR-008**: El sitio MUST mostrar las condiciones de entrega confirmadas: equipos pequeños
  que solo se enchufan, entregados sin costo dentro de la ciudad; con disponibilidad
  inmediata, instalación al día siguiente; fuera de la ciudad, traslado e instalación con
  costo adicional.
- **FR-009**: El sitio MUST mostrar la cobertura de envíos (Venezuela, Colombia, Brasil,
  Curaçao) y los métodos de pago como información (transferencia en moneda nacional,
  efectivo en moneda internacional, Banesco Panamá, Binance).
- **FR-010**: El WhatsApp del negocio MUST mostrarse solo en la sección de contacto, en el
  pie de página y en la confirmación del formulario. No hay botón flotante de WhatsApp, para
  que el formulario siga siendo la acción principal y cada solicitud quede medida.

**Formulario y solicitudes**

- **FR-011**: El formulario MUST pedir: tipo de solicitud (equipo, repuesto, servicio
  técnico), nombre, teléfono/WhatsApp, ciudad y país, y una descripción de lo que necesita.
  Correo y nombre del negocio son opcionales.
- **FR-012**: El formulario MUST validar los datos y mostrar el error junto al campo, sin
  borrar lo escrito.
- **FR-013**: Cada solicitud MUST guardarse con fecha, tipo, datos del cliente, producto
  asociado (si lo hay), parámetros UTM, página de entrada, sitio de referencia y estado.
- **FR-014**: Cada solicitud nueva MUST enviar un correo de aviso al negocio con el resumen
  y un enlace a la solicitud en el admin. Si el aviso falla, la solicitud MUST quedar
  guardada.
- **FR-015**: El formulario MUST tener protección contra spam y contra envíos duplicados.
- **FR-016**: Tras enviar, el visitante MUST ver una confirmación que le diga que el negocio
  le contactará y le ofrezca escribir por WhatsApp si es urgente.

**Admin**

- **FR-017**: El admin MUST exigir inicio de sesión con usuario y contraseña; no hay
  registro público. Todas las cuentas tienen el mismo acceso.
- **FR-018**: El admin MUST listar las solicitudes con filtros por estado (nueva,
  atendida), tipo y origen, y permitir cambiar el estado.
- **FR-019**: El detalle de una solicitud MUST ofrecer contactar al cliente por WhatsApp y
  por correo (si lo dejó) con un clic.
- **FR-020**: El admin MUST mostrar el número de solicitudes por semana y por origen.
- **FR-021**: El admin MUST permitir crear, editar, ocultar, ordenar y eliminar productos
  con nombre, categoría, descripción, una o más fotos y la marca de destacado.
- **FR-022**: El admin MUST permitir editar los textos de cada sección de la historia, los
  testimonios, el contacto, las redes sociales, los métodos de pago y la cobertura.
- **FR-023**: Los cambios hechos en el admin MUST verse en la landing en menos de 1 minuto,
  sin publicar una nueva versión.
- **FR-024**: Una sección o dato vacío (testimonios, dirección, horario, una red social)
  MUST ocultarse en la landing en lugar de mostrar texto de relleno.

**Contenido inicial**

- **FR-025**: La landing MUST salir con los textos del guion de marca ([brandscript.md](./brandscript.md)),
  el contacto confirmado (WhatsApp +58 416-6873369, distribuidoramaqserpan@hotmail.com,
  Instagram @distribuidora_maqserpan) y redes de prueba ocultas en producción hasta tener
  enlaces reales.
- **FR-026**: La landing MUST usar el logo, los colores y las tipografías definidos en la
  constitución (Archivo Black para títulos, Helvetica para textos).

**Medición y acceso**

- **FR-027**: El sitio MUST funcionar en el navegador interno de Instagram y Facebook.
- **FR-028**: Todo texto MUST cumplir contraste AA y todos los controles MUST poder usarse
  con teclado y lector de pantalla.

### Key Entities

- **Solicitud**: pedido de un visitante. Tipo (equipo, repuesto, servicio técnico), nombre,
  teléfono/WhatsApp, correo opcional, negocio opcional, ciudad, país, descripción, producto
  asociado (opcional, con el nombre guardado), origen (UTM, página de entrada, referencia),
  fecha y estado (nueva, atendida).
- **Producto**: equipo del catálogo. Nombre, categoría, descripción, fotos ordenadas,
  destacado sí/no, visible sí/no, orden.
- **Categoría**: agrupa productos (ej. rebanadoras, hornos, amasadoras). Nombre y orden.
- **Contenido de sección**: textos editables de cada bloque de la historia (titular,
  subtítulo, cuerpo, elementos de lista).
- **Testimonio**: cita, nombre y negocio del cliente, ciudad, visible sí/no.
- **Datos del negocio**: WhatsApp, correo, dirección, horario, redes sociales, métodos de
  pago, cobertura.
- **Usuario del admin**: nombre, correo de acceso y contraseña. Sin roles.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En una prueba de 5 segundos con 5 personas del rubro, al menos 4 responden
  correctamente qué ofrece Maqserpan, cómo les ayuda y cómo pedir una cotización.
- **SC-002**: Un visitante completa y envía el formulario en menos de 2 minutos desde el
  teléfono.
- **SC-003**: La primera pantalla se ve completa en menos de 3 segundos en una conexión
  móvil lenta (3G).
- **SC-004**: El 100 % de las solicitudes enviadas aparece en el admin, aunque falle el
  correo de aviso.
- **SC-005**: El negocio puede identificar qué anuncio o canal generó cada solicitud en el
  100 % de los envíos que llegan con parámetros UTM.
- **SC-006**: Una persona del negocio sin conocimientos técnicos carga un producto con fotos
  en menos de 5 minutos.
- **SC-007**: El negocio responde a las solicitudes nuevas sin depender de revisar su correo
  personal: todas quedan visibles como «nuevas» hasta que se atienden.

## Clarifications

### Session 2026-11-01

- Q: ¿Qué ofrece el CTA transicional? → A: «Ver el catálogo» (lleva a la sección de
  productos; no captura datos).
- Q: ¿Cómo se muestra el WhatsApp? → A: Solo en contacto, pie de página y confirmación del
  formulario; sin botón flotante.
- Q: ¿La especificación incluye el admin? → A: Sí, landing y admin juntos, con historias
  priorizadas.

## Assumptions

- El alcance incluye la landing pública y el admin (historias 3 a 5), confirmado por el
  negocio. Las historias están priorizadas para poder lanzar por partes.
- La landing es una sola página con fichas de producto que se abren sin perder el lugar en
  la página; no hay páginas por categoría en esta versión.
- No hay testimonios confirmados al lanzar; la sección queda oculta hasta cargarlos.
- No se usan imágenes de stock engañosas: las fotos de productos las sube el negocio; para
  las secciones de la historia se usan fotos reales del negocio cuando las haya o
  ilustraciones neutras.
- La dirección exacta y el horario se dejan vacíos hasta que el negocio los confirme.
- No hay meta numérica de solicitudes; el éxito se sigue con el conteo semanal por origen.
- Las cuentas del admin las crea el equipo técnico al lanzar; cambiar la contraseña desde el
  admin entra en el alcance, recuperar la contraseña por correo no.
- Las solicitudes se conservan indefinidamente salvo que el negocio las elimine.
