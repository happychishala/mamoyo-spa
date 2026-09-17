"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { FileUp, Loader2, CheckCircle2, AlertCircle, UtensilsCrossed } from "lucide-react";
import {
  extractRecipesFromPdf,
  importParsedRecipes,
  type RecipeExtractResult,
  type ActionResult,
} from "@/lib/actions";

export default function RecipeImport() {
  const [state, formAction, extracting] = useActionState<RecipeExtractResult | null, FormData>(
    extractRecipesFromPdf,
    null
  );
  const recipes = state?.recipes ?? [];
  const [picked, setPicked] = useState<boolean[]>([]);
  const [saveResult, setSaveResult] = useState<ActionResult | null>(null);
  const [saving, startSave] = useTransition();

  // Default every found recipe to selected when a new extraction arrives.
  useEffect(() => {
    setPicked(recipes.map(() => true));
    setSaveResult(null);
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedCount = picked.filter(Boolean).length;

  function save() {
    const chosen = recipes.filter((_, i) => picked[i]);
    if (chosen.length === 0) return;
    startSave(async () => {
      const res = await importParsedRecipes(JSON.stringify(chosen));
      setSaveResult(res);
    });
  }

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="file"
          name="pdf"
          accept="application/pdf,.pdf"
          required
          className="block w-full text-sm text-mist-700 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-mist-100 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-mist-700 hover:file:bg-mist-200"
        />
        <button
          type="submit"
          disabled={extracting}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-mist-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700 disabled:opacity-60"
        >
          {extracting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <FileUp className="h-4 w-4" aria-hidden="true" />}
          {extracting ? "Reading…" : "Read PDF"}
        </button>
      </form>
      <p className="mt-2 text-xs text-mist-600">
        Upload a recipe PDF (e.g. an AZURE technical fiche). We&apos;ll pull out the recipes so you can review and add them.
      </p>

      {state && !state.ok && (
        <p className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-800">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {state.message}
        </p>
      )}

      {state?.ok && recipes.length > 0 && !saveResult?.ok && (
        <div className="mt-4">
          <p className="text-sm font-medium text-mist-900">{state.message}</p>
          <ul className="mt-3 space-y-2">
            {recipes.map((r, i) => (
              <li key={`${r.name}-${i}`} className="rounded-xl border border-mist-200 bg-white p-3">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={picked[i] ?? false}
                    onChange={(e) => setPicked((p) => p.map((v, x) => (x === i ? e.target.checked : v)))}
                    className="mt-1 h-4 w-4 shrink-0 accent-mist-600"
                  />
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-baseline gap-2">
                      <span className="font-medium text-mist-950">{r.name}</span>
                      {r.category && (
                        <span className="rounded-full bg-mist-100 px-2 py-0.5 text-[0.65rem] font-semibold text-mist-600">
                          {r.category}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-xs text-mist-500">
                        <UtensilsCrossed className="h-3 w-3" aria-hidden="true" />
                        {r.ingredients.length} ingredients
                      </span>
                    </span>
                    <span className="mt-1 block truncate text-xs text-mist-600">
                      {r.ingredients.map((ing) => ing.name).join(", ")}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={save}
            disabled={saving || selectedCount === 0}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-mist-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
            {saving ? "Adding…" : `Add ${selectedCount} to recipe book`}
          </button>
        </div>
      )}

      {saveResult && (
        <p
          className={`mt-4 flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-xs ${
            saveResult.ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {saveResult.ok ? (
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          )}
          {saveResult.message}
        </p>
      )}
    </div>
  );
}
