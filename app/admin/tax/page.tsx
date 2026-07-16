import type { Metadata } from "next";
import { Calculator, CalendarDays, FileText, ReceiptText, Scale } from "lucide-react";
import { getSession } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { formatDate, todayISO } from "@/lib/format";
import { inclusiveVatBreakdown, VAT_RATE } from "@/lib/tax";
import { Card, NoAccess, PageHeader } from "@/components/admin/ui";
import PrintButton from "@/components/admin/PrintButton";

export const metadata: Metadata = { title: "Tax" };
export const dynamic = "force-dynamic";

const kwachaWithCents = new Intl.NumberFormat("en-ZM", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatTaxMoney(amount: number): string {
  return amount < 0 ? `-K${kwachaWithCents.format(-amount)}` : `K${kwachaWithCents.format(amount)}`;
}

function fullMonthLabel(yyyyMm: string): string {
  return new Date(`${yyyyMm}-01T00:00:00`).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

export default async function TaxPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const session = await getSession();
  if (session?.role === "Staff") return <NoAccess area="Tax" />;

  const params = await searchParams;
  const today = todayISO();
  const month = /^\d{4}-\d{2}$/.test(params.month ?? "") ? params.month! : today.slice(0, 7);
  const db = await readDb();

  const receipts = db.receipts
    .filter((receipt) => receipt.date.startsWith(month))
    .sort((a, b) => b.date.localeCompare(a.date) || b.number.localeCompare(a.number));
  const grossSales = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
  const totals = inclusiveVatBreakdown(grossSales);
  const dailyRows = [...new Set(receipts.map((receipt) => receipt.date))]
    .sort((a, b) => b.localeCompare(a))
    .map((date) => {
      const dayGross = receipts
        .filter((receipt) => receipt.date === date)
        .reduce((sum, receipt) => sum + receipt.amount, 0);
      return {
        date,
        receiptCount: receipts.filter((receipt) => receipt.date === date).length,
        ...inclusiveVatBreakdown(dayGross),
      };
    });

  const summary = [
    {
      label: "VAT inclusive sales",
      value: formatTaxMoney(totals.grossAmount),
      icon: ReceiptText,
      tone: "text-mist-950",
    },
    {
      label: "Sales excl. VAT",
      value: formatTaxMoney(totals.netAmount),
      icon: Scale,
      tone: "text-mist-950",
    },
    {
      label: `Output VAT ${VAT_RATE * 100}%`,
      value: formatTaxMoney(totals.vatAmount),
      icon: Calculator,
      tone: "text-emerald-700",
    },
    {
      label: "Receipts issued",
      value: receipts.length.toLocaleString(),
      icon: FileText,
      tone: "text-mist-950",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Tax"
          description="Monthly VAT sales summary for ZRA return preparation, calculated from issued receipts."
        />
        <PrintButton />
      </div>

      <Card className="p-6 print:border-0 print:p-0 print:shadow-none">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-mist-600">Return period</p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-mist-950">
              {fullMonthLabel(month)}
            </h2>
          </div>
          <form method="GET" className="flex items-center gap-2 print:hidden">
            <label htmlFor="tax-month" className="text-xs font-medium text-mist-700">
              Month
            </label>
            <input
              id="tax-month"
              name="month"
              type="month"
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

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summary.map((item) => (
            <div key={item.label} className="rounded-xl border border-mist-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-mist-600">
                  {item.label}
                </p>
                <item.icon className={`h-4 w-4 ${item.tone}`} aria-hidden="true" />
              </div>
              <p className={`mt-3 font-serif text-2xl font-semibold ${item.tone}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 print:border-0 print:p-0 print:shadow-none">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-mist-500" aria-hidden="true" />
          <h2 className="font-serif text-xl font-semibold text-mist-950">Daily VAT sales</h2>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-mist-200 text-xs font-semibold uppercase tracking-wide text-mist-600">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4 text-right">Receipts</th>
                <th className="pb-3 pr-4 text-right">Sales incl. VAT</th>
                <th className="pb-3 pr-4 text-right">Sales excl. VAT</th>
                <th className="pb-3 text-right">Output VAT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist-100">
              {dailyRows.map((row) => (
                <tr key={row.date}>
                  <td className="py-3.5 pr-4 text-mist-800">{formatDate(row.date)}</td>
                  <td className="py-3.5 pr-4 text-right text-mist-800">{row.receiptCount}</td>
                  <td className="py-3.5 pr-4 text-right font-medium text-mist-950">
                    {formatTaxMoney(row.grossAmount)}
                  </td>
                  <td className="py-3.5 pr-4 text-right text-mist-800">
                    {formatTaxMoney(row.netAmount)}
                  </td>
                  <td className="py-3.5 text-right font-semibold text-emerald-700">
                    {formatTaxMoney(row.vatAmount)}
                  </td>
                </tr>
              ))}
              {dailyRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-sm text-mist-500">
                    No receipt sales in this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6 print:border-0 print:p-0 print:shadow-none">
        <div className="flex items-center gap-2">
          <ReceiptText className="h-5 w-5 text-mist-500" aria-hidden="true" />
          <h2 className="font-serif text-xl font-semibold text-mist-950">Receipt audit trail</h2>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead>
              <tr className="border-b border-mist-200 text-xs font-semibold uppercase tracking-wide text-mist-600">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Receipt</th>
                <th className="pb-3 pr-4">Invoice</th>
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4 text-right">Incl. VAT</th>
                <th className="pb-3 pr-4 text-right">Excl. VAT</th>
                <th className="pb-3 text-right">VAT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist-100">
              {receipts.map((receipt) => {
                const vat = inclusiveVatBreakdown(receipt.amount);
                return (
                  <tr key={receipt.id}>
                    <td className="py-3.5 pr-4 whitespace-nowrap text-mist-800">
                      {formatDate(receipt.date)}
                    </td>
                    <td className="py-3.5 pr-4 font-medium text-mist-950">{receipt.number}</td>
                    <td className="py-3.5 pr-4 text-mist-800">{receipt.invoiceNumber}</td>
                    <td className="py-3.5 pr-4 text-mist-800">{receipt.customer}</td>
                    <td className="py-3.5 pr-4 text-right font-medium text-mist-950">
                      {formatTaxMoney(vat.grossAmount)}
                    </td>
                    <td className="py-3.5 pr-4 text-right text-mist-800">
                      {formatTaxMoney(vat.netAmount)}
                    </td>
                    <td className="py-3.5 text-right font-semibold text-emerald-700">
                      {formatTaxMoney(vat.vatAmount)}
                    </td>
                  </tr>
                );
              })}
              {receipts.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-mist-500">
                    No receipts to show.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
