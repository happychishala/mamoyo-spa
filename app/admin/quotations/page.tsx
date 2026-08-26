import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowRightLeft, Printer, Trash2 } from "lucide-react";
import { readDb, LOCATIONS } from "@/lib/db";
import { getSession } from "@/lib/auth";
import {
  updateQuotationStatus,
  convertQuotationToInvoice,
  deleteQuotation,
} from "@/lib/actions";
import { formatMoney, formatDate, todayISO, addDaysISO } from "@/lib/format";
import { PageHeader, Card, NoAccess } from "@/components/admin/ui";
import QuotationForm from "./QuotationForm";

export const metadata: Metadata = { title: "Quotations" };
export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  Draft: "border-slate-200 bg-slate-100 text-slate-700",
  Sent: "border-blue-200 bg-blue-50 text-blue-700",
  Accepted: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Declined: "border-red-200 bg-red-50 text-red-700",
  Expired: "border-amber-200 bg-amber-50 text-amber-700",
  Converted: "border-mist-300 bg-mist-100 text-mist-700",
};

const NEXT_STATUS = ["Draft", "Sent", "Accepted", "Declined", "Expired"];

export default async function QuotationsPage() {
  const session = await getSession();
  if (session?.role === "Staff") return <NoAccess area="Quotations" />;

  const db = await readDb();
  const today = todayISO();
  const quotations = [...db.quotations].sort((a, b) => b.number.localeCompare(a.number));
  const quoteTotal = (items: { qty: number; unitPrice: number }[]) =>
    items.reduce((s, i) => s + i.qty * i.unitPrice, 0);

  const outstanding = quotations
    .filter((q) => q.status === "Sent" || q.status === "Accepted")
    .reduce((s, q) => s + quoteTotal(q.items), 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Quotations"
        description="Prepare price quotes for prospective clients, send them, and convert accepted quotes straight into an invoice."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-mist-600">Quotations</p>
          <p className="mt-3 font-serif text-3xl font-semibold text-mist-950">{quotations.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-mist-600">Sent / accepted value</p>
          <p className="mt-3 font-serif text-3xl font-semibold text-mist-950">{formatMoney(outstanding)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-mist-600">Converted</p>
          <p className="mt-3 font-serif text-3xl font-semibold text-emerald-700">
            {quotations.filter((q) => q.status === "Converted").length}
          </p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1.5fr]">
        <Card className="h-fit p-6">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-mist-500" aria-hidden="true" />
            <h2 className="font-serif text-lg font-semibold text-mist-950">New quotation</h2>
          </div>
          <div className="mt-5">
            <QuotationForm locations={[...LOCATIONS]} today={today} validUntil={addDaysISO(today, 30)} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-serif text-lg font-semibold text-mist-950">All quotations</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-mist-200 text-xs font-semibold uppercase tracking-wide text-mist-600">
                  <th className="pb-3 pr-4">Number</th>
                  <th className="pb-3 pr-4">Client</th>
                  <th className="pb-3 pr-4">Valid until</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4 text-right">Total</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist-100">
                {quotations.map((q) => {
                  const expired = q.validUntil < today && q.status !== "Converted";
                  return (
                    <tr key={q.id}>
                      <td className="py-3 pr-4">
                        <Link href={`/admin/quotations/${q.id}/print`} className="font-medium text-mist-800 underline-offset-2 hover:underline">
                          {q.number}
                        </Link>
                        {q.convertedInvoice && (
                          <span className="mt-0.5 block text-[0.65rem] text-mist-500">→ {q.convertedInvoice}</span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-mist-800">{q.customer}</td>
                      <td className={`py-3 pr-4 ${expired ? "text-amber-700" : "text-mist-700"}`}>{formatDate(q.validUntil)}</td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[q.status]}`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-right font-semibold text-mist-950">{formatMoney(quoteTotal(q.items))}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {q.status !== "Converted" && (
                            <form action={updateQuotationStatus} className="flex items-center gap-1">
                              <input type="hidden" name="id" value={q.id} />
                              <label htmlFor={`st-${q.id}`} className="sr-only">Status for {q.number}</label>
                              <select
                                id={`st-${q.id}`}
                                name="status"
                                defaultValue={q.status}
                                className="rounded-lg border border-mist-200 bg-white px-2 py-1.5 text-xs text-mist-900 focus:border-mist-500 focus:outline-none"
                              >
                                {NEXT_STATUS.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                              <button type="submit" className="rounded-lg bg-mist-100 px-2 py-1.5 text-xs font-semibold text-mist-700 hover:bg-mist-200">
                                Set
                              </button>
                            </form>
                          )}
                          <Link
                            href={`/admin/quotations/${q.id}/print`}
                            className="inline-flex items-center gap-1 rounded-full border border-mist-300 px-3 py-1.5 text-xs font-semibold text-mist-700 hover:border-mist-400 hover:bg-mist-50"
                          >
                            <Printer className="h-3.5 w-3.5" aria-hidden="true" /> Print
                          </Link>
                          {q.status !== "Converted" ? (
                            <form action={convertQuotationToInvoice}>
                              <input type="hidden" name="id" value={q.id} />
                              <button
                                type="submit"
                                className="inline-flex items-center gap-1 rounded-full bg-mist-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-mist-700"
                              >
                                <ArrowRightLeft className="h-3.5 w-3.5" aria-hidden="true" /> To invoice
                              </button>
                            </form>
                          ) : (
                            <form action={deleteQuotation}>
                              <input type="hidden" name="id" value={q.id} />
                              <button
                                type="submit"
                                aria-label={`Delete ${q.number}`}
                                className="rounded-full p-1.5 text-mist-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                              </button>
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {quotations.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-mist-600">
                      No quotations yet — create your first one on the left.
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
