import { PasswordForm } from "@/components/admin/PasswordForm";
import { verifySession } from "@/lib/dal/session";

export const metadata = { title: "Cuenta" };

export default async function AccountPage() {
  const user = await verifySession();
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl">Cuenta</h1>
        <p className="mt-1 text-gris">{user.email}</p>
      </header>
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl">Cambiar contraseña</h2>
        <PasswordForm />
      </section>
    </div>
  );
}
