import Link from "next/link";
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
      <h1 className="text-3xl">Resumen</h1>

      <Link
        href="/admin/solicitudes?estado=nueva"
        className="flex items-center justify-between rounded-lg bg-amarillo p-6 shadow-sm hover:brightness-95"
      >
        <span className="text-xl font-bold">
          {newLeads} {newLeads === 1 ? "solicitud nueva" : "solicitudes nuevas"}
        </span>
        <span className="font-bold">Ver →</span>
      </Link>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-xl">Últimas 12 semanas</h2>
        <p className="mt-1 text-sm text-gris">
          {total} {total === 1 ? "solicitud" : "solicitudes"} en total. Semanas de lunes a domingo, hora de Venezuela.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <caption className="sr-only">Solicitudes por semana y origen</caption>
            <thead className="border-b border-neutral-200 text-xs uppercase tracking-wide text-gris">
              <tr>
                <th scope="col" className="px-3 py-2">Semana del</th>
                <th scope="col" className="px-3 py-2 text-right">Total</th>
                {sources.map((source) => (
                  <th key={source} scope="col" className="px-3 py-2 text-right">
                    {source}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.map((week) => (
                <tr key={week.week} className="border-b border-neutral-100 last:border-0">
                  <th scope="row" className="whitespace-nowrap px-3 py-2 font-normal">
                    {formatWeek(week.week)}
                  </th>
                  <td className="px-3 py-2 text-right font-bold">{week.total}</td>
                  {sources.map((source) => (
                    <td key={source} className="px-3 py-2 text-right tabular-nums">
                      {week.bySource[source] ?? 0}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
