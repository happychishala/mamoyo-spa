import type { Metadata } from "next";
import { Target, Save } from "lucide-react";
import Link from "next/link";
import { readDb, TREATMENT_PAYMENTS } from "@/lib/db";
import { updateTherapistTarget } from "@/lib/actions";
import { formatMoney, formatDate, todayISO } from "@/lib/format";
import { PageHeader, Card } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Reports" };
export const dynamic = "force-dynamic";

// House target across all therapists, from the paper workflow (K250,000/month)
const HOUSE_MONTHLY_TARGET = 250000;

function fullMonthLabel(yyyyMm: string): string {
  return new Date(`${yyyyMm}-01T00:00:00`).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; month?: string }>;
}) {
  const params = await searchParams;
  const today = todayISO();
  const day = /^\d{4}-\d{2}-\d{2}$/.test(params.date ?? "") ? params.date! : today;
  const month = /^\d{4}-\d{2}$/.test(params.month ?? "") ? params.month! : today.slice(0, 7);

  const db = await readDb();

  // ----- Daily report -----
  const dayRows = db.treatments
    .filter((t) => t.date === day)
    .sort((a, b) => a.therapist.localeCompare(b.therapist));
  const dayTotal = dayRows.reduce((s, t) => s + t.amount, 0);
  const dayByPayment = TREATMENT_PAYMENTS.map((p) => ({
    payment: p,
    total: dayRows.filter((t) => t.payment === p).reduce((s, t) => s + t.amount, 0),
  }));
  const dayByTherapist = [...new Set(dayRows.map((t) => t.therapist))].map((name) => ({
    name,
    total: dayRows.filter((t) => t.therapist === name).reduce((s, t) => s + t.amount, 0),
  }));

  // ----- Monthly report -----
  const monthRows = db.treatments.filter((t) => t.date.startsWith(month));
  const monthTotal = monthRows.reduce((s, t) => s + t.amount, 0);
  const monthByPayment = TREATMENT_PAYMENTS.map((p) => ({
    payment: p,
    total: monthRows.filter((t) => t.payment === p).reduce((s, t) => s + t.amount, 0),
  }));
  // Active therapists always show; ex-employees stay when they earned that month.
  const monthByTherapist = db.therapists
    .map((t) => {
      const total = monthRows
        .filter((r) => r.therapist === t.name)
        .reduce((s, r) => s + r.amount, 0);
      return { ...t, total, pct: t.monthlyTarget > 0 ? Math.min(100, Math.round((total / t.monthlyTarget) * 100)) : 0 };
    })
    .filter((t) => t.active || t.total > 0);
  const therapistNames = monthByTherapist.map((t) => t.name);

  // Daily × therapist matrix (mirrors the DAILY REVENUE sheet)
  const activeDates = [...new Set(monthRows.map((r) => r.date))].sort();
  const matrix = activeDates.map((d) => ({
    date: d,
    cells: therapistNames.map((name) =>
      monthRows.filter((r) => r.date === d && r.therapist === name).reduce((s, r) => s + r.amount, 0)
    ),
    total: monthRows.filter((r) => r.date === d).reduce((s, r) => s + r.amount, 0),
  }));

  return (
    <div className="space-y-10">
      <PageHeader
        title="Reports"
        description="Revenue flows in automatically as bookings are completed — walk-ins are captured as bookings too."
      />

      {/* ----- Daily section ----- */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-serif text-2xl font-semibold text-mist-950">Daily treatments</h2>
          <form method="GET" className="flex items-center gap-2">
            <input type="hidden" name="month" value={month} />
            <label htmlFor="report-date" className="text-xs font-medium text-mist-700">
              Day
            </label>
            <input
              id="report-date"
              type="date"
              name="date"
              defaultValue={day}
              className="rounded-xl border border-mist-200 bg-white px-3 py-2 text-sm text-mist-950 focus:border-mist-500 focus:outline-none"
            />
            <button
              type="submit"
              className="cursor-pointer rounded-full bg-mist-600 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
            >
              View
            </button>
          </form>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {dayByPayment.map((p) => (
            <Card key={p.payment} className="px-4 py-3">
              <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-mist-600">{p.payment}</p>
              <p className="mt-1 font-serif text-xl text-mist-950">{formatMoney(p.total)}</p>
            </Card>
          ))}
        </div>

        <Card className="p-6">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-serif text-lg font-semibold text-mist-950">{formatDate(day)}</h3>
              <p className="text-sm text-mist-700">
                Day total: <span className="font-semibold text-mist-950">{formatMoney(dayTotal)}</span>
              </p>
            </div>
            <div className="mt-4 hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-mist-200 text-xs font-semibold uppercase tracking-wide text-mist-600">
                    <th className="pb-3 pr-4">Therapist</th>
                    <th className="pb-3 pr-4">Service</th>
                    <th className="pb-3 pr-4">Payment</th>
                    <th className="pb-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist-100">
                  {dayRows.map((t) => (
                    <tr key={t.id}>
                      <td className="py-3 pr-4 font-medium text-mist-950">{t.therapist}</td>
                      <td className="py-3 pr-4 text-mist-800">
                        {t.service}
                        {t.bookingRef && (
                          <span className="ml-2 rounded-full bg-mist-100 px-2 py-0.5 text-[0.65rem] font-medium text-mist-700">
                            {t.bookingRef}
                          </span>
                        )}
                        {t.notes && <p className="text-xs italic text-mist-600">{t.notes}</p>}
                      </td>
                      <td className="py-3 pr-4 text-mist-800">{t.payment}</td>
                      <td className="py-3 text-right font-semibold text-mist-950">{formatMoney(t.amount)}</td>
                    </tr>
                  ))}
                  {dayRows.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-mist-600">
                        Nothing logged for this day — treatments appear here when bookings are{" "}
                        <Link href="/admin/bookings" className="font-medium text-mist-700 underline">
                          completed
                        </Link>
                        .
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 space-y-3 sm:hidden">
              {dayRows.map((t) => (
                <div key={t.id} className="rounded-xl border border-mist-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-mist-950">{t.therapist}</p>
                    <p className="shrink-0 text-sm font-semibold text-mist-950">{formatMoney(t.amount)}</p>
                  </div>
                  <p className="mt-1 text-sm text-mist-800">
                    {t.service}
                    {t.bookingRef && (
                      <span className="ml-2 rounded-full bg-mist-100 px-2 py-0.5 text-[0.65rem] font-medium text-mist-700">
                        {t.bookingRef}
                      </span>
                    )}
                  </p>
                  {t.notes && <p className="text-xs italic text-mist-600">{t.notes}</p>}
                  <p className="mt-1 text-xs text-mist-600">Paid by {t.payment}</p>
                </div>
              ))}
              {dayRows.length === 0 && (
                <div className="rounded-xl border border-mist-200 bg-white p-8 text-center text-sm text-mist-600">
                  Nothing logged for this day.
                </div>
              )}
            </div>
            {dayByTherapist.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-mist-100 pt-4">
                {dayByTherapist.map((r) => (
                  <span
                    key={r.name}
                    className="rounded-full border border-mist-200 bg-mist-50 px-3 py-1 text-xs text-mist-800"
                  >
                    {r.name}: <span className="font-semibold">{formatMoney(r.total)}</span>
                  </span>
                ))}
              </div>
            )}
          </Card>
      </section>

      {/* ----- Monthly section ----- */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-serif text-2xl font-semibold text-mist-950">
            Monthly revenue — {fullMonthLabel(month)}
          </h2>
          <form method="GET" className="flex items-center gap-2">
            <input type="hidden" name="date" value={day} />
            <label htmlFor="report-month" className="text-xs font-medium text-mist-700">
              Month
            </label>
            <input
              id="report-month"
              type="month"
              name="month"
              defaultValue={month}
              className="rounded-xl border border-mist-200 bg-white px-3 py-2 text-sm text-mist-950 focus:border-mist-500 focus:outline-none"
            />
            <button
              type="submit"
              className="cursor-pointer rounded-full bg-mist-600 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
            >
              View
            </button>
          </form>
        </div>

        {/* House total vs target */}
        <Card className="p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-mist-500" aria-hidden="true" />
              <h3 className="font-serif text-lg font-semibold text-mist-950">House target</h3>
            </div>
            <p className="text-sm text-mist-700">
              <span className="font-serif text-2xl font-semibold text-mist-950">{formatMoney(monthTotal)}</span>
              {" of "}
              {formatMoney(HOUSE_MONTHLY_TARGET)}
            </p>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-mist-100" role="img" aria-label={`House progress: ${Math.round((monthTotal / HOUSE_MONTHLY_TARGET) * 100)}% of monthly target`}>
            <div
              className="h-full rounded-full bg-mist-500 transition-all duration-500"
              style={{ width: `${Math.min(100, (monthTotal / HOUSE_MONTHLY_TARGET) * 100)}%` }}
            />
          </div>
        </Card>

        {/* Per-therapist vs target */}
        <Card className="p-6">
          <h3 className="font-serif text-lg font-semibold text-mist-950">Therapist totals vs targets</h3>
          <div className="mt-4 hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-mist-200 text-xs font-semibold uppercase tracking-wide text-mist-600">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Target</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3 pr-4 w-1/3">Progress</th>
                  <th className="pb-3 text-right">Adjust target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist-100">
                {monthByTherapist.map((t) => (
                  <tr key={t.id}>
                    <td className="py-3.5 pr-4 font-medium text-mist-950">
                      {t.name}
                      {!t.active && (
                        <span className="ml-2 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[0.65rem] font-medium text-slate-600">
                          Ex-employee
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 pr-4 text-mist-800">{formatMoney(t.monthlyTarget)}</td>
                    <td className="py-3.5 pr-4 font-semibold text-mist-950">{formatMoney(t.total)}</td>
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-mist-100">
                          <div
                            className={`h-full rounded-full ${t.pct >= 100 ? "bg-emerald-500" : "bg-mist-500"}`}
                            style={{ width: `${t.pct}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-xs text-mist-700">{t.pct}%</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <form action={updateTherapistTarget} className="flex items-center justify-end gap-2">
                        <input type="hidden" name="id" value={t.id} />
                        <label htmlFor={`target-${t.id}`} className="sr-only">
                          New target for {t.name}
                        </label>
                        <input
                          id={`target-${t.id}`}
                          name="target"
                          type="number"
                          min="0"
                          step="500"
                          defaultValue={t.monthlyTarget}
                          className="w-28 rounded-lg border border-mist-200 bg-white px-2.5 py-1.5 text-right text-xs text-mist-950 focus:border-mist-500 focus:outline-none"
                        />
                        <button
                          type="submit"
                          aria-label={`Save target for ${t.name}`}
                          className="cursor-pointer rounded-full bg-mist-100 p-2 text-mist-700 transition-colors duration-200 hover:bg-mist-600 hover:text-white"
                        >
                          <Save className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 space-y-3 sm:hidden">
            {monthByTherapist.map((t) => (
              <div key={t.id} className="rounded-xl border border-mist-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-mist-950">
                    {t.name}
                    {!t.active && (
                      <span className="ml-2 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[0.65rem] font-medium text-slate-600">
                        Ex-employee
                      </span>
                    )}
                  </p>
                  <p className="shrink-0 text-sm font-semibold text-mist-950">{formatMoney(t.total)}</p>
                </div>
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-mist-100">
                    <div
                      className={`h-full rounded-full ${t.pct >= 100 ? "bg-emerald-500" : "bg-mist-500"}`}
                      style={{ width: `${t.pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs text-mist-700">{t.pct}%</span>
                </div>
                <p className="mt-1 text-xs text-mist-600">Target {formatMoney(t.monthlyTarget)}</p>
                <form
                  action={updateTherapistTarget}
                  className="mt-3 flex items-center gap-2 border-t border-mist-100 pt-3"
                >
                  <label htmlFor={`target-m-${t.id}`} className="text-xs text-mist-600">
                    New target
                  </label>
                  <input type="hidden" name="id" value={t.id} />
                  <input
                    id={`target-m-${t.id}`}
                    name="target"
                    type="number"
                    min="0"
                    step="500"
                    defaultValue={t.monthlyTarget}
                    className="w-28 rounded-lg border border-mist-200 bg-white px-2.5 py-1.5 text-right text-xs text-mist-950 focus:border-mist-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label={`Save target for ${t.name}`}
                    className="cursor-pointer rounded-full bg-mist-100 p-2 text-mist-700 transition-colors duration-200 hover:bg-mist-600 hover:text-white"
                  >
                    <Save className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </form>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Payment mix */}
          <Card className="p-6">
            <h3 className="font-serif text-lg font-semibold text-mist-950">Payment mix</h3>
            <ul className="mt-4 space-y-3">
              {monthByPayment.map((p) => (
                <li key={p.payment} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-sm text-mist-800">{p.payment}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-mist-100">
                    <div
                      className="h-full rounded-full bg-mist-400"
                      style={{ width: monthTotal > 0 ? `${(p.total / monthTotal) * 100}%` : "0%" }}
                    />
                  </div>
                  <span className="w-24 shrink-0 text-right text-sm font-semibold text-mist-950">
                    {formatMoney(p.total)}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Daily × therapist matrix */}
          <Card className="p-6">
            <h3 className="font-serif text-lg font-semibold text-mist-950">Daily revenue by therapist</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-xs">
                <thead>
                  <tr className="border-b border-mist-200 font-semibold uppercase tracking-wide text-mist-600">
                    <th className="pb-2 pr-3">Date</th>
                    {therapistNames.map((n) => (
                      <th key={n} className="pb-2 pr-3 text-right">
                        {n}
                      </th>
                    ))}
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist-100">
                  {matrix.map((row) => (
                    <tr key={row.date}>
                      <td className="py-2.5 pr-3 whitespace-nowrap text-mist-800">{formatDate(row.date)}</td>
                      {row.cells.map((v, i) => (
                        <td key={i} className="py-2.5 pr-3 text-right text-mist-800">
                          {v > 0 ? v.toLocaleString() : "—"}
                        </td>
                      ))}
                      <td className="py-2.5 text-right font-semibold text-mist-950">{row.total.toLocaleString()}</td>
                    </tr>
                  ))}
                  {matrix.length === 0 && (
                    <tr>
                      <td colSpan={therapistNames.length + 2} className="py-8 text-center text-mist-600">
                        No treatments logged this month yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
