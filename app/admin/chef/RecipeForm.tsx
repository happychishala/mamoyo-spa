"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Plus, Trash2, NotebookPen, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { addRecipe, type ActionResult } from "@/lib/actions";

const inputClasses =
  "w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-mist-950 placeholder:text-mist-400 transition-colors duration-200 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200";

type Ing = { name: string; qty: string; unit: string };
const emptyIng = (): Ing => ({ name: "", qty: "", unit: "" });

export default function RecipeForm() {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(addRecipe, null);
  const [ings, setIngs] = useState<Ing[]>([emptyIng(), emptyIng()]);

  const update = (i: number, patch: Partial<Ing>) =>
    setIngs((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const add = () => setIngs((rows) => [...rows, emptyIng()]);
  const remove = (i: number) => setIngs((rows) => (rows.length > 1 ? rows.filter((_, idx) => idx !== i) : rows));

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="r-name" className="mb-1 block text-xs font-medium text-mist-800">Recipe name</label>
          <input id="r-name" name="name" required placeholder="e.g. Baobab granola" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="r-category" className="mb-1 block text-xs font-medium text-mist-800">Category <span className="font-normal text-mist-500">(optional)</span></label>
          <input id="r-category" name="category" placeholder="Breakfast, Bakery, Sauce…" className={inputClasses} />
        </div>
      </div>
      <div>
        <label htmlFor="r-yield" className="mb-1 block text-xs font-medium text-mist-800">Yield <span className="font-normal text-mist-500">(optional)</span></label>
        <input id="r-yield" name="yield" placeholder="e.g. 10 portions, 1 litre" className={inputClasses} />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-mist-600">Ingredients</span>
          <button type="button" onClick={add} className="inline-flex items-center gap-1 text-xs font-semibold text-mist-700 hover:text-mist-900">
            <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {ings.map((ing, i) => (
            <div key={i} className="grid grid-cols-[1fr_3.5rem_4rem_auto] items-center gap-2">
              <input name="ingredientName" value={ing.name} onChange={(e) => update(i, { name: e.target.value })} placeholder="Ingredient" className={inputClasses} />
              <input name="ingredientQty" value={ing.qty} onChange={(e) => update(i, { qty: e.target.value })} placeholder="Qty" className={`${inputClasses} text-right`} aria-label="Quantity" />
              <input name="ingredientUnit" value={ing.unit} onChange={(e) => update(i, { unit: e.target.value })} placeholder="unit" className={inputClasses} aria-label="Unit" />
              <button type="button" onClick={() => remove(i)} aria-label="Remove ingredient" className="rounded-full p-2 text-mist-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="r-method" className="mb-1 block text-xs font-medium text-mist-800">Method <span className="font-normal text-mist-500">(optional)</span></label>
        <textarea id="r-method" name="method" rows={4} placeholder="Step-by-step method…" className={inputClasses} />
      </div>
      <div>
        <label htmlFor="r-notes" className="mb-1 block text-xs font-medium text-mist-800">Notes <span className="font-normal text-mist-500">(optional)</span></label>
        <input id="r-notes" name="notes" placeholder="Allergens, storage, plating…" className={inputClasses} />
      </div>

      {state && (
        <p
          role="status"
          className={`flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-xs ${
            state.ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {state.ok ? <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-mist-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-mist-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <NotebookPen className="h-4 w-4" aria-hidden="true" />}
        {pending ? "Saving…" : "Save recipe"}
      </button>
    </form>
  );
}
