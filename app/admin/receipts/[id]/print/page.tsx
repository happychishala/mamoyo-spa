import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { formatAmount, formatDate } from "@/lib/format";
import { inclusiveVatBreakdown, VAT_RATE } from "@/lib/tax";
import { NoAccess } from "@/components/admin/ui";
import { locationInfo, contactInfo } from "@/lib/content";
import type { EposReceipt } from "@/lib/epos";
import PrintDocument from "@/components/admin/PrintDocument";
import ThermalReceipt from "@/components/admin/ThermalReceipt";
import ReceiptPrinter from "@/components/admin/ReceiptPrinter";

export const metadata: Metadata = { title: "Print receipt" };
export const dynamic = "force-dynamic";

export default async function ReceiptPrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ format?: string }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const { id } = await params;
  const { format } = await searchParams;
  const db = await readDb();
  const receipt = db.receipts.find((r) => r.id === id);
  if (!receipt) notFound();

  const items = receipt.items ?? [];
  const itemsTotal = items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0);
  const receivedVat = inclusiveVatBreakdown(receipt.amount);
  const m = (n: number) => formatAmount(n, receipt.currency);

  const isCafe = receipt.invoiceNumber.startsWith("POS-");
  const logoSrc = isCafe ? "/cafe-mamoyo-logo.png" : "/logo-mamoyo.png";
  const logoAlt = isCafe ? "MaMoyo Café receipt" : "MaMoyo Wellness & Beauty receipt";

  const branch = locationInfo[receipt.location ?? "Kabulonga"];
  const eposData: EposReceipt = {
    title: isCafe ? "MaMoyo Cafe" : "MaMoyo",
    branch: branch.name,
    address: branch.address,
    phone: contactInfo.phone,
    number: receipt.number,
    date: formatDate(receipt.date),
    reference: receipt.invoiceNumber,
    customer: receipt.customer,
    items: (receipt.items ?? []).map((it) => ({
      name: it.description,
      qty: it.qty,
      price: m(it.unitPrice),
      amount: m(it.qty * it.unitPrice),
    })),
    subtotal: m(receivedVat.netAmount),
    vat: m(receivedVat.vatAmount),
    vatRate: `${VAT_RATE * 100}%`,
    total: m(receipt.amount),
    payments:
      receipt.payments && receipt.payments.length > 1
        ? receipt.payments.map((p) => ({ method: p.method, amount: m(p.amount) }))
        : null,
    method: receipt.method,
  };

  if (format === "thermal") {
    return (
      <div className="mx-auto max-w-sm">
        <ReceiptPrinter backHref="/admin/receipts" receipt={eposData} />
        <ThermalReceipt receipt={receipt} cafe={isCafe} />
      </div>
    );
  }

  return (
    <>
      <ReceiptPrinter backHref="/admin/receipts" receipt={eposData} />
      <PrintDocument
        backHref="/admin/receipts"
        backLabel="Back to receipts"
        location={receipt.location}
        logoSrc={logoSrc}
        logoAlt={logoAlt}
        hideControls
      >
      <div className="mt-8 flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="font-serif text-3xl text-mist-950">Receipt</h1>
          <p className="mt-1 text-sm font-medium text-mist-800">{receipt.number}</p>
          <p className="text-xs text-mist-600">Against invoice {receipt.invoiceNumber}</p>
        </div>
        <div className="text-right text-sm text-mist-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-mist-600">Received from</p>
          <p className="mt-1 font-medium text-mist-950">{receipt.customer}</p>
          <p className="mt-3 text-xs text-mist-600">{formatDate(receipt.date)}</p>
          {receipt.payments && receipt.payments.length > 1 ? (
            <div className="mt-1 text-xs text-mist-600">
              <p>Paid by:</p>
              {receipt.payments.map((p, i) => (
                <p key={i} className="font-medium text-mist-800">
                  {p.method}: {m(p.amount)}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-xs text-mist-600">Paid by {receipt.method}</p>
          )}
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
          {items.length > 0 ? (
            items.map((item, idx) => (
              <tr key={idx}>
                <td className="py-3 pr-4 text-mist-950">{item.description}</td>
                <td className="py-3 pr-4 text-right text-mist-800">{item.qty}</td>
                <td className="py-3 pr-4 text-right text-mist-800">{m(item.unitPrice)}</td>
                <td className="py-3 text-right font-medium text-mist-950">
                  {m(item.qty * item.unitPrice)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="py-3 pr-4 text-mist-950">Payment against {receipt.invoiceNumber}</td>
              <td className="py-3 pr-4 text-right text-mist-800">1</td>
              <td className="py-3 pr-4 text-right text-mist-800">{m(receipt.amount)}</td>
              <td className="py-3 text-right font-medium text-mist-950">{m(receipt.amount)}</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          {items.length > 0 && (
            <tr className="border-t-2 border-mist-800">
              <td colSpan={3} className="pt-4 pr-4 text-right text-sm text-mist-700">
                Invoice total incl. VAT
              </td>
              <td className="pt-4 text-right text-sm font-medium text-mist-950">
                {m(itemsTotal)}
              </td>
            </tr>
          )}
          <tr className={items.length > 0 ? "" : "border-t-2 border-mist-800"}>
            <td colSpan={3} className="pt-2 pr-4 text-right text-sm text-mist-700">
              Subtotal excl. VAT
            </td>
            <td className="pt-2 text-right text-sm font-medium text-mist-950">
              {m(receivedVat.netAmount)}
            </td>
          </tr>
          <tr>
            <td colSpan={3} className="pt-2 pr-4 text-right text-sm text-mist-700">
              VAT ({VAT_RATE * 100}% included)
            </td>
            <td className="pt-2 text-right text-sm font-medium text-mist-950">
              {m(receivedVat.vatAmount)}
            </td>
          </tr>
          <tr>
            <td colSpan={3} className="pt-2 pr-4 text-right font-semibold text-mist-950">
              Amount received incl. VAT
            </td>
            <td className="pt-2 text-right font-serif text-2xl text-mist-950">
              {m(receipt.amount)}
            </td>
          </tr>
          {items.length > 0 && itemsTotal - receipt.amount > 0 && (
            <tr>
              <td colSpan={3} className="pt-1 pr-4 text-right text-sm text-mist-700">
                Balance remaining
              </td>
              <td className="pt-1 text-right text-sm font-medium text-mist-950">
                {m(itemsTotal - receipt.amount)}
              </td>
            </tr>
          )}
        </tfoot>
      </table>

      <p className="mt-8 text-xs leading-relaxed text-mist-600">
        {items.length > 0 && itemsTotal - receipt.amount > 0
          ? `Part payment received. Please quote ${receipt.invoiceNumber} for the balance.`
          : "This receipt confirms payment received for the amount shown above."}
      </p>
      </PrintDocument>
    </>
  );
}
