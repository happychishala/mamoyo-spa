"use client";

import { useActionState } from "react";
import { Plus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { addInventoryItem, type ActionResult } from "@/lib/actions";

const inputClasses =
  "w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-mist-950 placeholder:text-mist-400 transition-colors duration-200 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200";

export default function InventoryItemForm() {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    addInventoryItem,
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="inv-name" className="mb-1 block text-xs font-medium text-mist-800">
          Item name
        </label>
        <input
          id="inv-name"
          name="name"
          type="text"
          required
          placeholder="Massage oil, Coffee beans…"
          className={inputClasses}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="inv-brand" className="mb-1 block text-xs font-medium text-mist-800">
            Brand <span className="font-normal text-mist-500">(optional)</span>
          </label>
          <input id="inv-brand" name="brand" type="text" placeholder="Munali, OPI…" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="inv-volume" className="mb-1 block text-xs font-medium text-mist-800">
            Size / volume
          </label>
          <input id="inv-volume" name="volume" type="text" placeholder="1kg, 500g, 100ml…" className={inputClasses} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="inv-category" className="mb-1 block text-xs font-medium text-mist-800">
            Category
          </label>
          <select id="inv-category" name="category" required defaultValue="Spa products" className={inputClasses}>
            <option>Spa products</option>
            <option>Café</option>
          </select>
        </div>
        <div>
          <label htmlFor="inv-unit" className="mb-1 block text-xs font-medium text-mist-800">
            Unit
          </label>
          <input id="inv-unit" name="unit" type="text" placeholder="bottle, kg, pcs…" className={inputClasses} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="inv-qty" className="mb-1 block text-xs font-medium text-mist-800">
            Quantity in stock
          </label>
          <input id="inv-qty" name="quantity" type="number" min="0" required defaultValue={0} className={inputClasses} />
        </div>
        <div>
          <label htmlFor="inv-reorder" className="mb-1 block text-xs font-medium text-mist-800">
            Reorder when below
          </label>
          <input id="inv-reorder" name="reorderLevel" type="number" min="0" required defaultValue={2} className={inputClasses} />
        </div>
      </div>

      {state && (
        <p
          role="status"
          className={`flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-xs ${
            state.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {state.ok ? (
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          )}
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-mist-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-mist-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Plus className="h-4 w-4" aria-hidden="true" />
        )}
        {pending ? "Adding…" : "Add item"}
      </button>
    </form>
  );
}
