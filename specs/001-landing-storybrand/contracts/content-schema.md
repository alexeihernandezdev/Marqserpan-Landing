# Contrato: esquema del contenido editable

Cada fila de `content_sections` guarda un JSON que debe cumplir el esquema de su sección.
El admin genera el formulario desde este esquema y la landing oculta cualquier elemento
vacío (FR-024). Los valores iniciales salen de [brandscript.md](../brandscript.md).

Límites de longitud pensados para la regla de «pocas palabras» de StoryBrand y para que la
primera pantalla quepa en 360 × 640 px.

| Sección (`key`) | Campos | Límites | Valor inicial (resumen) |
|---|---|---|---|
| `hero` | `title`, `subtitle`, `primaryCta`, `secondaryCta`, `trustLine` | título ≤ 60, subtítulo ≤ 160, botones ≤ 30, trustLine ≤ 60 | «Equipos y repuestos para que tu panadería nunca pare» · subtítulo del guion · «Solicita tu cotización» · «Ver el catálogo» · «22 años en Puerto Ordaz» |
| `problem` | `title`, `body`, `points[]` (≤ 3) | título ≤ 60, cuerpo ≤ 280, punto ≤ 100 | Equipo parado: externo, interno y filosófico del guion |
| `guide` | `empathy`, `title`, `authorityPoints[]` (≤ 5) | empatía ≤ 120, punto ≤ 100 | «Sabemos lo que cuesta cada día con un equipo parado» + 22 años, todo en un lugar, fabricamos repuestos, envíos a 4 países |
| `plan` | `title`, `steps[3]` de `{ title, body }`, `agreement[]` (≤ 3) | título de paso ≤ 40, cuerpo ≤ 140 | «Tu equipo trabajando en 3 pasos» + los 3 pasos y el acuerdo |
| `services` | `title`, `intro`, `items[]` (5) de `{ title, body }` | ítem ≤ 40 / ≤ 140 | Venta y distribución · Fabricación a la medida · Importación · Servicio técnico · Traslado e instalación |
| `featured` | `title`, `body` | ≤ 60 / ≤ 200 | Rebanadoras de charcutería (los productos salen del catálogo marcados como destacados) |
| `stakes` | `title`, `points[]` (≤ 3) | punto ≤ 100 | Las 3 consecuencias del guion |
| `success` | `title`, `points[]` (4–6), `identity` | punto ≤ 100, identidad ≤ 140 | Resultados del guion + transformación «de… a…» |
| `testimonials` | `title` | ≤ 60 | «Lo que dicen nuestros clientes» (la sección se oculta sin testimonios) |
| `quote_form` | `title`, `intro`, `successTitle`, `successBody` | ≤ 60 / ≤ 200 / ≤ 60 / ≤ 240 | «Solicita tu cotización» · «Cuéntanos qué necesitas y te respondemos con precio y plazo» · confirmación con invitación a WhatsApp si es urgente |
| `contact` | `title`, `body` | ≤ 60 / ≤ 200 | Datos de contacto (los valores vienen de `business_settings`) |

Reglas:
- Ningún campo admite HTML; los saltos de línea se respetan.
- Ninguna sección puede contener precios ni plazos fijos: el admin advierte si detecta
  patrones como `$`, `Bs`, `USD` o «en X días» (aviso, no bloqueo).
- Textos estructurales (etiquetas de campos, errores de validación) viven en el código y no
  se editan desde el admin (constitución, Principio III).
