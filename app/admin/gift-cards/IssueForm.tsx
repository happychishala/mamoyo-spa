"use client";

import { useActionState, useState } from "react";
import { Gift, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { issueGiftCard, type ActionResult } from "@/lib/actions";

const input =
  "w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-mist-950 placeholder:text-mist-400 transition-colors duration-200 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200";
const label = "mb-1 block text-xs font-medium text-mist-800";

export default function IssueForm({
  values,
  experiences,
  prompts,
  minCustom,
  locations,
}: {
  values: readonly number[];
  experiences: readonly string[];
  prompts: { occasion: string; message: string }[];
  minCustom: number;
  locations: readonly string[];
}) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    issueGiftCard,
    null
  );
  const [mode, setMode] = useState<"value" | "experience">("value");
  const [amount, setAmount] = useState<string>(String(values[1] ?? values[0]));
  const [message, setMessage] = useState("");
  const [occasion, setOccasion] = useState("");

  return (
    <form action={action} className="space-y-5">
      {/* What the card is worth */}
      <fieldset>
        <legend className={label}>What is the gift?</legend>
        <div className="flex gap-2">
          {(["value", "experience"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`cursor-pointer rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200 ${
                mode === m
                  ? "bg-mist-600 text-white"
                  : "border border-mist-300 text-mist-700 hover:bg-mist-50"
              }`}
            >
              {m === "value" ? "A value" : "An experience"}
            </button>
          ))}
        </div>
      </fieldset>

      {mode === "value" ? (
        <div>
          <label htmlFor="gc-value" className={label}>
            Value
          </label>
          <div className="flex flex-wrap gap-2">
            {values.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setAmount(String(v))}
                className={`cursor-pointer rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200 ${
                  amount === String(v)
                    ? "bg-mist-600 text-white"
                    : "border border-mist-300 text-mist-700 hover:bg-mist-50"
                }`}
              >
                K{v.toLocaleString()}
              </button>
            ))}
          </div>
          <input
            id="gc-value"
            name="value"
            type="number"
            min={minCustom}
            step={50}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`${input} mt-3`}
          />
          <p className="mt-1 text-xs text-mist-600">Custom values from K{minCustom}.</p>
          <input type="hidden" name="experience" value="" />
        </div>
      ) : (
        <div>
          <label htmlFor="gc-exp" className={label}>
            Experience
          </label>
          <select id="gc-exp" name="experience" defaultValue={experiences[0]} className={input}>
            {experiences.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          <input type="hidden" name="value" value="0" />
        </div>
      )}

      {/* Who */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="gc-to" className={label}>
            For
          </label>
          <input id="gc-to" name="recipientName" type="text" required placeholder="Recipient name" className={input} />
        </div>
        <div>
          <label htmlFor="gc-from" className={label}>
            From
          </label>
          <input id="gc-from" name="senderName" type="text" required placeholder="Who it is from" className={input} />
        </div>
        <div>
          <label htmlFor="gc-email" className={label}>
            Recipient email <span className="font-normal text-mist-500">(to send it)</span>
          </label>
          <input id="gc-email" name="recipientEmail" type="email" placeholder="them@example.com" className={input} />
        </div>
        <div>
          <label htmlFor="gc-phone" className={label}>
            Recipient WhatsApp <span className="font-normal text-mist-500">(optional)</span>
          </label>
          <input id="gc-phone" name="recipientPhone" type="tel" placeholder="+260 …" className={input} />
        </div>
      </div>

      {/* Dedication */}
      <div>
        <label className={label}>Message</label>
        <div className="flex flex-wrap gap-2">
          {prompts.map((p) => (
            <button
              key={p.occasion}
              type="button"
              onClick={() => {
                setMessage(p.message);
                setOccasion(p.occasion);
              }}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                occasion === p.occasion
                  ? "bg-cocoa-700 text-white"
                  : "border border-mist-300 text-mist-700 hover:bg-mist-50"
              }`}
            >
              {p.occasion}
            </button>
          ))}
        </div>
        <textarea
          name="message"
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Written on the card. Leave blank for none."
          className={`${input} mt-3`}
        />
        <input type="hidden" name="occasion" value={occasion} />
      </div>

      {/* Delivery + branch */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="gc-delivery" className={label}>
            Delivery
          </label>
          <select id="gc-delivery" name="delivery" defaultValue="Email" className={input}>
            <option>Email</option>
            <option>WhatsApp</option>
            <option>Presentation card</option>
          </select>
        </div>
        <div>
          <label htmlFor="gc-loc" className={label}>
            Home branch
          </label>
          <select id="gc-loc" name="location" defaultValue="Kabulonga" className={input}>
            {locations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="gc-corp" className={label}>
            Company <span className="font-normal text-mist-500">(optional)</span>
          </label>
          <input id="gc-corp" name="corporateAccount" type="text" placeholder="Corporate order" className={input} />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-mist-600 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700 disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Gift className="h-4 w-4" aria-hidden="true" />}
        Issue gift card
      </button>

      {state && (
        <p
          role="status"
          className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${
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
      )}
    </form>
  );
}
