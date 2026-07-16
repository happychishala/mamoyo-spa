"use client";

import { useActionState } from "react";
import { CalendarCheck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { createBooking, type ActionResult } from "@/lib/actions";
import type { BookableService } from "@/lib/content";

const inputClasses =
  "w-full rounded-xl border border-mist-200 bg-white px-4 py-3 text-sm text-mist-950 placeholder:text-mist-400 transition-colors duration-200 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200";

export default function BookingForm({
  services,
  preselected,
}: {
  services: BookableService[];
  preselected?: string;
}) {
  const sections = [...new Set(services.map((s) => s.section))];
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    createBooking,
    null
  );

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-mist-200 bg-white p-10 text-center shadow-soft">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mist-100 text-mist-600">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </div>
        <h2 className="mt-5 font-serif text-2xl font-semibold text-mist-950">Request received</h2>
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
        <fieldset className="sm:col-span-2">
          <legend className="mb-1.5 block text-sm font-medium text-mist-900">Location</legend>
          <div className="grid grid-cols-2 gap-3">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="location"
                value="Kabulonga"
                defaultChecked
                className="peer sr-only"
              />
              <span className="block rounded-xl border border-mist-200 px-4 py-3 text-center transition-colors duration-200 peer-checked:border-mist-500 peer-checked:bg-mist-50 peer-checked:ring-2 peer-checked:ring-mist-200 hover:border-mist-300">
                <span className="block text-sm font-semibold text-mist-950">MaMoyo Kabulonga</span>
                <span className="mt-0.5 block text-xs text-mist-600">Spa · Café · Suites</span>
              </span>
            </label>
            <label className="cursor-pointer">
              <input type="radio" name="location" value="Twangale" className="peer sr-only" />
              <span className="block rounded-xl border border-mist-200 px-4 py-3 text-center transition-colors duration-200 peer-checked:border-mist-500 peer-checked:bg-mist-50 peer-checked:ring-2 peer-checked:ring-mist-200 hover:border-mist-300">
                <span className="block text-sm font-semibold text-mist-950">MaMoyo Twangale</span>
                <span className="mt-0.5 block text-xs text-mist-600">Spa &amp; wellness</span>
              </span>
            </label>
          </div>
        </fieldset>

        <div className="sm:col-span-2">
          <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-mist-900">
            Treatment
          </label>
          <select
            id="service"
            name="service"
            required
            defaultValue={preselected ?? ""}
            className={inputClasses}
          >
            <option value="" disabled>
              Choose a treatment…
            </option>
            {sections.map((section) => (
              <optgroup key={section} label={section}>
                {services
                  .filter((s) => s.section === section)
                  .map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name} · K{s.price.toLocaleString()}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="customer" className="mb-1.5 block text-sm font-medium text-mist-900">
            Full name
          </label>
          <input
            id="customer"
            name="customer"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-mist-900">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+260 …"
            className={inputClasses}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-mist-900">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-mist-900">
            Preferred date
          </label>
          <input id="date" name="date" type="date" required className={inputClasses} />
        </div>

        <div>
          <label htmlFor="time" className="mb-1.5 block text-sm font-medium text-mist-900">
            Preferred time
          </label>
          <input id="time" name="time" type="time" required min="08:00" max="18:00" className={inputClasses} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-mist-900">
            Anything we should know? <span className="font-normal text-mist-500">(optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="Allergies, preferences, special occasions…"
            className={inputClasses}
          />
        </div>
      </div>

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
            Sending request…
          </>
        ) : (
          <>
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            Request booking
          </>
        )}
      </button>
      <p className="mt-4 text-center text-xs text-mist-600">
        No payment taken online. Cancel or reschedule free of charge up to 24 hours before.
      </p>
    </form>
  );
}
