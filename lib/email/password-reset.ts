import "server-only";
import { Resend } from "resend";

type SendOptions = {
  from: string;
  apiKey: string;
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function buildPasswordResetEmail(name: string, resetUrl: string) {
  const subject = "Restablece tu contraseña del panel";

  const text = [
    `Hola, ${name}:`,
    "",
    "Pediste restablecer tu contraseña del panel de Distribuidora Maqserpan.",
    "Abre este enlace para elegir una nueva (vence en 1 hora y sirve una sola vez):",
    resetUrl,
    "",
    "Si no lo pediste, ignora este correo: tu contraseña no cambia.",
  ].join("\n");

  const html = `<!doctype html><html lang="es"><body style="font-family:Helvetica,Arial,sans-serif;color:#1c1f1d;line-height:1.5">
<p>Hola, ${escapeHtml(name)}:</p>
<p>Pediste restablecer tu contraseña del panel de Distribuidora Maqserpan.</p>
<p><a href="${escapeHtml(resetUrl)}" style="background:#007a23;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:bold">Elegir una nueva contraseña</a></p>
<p style="color:#616161">El enlace vence en 1 hora y sirve una sola vez. Si no lo pediste, ignora este correo: tu contraseña no cambia.</p>
</body></html>`;

  return { subject, text, html };
}

/** Envía el enlace de restablecimiento. Nunca lanza: el formulario responde igual exista o no la cuenta. */
export async function sendPasswordResetEmail(
  user: { name: string; email: string },
  resetUrl: string,
  { from, apiKey }: SendOptions,
): Promise<void> {
  if (!apiKey) {
    console.warn("Correo de restablecimiento no enviado: falta RESEND_API_KEY.");
    return;
  }
  try {
    const { subject, text, html } = buildPasswordResetEmail(user.name, resetUrl);
    const { error } = await new Resend(apiKey).emails.send({
      from: `Distribuidora Maqserpan <${from}>`,
      to: user.email,
      subject,
      text,
      html,
    });
    if (error) console.error(`Correo de restablecimiento rechazado por Resend: ${error.name}`);
  } catch (error) {
    console.error(`Correo de restablecimiento falló: ${(error as Error).name}`);
  }
}
