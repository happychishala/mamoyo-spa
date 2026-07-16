"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { login } from "@/lib/auth-actions";

export default function LoginForm({ from }: { from?: string }) {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      {from && <input type="hidden" name="from" value={from} />}

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-mist-800"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoFocus
          autoComplete="username"
          className="mt-1.5 w-full rounded-xl border border-mist-200 bg-mist-50 px-4 py-2.5 text-sm text-mist-950 outline-none transition-colors duration-200 placeholder:text-mist-400 focus:border-mist-400 focus:bg-white"
          placeholder="Your username"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-mist-800"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1.5 w-full rounded-xl border border-mist-200 bg-mist-50 px-4 py-2.5 text-sm text-mist-950 outline-none transition-colors duration-200 placeholder:text-mist-400 focus:border-mist-400 focus:bg-white"
          placeholder="Admin password"
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
        <LogIn className="h-4 w-4" aria-hidden="true" />
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
