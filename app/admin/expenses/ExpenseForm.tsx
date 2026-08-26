"use client";

import { useActionState } from "react";
import { Plus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { addExpense, type ActionResult } from "@/lib/actions";
import PopUploadField from "@/components/admin/PopUploadField";

const inputClasses =
  "w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-mist-950 placeholder:text-mist-400 transition-colors duration-200 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200";

const CATEGORIES = [
  "Rent",
  "Salaries",
  "Utilities",
  "Supplies",
  "Café stock",
  "Spa products",
  "Marketing",
  "Maintenance",
  "Transport",
  "Operations",
  "Other",
];

const METHODS = ["Cash", "Card", "Mobile Money", "Bank Transfer"];

export default function ExpenseForm({ today }: { today: string }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(addExpense, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="ex-category" className="mb-1 block text-xs font-medium text-mist-800">
            Category
          </label>
          <input
            id="ex-category"
            name="category"
            list="expense-categories"
            required
            placeholder="Rent, Supplies…"
            className={inputClasses}
          />
          <datalist id="expense-categories">
            {CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div>
          <label htmlFor="ex-date" className="mb-1 block text-xs font-medium text-mist-800">
            Date
          </label>
          <input id="ex-date" name="date" type="date" required defaultValue={today} className={inputClasses} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="ex-amount" className="mb-1 block text-xs font-medium text-mist-800">
            Amount (K)
          </label>
          <input id="ex-amount" name="amount" type="number" min="0" step="0.01" required placeholder="0.00" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="ex-method" className="mb-1 block text-xs font-medium text-mist-800">
            Paid via <span className="font-normal text-mist-500">(optional)</span>
          </label>
          <select id="ex-method" name="method" defaultValue="" className={inputClasses}>
            <option value="">—</option>
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="ex-description" className="mb-1 block text-xs font-medium text-mist-800">
          Description
        </label>
        <input id="ex-description" name="description" type="text" required placeholder="What was this for?" className={inputClasses} />
      </div>

      <PopUploadField />

      {state && (
        <p
          role="status"
          className={`flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-xs ${
            state.ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"
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
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
        {pending ? "Recording…" : "Record expense"}
      </button>
    </form>
  );
}
