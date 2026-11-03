/**
 * Catálogo inicial a partir del material del negocio (fotos y fichas técnicas de
 * Swedlinghaus, Magister y Fiorini). Sin precios (constitución, Principio I).
 * Las fotos están en ./images con el nombre <slug>-<n>.jpg, ya en 4:3.
 */

export type CatalogSeedCategory = { name: string; slug: string };

export type CatalogSeedProduct = {
  slug: string;
  name: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  isFeatured?: boolean;
  /** Texto alternativo de cada foto, en orden. */
  photos: string[];
};

export const CATALOG_CATEGORIES: CatalogSeedCategory[] = [
  { name: "Rebanadoras", slug: "rebanadoras" },
  { name: "Equipos de panadería", slug: "equipos-de-panaderia" },
  { name: "Equipos de cafetería", slug: "equipos-de-cafeteria" },
  { name: "Envasado", slug: "envasado" },
];

const VOLTAJE =
  "Pregúntanos por el voltaje: confirmamos la versión adecuada para la instalación eléctrica de tu local.";

export const CATALOG_PRODUCTS: CatalogSeedProduct[] = [
  // ── Rebanadoras Swedlinghaus ────────────────────────────────────────────────
  {
    slug: "rebanadora-swedlinghaus-af250-egr",
    name: "Rebanadora Swedlinghaus AF250 EGR",
    categorySlug: "rebanadoras",
    isFeatured: true,
    shortDescription:
      "Rebanadora por gravedad compacta con cuchilla de 250 mm, ideal para charcuterías con poco espacio. Funciona a 110 V.",
    description: `Cortadora por gravedad de la Serie Pro, diseñada para instalarse en espacios reducidos.

• Cuchilla de 250 mm forjada en acero templado
• Transmisión por correa
• Pomos en plástico
• Voltaje: 110 V / 60 Hz`,
    photos: ["Rebanadora Swedlinghaus AF250 EGR de aluminio con cuchilla de 250 mm"],
  },
  {
    slug: "rebanadora-swedlinghaus-af300-gr-pro",
    name: "Rebanadora Swedlinghaus AF300 GR Pro",
    categorySlug: "rebanadoras",
    isFeatured: true,
    shortDescription:
      "Rebanadora profesional por gravedad con cuchilla de 300 mm en acero 100Cr6 y cortes de 0 a 16 mm de grosor.",
    description: `Cortadora por gravedad profesional de la Serie Pro para el corte diario de embutidos y quesos.

• Cuchilla de 300 mm forjada en acero templado 100Cr6
• Transmisión por correa
• Grosor de corte regulable de 0 a 16 mm
• Controles con protección IP67
• Pomos en plástico o aluminio anodizado`,
    photos: ["Rebanadora Swedlinghaus AF300 GR de la Serie Pro"],
  },
  {
    slug: "rebanadora-swedlinghaus-af350-gr-pro",
    name: "Rebanadora Swedlinghaus AF350 GR Pro",
    categorySlug: "rebanadoras",
    isFeatured: true,
    shortDescription:
      "Rebanadora por gravedad de 350 mm para charcuterías con alto volumen: cuerpo de aluminio anodizado y afilador incorporado.",
    description: `Rebanadora profesional por gravedad, ideal para el corte de embutidos. Cuerpo fundido en aleación de aluminio anodizado.

• Cuchilla de 350 mm forjada en acero templado
• Transmisión por correa y motor de 0,37 kW con protección térmica
• Capacidad de corte: 300 × 260 mm (redondo: 260 mm)
• Grosor de corte de 0 a 16 mm
• Plato porta-producto de 315 × 280 mm con canales que reducen la fricción
• Carro sobre bujes autolubricados y sistema de desbloqueo del plato
• Afilador incorporado
• Peso: 42 kg

Opcionales: cuchilla dentada o teflonada, extractor de cuchilla, plano de apoyo más amplio en acero inoxidable.`,
    photos: ["Rebanadora Swedlinghaus AF350 GR de la Serie Pro"],
  },
  {
    slug: "rebanadora-swedlinghaus-af350-gr-top",
    name: "Rebanadora Swedlinghaus AF350 GR Top",
    categorySlug: "rebanadoras",
    isFeatured: true,
    shortDescription:
      "Rebanadora de la Serie Top con cuchilla italiana RASSPE y cortes de hasta 24 mm. Funciona a 110 V.",
    description: `Cortadora por gravedad de la Serie Top, pensada para supermercados y charcuterías de alto movimiento, con líneas redondeadas y nuevo diseño técnico.

• Cuchilla italiana RASSPE de 350 mm
• Transmisión por correa
• Apertura de corte de 0 a 24 mm
• Pomos y empuñadura en aluminio anodizado
• Controles con protección IP67
• Incluye kit de limpieza
• Voltaje: 110 V / 60 Hz

Accesorio opcional bajo pedido: superficie de apoyo más amplia.`,
    photos: ["Rebanadora Swedlinghaus AF350 GR Top con pomos azules"],
  },

  // ── Envasado Swedlinghaus ───────────────────────────────────────────────────
  {
    slug: "envolvedora-swedlinghaus-disp45",
    name: "Envolvedora con film Swedlinghaus DISP45",
    categorySlug: "envasado",
    shortDescription:
      "Dispensadora termoselladora para envolver bandejas con film de forma rápida e higiénica en charcuterías y carnicerías.",
    description: `Máquina para el envasado rápido e higiénico de alimentos, ideal para supermercados, carnicerías, charcuterías y tiendas de gastronomía.

• Bobina de film de hasta Ø 40 mm
• Corte del film por barra
• Superficie calefactora de 385 × 125 mm para sellar`,
    photos: ["Envolvedora Swedlinghaus DISP45 con bobina de film"],
  },

  // ── Cafeteras Magister ──────────────────────────────────────────────────────
  {
    slug: "cafetera-magister-delta-ms",
    name: "Máquina de café Magister Delta MS",
    categorySlug: "equipos-de-cafeteria",
    shortDescription:
      "Máquina de espresso semiautomática italiana de 2 o 3 grupos, robusta y sencilla de usar para cafeterías con mucho movimiento.",
    description: `Máquina semiautomática de erogación continua, fabricada en Italia por Magister.

• Carrocería en acero pulido y laterales de poliuretano con chasis de acero
• Bomba volumétrica incorporada
• Dos lanzas de vapor en acero inoxidable con protección antiquemaduras
• Salida de agua caliente en acero inoxidable
• Control de presión de la caldera por presostato
• Llenado automático de la caldera con control de nivel mínimo
• Interruptores antivandálicos iluminados

Versiones:
• 2 grupos: 830 × 535 × 500 mm, 4.500 W, 68 kg
• 3 grupos: 1.070 × 535 × 500 mm, 5.400 W, 88 kg
• Disponible en versión estándar, rebajada y High Group (580 mm de alto)

Opcionales: calientatazas eléctrico, versión de lujo con laterales pulidos a espejo, iluminación LED lateral.

${VOLTAJE}`,
    photos: [
      "Máquina de café Magister Delta MS de 2 grupos",
      "Máquina de café Magister Delta MS de 3 grupos",
      "Detalle del grupo y la lanza de vapor de la Magister Delta MS",
      "Vista lateral de la Magister Delta MS",
    ],
  },
  {
    slug: "cafetera-magister-delta-es",
    name: "Máquina de café Magister Delta ES (electrónica)",
    categorySlug: "equipos-de-cafeteria",
    shortDescription:
      "Espresso automática de 2 o 3 grupos con dosis programables, pantalla OLED y control electrónico de temperatura.",
    description: `Máquina automática con dosificación volumétrica: cada taza sale igual, la prepare quien la prepare.

• Dosis programables y botoneras de 6 teclas retroiluminadas
• Pantalla OLED: temperatura y nivel de la caldera, horarios de encendido y avisos de mantenimiento
• Control electrónico de la temperatura de la caldera, regulable desde el teclado
• Preinfusión electrónica desactivable
• Agua caliente dosificada por tiempo y mezclador de agua caliente
• Dos lanzas de vapor en acero inoxidable con protección antiquemaduras
• Luces LED en la zona de trabajo
• Fuente conmutada que soporta variaciones de voltaje

Versiones:
• 2 grupos: 830 × 535 × 500 mm, 4.500 W, 68 kg
• 3 grupos: 1.070 × 535 × 500 mm, 5.400 W, 88 kg
• Disponible en versión estándar, rebajada y High Group (580 mm de alto)

Opcionales: calientatazas eléctrico, lanza de vapor termostática EPS para espumar leche, versión de lujo, iluminación LED lateral.

${VOLTAJE}`,
    photos: [
      "Máquina de café Magister Delta ES de 3 grupos con laterales rojos",
      "Máquina de café Magister Delta ES de 3 grupos",
    ],
  },
  {
    slug: "cafetera-magister-k-xx",
    name: "Máquina de café Magister K-XX",
    categorySlug: "equipos-de-cafeteria",
    shortDescription:
      "Espresso profesional de 2 o 3 grupos en acero inoxidable, con temporizador de extracción y preinfusión.",
    description: `Máquina de espresso de la serie Kappa-XX, con grupos altos (tall cup) de serie para vasos grandes.

• Carrocería en acero inoxidable pulido
• Bomba volumétrica incorporada
• Una lanza de agua caliente y dos lanzas de vapor manuales
• Llenado automático electrónico con protección por falta de agua
• Temporizador de extracción (shot timer) y preinfusor
• Termostato de seguridad en la parte eléctrica

Versiones:
• 2 grupos: 795 × 535 × 500 mm, 4.500 W, 72 kg
• 3 grupos: 1.035 × 535 × 500 mm, caldera de 17 L, 5.400 W, 88 kg

Opcionales: calientatazas, kit de gas, lanzas Cool Touch, adaptador para monodosis, luces LED en la zona de trabajo.

${VOLTAJE}`,
    photos: [
      "Máquina de café Magister K-XX de 2 grupos",
      "Vista trasera de la Magister K-XX",
      "Vista lateral de la Magister K-XX",
    ],
  },
  {
    slug: "cafetera-magister-stilo-ms",
    name: "Máquina de café Magister Stilo MS",
    categorySlug: "equipos-de-cafeteria",
    shortDescription:
      "Espresso semiautomática de 1 a 4 grupos para empezar o crecer: acero inoxidable o pintada en colores.",
    description: `Línea Stilo de Magister, disponible desde 1 hasta 4 grupos para adaptarse al tamaño de tu negocio.

• Carrocería en acero inoxidable pulido o pintada
• Bomba volumétrica incorporada
• Nivel de agua automático electrónico de serie
• Salida de agua caliente con pulsador
• Termostato de seguridad en la parte eléctrica

Modelos:
• Stilo MS 60 (1 grupo): 415 × 535 × 500 mm, 1.600 W, 47 kg
• Stilo MS 70 (2 grupos compacta): 595 × 535 × 500 mm, caldera de 4,9 L, 2.700 W, 60 kg
• Stilo MS 100 (2 grupos): 795 × 535 × 500 mm, caldera de 11 L, 2.700/4.500 W, 68 kg
• Stilo MS 100 (3 grupos): 1.035 × 535 × 500 mm, caldera de 17 L, 4.500/5.400 W, 83 kg

Opcionales: infusor en el grupo, calientatazas, mezclador de agua caliente, kit de gas (MS 100), versión rebajada para vasos de 135 mm, capuchinador.

${VOLTAJE}`,
    photos: [
      "Máquina de café Magister Stilo MS de 2 grupos",
      "Máquina de café Magister Stilo MS de 1 grupo",
      "Máquina de café Magister Stilo MS de 2 grupos en color rojo",
    ],
  },
  {
    slug: "cafetera-magister-es40",
    name: "Máquina de café Magister ES40",
    categorySlug: "equipos-de-cafeteria",
    shortDescription:
      "Espresso semiprofesional de 1 grupo, compacta y en colores: para panaderías, oficinas o cafeterías pequeñas.",
    description: `Máquina semiprofesional de 1 grupo, con chasis de acero inoxidable y carrocería pintada en varios colores.

• Grupo Magister con calentamiento termosifónico
• Control electrónico de la temperatura de la caldera, regulable desde el teclado
• Botonera de 5 teclas y manómetro de la caldera de vapor
• Lanzas de agua y vapor en acero inoxidable
• Depósito de agua de 3 L con control de nivel (no requiere toma de agua)
• Versión tall cup para vasos altos
• Medidas: 250 × 430 × 350 mm · Peso: 18 kg
• Potencia: 1.450 W (versión de 115 V: 1.400 W)
• Voltaje: 220/240 V o 115 V monofásico`,
    photos: [
      "Máquina de café Magister ES40 de 1 grupo",
      "Magister ES40 en color negro",
      "Magister ES40 en color turquesa",
      "Magister ES40 en color amarillo",
    ],
  },
  {
    slug: "cafetera-superautomatica-magister-relax-r50",
    name: "Cafetera superautomática Magister Relax R50",
    categorySlug: "equipos-de-cafeteria",
    shortDescription:
      "Superautomática con pantalla táctil que muele y prepara cada bebida con un toque. Hasta 200 tazas al día.",
    description: `Cafetera superautomática: muele el grano y prepara la bebida al momento, sin necesidad de barista.

• Grupo de 45 mm con dosis variable de 8 a 14 g
• Sistema VARITHERM de calentamiento por inducción: ajusta la temperatura según la receta y reduce el consumo
• 3 contenedores de productos solubles de 1,7 L
• Altura útil para vasos de hasta 135 mm
• Producción de hasta 200 tazas al día
• Conexión a la red de agua
• Potencia: 3.000 W · 230 V, 50/60 Hz
• Medidas: 666 × 422 × 599 mm · Peso: 37,9 kg

Opcional: módulo de leche fresca con refrigerador.`,
    photos: ["Cafetera superautomática Magister Relax R50 con pantalla táctil"],
  },
  {
    slug: "cafetera-superautomatica-magister-relax-r150",
    name: "Cafetera superautomática Magister Relax R150",
    categorySlug: "equipos-de-cafeteria",
    shortDescription:
      "Superautomática para vasos altos, con salida de agua caliente y producción de 200 a 250 tazas diarias.",
    description: `Cafetera superautomática para negocios con flujo constante de clientes.

• Grupo de 45 mm con dosis variable de 8 a 14 g
• Sistema VARITHERM de calentamiento por inducción
• 3 contenedores de productos solubles de 1,7 L y salida de agua caliente
• Altura útil para vasos de hasta 165 mm
• Producción de 200 a 250 tazas al día
• Conexión a la red de agua
• Potencia: 3.000 W · 220-240 V, 50/60 Hz
• Medidas: 375 × 575 × 610 mm · Peso: 36,5 kg

Opcional: módulo de leche fresca con refrigerador.`,
    photos: ["Cafetera superautomática Magister Relax R150"],
  },
  {
    slug: "cafetera-superautomatica-magister-relax-r200",
    name: "Cafetera superautomática Magister Relax R200",
    categorySlug: "equipos-de-cafeteria",
    shortDescription:
      "Superautomática con sistema de leche fresca integrado para capuchinos y lattes con un solo toque.",
    description: `Cafetera superautomática con sistema de leche fresca "Flash Heater" integrado.

• Grupo de 45 mm con dosis variable de 8 a 14 g
• 3 contenedores de productos solubles de 1,7 L y salida de agua caliente
• Caldera de 800 cc y bomba rotativa
• Altura útil para vasos de hasta 193 mm
• Más de 120 bebidas al día
• Conexión a la red de agua
• Potencia: 2.860 W · 220-240 V, 50/60 Hz
• Medidas: 375 × 580 × 660 mm · Peso: 50 kg`,
    photos: ["Cafetera superautomática Magister Relax R200 en color negro"],
  },
  {
    slug: "molinos-de-cafe-magister",
    name: "Molinos de café Magister",
    categorySlug: "equipos-de-cafeteria",
    shortDescription:
      "Molinos profesionales con fresas de 50 a 83 mm: manuales, con temporizador, automáticos o electrónicos.",
    description: `Molinos de café para cafetería y para venta de café molido. Te ayudamos a elegir según cuántas tazas preparas al día.

• Serie MD, fresas de 58 mm: manual, con temporizador o electrónico
• Serie MD, fresas de 64 mm: manual, con temporizador, automático, electrónico o para venta de café molido
• Serie MD, fresas de 83 mm: manual, automático, electrónico o para venta de café molido
• Serie MMD8, fresas de 50 mm: manual, electrónico o electrónico con pantalla
• Serie M11, fresas de 58 mm: electrónico
• Serie M13, fresas de 64 mm con ajuste micrométrico: automático o instantáneo
• Serie M15, fresas de 83 mm: instantáneo

Voltajes: 110 V o 230 V monofásico, y 400 V trifásico en los modelos más grandes. Varios modelos cuentan con certificación ETL.`,
    photos: ["Molino de café Magister de la serie MD con tolva"],
  },

  // ── Hornos Fiorini ──────────────────────────────────────────────────────────
  {
    slug: "horno-rotativo-fiorini-small",
    name: "Horno rotativo Fiorini Small",
    categorySlug: "equipos-de-panaderia",
    shortDescription:
      "Horno rotativo italiano compacto para bandejas de 40 × 60 cm, a gas, gasoil, eléctrico o pellet.",
    description: `Horno rotativo muy versátil, se adapta a los productos y formas de trabajo más distintos. Fácil de manejar incluso por personal sin experiencia, con bajo consumo y larga vida útil.

• Fachada y paneles interiores y exteriores en acero inoxidable
• Campana con extractor en acero inoxidable
• Versión a gas, gasoil o pellet (intercambiador en acero inoxidable refractario) o eléctrica (resistencias blindadas)
• Vaporizador de alta producción con electroválvula temporizada
• Puerta de doble vidrio con empaque de goma
• Panel electromecánico con termostato digital, temporizador de cocción con alarma y temporizador de vapor
• Doble termostato de seguridad

Datos técnicos:
• Medidas: 107 × 156 × 206 cm (247 cm con motores)
• Bandejas de 40 × 60, 45 × 65 cm o 18" × 26", de 10 a 18 niveles
• Eléctrico: 34,5 kW · Gas o gasoil: 40.000 kcal/h
• Peso: 1.000 kg
• Carro de cocción no incluido

Opcionales: panel computarizado "Easy Cooking" o "Easy Touch", variador de velocidad del ventilador (ideal para pastelería), plataforma giratoria.

${VOLTAJE}`,
    photos: ["Horno rotativo Fiorini Small en acero inoxidable"],
  },
  {
    slug: "horno-rotativo-fiorini-mini-rotor",
    name: "Horno rotativo Fiorini Mini Rotor",
    categorySlug: "equipos-de-panaderia",
    shortDescription:
      "Horno rotativo para panaderías medianas: acepta bandejas de 40 × 60 hasta 50 × 70 cm, a gas, gasoil, eléctrico o pellet.",
    description: `Horno rotativo muy versátil, se adapta a los productos y formas de trabajo más distintos. Fácil de manejar incluso por personal sin experiencia, con bajo consumo y larga vida útil.

• Fachada y paneles interiores y exteriores en acero inoxidable
• Campana con extractor en acero inoxidable
• Versión a gas, gasoil o pellet (intercambiador en acero inoxidable refractario) o eléctrica (resistencias blindadas)
• Vaporizador de alta producción con electroválvula temporizada
• Puerta de doble vidrio con empaque de goma
• Panel electromecánico con termostato digital, temporizador de cocción con alarma y temporizador de vapor
• Doble termostato de seguridad

Datos técnicos:
• Medidas: 133 × 188 × 220 cm (261 cm con motores)
• Bandejas de 40 × 60, 45 × 65, 40 × 80, 45 × 75, 50 × 70 cm o 18" × 26", de 10 a 18 niveles
• Eléctrico: 34,5 kW · Gas o gasoil: 45.000 kcal/h
• Peso: 1.400 kg
• Carro de cocción no incluido

Opcionales: panel computarizado "Easy Cooking" o "Easy Touch", variador de velocidad del ventilador (ideal para pastelería), plataforma giratoria.

${VOLTAJE}`,
    photos: ["Horno rotativo Fiorini Mini Rotor en acero inoxidable"],
  },
  {
    slug: "horno-rotativo-fiorini-rotor",
    name: "Horno rotativo Fiorini Rotor",
    categorySlug: "equipos-de-panaderia",
    shortDescription:
      "Horno rotativo de alta producción para bandejas de 60 × 80 cm, a gas, gasoil, eléctrico o pellet.",
    description: `Horno rotativo muy versátil, se adapta a los productos y formas de trabajo más distintos. Fácil de manejar incluso por personal sin experiencia, con bajo consumo y larga vida útil.

• Fachada y paneles interiores y exteriores en acero inoxidable
• Campana con extractor en acero inoxidable
• Versión a gas, gasoil o pellet (intercambiador en acero inoxidable refractario) o eléctrica (resistencias blindadas)
• Vaporizador de alta producción con electroválvula temporizada
• Puerta de doble vidrio con empaque de goma
• Panel electromecánico con termostato digital, temporizador de cocción con alarma y temporizador de vapor
• Doble termostato de seguridad

Datos técnicos:
• Medidas: 143 × 203 × 220 cm (261 cm con motores)
• Bandejas de 60 × 80 cm, de 10 a 18 niveles
• Eléctrico: 45,9 kW · Gas o gasoil: 60.000 kcal/h
• Peso: 1.600 kg
• Carro de cocción no incluido

Opcionales: panel computarizado "Easy Cooking" o "Easy Touch", variador de velocidad del ventilador (ideal para pastelería), plataforma giratoria.

${VOLTAJE}`,
    photos: ["Horno rotativo Fiorini Rotor de dos puertas en acero inoxidable"],
  },
  {
    slug: "horno-rotativo-fiorini-rotor-fr",
    name: "Horno rotativo Fiorini Rotor FR",
    categorySlug: "equipos-de-panaderia",
    shortDescription:
      "Horno rotativo para bandejas de 60 × 80 cm con el quemador al frente: queda libre por 3 lados, ideal para espacios estrechos.",
    description: `El Rotor FR lleva el intercambiador de calor en la parte frontal, así que deja libres tres lados del horno y se acomoda en obradores con poco espacio. Su sistema de recirculación de aire ahorra energía y cocina de forma pareja pan y pastelería.

• Fachada y paneles interiores y exteriores en acero inoxidable
• Campana con extractor en acero inoxidable
• Versión a gas o gasoil (intercambiador en acero inoxidable refractario) o eléctrica (resistencias blindadas), todo en la parte frontal
• Vaporizador de alta producción con electroválvula temporizada
• Puerta de doble vidrio con empaque de goma
• Panel electromecánico con termostato digital, temporizador de cocción con alarma y temporizador de vapor
• Doble termostato de seguridad
• Carro con plataforma inferior o gancho superior

Datos técnicos:
• Medidas: 170 × 151 × 230 cm (274 cm con motores)
• Bandejas de 60 × 80 cm, de 11 a 20 niveles
• Eléctrico: 52,2 kW · Gas o gasoil: 60.000 kcal/h
• Peso: 1.700 kg
• Carro de cocción no incluido

Opcionales: panel computarizado "Easy Cooking" o "Easy Touch", variador de velocidad del ventilador (ideal para pastelería).

${VOLTAJE}`,
    photos: ["Horno rotativo Fiorini Rotor FR en acero inoxidable"],
  },
];
