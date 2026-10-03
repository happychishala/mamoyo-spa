import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readDb, type Receipt } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { formatAmount, todayISO } from "@/lib/format";
import { inclusiveVatBreakdown, VAT_RATE } from "@/lib/tax";
import { locationInfo, contactInfo } from "@/lib/content";
import type { EposReceipt } from "@/lib/epos";
import { NoAccess } from "@/components/admin/ui";
import ThermalReceipt from "@/components/admin/ThermalReceipt";
import ReceiptPrinter from "@/components/admin/ReceiptPrinter";

export const metadata: Metadata = { title: "Tab bill" };
export const dynamic = "force-dynamic";

export default async function TabBillPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return null;
  if (session.role === "Staff") return <NoAccess area="POS" />;

  const { id } = await params;
  const db = await readDb();
  const tab = db.openTabs.find((t) => t.id === id);
  if (!tab) notFound();

  const total = tab.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const vat = inclusiveVatBreakdown(total);
  const m = (n: number) => formatAmount(n);
  const branch = locationInfo[tab.location];

  // A bill is not a saved receipt — synthesise a receipt-shaped object just to
  // render the same slip layout, flagged as a bill.
  const synthetic: Receipt = {
    id: tab.id,
    number: tab.name,
    invoiceNumber: "POS-OPEN",
    customer: tab.name,
    amount: total,
    method: "",
    date: todayISO(),
    location: tab.location,
    items: tab.items.map((i) => ({ description: i.description, qty: i.qty, unitPrice: i.unitPrice })),
  };

  const eposData: EposReceipt = {
    title: "MaMoyo Cafe",
    branch: branch.name,
    address: branch.address,
    phone: contactInfo.phone,
    number: tab.name,
    date: todayISO(),
    reference: "",
    customer: tab.name,
    items: tab.items.map((i) => ({ name: i.description, qty: i.qty, price: m(i.unitPrice), amount: m(i.qty * i.unitPrice) })),
    subtotal: m(vat.netAmount),
    vat: m(vat.vatAmount),
    vatRate: `${VAT_RATE * 100}%`,
    total: m(total),
    payments: null,
    method: "",
    isBill: true,
  };

  return (
    <div className="mx-auto max-w-sm">
      <ReceiptPrinter backHref="/admin/pos" backLabel="Back to POS" receipt={eposData} />
      <ThermalReceipt receipt={synthetic} cafe isBill />
    </div>
  );
}
