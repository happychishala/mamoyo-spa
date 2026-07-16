"use client";

import { useActionState } from "react";
import { BedDouble, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createAdminStay, type ActionResult } from "@/lib/actions";

const inputClasses =
  "w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-mist-950 placeholder:text-mist-400 transition-colors duration-200 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200";

interface SuiteOption {
  id: string;
  name: string;
  ratePerNight: number;
}

export default function NewStayForm({
  suites,
  defaultDate,
}: {
  suites: SuiteOption[];
  defaultDate: string;
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    createAdminStay,
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="ns-guest" className="mb-1 block text-xs font-medium text-mist-800">
            Guest name
          </label>
          <input id="ns-guest" name="guest" type="text" required placeholder="Walk-in guest" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="ns-phone" className="mb-1 block text-xs font-medium text-mist-800">
            Phone <span className="font-normal text-mist-500">(optional)</span>
          </label>
          <input id="ns-phone" name="phone" type="tel" placeholder="+260 …" className={inputClasses} />
        </div>
      </div>

      <div>
        <label htmlFor="ns-suite" className="mb-1 block text-xs font-medium text-mist-800">
          Studio
        </label>
        <select id="ns-suite" name="suiteId" required defaultValue={suites[0]?.id} className={inputClasses}>
          {suites.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — K{s.ratePerNight.toLocaleString()}/night
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label htmlFor="ns-in" className="mb-1 block text-xs font-medium text-mist-800">
            Check-in
          </label>
          <input id="ns-in" name="checkIn" type="date" required defaultValue={defaultDate} className={inputClasses} />
        </div>
        <div>
          <label htmlFor="ns-out" className="mb-1 block text-xs font-medium text-mist-800">
            Check-out
          </label>
          <input id="ns-out" name="checkOut" type="date" required className={inputClasses} />
        </div>
        <div>
          <label htmlFor="ns-guests" className="mb-1 block text-xs font-medium text-mist-800">
            Guests
          </label>
          <select id="ns-guests" name="guests" required defaultValue="1" className={inputClasses}>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="ns-email" className="mb-1 block text-xs font-medium text-mist-800">
          Email <span className="font-normal text-mist-500">(optional)</span>
        </label>
        <input id="ns-email" name="email" type="email" placeholder="guest@example.com" className={inputClasses} />
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
          <BedDouble className="h-4 w-4" aria-hidden="true" />
        )}
        {pending ? "Booking…" : "Book stay"}
      </button>
    </form>
  );
}
