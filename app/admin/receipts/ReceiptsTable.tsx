"use client";

import Link from "next/link";
import { Printer } from "lucide-react";
import SendButtons from "@/components/admin/SendButtons";
import type { Receipt } from "@/lib/db";

/** Receipt plus the WhatsApp text, rendered on the server so this client
 *  component never imports lib/notify (which reaches into the database). */
export type ReceiptRow = Receipt & { whatsappBody: string };
import { formatMoney, formatDate } from "@/lib/format";
import { DataTable, type DataColumn } from "@/components/admin/DataTable";

const columns: DataColumn<ReceiptRow>[] = [
  { key: "number", header: "Receipt №", cellClassName: "font-medium text-mist-950" },
  { key: "invoiceNumber", header: "Invoice" },
  { key: "customer", header: "Customer" },
  { key: "method", header: "Method", filterable: true },
  {
    key: "location",
    header: "Branch",
    filterable: true,
    value: (r) => r.location ?? "Kabulonga",
  },
  {
    key: "date",
    header: "Date",
    value: (r) => r.date,
    cell: (r) => formatDate(r.date),
  },
  {
    key: "amount",
    header: "Amount",
    align: "right",
    value: (r) => r.amount,
    cell: (r) => formatMoney(r.amount),
    cellClassName: "font-semibold text-mist-950",
  },
  {
    key: "print",
    header: "Print",
    align: "right",
    sortable: false,
    searchable: false,
    exportable: false,
    cell: (r) => (
      <Link
        href={`/admin/receipts/${r.id}/print`}
        aria-label={`Print ${r.number}`}
        className="inline-flex items-center rounded-full border border-mist-300 p-2 text-mist-700 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
      >
        <Printer className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    ),
  },
  {
    key: "send",
    header: "Send",
    align: "right",
    sortable: false,
    searchable: false,
    exportable: false,
    cell: (r) => (
      <SendButtons
        kind="receipt"
        id={r.id}
        reference={r.number}
        email={r.customerEmail}
        phone={r.customerPhone}
        whatsappBody={r.whatsappBody}
      />
    ),
  },
];

export default function ReceiptsTable({ receipts }: { receipts: ReceiptRow[] }) {
  return (
    <DataTable
      rows={receipts}
      columns={columns}
      filename="mamoyo-receipts"
      title="MaMoyo Receipts"
      searchPlaceholder="Search receipt, invoice or customer…"
      initialSort={{ key: "date", dir: "desc" }}
      emptyMessage="No receipts yet."
    />
  );
}
