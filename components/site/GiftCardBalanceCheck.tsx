"use client";

import { useActionState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { checkGiftCardBalance, type GiftCardLookupResult } from "@/lib/actions";

const inputClasses =
  "w-full rounded-xl border border-mist-200 bg-white px-4 py-3 text-sm uppercase tracking-wide text-mist-950 placeholder:normal-case placeholder:tracking-normal placeholder:text-mist-400 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200";

export default function GiftCardBalanceCheck() {
  const [state, action, pending] = useActionState<GiftCardLookupResult | null, FormData>(
    checkGiftCardBalance,
    null
  );

  return (
    <div className="rounded-2xl border border-mist-200 bg-white p-6 shadow-soft">
      <h3 className="font-serif text-lg font-semibold text-cocoa-700">Check your gift card balance</h3>
      <p className="mt-2 text-sm leading-relaxed text-mist-700">
        Enter the code printed on your card to see its remaining value and expiry.
      </p>
      <form action={action} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="gc-code" className="sr-only">
          Gift card code
        </label>
        <input id="gc-code" name="code" required placeholder="MM-XXXX-XXXX" className={inputClasses} />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-full bg-mist-600 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700 disabled:opacity-60"
        >
          {pending ? "Checking…" : "Check balance"}
        </button>
      </form>

      {state && !state.ok && (
        <p className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {state.message}
        </p>
      )}

      {state?.ok && state.card && (
        <div className="mt-4 rounded-xl border border-mist-200 bg-mist-50 p-5">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <span className="text-sm font-semibold">Gift card found</span>
          </div>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-mist-600">Card</dt>
              <dd className="font-medium text-mist-950">{state.card.label}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-mist-600">Remaining balance</dt>
              <dd className="font-serif text-lg font-semibold text-cocoa-700">{state.card.balance}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-mist-600">Status</dt>
              <dd className="font-medium text-mist-950">
                {state.card.redeemable ? "Ready to use" : state.card.status}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-mist-600">Valid until</dt>
              <dd className="font-medium text-mist-950">{state.card.expiresOn}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
