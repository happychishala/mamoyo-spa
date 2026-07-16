import type { Metadata } from "next";
import { TrendingUp, TrendingDown, Scale } from "lucide-react";
import { readDb } from "@/lib/db";
import { formatMoney } from "@/lib/format";
import { PageHeader, Card, NoAccess } from "@/components/admin/ui";
import { getSession } from "@/lib/auth";
import { IncomeExpenseChart } from "@/components/admin/charts";
import { monthlyIncomeExpense } from "@/lib/analytics";
import TransactionForm from "./TransactionForm";
import FinanceTable from "./FinanceTable";

export const metadata: Metadata = { title: "Finance" };
export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const session = await getSession();
  if (session?.role === "Staff") return <NoAccess area="Finance" />;

  const db = await readDb();
  const transactions = [...db.transactions].sort((a, b) => b.date.localeCompare(a.date));

  const income = transactions.filter((t) => t.type === "Income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "Expense").reduce((s, t) => s + t.amount, 0);
  const net = income - expenses;

  const totals = [
    { label: "Total income", value: formatMoney(income), icon: TrendingUp, tone: "text-emerald-700" },
    { label: "Total expenses", value: formatMoney(expenses), icon: TrendingDown, tone: "text-red-700" },
    { label: "Net position", value: formatMoney(net), icon: Scale, tone: net >= 0 ? "text-emerald-700" : "text-red-700" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Finance"
        description="Every kwacha in and out of the retreat — spa, café and operations combined."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {totals.map((t) => (
          <Card key={t.label} className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-mist-600">{t.label}</p>
              <t.icon className={`h-4.5 w-4.5 ${t.tone}`} aria-hidden="true" />
            </div>
            <p className={`mt-3 font-serif text-3xl font-semibold ${t.tone}`}>{t.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <Card className="p-6 xl:col-span-3">
          <h2 className="font-serif text-xl font-semibold text-mist-950">Monthly trend</h2>
          <div className="mt-4">
            <IncomeExpenseChart data={monthlyIncomeExpense(db.transactions, 6)} />
          </div>
        </Card>

        <Card className="p-6 xl:col-span-2">
          <h2 className="font-serif text-xl font-semibold text-mist-950">Record a transaction</h2>
          <p className="mt-1 text-sm text-mist-700">
            Café takings, supplier payments, rent — keep the ledger honest.
          </p>
          <div className="mt-5">
            <TransactionForm />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="font-serif text-xl font-semibold text-mist-950">Ledger</h2>
        <div className="mt-5">
          <FinanceTable transactions={transactions} />
        </div>
      </Card>
    </div>
  );
}
