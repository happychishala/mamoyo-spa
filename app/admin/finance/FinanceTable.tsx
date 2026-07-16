"use client";

import type { Transaction } from "@/lib/db";
import { formatMoney, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/admin/ui";
import { DataTable, type DataColumn } from "@/components/admin/DataTable";

const columns: DataColumn<Transaction>[] = [
  {
    key: "date",
    header: "Date",
    value: (t) => t.date,
    cell: (t) => formatDate(t.date),
  },
  {
    key: "type",
    header: "Type",
    filterable: true,
    cell: (t) => <StatusBadge status={t.type} />,
  },
  { key: "category", header: "Category", filterable: true },
  { key: "description", header: "Description" },
  {
    key: "amount",
    header: "Amount",
    align: "right",
    value: (t) => (t.type === "Income" ? t.amount : -t.amount),
    cell: (t) => (
      <span className={`font-semibold ${t.type === "Income" ? "text-emerald-700" : "text-red-700"}`}>
        {t.type === "Income" ? "+" : "−"}
        {formatMoney(t.amount)}
      </span>
    ),
  },
];

export default function FinanceTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <DataTable
      rows={transactions}
      columns={columns}
      filename="mamoyo-finance"
      title="MaMoyo Finance Ledger"
      searchPlaceholder="Search description or category…"
      initialSort={{ key: "date", dir: "desc" }}
      emptyMessage="No transactions recorded yet."
    />
  );
}
