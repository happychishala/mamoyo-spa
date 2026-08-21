"use client";

import { useActionState } from "react";
import { Plus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { logTreatment, type ActionResult } from "@/lib/actions";

const inputClasses =
  "w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-mist-950 placeholder:text-mist-400 transition-colors duration-200 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200";

export default function LogTreatmentForm({
  therapists,
  payments,
  locations,
  today,
}: {
  therapists: string[];
  payments: string[];
  locations: string[];
  today: string;
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(logTreatment, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="lt-therapist" className="mb-1 block text-xs font-medium text-mist-800">
            Therapist
          </label>
          <select id="lt-therapist" name="therapist" required defaultValue="" className={inputClasses}>
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
          <label htmlFor="lt-date" className="mb-1 block text-xs font-medium text-mist-800">
            Date
          </label>
          <input id="lt-date" name="date" type="date" required defaultValue={today} className={inputClasses} />
        </div>
      </div>

      <div>
        <label htmlFor="lt-service" className="mb-1 block text-xs font-medium text-mist-800">
          Service
        </label>
        <input id="lt-service" name="service" type="text" required placeholder="e.g. Swedish Massage (60 min)" className={inputClasses} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="lt-amount" className="mb-1 block text-xs font-medium text-mist-800">
            Amount (K)
          </label>
          <input id="lt-amount" name="amount" type="number" min="0" step="0.01" required placeholder="0.00" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="lt-payment" className="mb-1 block text-xs font-medium text-mist-800">
            Payment
          </label>
          <select id="lt-payment" name="payment" required defaultValue="Cash" className={inputClasses}>
            {payments.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="lt-location" className="mb-1 block text-xs font-medium text-mist-800">
            Location
          </label>
          <select id="lt-location" name="location" defaultValue={locations[0]} className={inputClasses}>
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="lt-notes" className="mb-1 block text-xs font-medium text-mist-800">
            Notes <span className="font-normal text-mist-500">(optional)</span>
          </label>
          <input id="lt-notes" name="notes" type="text" placeholder="Walk-in, package…" className={inputClasses} />
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
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
        {pending ? "Logging…" : "Log treatment"}
      </button>
    </form>
  );
}
