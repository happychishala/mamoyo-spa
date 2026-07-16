import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, CalendarClock, FileWarning } from "lucide-react";
import { readDb, invoiceTotal } from "@/lib/db";
import { formatMoney, formatDate, todayISO } from "@/lib/format";
import { PageHeader, Card, StatusBadge } from "@/components/admin/ui";
import { IncomeExpenseChart, BreakdownDonut } from "@/components/admin/charts";
import { monthlyIncomeExpense, sumByKey } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const db = await readDb();
  const today = todayISO();
  const thisMonth = today.slice(0, 7);

  const incomeThisMonth = db.transactions
    .filter((t) => t.type === "Income" && t.date.startsWith(thisMonth))
    .reduce((sum, t) => sum + t.amount, 0);
  const expensesThisMonth = db.transactions
    .filter((t) => t.type === "Expense" && t.date.startsWith(thisMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  const outstanding = db.invoices
    .filter((i) => i.status === "Sent" || i.status === "Overdue")
    .reduce((sum, i) => sum + invoiceTotal(i), 0);
  const overdueCount = db.invoices.filter((i) => i.status === "Overdue").length;

  const upcoming = db.bookings
    .filter((b) => (b.status === "Confirmed" || b.status === "Pending") && b.date >= today)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const pendingCount = db.bookings.filter((b) => b.status === "Pending").length;

  const incomeExpense = monthlyIncomeExpense(db.transactions, 6);
  const revenueBySource = sumByKey(
    db.transactions.filter((t) => t.type === "Income"),
    (t) => t.category,
    (t) => t.amount
  );
  const paymentMix = sumByKey(
    db.receipts,
    (r) => r.method,
    (r) => r.amount
  );

  const kpis = [
    {
      label: "Income this month",
      value: formatMoney(incomeThisMonth),
      note: `${formatMoney(expensesThisMonth)} spent`,
      icon: TrendingUp,
    },
    {
      label: "Net this month",
      value: formatMoney(incomeThisMonth - expensesThisMonth),
      note: incomeThisMonth >= expensesThisMonth ? "In the green" : "Running a deficit",
      icon: incomeThisMonth >= expensesThisMonth ? TrendingUp : TrendingDown,
    },
    {
      label: "Outstanding invoices",
      value: formatMoney(outstanding),
      note: `${overdueCount} overdue`,
      icon: FileWarning,
    },
    {
      label: "Upcoming bookings",
      value: String(upcoming.length),
      note: `${pendingCount} awaiting confirmation`,
      icon: CalendarClock,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description={`Today is ${formatDate(today)} — here's how the retreat is doing.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-mist-600">
                {kpi.label}
              </p>
              <kpi.icon className="h-4.5 w-4.5 text-mist-400" aria-hidden="true" />
            </div>
            <p className="mt-3 font-serif text-3xl font-semibold text-mist-950">{kpi.value}</p>
            <p className="mt-1 text-xs text-mist-600">{kpi.note}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <Card className="p-6 xl:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-mist-950">Income vs expenses</h2>
            <Link
              href="/admin/finance"
              className="inline-flex items-center gap-1 text-sm font-medium text-mist-700 transition-colors duration-200 hover:text-mist-900"
            >
              Finance
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-4">
            <IncomeExpenseChart data={incomeExpense} />
          </div>
        </Card>

        <Card className="p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-mist-950">Next up</h2>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-1 text-sm font-medium text-mist-700 transition-colors duration-200 hover:text-mist-900"
            >
              All bookings
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-mist-100">
            {upcoming.slice(0, 5).map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-mist-950">{b.customer}</p>
                  <p className="truncate text-xs text-mist-600">
                    {b.service} · {formatDate(b.date)} at {b.time}
                  </p>
                </div>
                <StatusBadge status={b.status} />
              </li>
            ))}
            {upcoming.length === 0 && (
              <li className="py-8 text-center text-sm text-mist-600">No upcoming bookings.</li>
            )}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-mist-950">Revenue by source</h2>
            <Link
              href="/admin/reports"
              className="inline-flex items-center gap-1 text-sm font-medium text-mist-700 transition-colors duration-200 hover:text-mist-900"
            >
              Reports
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6">
            <BreakdownDonut data={revenueBySource} centerLabel="Revenue" emptyLabel="No income recorded yet." />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-mist-950">Payment mix</h2>
            <Link
              href="/admin/receipts"
              className="inline-flex items-center gap-1 text-sm font-medium text-mist-700 transition-colors duration-200 hover:text-mist-900"
            >
              Receipts
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6">
            <BreakdownDonut data={paymentMix} centerLabel="Receipts" emptyLabel="No receipts issued yet." />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="font-serif text-xl font-semibold text-mist-950">Latest receipts</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-mist-200 text-xs font-semibold uppercase tracking-wide text-mist-600">
                <th className="pb-3 pr-4">Receipt</th>
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Method</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist-100">
              {db.receipts.slice(0, 5).map((r) => (
                <tr key={r.id}>
                  <td className="py-3 pr-4 font-medium text-mist-950">{r.number}</td>
                  <td className="py-3 pr-4 text-mist-800">{r.customer}</td>
                  <td className="py-3 pr-4 text-mist-800">{r.method}</td>
                  <td className="py-3 pr-4 text-mist-800">{formatDate(r.date)}</td>
                  <td className="py-3 text-right font-semibold text-mist-950">{formatMoney(r.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
