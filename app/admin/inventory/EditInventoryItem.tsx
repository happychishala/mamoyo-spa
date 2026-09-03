"use client";

import { Pencil } from "lucide-react";
import { updateInventoryItem } from "@/lib/actions";
import type { InventoryItem } from "@/lib/db";
import { INVENTORY_UNITS } from "@/lib/inventory-units";

const cls =
  "w-full rounded-lg border border-mist-200 bg-white px-2.5 py-1.5 text-xs text-mist-950 focus:border-mist-500 focus:outline-none";

export default function EditInventoryItem({ item }: { item: InventoryItem }) {
  return (
    <details className="text-left">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-xs font-semibold text-mist-600 transition-colors duration-200 hover:text-mist-900">
        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
        Edit
      </summary>
      <form action={updateInventoryItem} className="mt-2 w-72 space-y-2 rounded-xl border border-mist-200 bg-white p-3 shadow-soft">
        <input type="hidden" name="id" value={item.id} />
        <input name="name" defaultValue={item.name} required placeholder="Item name" className={cls} />
        <div className="grid grid-cols-2 gap-2">
          <input name="brand" defaultValue={item.brand ?? ""} placeholder="Brand" className={cls} />
          <input name="volume" defaultValue={item.volume ?? ""} placeholder="Size" className={cls} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <select name="category" defaultValue={item.category} className={cls}>
            <option>Spa products</option>
            <option>Café</option>
          </select>
          <select name="unit" defaultValue={item.unit} className={cls}>
            {INVENTORY_UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <label className="block text-[0.65rem] text-mist-600">
            Quantity
            <input name="quantity" type="number" min="0" defaultValue={item.quantity} className={cls} />
          </label>
          <label className="block text-[0.65rem] text-mist-600">
            Reorder at
            <input name="reorderLevel" type="number" min="0" defaultValue={item.reorderLevel} className={cls} />
          </label>
        </div>
        <button type="submit" className="w-full rounded-full bg-mist-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-mist-700">
          Save changes
        </button>
      </form>
    </details>
  );
}
