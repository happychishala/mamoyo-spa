"use client";

import { Check, X, LogIn, LogOut } from "lucide-react";
import type { StayBooking } from "@/lib/db";
import { updateStayStatus } from "@/lib/actions";
import { suites } from "@/lib/content";
import { formatMoney, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/admin/ui";
import { DataTable, type DataColumn } from "@/components/admin/DataTable";

const suiteName = (id: string) => suites.find((s) => s.id === id)?.name ?? id;

function StatusAction({ id, status, label, value, tone }: {
  id: string;
  status: string;
  label: string;
  value: string;
  tone: "primary" | "success" | "ghost";
}) {
  const Icon = value === "Cancelled" ? X : value === "Confirmed" ? Check : value === "CheckedIn" ? LogIn : LogOut;
  const cls =
    tone === "success"
      ? "bg-emerald-600 text-white hover:bg-emerald-700"
      : tone === "ghost"
        ? "border border-mist-300 text-mist-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
        : "bg-mist-600 text-white hover:bg-mist-700";
  return (
    <form action={updateStayStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={value} />
      <button
        type="submit"
        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors duration-200 ${cls}`}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </button>
    </form>
  );
}

const columns: DataColumn<StayBooking>[] = [
  { key: "ref", header: "Ref", cellClassName: "font-medium text-mist-950" },
  {
    key: "guest",
    header: "Guest",
    cell: (s) => (
      <div>
        <p className="font-medium text-mist-950">{s.guest}</p>
        <p className="text-xs text-mist-600">
          {s.guests} {s.guests === 1 ? "guest" : "guests"} · {s.phone || s.email}
        </p>
        {s.notes && <p className="mt-1 text-xs italic text-mist-600">“{s.notes}”</p>}
      </div>
    ),
    value: (s) => s.guest,
  },
  { key: "studio", header: "Studio", value: (s) => suiteName(s.suiteId), filterable: true },
  {
    key: "dates",
    header: "Dates",
    value: (s) => `${s.checkIn} → ${s.checkOut}`,
    cell: (s) => (
      <div className="text-mist-800">
        {formatDate(s.checkIn)} → {formatDate(s.checkOut)}
        <p className="text-xs text-mist-600">
          {s.nights} {s.nights === 1 ? "night" : "nights"}
        </p>
      </div>
    ),
  },
  {
    key: "total",
    header: "Total",
    value: (s) => s.total,
    cell: (s) => formatMoney(s.total),
    cellClassName: "font-semibold text-mist-950",
  },
  {
    key: "status",
    header: "Status",
    filterable: true,
    cell: (s) => <StatusBadge status={s.status} />,
  },
  {
    key: "actions",
    header: "Actions",
    align: "right",
    sortable: false,
    searchable: false,
    exportable: false,
    cell: (s) => (
      <div className="flex justify-end gap-2">
        {s.status === "Pending" && (
          <StatusAction id={s.id} status={s.status} label="Confirm" value="Confirmed" tone="primary" />
        )}
        {s.status === "Confirmed" && (
          <StatusAction id={s.id} status={s.status} label="Check in" value="CheckedIn" tone="primary" />
        )}
        {s.status === "CheckedIn" && (
          <StatusAction id={s.id} status={s.status} label="Check out" value="CheckedOut" tone="success" />
        )}
        {(s.status === "Pending" || s.status === "Confirmed") && (
          <StatusAction id={s.id} status={s.status} label="Cancel" value="Cancelled" tone="ghost" />
        )}
      </div>
    ),
  },
];

export default function StaysTable({ stays }: { stays: StayBooking[] }) {
  return (
    <DataTable
      rows={stays}
      columns={columns}
      filename="mamoyo-stays"
      title="MaMoyo Suites — Stays"
      pageSize={8}
      searchPlaceholder="Search guest, ref or studio…"
      initialSort={{ key: "dates", dir: "desc" }}
      emptyMessage="No stays booked yet."
    />
  );
}
