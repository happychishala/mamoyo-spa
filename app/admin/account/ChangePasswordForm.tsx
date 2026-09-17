"use client";

import { useActionState, useEffect, useRef } from "react";
import { KeyRound, CheckCircle2, AlertCircle } from "lucide-react";
import { changeOwnPassword, type ActionResult } from "@/lib/actions";

const inputClasses =
  "w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-mist-950 placeholder:text-mist-400 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200";

export default function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(changeOwnPassword, null);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the fields after a successful change.
  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div>
        <label htmlFor="pw-current" className="mb-1 block text-xs font-medium text-mist-800">
          Current password
        </label>
        <input id="pw-current" name="current" type="password" required autoComplete="current-password" className={inputClasses} />
      </div>
      <div>
        <label htmlFor="pw-next" className="mb-1 block text-xs font-medium text-mist-800">
          New password <span className="font-normal text-mist-500">— at least 8 characters</span>
        </label>
        <input id="pw-next" name="next" type="password" required minLength={8} autoComplete="new-password" className={inputClasses} />
      </div>
      <div>
        <label htmlFor="pw-confirm" className="mb-1 block text-xs font-medium text-mist-800">
          Confirm new password
        </label>
        <input id="pw-confirm" name="confirm" type="password" required minLength={8} autoComplete="new-password" className={inputClasses} />
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
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-mist-600 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <KeyRound className="h-4 w-4" aria-hidden="true" />
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
