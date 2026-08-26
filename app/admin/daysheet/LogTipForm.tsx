"use client";

import { useActionState } from "react";
import { HandCoins, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { logTip, type ActionResult } from "@/lib/actions";

const inputClasses =
  "w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-mist-950 placeholder:text-mist-400 transition-colors duration-200 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200";

export default function LogTipForm({
  therapists,
  methods,
  locations,
  today,
}: {
  therapists: string[];
  methods: string[];
  locations: string[];
  today: string;
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(logTip, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="tip-therapist" className="mb-1 block text-xs font-medium text-mist-800">
            Therapist
          </label>
          <select id="tip-therapist" name="therapist" required defaultValue="" className={inputClasses}>
            <option value="" disabled>
              Choose…
            </option>
            {therapists.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tip-amount" className="mb-1 block text-xs font-medium text-mist-800">
            Tip (K)
          </label>
          <input id="tip-amount" name="amount" type="number" min="0" step="0.01" required placeholder="0.00" className={inputClasses} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="tip-date" className="mb-1 block text-xs font-medium text-mist-800">
            Date
          </label>
          <input id="tip-date" name="date" type="date" required defaultValue={today} className={inputClasses} />
        </div>
        <div>
          <label htmlFor="tip-method" className="mb-1 block text-xs font-medium text-mist-800">
            Via <span className="font-normal text-mist-500">(optional)</span>
          </label>
          <select id="tip-method" name="method" defaultValue="" className={inputClasses}>
            <option value="">—</option>
            {methods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="tip-location" className="mb-1 block text-xs font-medium text-mist-800">
            Location
          </label>
          <select id="tip-location" name="location" defaultValue={locations[0]} className={inputClasses}>
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tip-note" className="mb-1 block text-xs font-medium text-mist-800">
            Note <span className="font-normal text-mist-500">(optional)</span>
          </label>
          <input id="tip-note" name="note" type="text" placeholder="e.g. from booking MS-1042" className={inputClasses} />
        </div>
      </div>

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
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <HandCoins className="h-4 w-4" aria-hidden="true" />}
        {pending ? "Saving…" : "Log tip"}
      </button>
    </form>
  );
}
