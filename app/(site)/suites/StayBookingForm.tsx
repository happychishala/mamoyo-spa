"use client";

import { useActionState, useState } from "react";
import { BedDouble, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { createStayBooking, type ActionResult } from "@/lib/actions";

interface SuiteOption {
  id: string;
  name: string;
  ratePerNight: number;
  sleeps: number;
}

const inputClasses =
  "w-full rounded-xl border border-mist-200 bg-white px-4 py-3 text-sm text-mist-950 placeholder:text-mist-400 transition-colors duration-200 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200";

function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const n = Math.round((Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`)) / 86400000);
  return n > 0 ? n : 0;
}

export default function StayBookingForm({
  suites,
  preselected,
}: {
  suites: SuiteOption[];
  preselected?: string;
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    createStayBooking,
    null
  );
  const [suiteId, setSuiteId] = useState(preselected ?? suites[0]?.id ?? "");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const suite = suites.find((s) => s.id === suiteId);
  const nights = nightsBetween(checkIn, checkOut);
  const estimate = suite && nights > 0 ? nights * suite.ratePerNight : 0;
  const today = new Date().toISOString().slice(0, 10);

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-mist-200 bg-white p-10 text-center shadow-soft">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mist-100 text-mist-600">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </div>
        <h2 className="mt-5 font-serif text-2xl font-semibold text-mist-950">Stay requested</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-mist-800">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-mist-200 bg-white p-8 shadow-soft sm:p-10"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="suiteId" className="mb-1.5 block text-sm font-medium text-mist-900">
            Studio
          </label>
          <select
            id="suiteId"
            name="suiteId"
            required
            value={suiteId}
            onChange={(e) => setSuiteId(e.target.value)}
            className={inputClasses}
          >
            {suites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — K{s.ratePerNight.toLocaleString()}/night · sleeps {s.sleeps}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="checkIn" className="mb-1.5 block text-sm font-medium text-mist-900">
            Check-in
          </label>
          <input
            id="checkIn"
            name="checkIn"
            type="date"
            required
            min={today}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="checkOut" className="mb-1.5 block text-sm font-medium text-mist-900">
            Check-out
          </label>
          <input
            id="checkOut"
            name="checkOut"
            type="date"
            required
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="guest" className="mb-1.5 block text-sm font-medium text-mist-900">
            Full name
          </label>
          <input
            id="guest"
            name="guest"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="guests" className="mb-1.5 block text-sm font-medium text-mist-900">
            Guests
          </label>
          <select id="guests" name="guests" required defaultValue="1" className={inputClasses}>
            <option value="1">1 guest</option>
            <option value="2">2 guests</option>
          </select>
        </div>

        <div>
          <label htmlFor="stay-email" className="mb-1.5 block text-sm font-medium text-mist-900">
            Email
          </label>
          <input
            id="stay-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="stay-phone" className="mb-1.5 block text-sm font-medium text-mist-900">
            Phone <span className="font-normal text-mist-500">(optional)</span>
          </label>
          <input
            id="stay-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+260 …"
            className={inputClasses}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="stay-notes" className="mb-1.5 block text-sm font-medium text-mist-900">
            Anything we should know? <span className="font-normal text-mist-500">(optional)</span>
          </label>
          <textarea
            id="stay-notes"
            name="notes"
            rows={3}
            placeholder="Arrival time, dietary needs for breakfast, special occasions…"
            className={inputClasses}
          />
        </div>
      </div>

      {nights > 0 && suite && (
        <div className="mt-6 flex items-center justify-between rounded-xl bg-mist-50 px-5 py-4">
          <p className="text-sm text-mist-800">
            {suite.name} · {nights} {nights === 1 ? "night" : "nights"} ×{" "}
            {`K${suite.ratePerNight.toLocaleString()}`}
          </p>
          <p className="font-serif text-xl text-mist-950">{`K${estimate.toLocaleString()}`}</p>
        </div>
      )}

      {state && !state.ok && (
        <p
          role="alert"
          className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-7 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-mist-600 px-8 py-4 text-sm font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-mist-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Checking availability…
          </>
        ) : (
          <>
            <BedDouble className="h-4 w-4" aria-hidden="true" />
            Request this stay
          </>
        )}
      </button>
      <p className="mt-4 text-center text-xs text-mist-600">
        Breakfast is included only where stated in your confirmed rate. Free cancellation up to 48
        hours before check-in.
      </p>
    </form>
  );
}
