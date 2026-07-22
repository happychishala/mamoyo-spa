"use client";

import { Play, CheckCheck, RotateCcw } from "lucide-react";
import type { Enquiry } from "@/lib/db";
import { updateEnquiryStatus } from "@/lib/actions";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/admin/ui";
import { DataTable, type DataColumn } from "@/components/admin/DataTable";

function StatusButton({ id, status, label, tone, Icon }: {
  id: string;
  status: string;
  label: string;
  tone: "primary" | "success" | "ghost";
  Icon: typeof Play;
}) {
  const cls =
    tone === "success"
      ? "bg-emerald-600 text-white hover:bg-emerald-700"
      : tone === "ghost"
        ? "border border-mist-300 text-mist-700 hover:border-mist-400 hover:bg-mist-50"
        : "bg-mist-600 text-white hover:bg-mist-700";
  return (
    <form action={updateEnquiryStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button
        type="submit"
        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${cls}`}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </button>
    </form>
  );
}

const columns: DataColumn<Enquiry>[] = [
  { key: "ref", header: "Ref", cellClassName: "font-medium text-mist-950" },
  { key: "type", header: "Type", filterable: true },
  {
    key: "name",
    header: "From",
    value: (e) => e.name,
    cell: (e) => (
      <div>
        <p className="font-medium text-mist-950">{e.name}</p>
        <p className="text-xs text-mist-600">{e.email}</p>
        {e.phone && <p className="text-xs text-mist-600">{e.phone}</p>}
      </div>
    ),
  },
  {
    key: "message",
    header: "Message",
    value: (e) => e.message,
    cell: (e) => (
      <div className="max-w-md">
        <p className="text-mist-800">{e.message}</p>
        {e.details && e.details.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {e.details.map((d) => (
              <span key={d.label} className="rounded-full bg-mist-100 px-2 py-0.5 text-[0.65rem] text-mist-700">
                {d.label}: <span className="font-medium">{d.value}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    ),
  },
  { key: "location", header: "Location", value: (e) => e.location ?? "—", filterable: true },
  {
    key: "status",
    header: "Status",
    filterable: true,
    cell: (e) => <StatusBadge status={e.status} />,
  },
  {
    key: "createdAt",
    header: "Date",
    value: (e) => e.createdAt,
    cell: (e) => formatDate(e.createdAt),
  },
  {
    key: "actions",
    header: "Actions",
    align: "right",
    sortable: false,
    searchable: false,
    exportable: false,
    cell: (e) => (
      <div className="flex justify-end gap-2">
        {e.status === "New" && (
          <StatusButton id={e.id} status="In progress" label="Start" tone="primary" Icon={Play} />
        )}
        {e.status !== "Closed" && (
          <StatusButton id={e.id} status="Closed" label="Close" tone="success" Icon={CheckCheck} />
        )}
        {e.status === "Closed" && (
          <StatusButton id={e.id} status="New" label="Reopen" tone="ghost" Icon={RotateCcw} />
        )}
      </div>
    ),
  },
];

export default function EnquiriesTable({ enquiries }: { enquiries: Enquiry[] }) {
  return (
    <DataTable
      rows={enquiries}
      columns={columns}
      filename="mamoyo-enquiries"
      title="MaMoyo Enquiries"
      searchPlaceholder="Search name, email or message…"
      initialSort={{ key: "createdAt", dir: "desc" }}
      emptyMessage="No enquiries yet — submissions from the website land here."
    />
  );
}
