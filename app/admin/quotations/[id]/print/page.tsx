import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { formatMoney, formatDate } from "@/lib/format";
import { inclusiveVatBreakdown, VAT_RATE } from "@/lib/tax";
import { NoAccess } from "@/components/admin/ui";
import PrintDocument from "@/components/admin/PrintDocument";

export const metadata: Metadata = { title: "Print quotation" };
export const dynamic = "force-dynamic";

export default async function QuotationPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (session?.role === "Staff") return <NoAccess area="Quotations" />;

  const { id } = await params;
  const db = await readDb();
  const quotation = db.quotations.find((q) => q.id === id);
  if (!quotation) notFound();

  const total = quotation.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const vat = inclusiveVatBreakdown(total);

  return (
    <PrintDocument backHref="/admin/quotations" backLabel="Back to quotations" location={quotation.location}>
      <div className="mt-8 flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="font-serif text-3xl text-mist-950">Quotation</h1>
          <p className="mt-1 text-sm font-medium text-mist-800">{quotation.number}</p>
        </div>
        <div className="text-right text-sm text-mist-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-mist-600">Prepared for</p>
          <p className="mt-1 font-medium text-mist-950">{quotation.customer}</p>
          <p className="mt-3 text-xs text-mist-600">
            Issued {formatDate(quotation.issueDate)} · Valid until {formatDate(quotation.validUntil)}
          </p>
          <p className="text-xs text-mist-600">Status: {quotation.status}</p>
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
          {quotation.items.map((item, idx) => (
            <tr key={idx}>
              <td className="py-3 pr-4 text-mist-950">{item.description}</td>
              <td className="py-3 pr-4 text-right text-mist-800">{item.qty}</td>
              <td className="py-3 pr-4 text-right text-mist-800">{formatMoney(item.unitPrice)}</td>
              <td className="py-3 text-right font-medium text-mist-950">{formatMoney(item.qty * item.unitPrice)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-mist-800">
            <td colSpan={3} className="pt-4 pr-4 text-right font-semibold text-mist-950">Subtotal excl. VAT</td>
            <td className="pt-4 text-right font-medium text-mist-950">{formatMoney(vat.netAmount)}</td>
          </tr>
          <tr>
            <td colSpan={3} className="pt-2 pr-4 text-right text-sm text-mist-700">VAT ({VAT_RATE * 100}% included)</td>
            <td className="pt-2 text-right text-sm font-medium text-mist-950">{formatMoney(vat.vatAmount)}</td>
          </tr>
          <tr>
            <td colSpan={3} className="pt-2 pr-4 text-right font-semibold text-mist-950">Total incl. VAT</td>
            <td className="pt-2 text-right font-serif text-2xl text-mist-950">{formatMoney(total)}</td>
          </tr>
        </tfoot>
      </table>

      {quotation.notes && (
        <p className="mt-8 whitespace-pre-line text-sm leading-relaxed text-mist-700">{quotation.notes}</p>
      )}
      <p className="mt-6 text-xs leading-relaxed text-mist-600">
        This quotation is valid until {formatDate(quotation.validUntil)}. Prices are held for the
        validity period and are subject to availability. Quote {quotation.number} when confirming.
      </p>
    </PrintDocument>
  );
}
