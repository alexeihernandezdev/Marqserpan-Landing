import type { BusinessSettingsInput } from "@/lib/validation/business";
import type { Sections } from "@/lib/validation/content";

// Contenido inicial de la landing. Sale de specs/001-landing-storybrand/brandscript.md y solo
// usa datos confirmados por el negocio (constitución, Principio I). Se edita después desde el admin.

export const DEFAULT_SECTIONS: Sections = {
  hero: {
    title: "Equipos y repuestos para que tu panadería nunca pare",
    subtitle:
      "Vendemos, fabricamos, importamos, reparamos e instalamos equipos para panaderías, cafeterías y charcuterías.",
    primaryCta: "Solicita tu cotización",
    secondaryCta: "Ver el catálogo",
    trustLine: "22 años en el mercado",
  },
  problem: {
    title: "¿Tu equipo se paró?",
    body: "Cuando una máquina se daña o un repuesto no se consigue, tu negocio deja de producir. Y cada día parado son ventas que no vuelven.",
    points: [
      "No encuentras el equipo o el repuesto que necesitas.",
      "No sabes quién puede reparar tu máquina.",
      "Un negocio no debería detenerse por un repuesto que no se consigue.",
    ],
  },
  guide: {
    empathy: "Sabemos lo que cuesta cada día con un equipo parado.",
    title: "22 años equipando panaderías y cafeterías",
    authorityPoints: [
      "Vendemos, fabricamos, importamos, reparamos e instalamos: todo en un solo lugar.",
      "Fabricamos los repuestos que no se consiguen.",
      "Servicio técnico especializado en equipos de panadería.",
      "Enviamos a toda Venezuela, Colombia, Brasil y Curaçao.",
    ],
  },
  plan: {
    title: "Tu equipo trabajando en 3 pasos",
    steps: [
      {
        title: "Cuéntanos qué necesitas",
        body: "Escríbenos por el equipo, el repuesto o la reparación que buscas.",
      },
      {
        title: "Recibe tu cotización",
        body: "Te enviamos el precio y el plazo de tu pedido.",
      },
      {
        title: "Lo entregamos e instalamos",
        body: "Llevamos el equipo y lo dejamos trabajando.",
      },
    ],
    agreement: [
      "Si no lo tenemos, lo fabricamos o lo importamos.",
      "Equipos pequeños: te los llevamos sin costo dentro de la ciudad.",
      "Con disponibilidad inmediata.",
    ],
  },
  services: {
    title: "Todo lo que tu negocio necesita",
    intro:
      "Equipos y repuestos para panaderías, cafeterías y charcuterías, de la cotización a la instalación.",
    items: [
      {
        title: "Venta y distribución",
        body: "Equipos y repuestos para panadería, cafetería y charcutería.",
      },
      {
        title: "Fabricación a la medida",
        body: "Fabricamos equipos a la medida de tu negocio y los repuestos que no se consiguen.",
      },
      {
        title: "Importación",
        body: "Conseguimos el equipo que necesitas, aunque haya que traerlo de otro país.",
      },
      {
        title: "Servicio técnico",
        body: "Revisamos y reparamos tus equipos. Cada caso se evalúa contigo.",
      },
      {
        title: "Traslado e instalación",
        body: "Llevamos, buscamos e instalamos tus equipos para que empiecen a trabajar.",
      },
    ],
  },
  featured: {
    title: "Nuestros productos más destacados",
    body: "Los equipos que más nos piden panaderías, cafeterías y charcuterías. Cuéntanos qué necesitas y te lo cotizamos.",
  },
  stakes: {
    title: "Cada día parado te cuesta",
    points: [
      "Pierdes ventas.",
      "Tus clientes se van a la competencia.",
      "Los arreglos improvisados vuelven a fallar.",
    ],
  },
  success: {
    title: "Tu negocio, sin paradas",
    points: [
      "El equipo correcto, instalado y trabajando.",
      "Vendes todos los días.",
      "Repuestos aunque no existan en el país.",
      "La tranquilidad de tener a quién llamar.",
    ],
    identity: "De equipos que fallan a un negocio que no para.",
  },
  testimonials: {
    title: "Lo que dicen nuestros clientes",
    intro: "Panaderías y supermercados confían en nosotros para que sus equipos no se detengan.",
    stats: [{ title: "22", body: "años en el mercado" }],
  },
  quote_form: {
    title: "Solicita tu cotización",
    intro: "Cuéntanos qué necesitas y te respondemos con el precio y el plazo.",
    successTitle: "¡Recibimos tu solicitud!",
    successBody:
      "Te contactaremos pronto por WhatsApp o correo con tu cotización. Si es urgente, escríbenos por WhatsApp.",
  },
  contact: {
    title: "Contáctanos",
    body: "Estamos en Los Pinos, Puerto Ordaz, Venezuela.",
  },
};

export const DEFAULT_BUSINESS_SETTINGS: BusinessSettingsInput = {
  whatsapp: "+584166873369",
  email: "distribuidoramaqserpan@hotmail.com",
  address: "",
  businessHours: "",
  socialLinks: [
    {
      network: "instagram",
      url: "https://www.instagram.com/distribuidora_maqserpan",
      isTest: false,
    },
    // Enlaces de prueba: solo se ven fuera de producción hasta tener los reales.
    { network: "facebook", url: "https://www.facebook.com/distribuidoramaqserpan", isTest: true },
    { network: "tiktok", url: "https://www.tiktok.com/@distribuidoramaqserpan", isTest: true },
  ],
  paymentMethods: [
    "Transferencia en moneda nacional",
    "Efectivo en moneda internacional",
    "Banesco Panamá",
    "Binance",
  ],
  shippingCoverage: ["Venezuela", "Colombia", "Brasil", "Curaçao"],
  deliveryTerms: [
    "Equipos pequeños que solo se enchufan: entrega sin costo dentro de la ciudad.",
    "Con disponibilidad inmediata, instalamos al día siguiente.",
    "Fuera de la ciudad: traslado e instalación con costo adicional.",
  ],
  legalName: "Distribuidora Maqserpan C.A.",
  rif: "J-31113230-9",
};

export const DEFAULT_CATEGORIES = [
  { name: "Rebanadoras", slug: "rebanadoras" },
  { name: "Equipos de panadería", slug: "equipos-de-panaderia" },
  { name: "Equipos de cafetería", slug: "equipos-de-cafeteria" },
  { name: "Repuestos", slug: "repuestos" },
];
