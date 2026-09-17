"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Plus, Trash2, Pencil, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { updateRecipe, type ActionResult } from "@/lib/actions";
import type { Recipe } from "@/lib/db";

const inputClasses =
  "w-full rounded-xl border border-mist-200 bg-white px-3 py-2 text-sm text-mist-950 placeholder:text-mist-400 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200";

type Ing = { name: string; qty: string; unit: string };

export default function EditRecipe({ recipe }: { recipe: Recipe }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(updateRecipe, null);
  const [ings, setIngs] = useState<Ing[]>(
    recipe.ingredients.length > 0
      ? recipe.ingredients.map((i) => ({ name: i.name, qty: i.qty ?? "", unit: i.unit ?? "" }))
      : [{ name: "", qty: "", unit: "" }]
  );

  const update = (i: number, patch: Partial<Ing>) =>
    setIngs((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const add = () => setIngs((rows) => [...rows, { name: "", qty: "", unit: "" }]);
  const remove = (i: number) => setIngs((rows) => (rows.length > 1 ? rows.filter((_, idx) => idx !== i) : rows));

  return (
    <details className="mt-3">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-xs font-semibold text-mist-600 transition-colors duration-200 hover:text-mist-900">
        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
        Edit recipe
      </summary>

      <form action={formAction} className="mt-3 space-y-3 rounded-xl border border-mist-200 bg-white p-3">
        <input type="hidden" name="id" value={recipe.id} />
        <div className="grid gap-2 sm:grid-cols-2">
          <input name="name" required defaultValue={recipe.name} placeholder="Recipe name" className={inputClasses} />
          <input name="category" defaultValue={recipe.category ?? ""} placeholder="Category" className={inputClasses} />
        </div>
        <input name="yield" defaultValue={recipe.yield ?? ""} placeholder="Yield (e.g. 10 portions)" className={inputClasses} />

        <div>
          <div className="mb-1.5 flex items-center justify-between">
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
                <button type="button" onClick={() => remove(i)} aria-label="Remove ingredient" className="rounded-full p-1.5 text-mist-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <textarea name="method" rows={4} defaultValue={recipe.method ?? ""} placeholder="Step-by-step method…" className={inputClasses} />
        <input name="notes" defaultValue={recipe.notes ?? ""} placeholder="Allergens, storage, plating…" className={inputClasses} />

        {state && (
          <p className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-xs ${
            state.ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"
          }`}>
            {state.ok ? <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-mist-600 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-mist-700 disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
          {pending ? "Saving…" : "Save changes"}
        </button>
      </form>
    </details>
  );
}
