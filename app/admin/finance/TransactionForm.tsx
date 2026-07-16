"use client";

import { useActionState } from "react";
import { Plus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { addTransaction, type ActionResult } from "@/lib/actions";

const inputClasses =
  "w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-mist-950 placeholder:text-mist-400 transition-colors duration-200 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200";

export default function TransactionForm() {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    addTransaction,
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="tx-type" className="mb-1 block text-xs font-medium text-mist-800">
            Type
          </label>
          <select id="tx-type" name="type" required defaultValue="Income" className={inputClasses}>
            <option>Income</option>
            <option>Expense</option>
          </select>
        </div>
        <div>
          <label htmlFor="tx-date" className="mb-1 block text-xs font-medium text-mist-800">
            Date
          </label>
          <input
            id="tx-date"
            name="date"
            type="date"
            required
            defaultValue={new Date().toISOString().slice(0, 10)}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="tx-category" className="mb-1 block text-xs font-medium text-mist-800">
            Category
          </label>
          <input
            id="tx-category"
            name="category"
            type="text"
            required
            placeholder="Café, Supplies…"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="tx-amount" className="mb-1 block text-xs font-medium text-mist-800">
            Amount (K)
          </label>
          <input
            id="tx-amount"
            name="amount"
            type="number"
            min="1"
            step="0.01"
            required
            placeholder="0.00"
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label htmlFor="tx-description" className="mb-1 block text-xs font-medium text-mist-800">
          Description
        </label>
        <input
          id="tx-description"
          name="description"
          type="text"
          required
          placeholder="What was this for?"
          className={inputClasses}
        />
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
        {pending ? "Recording…" : "Add to ledger"}
      </button>
    </form>
  );
}
