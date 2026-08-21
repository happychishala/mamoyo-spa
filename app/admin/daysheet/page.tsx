import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, ShoppingBag } from "lucide-react";
import { readDb, TREATMENT_PAYMENTS, LOCATIONS } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { formatMoney, formatDate, todayISO } from "@/lib/format";
import { PageHeader, Card } from "@/components/admin/ui";
import LogTreatmentForm from "./LogTreatmentForm";

export const metadata: Metadata = { title: "Day Sheet" };
export const dynamic = "force-dynamic";

export default async function DaySheetPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const params = await searchParams;
  const today = todayISO();
  const day = /^\d{4}-\d{2}-\d{2}$/.test(params.date ?? "") ? params.date! : today;

  const db = await readDb();
  const therapists = db.therapists.filter((t) => t.active).map((t) => t.name);

  // ----- Treatments logged for the day -----
  const dayTreatments = db.treatments
    .filter((t) => t.date === day)
    .sort((a, b) => a.therapist.localeCompare(b.therapist));
  const treatmentsTotal = dayTreatments.reduce((s, t) => s + t.amount, 0);
  const byTherapist = [...new Set(dayTreatments.map((t) => t.therapist))].map((name) => ({
    name,
    count: dayTreatments.filter((t) => t.therapist === name).length,
    total: dayTreatments.filter((t) => t.therapist === name).reduce((s, t) => s + t.amount, 0),
  }));

  // ----- Product sales for the day (POS "Products" receipts are PRD-…) -----
  const productSales = db.receipts
    .filter((r) => r.invoiceNumber?.startsWith("PRD-") && r.date === day)
    .sort((a, b) => b.number.localeCompare(a.number));
  const productTotal = productSales.reduce((s, r) => s + r.amount, 0);
  const unitsSold = productSales.reduce(
    (s, r) => s + (r.items?.reduce((n, i) => n + i.qty, 0) ?? 0),
    0
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Day Sheet"
        description="Log walk-in treatments by therapist and see the day's treatment and product sales at a glance."
      />

      {/* Date picker */}
      <form method="GET" className="flex items-center gap-2">
        <label htmlFor="ds-date" className="text-xs font-medium text-mist-700">
          Day
        </label>
        <input
          id="ds-date"
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

      <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        {/* Log a treatment */}
        <Card className="h-fit p-6">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-mist-500" aria-hidden="true" />
            <h2 className="font-serif text-lg font-semibold text-mist-950">Log a treatment</h2>
          </div>
          <p className="mt-1 text-sm text-mist-700">
            For walk-ins and treatments not tied to a booking. Completed bookings log themselves.
          </p>
          <div className="mt-5">
            {therapists.length === 0 ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-800">
                Add a therapist on the{" "}
                <Link href="/admin/team" className="font-semibold underline">
                  Team
                </Link>{" "}
                page first.
              </p>
            ) : (
              <LogTreatmentForm
                therapists={therapists}
                payments={[...TREATMENT_PAYMENTS]}
                locations={[...LOCATIONS]}
                today={day}
              />
            )}
          </div>
        </Card>

        {/* Today's treatments */}
        <Card className="p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-serif text-lg font-semibold text-mist-950">Treatments · {formatDate(day)}</h2>
            <p className="text-sm text-mist-700">
              Total: <span className="font-semibold text-mist-950">{formatMoney(treatmentsTotal)}</span>
            </p>
          </div>

          {byTherapist.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {byTherapist.map((r) => (
                <span key={r.name} className="rounded-full border border-mist-200 bg-mist-50 px-3 py-1 text-xs text-mist-800">
                  {r.name}: <span className="font-semibold">{formatMoney(r.total)}</span> · {r.count}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[460px] text-left text-sm">
              <thead>
                <tr className="border-b border-mist-200 text-xs font-semibold uppercase tracking-wide text-mist-600">
                  <th className="pb-3 pr-4">Therapist</th>
                  <th className="pb-3 pr-4">Service</th>
                  <th className="pb-3 pr-4">Payment</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist-100">
                {dayTreatments.map((t) => (
                  <tr key={t.id}>
                    <td className="py-3 pr-4 font-medium text-mist-950">{t.therapist}</td>
                    <td className="py-3 pr-4 text-mist-800">
                      {t.service}
                      {t.bookingRef && (
                        <span className="ml-2 rounded-full bg-mist-100 px-2 py-0.5 text-[0.65rem] font-medium text-mist-700">
                          {t.bookingRef}
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-mist-800">{t.payment}</td>
                    <td className="py-3 text-right font-semibold text-mist-950">{formatMoney(t.amount)}</td>
                  </tr>
                ))}
                {dayTreatments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-mist-600">
                      Nothing logged for this day yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Daily product sales */}
      <Card className="p-6">
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-mist-500" aria-hidden="true" />
            <h2 className="font-serif text-lg font-semibold text-mist-950">Product sales · {formatDate(day)}</h2>
          </div>
          <p className="text-sm text-mist-700">
            {unitsSold} item{unitsSold === 1 ? "" : "s"} ·{" "}
            <span className="font-semibold text-mist-950">{formatMoney(productTotal)}</span>
          </p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-mist-200 text-xs font-semibold uppercase tracking-wide text-mist-600">
                <th className="pb-3 pr-4">Sale</th>
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Items</th>
                <th className="pb-3 pr-4">Payment</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist-100">
              {productSales.map((r) => (
                <tr key={r.id}>
                  <td className="py-3 pr-4">
                    <Link href={`/admin/receipts/${r.id}/print`} className="font-medium text-mist-800 underline-offset-2 hover:underline">
                      {r.invoiceNumber}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-mist-800">{r.customer}</td>
                  <td className="py-3 pr-4 text-mist-700">
                    {r.items?.map((i) => `${i.qty}× ${i.description}`).join(", ") ?? "—"}
                  </td>
                  <td className="py-3 pr-4 text-mist-800">{r.method}</td>
                  <td className="py-3 text-right font-semibold text-mist-950">{formatMoney(r.amount)}</td>
                </tr>
              ))}
              {productSales.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-mist-600">
                    No product sales for this day. Ring one up in{" "}
                    <Link href="/admin/pos" className="font-medium text-mist-700 underline">
                      POS → Products
                    </Link>
                    .
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
