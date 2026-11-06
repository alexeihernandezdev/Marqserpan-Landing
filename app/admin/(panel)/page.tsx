import { ArrowRight, Inbox } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { countNewLeads, getLeadStats } from "@/lib/dal/leads";
import { formatWeek } from "@/lib/format";

export const metadata = { title: "Resumen" };

/** Resumen: solicitudes nuevas y totales por semana y origen (FR-020). */
export default async function DashboardPage() {
  const [newLeads, stats] = await Promise.all([countNewLeads(), getLeadStats({ weeks: 12 })]);
  const sources = [...new Set(stats.flatMap((week) => Object.keys(week.bySource)))].sort();
  const total = stats.reduce((sum, week) => sum + week.total, 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Resumen" />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/solicitudes?estado=nueva"
          className="group flex items-center justify-between gap-4 rounded-xl bg-amarillo p-6 shadow-sm transition-[filter] hover:brightness-95"
        >
          <span className="flex items-center gap-4">
            <span className="flex size-11 items-center justify-center rounded-full bg-carbon/10">
              <Inbox className="size-5" aria-hidden="true" />
            </span>
            <span className="flex flex-col">
              <span className="font-display text-3xl leading-none">{newLeads}</span>{" "}
              <span className="mt-1 text-sm font-semibold">
                {newLeads === 1 ? "solicitud nueva" : "solicitudes nuevas"}
              </span>
            </span>
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold">
            Ver <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </Link>
        <Card className="justify-center gap-1 px-6">
          <span className="font-display text-3xl leading-none">{total}</span>
          <span className="text-sm text-muted-foreground">
            {total === 1 ? "solicitud" : "solicitudes"} en las últimas 12 semanas
          </span>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <h2 className="text-xl">Últimas 12 semanas</h2>
          </CardTitle>
          <CardDescription>Semanas de lunes a domingo, hora de Venezuela.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="min-w-[480px]">
            <TableCaption className="sr-only">Solicitudes por semana y origen</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Semana del</TableHead>
                <TableHead className="text-right">Total</TableHead>
                {sources.map((source) => (
                  <TableHead key={source} className="text-right">
                    {source}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((week) => (
                <TableRow key={week.week}>
                  <TableHead scope="row" className="font-normal text-foreground">
                    {formatWeek(week.week)}
                  </TableHead>
                  <TableCell className="text-right font-semibold tabular-nums">{week.total}</TableCell>
                  {sources.map((source) => (
                    <TableCell key={source} className="text-right text-muted-foreground tabular-nums">
                      {week.bySource[source] ?? 0}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
