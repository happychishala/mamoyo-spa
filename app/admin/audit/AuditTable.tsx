"use client";

import type { AuditEntry } from "@/lib/db";
import { DataTable, type DataColumn } from "@/components/admin/DataTable";

function when(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const columns: DataColumn<AuditEntry>[] = [
  {
    key: "at",
    header: "When",
    value: (e) => e.at,
    cell: (e) => <span className="whitespace-nowrap text-mist-800">{when(e.at)}</span>,
  },
  {
    key: "actor",
    header: "Who",
    filterable: true,
    cell: (e) => (
      <span>
        <span className="font-medium text-mist-950">{e.actor}</span>{" "}
        <span className="text-xs text-mist-600">({e.role})</span>
      </span>
    ),
  },
  { key: "action", header: "Action", filterable: true, cellClassName: "text-mist-800" },
  { key: "target", header: "Record", value: (e) => e.target ?? "", cellClassName: "font-medium text-mist-950" },
];

export default function AuditTable({ entries }: { entries: AuditEntry[] }) {
  return (
    <DataTable
      rows={entries}
      columns={columns}
      filename="mamoyo-audit-log"
      title="MaMoyo Audit Log"
      pageSize={20}
      searchPlaceholder="Search action, user or record…"
      initialSort={{ key: "at", dir: "desc" }}
      emptyMessage="No actions logged yet."
    />
  );
}
