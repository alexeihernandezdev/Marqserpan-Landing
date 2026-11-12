# Manual del sitio web — Distribuidora Maqserpan

Este documento explica cómo funciona tu sitio web, qué partes tiene, cómo se conectan entre sí y
cómo cambiar cada una. Está pensado para que puedas administrarlo tú misma, sin conocimientos
técnicos. Al final hay un apéndice técnico para el desarrollador que lo mantenga.

---

## Índice

1. [Resumen: qué tienes](#1-resumen-qué-tienes)
2. [Cómo se conecta todo](#2-cómo-se-conecta-todo)
3. [La página principal, sección por sección](#3-la-página-principal-sección-por-sección)
4. [Catálogo y fichas de producto](#4-catálogo-y-fichas-de-producto)
5. [El formulario de cotización: qué pasa cuando alguien escribe](#5-el-formulario-de-cotización-qué-pasa-cuando-alguien-escribe)
6. [El panel de administración](#6-el-panel-de-administración)
7. [Tareas frecuentes paso a paso](#7-tareas-frecuentes-paso-a-paso)
8. [Qué se cambia desde el panel y qué necesita al desarrollador](#8-qué-se-cambia-desde-el-panel-y-qué-necesita-al-desarrollador)
9. [Buenas prácticas](#9-buenas-prácticas)
10. [Preguntas frecuentes y solución de problemas](#10-preguntas-frecuentes-y-solución-de-problemas)
11. [Apéndice técnico (para el desarrollador)](#11-apéndice-técnico-para-el-desarrollador)

---

## 1. Resumen: qué tienes

Tu sitio tiene dos partes:


| Parte                       | Dirección             | Para quién     | Qué hace                                                                                         |
| --------------------------- | --------------------- | -------------- | ------------------------------------------------------------------------------------------------ |
| **Sitio público**           | `maqserpan.com`       | Tus clientes   | Presenta el negocio, muestra el catálogo y recibe solicitudes de cotización.                     |
| **Panel de administración** | `maqserpan.com/admin` | Tú y tu equipo | Ver y atender las solicitudes, cargar productos, editar textos, testimonios y datos del negocio. |


Todo lo que cambias en el panel **se ve en el sitio público en segundos**, sin tener que llamar a
nadie ni volver a publicar el sitio.

El sitio público tiene tres tipos de páginas:

- **Página principal** (`/`): cuenta la historia del negocio y termina en el formulario de cotización.
- **Catálogo** (`/catalogo`): todos los productos visibles, con filtros por marca y categoría.
- **Ficha de producto** (`/productos/nombre-del-producto`): fotos, descripción y un botón para pedir cotización de ese equipo.

---

## 2. Cómo se conecta todo

```
                   ┌──────────────────────────────┐
                   │   PANEL DE ADMINISTRACIÓN    │
                   │        maqserpan.com/admin   │
                   │  (tú editas textos, productos│
                   │   testimonios y datos)       │
                   └──────────────┬───────────────┘
                                  │ guarda
                                  ▼
 ┌──────────────┐        ┌──────────────────┐        ┌───────────────────┐
 │  CLOUDINARY  │◄──────►│  BASE DE DATOS   │◄──────►│   SITIO PÚBLICO   │
 │ (fotos de    │ fotos  │  (Neon)          │ lee    │  maqserpan.com    │
 │  productos)  │        │  textos, produc- │        │  lo que ven tus   │
 └──────────────┘        │  tos, solicitudes│        │  clientes         │
                         └────────┬─────────┘        └─────────┬─────────┘
                                  ▲                            │
                                  │ guarda la solicitud        │ cliente llena
                                  └────────────────────────────┘ el formulario
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  RESEND (correo) │──► te llega un correo con la
                         └──────────────────┘    solicitud y botón de WhatsApp
```

Los servicios que usa el sitio:


| Servicio                 | Para qué sirve                                                                                                         |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| **Vercel**               | Es donde "vive" el sitio y lo publica en internet.                                                                     |
| **Neon** (base de datos) | Guarda todo: textos, productos, categorías, testimonios, datos del negocio, solicitudes y usuarios del panel.          |
| **Cloudinary**           | Guarda las fotos de los productos y de las restauraciones, y las entrega optimizadas para cada teléfono o computadora. |
| **Resend**               | Envía el correo de aviso cuando llega una solicitud y el correo para recuperar la contraseña.                          |


**Cómo viaja un cambio:** cuando guardas algo en el panel, se escribe en la base de datos y el
sitio público se actualiza automáticamente. Si una foto o texto no cambia de inmediato, recarga la
página (en el teléfono, cierra y vuelve a abrir la pestaña).

---

## 3. La página principal, sección por sección

La página principal está ordenada como una historia: el cliente tiene un problema, Maqserpan es
quien lo guía, le muestra el plan y lo invita a pedir su cotización. Estas son las secciones en el
orden en que aparecen, y **dónde se cambia cada una**.

> En el panel, *Contenido* lista las secciones con el mismo nombre que verás abajo entre corchetes.

### Cabecera (barra superior fija)

- Logo, enlace **Inicio**, enlace al **Catálogo** y el botón principal (por ejemplo «Solicita tu cotización»).
- **Se cambia en:** *Contenido → [Primera pantalla]*. El texto del botón principal es el campo
«Botón principal» y el del catálogo es «Botón secundario».
- El enlace al catálogo solo aparece si hay al menos un producto visible.

### 1. Primera pantalla — [Primera pantalla]

Lo primero que ve el visitante, sobre la foto del logo iluminado de la tienda.


| Lo que ves                                                 | Campo en el panel                                                                              |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Sello verde «Respaldo garantizado · 22 años en el mercado» | «Línea de confianza» (si la dejas vacía, el sello no aparece)                                  |
| Titular grande                                             | «Titular» (máx. 60 caracteres)                                                                 |
| Texto bajo el titular                                      | «Subtítulo» (máx. 160)                                                                         |
| Botón amarillo principal                                   | «Botón principal» — **se repite en toda la página**, en la cabecera y al final de cada sección |
| Botón «Ver el catálogo»                                    | «Botón secundario»                                                                             |
| Pastillas con check bajo los botones                       | *Contenido → \[Plan de 3 pasos\] → Compromisos*                                                |


La **foto de fondo** es fija (ver sección 8).

### 2. El problema — [Problema]

«¿Tu equipo se paró?» con una lista numerada 01, 02, 03.

- **Título**, **Texto** y hasta **3 puntos**.

### 3. Quiénes somos — [Guía (empatía y autoridad)]

Una frase grande entre comillas y una tarjeta con la experiencia del negocio.


| Lo que ves                  | Campo                                                                                     |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| Frase grande entre comillas | «Frase de empatía»                                                                        |
| «**22** años equipando…»    | «Título». **Truco:** si el título empieza con un número, ese número se muestra en grande. |
| Lista con checks verdes     | «Puntos de autoridad» (hasta 5)                                                           |


Debajo aparece la banda **«Nuestro taller — Las manos detrás de cada equipo»** con fotos del equipo
desplazándose. Esas fotos son fijas (ver sección 8).

### 4. Marcas — (fija)

«Distribuimos equipos de marcas reconocidas» con los logos de Swedlinghaus, Magister, Forni
Fiorini y Pietroberto, junto a la tarjeta «Fabricación propia». **No se edita desde el panel**
(ver sección 8).

### 5. Servicios — [Servicios]

Tarjetas con ilustraciones sobre fondo oscuro.

- **Título**, **Introducción** y de **1 a 6 servicios** (cada uno con título y texto).
- Los dos primeros servicios salen más grandes.
- **El dibujo de cada tarjeta se elige solo según las palabras del título:**


| Si el título contiene…         | Dibujo    |
| ------------------------------ | --------- |
| venta, distribución            | Tienda    |
| fabricación                    | Fábrica   |
| importación                    | Barco     |
| técnico, reparación            | Llave     |
| traslado, instalación, entrega | Camión    |
| otra cosa                      | Engranaje |


### 6. Productos destacados — [Producto destacado]

Hasta 4 tarjetas de productos y el botón «Ver más productos».

- **Título** y **Texto** se cambian en *Contenido → [Producto destacado]*.
- **Qué productos salen:** los que marques como **Destacado** en *Productos*. Si no hay ninguno
marcado, se muestran los 3 primeros del catálogo. Si no hay productos visibles, la sección no aparece.

### 7. Restauraciones — (fija)

«Si tiene arreglo, lo dejamos como nuevo»: un mosaico de equipos restaurados en el taller cuyas
fotos alternan entre **Antes** y **Después**. **No se edita desde el panel** (ver sección 8).

### 8. Lo que está en juego — [Lo que está en juego]

Recuadro oscuro con equis rojas: lo que pierde el cliente si no actúa.

- **Título** y hasta **3 consecuencias**. Si no hay ninguna, la sección no aparece.

### 9. El resultado — [Éxito]

Lista de resultados con checks y una transformación «Antes → Con Maqserpan».

- **Título**, **Resultados** (entre 4 y 6) y **Transformación**.
- **Truco:** si la transformación sigue el molde «**De** algo **a** otra cosa» (por ejemplo «De
equipos que fallan a un negocio que no para»), se muestra en dos tarjetas: la de «Antes» tachada
y la de «Con Maqserpan» en color. Si no sigue ese molde, se muestra en un solo bloque.

### 10. Testimonios — [Testimonios] + *Testimonios*

«Lo que dicen nuestros clientes».

- **Título**, **Introducción** y **Datos destacados** (hasta 3 cifras, por ejemplo «22 — años en
el mercado») se cambian en *Contenido → [Testimonios]*.
- **Los testimonios en sí** se cargan en la página *Testimonios* del panel.
- Se muestran hasta **6** testimonios visibles. Si no hay ninguno visible, **toda la sección se oculta**.
- Cada testimonio muestra un círculo con las iniciales del cliente (o el logo del negocio, si el
desarrollador lo cargó).

### 11. Formulario de cotización — [Formulario de cotización] + [Plan de 3 pasos]

La sección final y la más importante: aquí llegan las solicitudes.


| Lo que ves                                                     | Dónde se cambia                                    |
| -------------------------------------------------------------- | -------------------------------------------------- |
| Título e introducción                                          | *Contenido → \[Formulario de cotización\]*         |
| Los 3 pasos numerados al lado (solo en computadora)            | *Contenido → \[Plan de 3 pasos\] → Pasos*          |
| Mensaje «¡Recibimos tu solicitud!» que ve el cliente al enviar | «Título de confirmación» y «Texto de confirmación» |
| Botón de WhatsApp en la confirmación                           | Número de WhatsApp en *Negocio*                    |


Las preguntas del formulario (nombre, teléfono, ciudad, etc.) son fijas.

### Pie de página — [Contacto] + *Negocio*


| Bloque                                             | Dónde se cambia                                                            |
| -------------------------------------------------- | -------------------------------------------------------------------------- |
| Logo blanco, «Contáctanos» y el texto de ubicación | *Contenido → \[Contacto\]*                                                 |
| WhatsApp, correo, dirección, horario               | *Negocio → Contacto* (si dirección u horario están vacíos, no se muestran) |
| Íconos de redes sociales                           | *Negocio → Redes sociales*                                                 |
| Envíos y entrega (lista)                           | *Negocio → Condiciones de entrega*                                         |
| Formas de pago (pastillas con ícono)               | *Negocio → Formas de pago*                                                 |
| © Razón social · RIF                               | *Negocio → Datos legales*                                                  |


El ícono de cada forma de pago se elige solo según la palabra: «Binance/USDT/cripto» → Binance,
«efectivo» → billetes, «transferencia/pago móvil» → transferencia, «banco/Banesco/Zelle» → banco;
cualquier otra → billetera.

---

## 4. Catálogo y fichas de producto

### Catálogo (`/catalogo`)

- Muestra todos los productos **visibles**: primero los destacados y luego agrupados por categoría.
- **Filtro por marca**: aparece solo si hay productos de más de una marca. Las marcas salen del
campo «Marca» de cada producto.
- **Índice de categorías**: enlaces para saltar a cada grupo. El orden de las categorías es el que
pongas en *Categorías*.

### Ficha de producto (`/productos/<enlace>`)

- Galería de fotos (la primera es la portada), categoría, marca, nombre, descripción corta,
descripción larga y la nota «Cotizamos cada pedido con su precio y su plazo».
- El botón **«Solicitar cotización de este equipo»** lleva al formulario de la página principal con
ese producto ya elegido. La solicitud te llega indicando el producto.
- Si abres un producto desde la página principal o el catálogo, la ficha se abre en una ventana
encima; si entras directo por el enlace (por ejemplo desde Instagram), se abre como página propia.

---

## 5. El formulario de cotización: qué pasa cuando alguien escribe

El formulario tiene **dos pasos**, para no perder al cliente aunque no termine:

1. **Paso 1 — «¿Cómo te contactamos?»**: nombre, teléfono/WhatsApp, ciudad, país y correo
 (opcional). Al pulsar **Continuar**, estos datos **ya quedan guardados** en el panel.
2. **Paso 2 — «¿Qué necesitas?»**: tipo (Equipo, Repuesto o Servicio técnico), mensaje y nombre del
 negocio (opcional). Al pulsar **Enviar solicitud** se completa.

Luego, automáticamente:

```
Cliente envía ──► Se guarda en el panel (Solicitudes, estado «Nueva»)
                  ├─► Te llega un correo con todos los datos y un botón «Escribir por WhatsApp»
                  └─► El cliente ve el mensaje de confirmación con tu WhatsApp
```

- **Si alguien solo hizo el paso 1**, la solicitud aparece con la etiqueta **«Solo contacto»**.
Escríbele: dejó sus datos pero no terminó.
- **El correo llega a** la dirección que pongas en *Negocio → Correo*.
- **Si el correo falla**, la solicitud **no se pierde**: queda en el panel con la etiqueta
**«Aviso fallido»**. Por eso conviene revisar el panel a diario aunque no lleguen correos.
- **Origen de la solicitud:** el sistema anota de dónde vino el cliente (Instagram, Facebook,
Google, «directo», o el nombre de la campaña si usas enlaces con UTM; ver sección 9). Así sabes
qué publicidad funciona.
- **Protección contra spam:** se bloquean envíos automáticos (robots) y más de 5 solicitudes desde
la misma conexión en 10 minutos.

Países disponibles en el formulario: Venezuela, Colombia, Brasil, Curaçao y «Otro país».

---

## 6. El panel de administración

### Entrar

1. Ve a `maqserpan.com/admin`.
2. Escribe tu correo y contraseña.
3. La sesión dura **7 días** (se renueva sola si entras seguido). Para salir, usa el botón de
 cerrar sesión.

- Tras **5 intentos fallidos en 15 minutos**, el acceso de ese correo se bloquea temporalmente.
- **¿Olvidaste tu contraseña?** En la pantalla de entrada, pulsa el enlace, escribe tu correo y te
llegará un enlace válido por **1 hora** y de un solo uso (máximo 3 pedidos por hora).

### Menú del panel


| Página          | Para qué sirve                                                                      |
| --------------- | ----------------------------------------------------------------------------------- |
| **Resumen**     | Cuántas solicitudes nuevas tienes y una tabla de las últimas 12 semanas por origen. |
| **Solicitudes** | La bandeja de entrada de cotizaciones.                                              |
| **Productos**   | Crear, editar, ordenar, publicar y destacar productos; subir fotos.                 |
| **Categorías**  | Crear, renombrar, ordenar y borrar categorías del catálogo.                         |
| **Contenido**   | Editar los textos de cada sección de la página principal.                           |
| **Testimonios** | Agregar, editar, ocultar y ordenar testimonios.                                     |
| **Negocio**     | WhatsApp, correo, dirección, horario, redes, pagos, entregas y datos legales.       |
| **Cuenta**      | Cambiar tu contraseña.                                                              |


### Resumen

- La tarjeta amarilla muestra las **solicitudes nuevas** (sin atender). Púlsala para ir directo a ellas.
- La tabla muestra cuántas solicitudes llegaron cada semana (lunes a domingo, hora de Venezuela) y
de qué origen. Úsala para medir tus campañas.

### Solicitudes

- **Lista** con fecha, nombre, tipo, ciudad, origen y estado; 25 por página.
- **Filtros** por estado (Nuevas / Atendidas), tipo y origen.
- Al abrir una solicitud ves el **mensaje**, los **datos** del cliente y el **origen** (campaña,
página de entrada, etc.).
- **Marcar como atendida** cuando ya respondiste (puedes volver a marcarla como nueva).
- **Borrar solicitud**: pide confirmación y es **permanente**.

### Productos

- **Nuevo producto**: botón arriba a la derecha.
- En la lista puedes, sin abrir el producto:
  - Activar/desactivar **Visible** (si se ve en el sitio).
  - Activar/desactivar **Destacado** (sale en la página principal y primero en el catálogo).
  - **Subir/bajar** con las flechas para cambiar el orden dentro de su categoría.
- Dentro del producto: **Ver en la landing** abre la ficha pública en otra pestaña.

Campos del producto:


| Campo                 | Notas                                                                                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Nombre                | Obligatorio, hasta 120 caracteres.                                                                                                                                                   |
| Categoría             | Obligatoria. Créala antes en *Categorías* si no existe.                                                                                                                              |
| Marca                 | Elige una de la lista o escribe una nueva. Sirve para el filtro del catálogo. **Escríbela siempre igual** («Magister», no a veces «magister sistema»), o saldrá como marca distinta. |
| Descripción corta     | Obligatoria, hasta 200. Se ve en la tarjeta del catálogo.                                                                                                                            |
| Descripción           | Opcional, hasta 5.000. Se ve en la ficha. Sin precios.                                                                                                                               |
| Enlace                | La parte final de la dirección (`/productos/rebanadora-300`). Si lo dejas vacío, se crea del nombre.                                                                                 |
| Visible en la landing | **Necesita al menos una foto.**                                                                                                                                                      |
| Destacado             | Aparece en la página principal y primero en el catálogo.                                                                                                                             |


Fotos del producto:

- Pulsa **Agregar fotos** (puedes subir varias). Formatos: JPG, PNG, WEBP o HEIC; **máximo 10 MB** cada una.
- La **primera foto es la portada** (lleva la etiqueta «Portada»). Cambia el orden con las flechas.
- Cada foto tiene una **descripción** (para buscadores y personas con discapacidad visual): escribe
qué se ve, por ejemplo «Rebanadora Swedlinghaus AF350 vista de frente».
- Si borras la última foto, el producto **se oculta automáticamente** del sitio.

### Categorías

- Escribe el nombre y pulsa agregar. Puedes renombrar, ordenar con flechas y borrar.
- El orden aquí es el orden de los grupos en el catálogo.
- **No se puede borrar una categoría que tenga productos.** Primero mueve esos productos a otra categoría.

### Contenido

- Lista las secciones de la página principal en su orden. Entra a una, cambia los textos y pulsa
**Guardar sección**.
- Cada campo muestra un **contador de caracteres** con su límite. Los límites existen para que el
diseño no se rompa en el teléfono.
- En las listas (puntos, servicios, pasos…) puedes **Agregar** y **Quitar** elementos dentro del
mínimo y máximo de cada una.
- Si escribes algo que parece un **precio** («$», «USD», «Bs», «dólares»…) o un **plazo fijo**
(«en 3 días», «5 días hábiles»…), aparece un aviso. No impide guardar, pero el sitio está pensado
para no publicar precios ni plazos.

Resumen de cada sección y sus límites:


| Sección                  | Campos                                                                                              |
| ------------------------ | --------------------------------------------------------------------------------------------------- |
| Primera pantalla         | Titular (60), Subtítulo (160), Botón principal (30), Botón secundario (30), Línea de confianza (60) |
| Problema                 | Título (60), Texto (280), Puntos (0–3, de 100)                                                      |
| Guía                     | Frase de empatía (120), Título (60), Puntos de autoridad (0–5, de 100)                              |
| Plan de 3 pasos          | Título (60)\*, Pasos (exactamente 3: título 40 / texto 140), Compromisos (0–3, de 140)              |
| Servicios                | Título (60), Introducción (200), Servicios (1–6: título 40 / texto 140)                             |
| Producto destacado       | Título (60), Texto (200)                                                                            |
| Lo que está en juego     | Título (60), Consecuencias (0–3, de 100)                                                            |
| Éxito                    | Título (60), Resultados (4–6, de 100), Transformación (140)                                         |
| Testimonios              | Título (60), Introducción (200), Datos destacados (0–3: cifra 12 / texto 40)                        |
| Formulario de cotización | Título (60), Introducción (200), Título de confirmación (60), Texto de confirmación (240)           |
| Contacto                 | Título (60), Texto (200)                                                                            |


\* El título del plan se guarda, pero en el diseño actual no se muestra: los **pasos** salen junto
al formulario y los **compromisos**, como pastillas en la primera pantalla.

### Testimonios

- **Nuevo testimonio** (abajo): Testimonio (lo que dijo el cliente, con sus palabras), Nombre del
cliente, Negocio y Ciudad (opcionales) y **Visible en la landing**.
- En los existentes puedes editar, ocultar (desactivando «Visible»), **ordenar** con flechas y **borrar**.
- Recuerda: solo se muestran los 6 primeros visibles.

### Negocio


| Grupo          | Campos                                                                                  | Dónde se ve                                                                                                                                                                  |
| -------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Contacto       | WhatsApp (formato internacional, ej. `+584166873369`), Correo, Dirección, Horario       | Pie de página. El **WhatsApp** también sale en la confirmación del formulario. El **Correo** es donde **llegan los avisos de solicitudes**.                                  |
| Redes sociales | Enlace de Instagram, Facebook, TikTok, YouTube y X, cada uno con la casilla «de prueba» | Íconos del pie de página. Deja el enlace vacío para ocultar una red. Las marcadas «de prueba» **no se ven** en el sitio publicado. Los enlaces deben empezar por `https://`. |
| Pagos y envíos | Formas de pago, Cobertura de envíos, Condiciones de entrega (una por línea)             | Formas de pago y condiciones de entrega en el pie de página.\*\*                                                                                                             |
| Datos legales  | Razón social, RIF                                                                       | Última línea del pie de página.                                                                                                                                              |


** La «Cobertura de envíos» se guarda, pero el diseño actual del pie muestra el texto fijo
«Enviamos a toda Venezuela». Si quieres que muestre la lista de países, pídeselo al desarrollador.

### Cuenta

- **Cambiar contraseña**: al cambiarla se cierran las demás sesiones abiertas (por ejemplo, en
otro teléfono).
- Para **agregar otro usuario** al panel, pídeselo al desarrollador (sección 11).

---

## 7. Tareas frecuentes paso a paso

### Atender una solicitud nueva

1. Abre el correo de aviso o entra a *Resumen* y pulsa la tarjeta amarilla.
2. Abre la solicitud y lee el mensaje.
3. Pulsa el teléfono o el botón de WhatsApp del correo para escribirle.
4. Vuelve al panel y pulsa **Marcar como atendida**.

### Publicar un producto nuevo

1. Si su categoría no existe, créala en *Categorías*.
2. *Productos → Nuevo producto*: nombre, categoría, marca y descripciones. Deja «Visible» apagado.
3. Pulsa **Guardar producto**.
4. Sube las fotos, ordénalas (la primera es la portada) y escribe la descripción de cada una.
5. Activa **Visible en la landing** (y **Destacado** si quieres que salga en la página principal).
6. Pulsa **Ver en la landing** para revisarlo.

### Ocultar un producto agotado sin borrarlo

En *Productos*, apaga el interruptor **Visible** de ese producto. Para volver a mostrarlo, enciéndelo.

### Cambiar qué productos salen en la página principal

En *Productos*, enciende **Destacado** en los que quieras (lo ideal son 4) y apágalo en los demás.

### Cambiar el número de WhatsApp o el correo de avisos

*Negocio → Contacto* → cambia el campo → **Guardar datos del negocio**. Aplica de inmediato al pie
de página, a la confirmación del formulario y a los avisos por correo.

### Agregar una red social real

*Negocio → Redes sociales* → pega el enlace (con `https://`) → **desmarca** «de prueba» → guarda.

### Cambiar el texto del botón principal

*Contenido → Primera pantalla → Botón principal*. Cambia en la cabecera y en todos los botones de la página.

### Agregar un testimonio

*Testimonios → Nuevo testimonio* → completa los datos → **Agregar testimonio**. Ordénalo con las flechas.

---

## 8. Qué se cambia desde el panel y qué necesita al desarrollador


| Elemento                                                                                                                     | Desde el panel | Necesita desarrollador |
| ---------------------------------------------------------------------------------------------------------------------------- | :--------------: | :----------------------: |
| Textos de las secciones de la historia                                                                                       | ✅              |                        |
| Texto de los botones                                                                                                         | ✅              |                        |
| Productos, fotos de productos, marcas, categorías                                                                            | ✅              |                        |
| Productos destacados                                                                                                         | ✅              |                        |
| Testimonios (texto, nombre, negocio, ciudad, orden, visibilidad)                                                             | ✅              |                        |
| WhatsApp, correo de avisos, dirección, horario, redes                                                                        | ✅              |                        |
| Formas de pago, condiciones de entrega, razón social, RIF                                                                    | ✅              |                        |
| Contraseña                                                                                                                   | ✅              |                        |
| Logo del negocio de un testimonio                                                                                            |                | ✅                      |
| Foto de fondo de la primera pantalla                                                                                         |                | ✅                      |
| Fotos del taller («Las manos detrás de cada equipo»)                                                                         |                | ✅                      |
| Sección de marcas (logos de fabricantes y texto «Fabricación propia»)                                                        |                | ✅                      |
| Restauraciones (fotos antes/después, nombres y descripción)                                                                  |                | ✅                      |
| Etiquetas pequeñas sobre los títulos («Quiénes somos», «Servicios», «Clientes»…)                                             |                | ✅                      |
| Preguntas del formulario y textos fijos («Todo en un solo lugar», «Enviamos a toda Venezuela», nota de la ficha de producto) |                | ✅                      |
| Título y descripción para Google y al compartir el enlace                                                                    |                | ✅                      |
| Colores, tipografías, logo y diseño                                                                                          |                | ✅                      |
| Nuevos usuarios del panel                                                                                                    |                | ✅                      |
| Dominio propio y correo `avisos@tudominio.com`                                                                               |                | ✅                      |


---

## 9. Buenas prácticas

- **Revisa el panel todos los días**, no solo el correo: así no se te escapa ninguna solicitud,
incluidas las de «Solo contacto» y las de «Aviso fallido».
- **Frases cortas.** Los límites de caracteres están pensados para el teléfono, que es desde donde
entra la mayoría de tus clientes (Instagram).
- **Revisa en el teléfono** después de cambiar textos.
- **No publiques precios ni plazos fijos.** Usa el formulario para cotizar caso por caso.
- **Fotos de productos:** fondo limpio, buena luz, el equipo completo y nítido. Horizontales o
cuadradas funcionan mejor.
- **No cambies el «Enlace» de un producto ya publicado** si ya lo compartiste: el enlace viejo
dejará de funcionar.
- **Mide tus campañas con enlaces UTM.** Si publicas un anuncio, agrega al enlace algo como
`?utm_source=instagram&utm_campaign=hornos-noviembre`. En *Resumen* y en cada solicitud verás de
qué campaña vino.
- **Testimonios reales**, con permiso del cliente y con sus palabras.
- **No compartas tu contraseña.** Si alguien más necesita entrar, pide que le creen su propio usuario.

---

## 10. Preguntas frecuentes y solución de problemas

**Cambié un texto y no lo veo en el sitio.**
Recarga la página. En el teléfono, cierra la pestaña y vuelve a abrir el enlace. Confirma que
pulsaste **Guardar** y que salió el mensaje de guardado.

**No me llegan los correos de solicitudes.**

1. Revisa la carpeta de correo no deseado.
2. Verifica el correo en *Negocio → Correo*.
3. Mientras no haya dominio propio configurado, el servicio de correo solo puede enviar a
 [**distribuidoramaqserpan@hotmail.com**](mailto:distribuidoramaqserpan@hotmail.com) (la dirección dueña de la cuenta de Resend). Si pones
 otro correo en *Negocio*, los avisos fallarán.
4. Las solicitudes siguen guardándose en el panel con la etiqueta «Aviso fallido».

**Un producto no aparece en el sitio.**
Revisa que tenga al menos una foto y que **Visible** esté encendido.

**No puedo encender «Visible» en un producto.**
Le falta al menos una foto.

**No puedo borrar una categoría.**
Tiene productos. Muévelos a otra categoría primero.

**La sección de testimonios desapareció.**
No hay ningún testimonio con «Visible» encendido.

**La sección «Lo que está en juego» desapareció.**
Quedó sin consecuencias en *Contenido*. Agrega al menos una.

**No aparece el filtro de marcas en el catálogo.**
Solo aparece cuando hay productos visibles de dos o más marcas.

**Una red social no aparece.**
Está vacía o marcada «de prueba».

**Olvidé mi contraseña.**  
En `maqserpan.com/admin`, pulsa «¿Olvidaste tu contraseña?». El enlace llega al correo del usuario  
y vale 1 hora. Mientras no haya dominio propio, solo llega si el usuario usa el correo dueño de la  
cuenta de Resend; si no, pide al desarrollador que la restablezca.

**El panel dice que hay demasiados intentos.**
Espera 15 minutos y vuelve a intentar.

**Un cliente dice que no pudo enviar el formulario.**
Puede haber superado el límite de 5 envíos en 10 minutos o tener mala conexión. El mensaje de error
le sugiere escribir por WhatsApp.

---

## 11. Apéndice técnico (para el desarrollador)

> Esta sección es de referencia para quien mantenga el sitio. El cliente no necesita leerla.
> Detalles completos de instalación y despliegue en [`README.md`](../README.md); especificación en
> [`specs/001-landing-storybrand/`](../specs/001-landing-storybrand/).

### Tecnología

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS 4 · PostgreSQL en
Neon con Drizzle ORM · Cloudinary · Resend · Vercel.

### Mapa del código


| Carpeta / archivo                                            | Qué contiene                                                                                                                                                            |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/(site)/`                                                | Sitio público: `page.tsx` (página principal y orden de secciones), `catalogo/`, `productos/[slug]/`, `@modal/` (ficha en ventana), `actions.ts` (envío del formulario). |
| `app/admin/`                                                 | Panel: `login/`, `recuperar/`, `restablecer/` y `(panel)/` con cada página del menú y sus `actions.ts`.                                                                 |
| `components/site/`                                           | Componentes públicos. `sections/` tiene una por sección de la historia.                                                                                                 |
| `components/admin/`                                          | Formularios y listas del panel.                                                                                                                                         |
| `lib/db/schema.ts`                                           | Tablas de la base de datos.                                                                                                                                             |
| `lib/content/defaults.ts`                                    | Textos y datos iniciales (los que carga `db:seed`).                                                                                                                     |
| `lib/content/editor-fields.ts` y `lib/validation/content.ts` | Campos editables de cada sección y sus límites.                                                                                                                         |
| `lib/content/queries.ts`, `lib/content/products.ts`          | Lecturas públicas con caché.                                                                                                                                            |
| `lib/leads/`, `lib/email/`                                   | Guardado de solicitudes, origen, límite de envíos y correo de aviso.                                                                                                    |
| `lib/auth/`                                                  | Sesiones, contraseñas (argon2), bloqueo por intentos y restablecimiento.                                                                                                |
| `proxy.ts`                                                   | Redirige `/admin/*` al login si no hay cookie de sesión.                                                                                                                |
| `scripts/`                                                   | Seed, carga del catálogo inicial, creación de usuarios y generación de recursos de marca.                                                                               |
| `drizzle/`                                                   | Migraciones SQL.                                                                                                                                                        |
| `public/`                                                    | Logo, logos de marcas (`brand/marcas/`), fotos del equipo/taller (`equipo/`), logos de clientes (`clientes/`).                                                          |
| `brand/`                                                     | Logos y fuentes originales.                                                                                                                                             |


### Tablas de la base de datos


| Tabla                                                                      | Contenido                                                                                                                                                                                                                           |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content_sections`                                                         | Una fila por sección (`hero`, `problem`, `guide`, `plan`, `services`, `featured`, `stakes`, `success`, `testimonials`, `quote_form`, `contact`), con sus textos en JSON. Si una fila es inválida, se usa el texto de `defaults.ts`. |
| `business_settings`                                                        | Fila única (id = 1) con contacto, redes, pagos, envíos y datos legales.                                                                                                                                                             |
| `categories`, `products`, `product_images`                                 | Catálogo. Las imágenes guardan el `public_id` de Cloudinary.                                                                                                                                                                        |
| `testimonials`                                                             | Testimonios; `logo` es una ruta en `/public` o un `public_id` de Cloudinary.                                                                                                                                                        |
| `leads`                                                                    | Solicitudes. `completed_at` nulo = solo paso 1. Guarda UTM, origen, URL de entrada, referencia y hash de IP (nunca la IP en claro).                                                                                                 |
| `admin_users`, `admin_sessions`, `login_attempts`, `password_reset_tokens` | Acceso al panel. Sesiones y tokens guardados como SHA-256.                                                                                                                                                                          |


### Caché y actualización

Las lecturas públicas usan `"use cache"` con etiquetas (`lib/tags.ts`: `content`, `products`,
`testimonials`, `settings`). Cada acción del panel llama a `updateTag(...)` con la etiqueta
correspondiente, por eso los cambios se ven al instante sin redesplegar.

### Cambios que piden código


| Cambio                              | Dónde                                                                                                                                                                        |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Foto de la primera pantalla         | `public/equipo/hero-logo.webp` (`components/site/Hero.tsx`)                                                                                                                  |
| Fotos del taller                    | `public/equipo/taller-*.webp` y la lista `PHOTOS` en `components/site/TeamCarousel.tsx`                                                                                      |
| Logos de marcas                     | `public/brand/marcas/` (alto 160 px, fondo transparente) y `SUPPLIERS` en `components/site/sections/Brands.tsx`                                                              |
| Restauraciones                      | Subir a Cloudinary en `maqserpan/restauraciones/<slug>-antes` y `<slug>-despues` (1200×1600) y agregar a `RESTORATIONS` en `components/site/sections/RestorationsMosaic.tsx` |
| Logo de un testimonio               | Archivo en `public/clientes/` y columna `testimonials.logo` (ver `scripts/seed-testimonials.ts`)                                                                             |
| Mostrar «Cobertura de envíos»       | `components/site/Footer.tsx` (hoy fijo: «Enviamos a toda Venezuela.»)                                                                                                        |
| Título/descripción SEO              | `app/layout.tsx` (`metadata`) y `app/opengraph-image.tsx`                                                                                                                    |
| Orden de secciones                  | `app/(site)/page.tsx`                                                                                                                                                        |
| Colores y fuentes                   | `app/globals.css`, `app/fonts/`; regenerar con `npm run brand:build`                                                                                                         |
| Nuevo campo editable en una sección | `lib/validation/content.ts` + `lib/content/editor-fields.ts` + el componente de la sección                                                                                   |


### Usuarios del panel

- **Primer usuario**: con `ADMIN_EMAIL` y `ADMIN_PASSWORD` en Vercel, cada despliegue lo crea si no
existe (no cambia la contraseña de uno existente).
- **Usuarios adicionales**: `npm run admin:create -- --name "Nombre" --email correo@ejemplo.com`
contra la `DATABASE_URL` de producción.

### Variables de entorno

`DATABASE_URL`, `SESSION_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
`CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `RESEND_API_KEY`, `EMAIL_FROM`,
`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`, `NEXT_PUBLIC_SITE_URL`. `SHOW_TEST_SOCIALS` **no**
se define en producción. Detalle en `README.md` y `.env.example`.

### Despliegue

Vercel ejecuta `npm run db:migrate && npm run admin:default && npm run build` (`vercel.json`): las
migraciones se aplican solas y, si fallan, no se publica. Cada rama tiene vista previa con su propia
rama de Neon.

### Correo con dominio propio

Mientras `EMAIL_FROM=onboarding@resend.dev`, Resend solo entrega a la dueña de la cuenta. Para
enviar a cualquier dirección: verificar el dominio en Resend, cambiar `EMAIL_FROM` a algo como
`avisos@<dominio>` y redesplegar.

### Seguridad

- `/admin` no se indexa (`X-Robots-Tag`, `robots.ts`) ni se puede mostrar dentro de otro sitio.
- Cada página y acción del panel verifica la sesión en el servidor (`verifySession()`).
- Las fotos solo se aceptan dentro de la carpeta del sitio en Cloudinary (`maqserpan/products` en
producción).