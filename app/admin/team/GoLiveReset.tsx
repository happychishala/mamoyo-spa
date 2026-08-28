"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { resetForGoLive } from "@/lib/actions";

const CLEARS = [
  "Bookings & stays",
  "Invoices, receipts & finance",
  "Expenses & tips",
  "Inventory / stock",
  "Quotations & gift cards",
  "Treatments, reports & day sheet",
  "Work sheet, café menu & recipes",
  "Enquiries, reviews & notification log",
];
const KEEPS = ["User accounts & roles", "2-step sign-in (2FA)", "Email & integration settings", "Therapist team", "Treatment menu (in code)"];

export default function GoLiveReset() {
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const armed = confirm.trim() === "GO LIVE";

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/60 p-6">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-red-600" aria-hidden="true" />
        <h2 className="font-serif text-lg font-semibold text-red-800">Danger zone — prepare for go-live</h2>
      </div>
      <p className="mt-2 text-sm text-red-800/90">
        Permanently deletes all demo and transactional data so you start from zero. This cannot be undone.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-red-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-700">Will be cleared</p>
          <ul className="mt-2 space-y-1 text-sm text-mist-800">
            {CLEARS.map((c) => (
              <li key={c} className="flex items-start gap-2">
                <Trash2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Kept</p>
          <ul className="mt-2 space-y-1 text-sm text-mist-800">
            {KEEPS.map((k) => (
              <li key={k} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
                {k}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <form action={resetForGoLive} onSubmit={() => setPending(true)} className="mt-5 flex flex-wrap items-center gap-3">
        <label htmlFor="golive-confirm" className="sr-only">Type GO LIVE to confirm</label>
        <input
          id="golive-confirm"
          name="confirm"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Type GO LIVE to confirm"
          autoComplete="off"
          className="w-56 rounded-xl border border-red-300 bg-white px-3.5 py-2.5 text-sm text-mist-950 placeholder:text-mist-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
        />
        <button
          type="submit"
          disabled={!armed || pending}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
          {pending ? "Clearing…" : "Reset all demo data"}
        </button>
      </form>
    </div>
  );
}
