"use client";

import { PackagePlus, PackageMinus, AlertTriangle } from "lucide-react";
import type { InventoryItem } from "@/lib/db";
import { adjustInventory } from "@/lib/actions";
import { formatDate } from "@/lib/format";
import { DataTable, type DataColumn } from "@/components/admin/DataTable";

const isLow = (item: InventoryItem) => item.quantity <= item.reorderLevel;

const columns: DataColumn<InventoryItem>[] = [
  {
    key: "name",
    header: "Item",
    value: (i) => i.name,
    cell: (i) => (
      <span>
        <span className="font-medium text-mist-950">{i.name}</span>
        {isLow(i) && (
          <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[0.65rem] font-semibold text-red-700">
            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
            Low
          </span>
        )}
      </span>
    ),
  },
  { key: "brand", header: "Brand", value: (i) => i.brand ?? "—" },
  { key: "volume", header: "Size", value: (i) => i.volume ?? "—" },
  { key: "category", header: "Category", filterable: true },
  {
    key: "quantity",
    header: "In stock",
    value: (i) => i.quantity,
    cell: (i) => (
      <span>
        <span className="font-semibold text-mist-950">{i.quantity}</span> {i.unit}
      </span>
    ),
  },
  {
    key: "reorderLevel",
    header: "Reorder at",
    value: (i) => i.reorderLevel,
    cell: (i) => `${i.reorderLevel} ${i.unit}`,
  },
  {
    key: "updatedAt",
    header: "Updated",
    value: (i) => i.updatedAt,
    cell: (i) => formatDate(i.updatedAt),
  },
  {
    key: "adjust",
    header: "Stock in / out",
    align: "right",
    sortable: false,
    searchable: false,
    exportable: false,
    cell: (item) => (
      <form action={adjustInventory} className="flex items-center justify-end gap-2">
        <input type="hidden" name="id" value={item.id} />
        <label htmlFor={`adj-${item.id}`} className="sr-only">
          Adjustment amount for {item.name}
        </label>
        <input
          id={`adj-${item.id}`}
          name="amount"
          type="number"
          min="1"
          defaultValue={1}
          className="w-16 rounded-lg border border-mist-200 bg-white px-2.5 py-1.5 text-right text-xs text-mist-950 focus:border-mist-500 focus:outline-none"
        />
        <button
          type="submit"
          name="direction"
          value="in"
          aria-label={`Stock in ${item.name}`}
          className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-mist-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
        >
          <PackagePlus className="h-3.5 w-3.5" aria-hidden="true" />
          In
        </button>
        <button
          type="submit"
          name="direction"
          value="out"
          aria-label={`Stock out ${item.name}`}
          className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-mist-300 px-3 py-1.5 text-xs font-semibold text-mist-700 transition-colors duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
        >
          <PackageMinus className="h-3.5 w-3.5" aria-hidden="true" />
          Out
        </button>
      </form>
    ),
  },
];

export default function InventoryTable({ items }: { items: InventoryItem[] }) {
  return (
    <DataTable
      rows={items}
      columns={columns}
      filename="mamoyo-inventory"
      title="MaMoyo Inventory"
      pageSize={12}
      searchPlaceholder="Search item or brand…"
      initialSort={{ key: "name", dir: "asc" }}
      emptyMessage="Nothing here yet — add your first item."
      rowClassName={(i) => (isLow(i) ? "bg-red-50/40" : undefined)}
    />
  );
}
