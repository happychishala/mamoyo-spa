import { contactInfo, locationInfo } from "@/lib/content";
import { formatAmount, formatDate } from "@/lib/format";
import { inclusiveVatBreakdown, VAT_RATE } from "@/lib/tax";
import type { Receipt } from "@/lib/db";

/**
 * 80mm thermal / Epson receipt-printer layout. Narrow, monochrome, monospace
 * amounts. The @page rule sizes the paper to an 80mm roll so it prints without
 * scaling on a receipt printer (or as a compact slip on any printer).
 */
export default function ThermalReceipt({ receipt, cafe }: { receipt: Receipt; cafe: boolean }) {
  const items = receipt.items ?? [];
  const vat = inclusiveVatBreakdown(receipt.amount);
  const m = (n: number) => formatAmount(n, receipt.currency);
  const branch = locationInfo[receipt.location ?? "Kabulonga"];

  return (
    <div className="thermal mx-auto text-black">
      <style>{`
        @page { size: 80mm auto; margin: 3mm; }
        .thermal { width: 74mm; font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; font-size: 11px; line-height: 1.35; color: #000; }
        .thermal .r { display: flex; justify-content: space-between; gap: 6px; }
        .thermal .hr { border-top: 1px dashed #000; margin: 6px 0; }
        .thermal .center { text-align: center; }
        .thermal .b { font-weight: 700; }
        .thermal .big { font-size: 15px; }
        @media print { .thermal { width: 74mm; } }
      `}</style>

      <div className="center">
        <p className="b" style={{ fontSize: "15px", letterSpacing: "1px" }}>
          {cafe ? "MaMoyo Café" : "MaMoyo"}
        </p>
        <p>{branch.name}</p>
        <p>{branch.address}</p>
        <p>{contactInfo.phone}</p>
      </div>

      <div className="hr" />
      <div className="r"><span>Receipt</span><span className="b">{receipt.number}</span></div>
      <div className="r"><span>Date</span><span>{formatDate(receipt.date)}</span></div>
      <div className="r"><span>Ref</span><span>{receipt.invoiceNumber}</span></div>
      <div className="r"><span>Customer</span><span>{receipt.customer}</span></div>
      <div className="hr" />

      {items.length > 0 ? (
        items.map((it, i) => (
          <div key={i} style={{ marginBottom: "2px" }}>
            <div>{it.description}</div>
            <div className="r">
              <span>{it.qty} × {m(it.unitPrice)}</span>
              <span className="b">{m(it.qty * it.unitPrice)}</span>
            </div>
          </div>
        ))
      ) : (
        <div className="r"><span>Payment {receipt.invoiceNumber}</span><span className="b">{m(receipt.amount)}</span></div>
      )}

      <div className="hr" />
      <div className="r"><span>Subtotal excl. VAT</span><span>{m(vat.netAmount)}</span></div>
      <div className="r"><span>VAT ({VAT_RATE * 100}%)</span><span>{m(vat.vatAmount)}</span></div>
      <div className="r b big"><span>TOTAL</span><span>{m(receipt.amount)}</span></div>

      <div className="hr" />
      {receipt.payments && receipt.payments.length > 1 ? (
        <>
          <div>Paid by:</div>
          {receipt.payments.map((p, i) => (
            <div key={i} className="r"><span>{p.method}</span><span>{m(p.amount)}</span></div>
          ))}
        </>
      ) : (
        <div className="r"><span>Paid by</span><span>{receipt.method}</span></div>
      )}

      <div className="hr" />
      <p className="center">Thank you — see you again!</p>
      <p className="center" style={{ fontSize: "9px", marginTop: "4px" }}>spa · café · suites · wellness</p>
    </div>
  );
}
