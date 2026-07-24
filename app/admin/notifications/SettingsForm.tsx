"use client";

import { useActionState } from "react";
import { Save, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { updateEmailSettings, sendTestEmail, type ActionResult } from "@/lib/actions";

const input =
  "w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-mist-950 placeholder:text-mist-400 transition-colors duration-200 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200";
const label = "mb-1 block text-xs font-medium text-mist-800";

export interface SettingsView {
  enabled: boolean;
  fromAddress: string;
  alertKabulonga: string;
  alertTwangale: string;
  hasKey: boolean;
}

function Result({ state }: { state: ActionResult | null }) {
  if (!state) return null;
  return (
    <p
      role="status"
      className={`mt-4 flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${
        state.ok
          ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border border-red-200 bg-red-50 text-red-800"
      }`}
    >
      {state.ok ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      ) : (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      )}
      {state.message}
    </p>
  );
}

export function EmailSettingsForm({ settings }: { settings: SettingsView }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    (_p, fd) => updateEmailSettings(fd),
    null
  );

  return (
    <form action={action} className="space-y-4">
      <label className="flex items-start gap-3 rounded-xl border border-mist-200 bg-mist-50 p-4">
        <input
          type="checkbox"
          name="enabled"
          defaultChecked={settings.enabled}
          className="mt-0.5 h-4 w-4 accent-mist-600"
        />
        <span>
          <span className="block text-sm font-semibold text-mist-950">Send emails</span>
          <span className="mt-0.5 block text-xs text-mist-700">
            When off, nothing is sent and every attempt is recorded below with the reason.
          </span>
        </span>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="fromAddress" className={label}>
            Send from
          </label>
          <input
            id="fromAddress"
            name="fromAddress"
            type="text"
            defaultValue={settings.fromAddress}
            placeholder="MaMoyo &lt;noreply@mamoyospa.com&gt;"
            className={input}
          />
          <p className="mt-1 text-xs text-mist-600">
            Must be a sender you have verified with the email provider.
          </p>
        </div>
        <div>
          <label htmlFor="apiKey" className={label}>
            Provider API key
          </label>
          <input
            id="apiKey"
            name="apiKey"
            type="password"
            autoComplete="off"
            placeholder={settings.hasKey ? "•••••••• (leave blank to keep)" : "re_…"}
            className={input}
          />
          <p className="mt-1 text-xs text-mist-600">
            {settings.hasKey ? "A key is saved. Enter a new one to replace it." : "No key saved yet."}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="alertKabulonga" className={label}>
            Kabulonga booking inbox
          </label>
          <input
            id="alertKabulonga"
            name="alertKabulonga"
            type="email"
            defaultValue={settings.alertKabulonga}
            placeholder="kabulonga@mamoyospa.com"
            className={input}
          />
        </div>
        <div>
          <label htmlFor="alertTwangale" className={label}>
            Twangale booking inbox
          </label>
          <input
            id="alertTwangale"
            name="alertTwangale"
            type="email"
            defaultValue={settings.alertTwangale}
            placeholder="twangale@mamoyospa.com"
            className={input}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-mist-600 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700 disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
        Save settings
      </button>
      <Result state={state} />
    </form>
  );
}

export function TestEmailForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    (_p, fd) => sendTestEmail(fd),
    null
  );

  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <div className="min-w-[220px] flex-1">
        <label htmlFor="test-to" className={label}>
          Send a test to
        </label>
        <input id="test-to" name="to" type="email" required placeholder="you@example.com" className={input} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-mist-300 px-5 py-2.5 text-sm font-semibold text-mist-800 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50 disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
        Send test
      </button>
      <div className="w-full">
        <Result state={state} />
      </div>
    </form>
  );
}
