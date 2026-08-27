"use client";

import { useActionState } from "react";
import { CalendarPlus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { addWorkShift, type ActionResult } from "@/lib/actions";

const inputClasses =
  "w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-mist-950 placeholder:text-mist-400 transition-colors duration-200 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200";

export default function AddShiftForm({
  therapists,
  locations,
  defaultDate,
}: {
  therapists: string[];
  locations: string[];
  defaultDate: string;
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(addWorkShift, null);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="ws-therapist" className="mb-1 block text-xs font-medium text-mist-800">Therapist</label>
        <select id="ws-therapist" name="therapist" required defaultValue="" className={`${inputClasses} w-44`}>
          <option value="" disabled>Choose…</option>
          {therapists.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="ws-date" className="mb-1 block text-xs font-medium text-mist-800">Date</label>
        <input id="ws-date" name="date" type="date" required defaultValue={defaultDate} className={`${inputClasses} w-40`} />
      </div>
      <div>
        <label htmlFor="ws-location" className="mb-1 block text-xs font-medium text-mist-800">Location</label>
        <select id="ws-location" name="location" defaultValue={locations[0]} className={`${inputClasses} w-40`}>
          {locations.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-[8rem]">
        <label htmlFor="ws-note" className="mb-1 block text-xs font-medium text-mist-800">Note <span className="font-normal text-mist-500">(optional)</span></label>
        <input id="ws-note" name="note" placeholder="e.g. AM only" className={inputClasses} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-[42px] cursor-pointer items-center justify-center gap-2 rounded-full bg-mist-600 px-5 text-sm font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-mist-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <CalendarPlus className="h-4 w-4" aria-hidden="true" />}
        Add shift
      </button>

      {state && (
        <p
          role="status"
          className={`flex w-full items-start gap-2 rounded-xl border px-3.5 py-2.5 text-xs ${
            state.ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {state.ok ? <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
          {state.message}
        </p>
      )}
    </form>
  );
}
