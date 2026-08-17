"use client";

import { useActionState } from "react";
import { ShieldCheck } from "lucide-react";
import { verifyTotp } from "@/lib/auth-actions";

export default function VerifyForm({ from }: { from?: string }) {
  const [state, formAction, pending] = useActionState(verifyTotp, null);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      {from && <input type="hidden" name="from" value={from} />}

      <div>
        <label htmlFor="code" className="block text-sm font-medium text-mist-800">
          6-digit code
        </label>
        <input
          id="code"
          name="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={6}
          required
          autoFocus
          className="mt-1.5 w-full rounded-xl border border-mist-200 bg-mist-50 px-4 py-2.5 text-center text-lg tracking-[0.5em] text-mist-950 outline-none transition-colors duration-200 placeholder:tracking-normal placeholder:text-mist-400 focus:border-mist-400 focus:bg-white"
          placeholder="000000"
        />
      </div>

      {state && !pending && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-800">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-mist-600 px-4 py-2.5 text-sm font-medium text-white shadow-soft transition-colors duration-200 hover:bg-mist-700 disabled:cursor-default disabled:opacity-60"
      >
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        {pending ? "Verifying…" : "Verify & sign in"}
      </button>

      <a href="/login" className="block text-center text-xs text-mist-600 underline-offset-2 hover:underline">
        Start over
      </a>
    </form>
  );
}
