import { PageHeader } from "@/components/admin/PageHeader";
import { PasswordForm } from "@/components/admin/PasswordForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { verifySession } from "@/lib/dal/session";

export const metadata = { title: "Cuenta" };

export default async function AccountPage() {
  const user = await verifySession();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Cuenta" description={user.email} />
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 className="text-xl">Cambiar contraseña</h2>
          </CardTitle>
          <CardDescription>Al cambiarla se cierran las demás sesiones abiertas.</CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
