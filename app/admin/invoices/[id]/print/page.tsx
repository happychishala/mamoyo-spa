import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readDb, invoiceTotal, invoicePaid, invoiceBalance } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { formatMoney, formatDate } from "@/lib/format";
import { inclusiveVatBreakdown, VAT_RATE } from "@/lib/tax";
import { NoAccess } from "@/components/admin/ui";
import PrintDocument from "@/components/admin/PrintDocument";

export const metadata: Metadata = { title: "Print invoice" };
export const dynamic = "force-dynamic";

export default async function InvoicePrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (session?.role === "Staff") return <NoAccess area="Invoicing" />;

  const { id } = await params;
  const db = await readDb();
  const invoice = db.invoices.find((i) => i.id === id);
  if (!invoice) notFound();

  const total = invoiceTotal(invoice);
  const paid = invoicePaid(invoice);
  const balance = invoiceBalance(invoice);
  const totalVat = inclusiveVatBreakdown(total);

  return (
    <PrintDocument backHref="/admin/invoices" backLabel="Back to invoices" location={invoice.location}>
      <div className="mt-8 flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="font-serif text-3xl text-mist-950">Invoice</h1>
          <p className="mt-1 text-sm font-medium text-mist-800">{invoice.number}</p>
          {invoice.bookingRef && (
            <p className="text-xs text-mist-600">Booking {invoice.bookingRef}</p>
          )}
        </div>
        <div className="text-right text-sm text-mist-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-mist-600">Billed to</p>
          <p className="mt-1 font-medium text-mist-950">{invoice.customer}</p>
          <p className="mt-3 text-xs text-mist-600">
            Issued {formatDate(invoice.issueDate)} · Due {formatDate(invoice.dueDate)}
          </p>
          <p className="text-xs text-mist-600">Status: {invoice.status}</p>
        </div>
      </div>

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b-2 border-mist-800 text-xs font-semibold uppercase tracking-wide text-mist-700">
            <th className="pb-2 pr-4">Description</th>
            <th className="pb-2 pr-4 text-right">Qty</th>
            <th className="pb-2 pr-4 text-right">Unit price incl. VAT</th>
            <th className="pb-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-mist-200">
          {invoice.items.map((item, idx) => (
            <tr key={idx}>
              <td className="py-3 pr-4 text-mist-950">{item.description}</td>
              <td className="py-3 pr-4 text-right text-mist-800">{item.qty}</td>
              <td className="py-3 pr-4 text-right text-mist-800">{formatMoney(item.unitPrice)}</td>
              <td className="py-3 text-right font-medium text-mist-950">
                {formatMoney(item.qty * item.unitPrice)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-mist-800">
            <td colSpan={3} className="pt-4 pr-4 text-right font-semibold text-mist-950">
              Subtotal excl. VAT
            </td>
            <td className="pt-4 text-right font-medium text-mist-950">
              {formatMoney(totalVat.netAmount)}
            </td>
          </tr>
          <tr>
            <td colSpan={3} className="pt-2 pr-4 text-right text-sm text-mist-700">
              VAT ({VAT_RATE * 100}% included)
            </td>
            <td className="pt-2 text-right text-sm font-medium text-mist-950">
              {formatMoney(totalVat.vatAmount)}
            </td>
          </tr>
          <tr>
            <td colSpan={3} className="pt-2 pr-4 text-right font-semibold text-mist-950">
              Total incl. VAT
            </td>
            <td className="pt-2 text-right font-serif text-2xl text-mist-950">{formatMoney(total)}</td>
          </tr>
          {paid > 0 && (
            <>
              <tr>
                <td colSpan={3} className="pt-2 pr-4 text-right text-sm text-mist-700">
                  Paid to date
                </td>
                <td className="pt-2 text-right text-sm font-medium text-mist-950">
                  {formatMoney(paid)}
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="pt-1 pr-4 text-right font-semibold text-mist-950">
                  Balance due
                </td>
                <td className="pt-1 text-right font-serif text-xl text-mist-950">
                  {formatMoney(balance)}
                </td>
              </tr>
            </>
          )}
        </tfoot>
      </table>

      <p className="mt-8 text-xs leading-relaxed text-mist-600">
        Payment by cash, card, mobile money or bank transfer. Please quote {invoice.number} as
        the reference.
      </p>
    </PrintDocument>
  );
}
