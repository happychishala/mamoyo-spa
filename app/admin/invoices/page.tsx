import type { Metadata } from "next";
import Link from "next/link";
import { Send, BadgeCheck, Printer } from "lucide-react";
import { readDb, invoiceTotal, invoicePaid, invoiceBalance } from "@/lib/db";
import { updateInvoiceStatus, recordInvoicePayment } from "@/lib/actions";
import { formatMoney, formatDate } from "@/lib/format";
import { PageHeader, Card, StatusBadge, NoAccess } from "@/components/admin/ui";
import SendButtons from "@/components/admin/SendButtons";
import { invoiceMessage } from "@/lib/notify";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Invoices" };
export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const session = await getSession();
  if (session?.role === "Staff") return <NoAccess area="Invoicing" />;

  const db = await readDb();
  const invoices = [...db.invoices].sort((a, b) => b.issueDate.localeCompare(a.issueDate));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Invoices"
        description="Marking an invoice as paid automatically issues a receipt and records the income in Finance."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {invoices.map((inv) => {
          const total = invoiceTotal(inv);
          const paid = invoicePaid(inv);
          const balance = invoiceBalance(inv);
          return (
            <Card key={inv.id} className="flex flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-lg font-semibold text-mist-950">{inv.number}</p>
                  <p className="text-sm text-mist-800">{inv.customer}</p>
                  {inv.bookingRef && (
                    <p className="text-xs text-mist-600">Booking {inv.bookingRef}</p>
                  )}
                </div>
                <StatusBadge status={inv.status} />
              </div>

              <ul className="mt-4 flex-1 space-y-2 border-t border-mist-100 pt-4 text-sm">
                {inv.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between gap-3 text-mist-800">
                    <span>
                      {item.description}
                      {item.qty > 1 && <span className="text-mist-500"> × {item.qty}</span>}
                    </span>
                    <span className="shrink-0">{formatMoney(item.qty * item.unitPrice)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between border-t border-mist-100 pt-4">
                <div className="text-xs text-mist-600">
                  <p>Issued {formatDate(inv.issueDate)}</p>
                  <p>Due {formatDate(inv.dueDate)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/invoices/${inv.id}/print`}
                    aria-label={`Print ${inv.number}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-mist-300 px-3.5 py-2 text-xs font-semibold text-mist-700 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
                  >
                    <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                    Print
                  </Link>
                  <p className="font-serif text-2xl font-semibold text-mist-950">{formatMoney(total)}</p>
                </div>
              </div>

              <div className="mt-4 border-t border-mist-100 pt-4">
                <SendButtons
                  kind="invoice"
                  id={inv.id}
                  reference={inv.number}
                  email={inv.customerEmail}
                  phone={inv.customerPhone}
                  whatsappBody={invoiceMessage(inv).text}
                />
              </div>

              {paid > 0 && balance > 0 && (
                <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
                  {formatMoney(paid)} paid · balance {formatMoney(balance)}
                </p>
              )}

              {(inv.status === "Draft" || inv.status === "Sent" || inv.status === "Overdue") && (
                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-mist-100 pt-4">
                  {inv.status === "Draft" && (
                    <form action={updateInvoiceStatus}>
                      <input type="hidden" name="id" value={inv.id} />
                      <input type="hidden" name="status" value="Sent" />
                      <button
                        type="submit"
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-mist-600 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
                      >
                        <Send className="h-3.5 w-3.5" aria-hidden="true" />
                        Send to client
                      </button>
                    </form>
                  )}
                  {(inv.status === "Sent" || inv.status === "Overdue") && (
                    <form action={recordInvoicePayment} className="flex flex-wrap items-center gap-2">
                      <input type="hidden" name="id" value={inv.id} />
                      <label htmlFor={`method-${inv.id}`} className="sr-only">
                        Payment method
                      </label>
                      <select
                        id={`method-${inv.id}`}
                        name="method"
                        defaultValue="Mobile Money"
                        className="rounded-full border border-mist-200 bg-white px-3 py-2 text-xs text-mist-800 focus:border-mist-500 focus:outline-none"
                      >
                        <option>Mobile Money</option>
                        <option>Card</option>
                        <option>Cash</option>
                        <option>Bank Transfer</option>
                      </select>
                      <label htmlFor={`amount-${inv.id}`} className="sr-only">
                        Amount received
                      </label>
                      <input
                        id={`amount-${inv.id}`}
                        name="amount"
                        type="number"
                        min="0.01"
                        max={balance}
                        step="0.01"
                        defaultValue={balance}
                        title="Amount received — enter less for a partial payment"
                        className="w-24 rounded-full border border-mist-200 bg-white px-3 py-2 text-right text-xs text-mist-800 focus:border-mist-500 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-emerald-700"
                      >
                        <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                        Record payment
                      </button>
                    </form>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
