"use client";

import { Mail, MessageCircle } from "lucide-react";
import type { NotificationLog } from "@/lib/db";
import { DataTable, type DataColumn } from "@/components/admin/DataTable";

const statusStyles: Record<string, string> = {
  sent: "bg-emerald-100 text-emerald-800",
  manual: "bg-mist-100 text-mist-800",
  failed: "bg-red-100 text-red-800",
  "not-configured": "bg-amber-100 text-amber-900",
};

const statusLabels: Record<string, string> = {
  sent: "Sent",
  manual: "Opened in WhatsApp",
  failed: "Failed",
  "not-configured": "Not sent",
};

const kindLabels: Record<string, string> = {
  "booking-alert": "Booking alert",
  invoice: "Invoice",
  receipt: "Receipt",
};

const columns: DataColumn<NotificationLog>[] = [
  {
    key: "createdAt",
    header: "When",
    value: (n) => n.createdAt,
    cell: (n) => new Date(n.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
  },
  {
    key: "channel",
    header: "Channel",
    filterable: true,
    cell: (n) => (
      <span className="inline-flex items-center gap-1.5">
        {n.channel === "email" ? (
          <Mail className="h-3.5 w-3.5 text-mist-500" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-3.5 w-3.5 text-mist-500" aria-hidden="true" />
        )}
        {n.channel === "email" ? "Email" : "WhatsApp"}
      </span>
    ),
  },
  { key: "kind", header: "Type", filterable: true, value: (n) => kindLabels[n.kind] ?? n.kind },
  { key: "reference", header: "Reference", cellClassName: "font-medium text-mist-950" },
  { key: "recipient", header: "To" },
  {
    key: "status",
    header: "Status",
    filterable: true,
    value: (n) => statusLabels[n.status] ?? n.status,
    cell: (n) => (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
          statusStyles[n.status] ?? "bg-mist-100 text-mist-800"
        }`}
      >
        {statusLabels[n.status] ?? n.status}
      </span>
    ),
  },
  {
    key: "detail",
    header: "Detail",
    cell: (n) => <p className="max-w-md text-xs leading-relaxed text-mist-700">{n.detail}</p>,
  },
];

export default function NotificationsTable({ rows }: { rows: NotificationLog[] }) {
  return (
    <DataTable
      rows={rows}
      columns={columns}
      filename="mamoyo-notifications"
      title="MaMoyo Notification History"
      searchPlaceholder="Search reference, recipient or detail…"
      initialSort={{ key: "createdAt", dir: "desc" }}
      emptyMessage="Nothing sent yet. Booking alerts, invoices and receipts appear here."
    />
  );
}
