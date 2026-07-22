"use client";

import { useActionState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";
import { createEnquiry, type ActionResult } from "@/lib/actions";

const inputClasses =
  "w-full rounded-xl border border-mist-200 bg-white px-4 py-3 text-sm text-mist-950 placeholder:text-mist-400 transition-colors duration-200 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200";

type ExtraField = {
  label: string;
  type?: "text" | "select" | "textarea";
  options?: string[];
  placeholder?: string;
  required?: boolean;
};

export default function EnquiryForm({
  type,
  submitLabel = "Send Enquiry",
  messageLabel = "How can we help?",
  messagePlaceholder = "Tell us a little about what you're looking for…",
  showPhone = true,
  showLocation = true,
  extraFields = [],
  typeOptions,
}: {
  type: string;
  submitLabel?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  showPhone?: boolean;
  showLocation?: boolean;
  extraFields?: ExtraField[];
  /** When set, the visitor chooses the enquiry type from this list. */
  typeOptions?: { label: string; value: string }[];
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    createEnquiry,
    null
  );

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-mist-200 bg-white p-8 text-center shadow-soft">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mist-100 text-mist-600">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </div>
        <h3 className="mt-5 font-serif text-xl font-semibold text-mist-950">Enquiry received</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-mist-700">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-2xl border border-mist-200 bg-white p-7 shadow-soft sm:p-8">
      {!typeOptions && <input type="hidden" name="type" value={type} />}
      <div className="grid gap-4 sm:grid-cols-2">
        {typeOptions && (
          <div className="sm:col-span-2">
            <label htmlFor="ef-type" className="mb-1.5 block text-sm font-medium text-mist-900">
              What can we help with?
            </label>
            <select id="ef-type" name="type" defaultValue={type} className={inputClasses}>
              {typeOptions.map((o) => (
                <option key={o.label} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="sm:col-span-2">
          <label htmlFor="ef-name" className="mb-1.5 block text-sm font-medium text-mist-900">
            Full name
          </label>
          <input id="ef-name" name="name" required autoComplete="name" placeholder="Your name" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="ef-email" className="mb-1.5 block text-sm font-medium text-mist-900">
            Email
          </label>
          <input id="ef-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={inputClasses} />
        </div>
        {showPhone && (
          <div>
            <label htmlFor="ef-phone" className="mb-1.5 block text-sm font-medium text-mist-900">
              Phone / WhatsApp <span className="font-normal text-mist-500">(optional)</span>
            </label>
            <input id="ef-phone" name="phone" type="tel" autoComplete="tel" placeholder="+260 …" className={inputClasses} />
          </div>
        )}
        {showLocation && (
          <div>
            <label htmlFor="ef-location" className="mb-1.5 block text-sm font-medium text-mist-900">
              Preferred location
            </label>
            <select id="ef-location" name="location" defaultValue="" className={inputClasses}>
              <option value="">No preference</option>
              <option>Kabulonga</option>
              <option>Twangale Resort</option>
            </select>
          </div>
        )}
        {extraFields.map((f) => {
          const name = `detail_${f.label.replace(/\s+/g, "_")}`;
          const id = `ef-${name}`;
          return (
            <div key={f.label} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
              <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-mist-900">
                {f.label}
                {!f.required && <span className="font-normal text-mist-500"> (optional)</span>}
              </label>
              {f.type === "select" ? (
                <select id={id} name={name} defaultValue="" required={f.required} className={inputClasses}>
                  <option value="" disabled>
                    Choose…
                  </option>
                  {f.options?.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ) : f.type === "textarea" ? (
                <textarea id={id} name={name} rows={3} required={f.required} placeholder={f.placeholder} className={inputClasses} />
              ) : (
                <input id={id} name={name} required={f.required} placeholder={f.placeholder} className={inputClasses} />
              )}
            </div>
          );
        })}
        <div className="sm:col-span-2">
          <label htmlFor="ef-message" className="mb-1.5 block text-sm font-medium text-mist-900">
            {messageLabel}
          </label>
          <textarea id="ef-message" name="message" rows={4} required placeholder={messagePlaceholder} className={inputClasses} />
        </div>
      </div>

      {state && !state.ok && (
        <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-mist-600 px-8 py-4 text-sm font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-mist-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            {submitLabel}
          </>
        )}
      </button>
      <p className="mt-3 text-center text-xs text-mist-500">
        For same-day requests, WhatsApp is the fastest way to reach us.
      </p>
    </form>
  );
}
