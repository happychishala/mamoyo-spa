import type { Metadata } from "next";
import { TrendingDown, Wallet } from "lucide-react";
import { readDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { formatMoney, formatDate, todayISO } from "@/lib/format";
import { PageHeader, Card, NoAccess } from "@/components/admin/ui";
import ExpenseForm from "./ExpenseForm";
import ExpensePopCell from "./ExpensePopCell";

export const metadata: Metadata = { title: "Expenses" };
export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  const session = await getSession();
  if (session?.role === "Staff") return <NoAccess area="Expenses" />;

  const db = await readDb();
  const today = todayISO();
  const month = today.slice(0, 7);

  const expenses = db.transactions
    .filter((t) => t.type === "Expense")
    .sort((a, b) => b.date.localeCompare(a.date));

  const monthExpenses = expenses.filter((t) => t.date.startsWith(month));
  const monthTotal = monthExpenses.reduce((s, t) => s + t.amount, 0);

  // This month's spend grouped by category, biggest first.
  const byCategory = Object.entries(
    monthExpenses.reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + t.amount;
      return acc;
    }, {})
  )
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Expenses"
        description="Record what goes out — rent, salaries, stock, utilities. Every expense also lands in Finance and the tax view."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-mist-600">This month</p>
            <TrendingDown className="h-4.5 w-4.5 text-red-700" aria-hidden="true" />
          </div>
          <p className="mt-3 font-serif text-3xl font-semibold text-red-700">{formatMoney(monthTotal)}</p>
          <p className="mt-1 text-xs text-mist-600">{monthExpenses.length} expense entries</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Wallet className="h-4.5 w-4.5 text-mist-500" aria-hidden="true" />
            <p className="text-xs font-semibold uppercase tracking-wide text-mist-600">Top categories this month</p>
          </div>
          {byCategory.length === 0 ? (
            <p className="mt-3 text-sm text-mist-600">No expenses yet this month.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {byCategory.slice(0, 4).map((c) => (
                <li key={c.category} className="flex items-center justify-between text-sm">
                  <span className="text-mist-800">{c.category}</span>
                  <span className="font-semibold text-mist-950">{formatMoney(c.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.6fr]">
        <Card className="h-fit p-6">
          <h2 className="font-serif text-lg font-semibold text-mist-950">Record an expense</h2>
          <div className="mt-5">
            <ExpenseForm today={today} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-serif text-lg font-semibold text-mist-950">Recent expenses</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-mist-200 text-xs font-semibold uppercase tracking-wide text-mist-600">
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">Description</th>
                  <th className="pb-3 pr-4">Proof</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist-100">
                {expenses.slice(0, 40).map((t) => (
                  <tr key={t.id}>
                    <td className="py-3 pr-4 whitespace-nowrap text-mist-800">{formatDate(t.date)}</td>
                    <td className="py-3 pr-4">
                      <span className="rounded-full bg-mist-100 px-2.5 py-0.5 text-xs font-medium text-mist-700">{t.category}</span>
                    </td>
                    <td className="py-3 pr-4 text-mist-800">{t.description}</td>
                    <td className="py-3 pr-4"><ExpensePopCell id={t.id} popId={t.popId} /></td>
                    <td className="py-3 text-right font-semibold text-red-700">{formatMoney(t.amount)}</td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-mist-600">
                      No expenses recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
