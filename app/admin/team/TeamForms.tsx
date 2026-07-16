"use client";

import { useActionState } from "react";
import { UserPlus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { addTherapist, addUser, type ActionResult } from "@/lib/actions";

const inputClasses =
  "w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-mist-950 placeholder:text-mist-400 transition-colors duration-200 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200";

function StatusNote({ state }: { state: ActionResult | null }) {
  if (!state) return null;
  return (
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
  );
}

function SubmitButton({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-mist-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-mist-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <UserPlus className="h-4 w-4" aria-hidden="true" />
      )}
      {pending ? "Saving…" : label}
    </button>
  );
}

export function AddTherapistForm() {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    addTherapist,
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="th-name" className="mb-1 block text-xs font-medium text-mist-800">
          Name
        </label>
        <input id="th-name" name="name" type="text" required placeholder="Therapist name" className={inputClasses} />
      </div>
      <div>
        <label htmlFor="th-target" className="mb-1 block text-xs font-medium text-mist-800">
          Monthly target (K)
        </label>
        <input
          id="th-target"
          name="monthlyTarget"
          type="number"
          min="0"
          step="500"
          required
          defaultValue={30000}
          className={inputClasses}
        />
      </div>
      <StatusNote state={state} />
      <SubmitButton pending={pending} label="Add therapist" />
    </form>
  );
}

export function AddUserForm({ roleOptions }: { roleOptions: string[] }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    addUser,
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="u-name" className="mb-1 block text-xs font-medium text-mist-800">
            Full name
          </label>
          <input id="u-name" name="name" type="text" required placeholder="Jane Banda" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="u-username" className="mb-1 block text-xs font-medium text-mist-800">
            Username
          </label>
          <input
            id="u-username"
            name="username"
            type="text"
            required
            autoComplete="off"
            placeholder="jane"
            className={inputClasses}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="u-password" className="mb-1 block text-xs font-medium text-mist-800">
            Password
          </label>
          <input
            id="u-password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Min 8 characters"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="u-role" className="mb-1 block text-xs font-medium text-mist-800">
            Role
          </label>
          <select id="u-role" name="role" required defaultValue="Staff" className={inputClasses}>
            {roleOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <StatusNote state={state} />
      <SubmitButton pending={pending} label="Add user" />
    </form>
  );
}
