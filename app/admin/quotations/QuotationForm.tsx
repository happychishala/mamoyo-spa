"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Plus, Trash2, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createQuotation, type ActionResult } from "@/lib/actions";
import { formatMoney } from "@/lib/format";

const inputClasses =
  "w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-mist-950 placeholder:text-mist-400 transition-colors duration-200 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200";

type Line = { description: string; qty: string; unitPrice: string };

const emptyLine = (): Line => ({ description: "", qty: "1", unitPrice: "" });

export default function QuotationForm({
  locations,
  today,
  validUntil,
}: {
  locations: string[];
  today: string;
  validUntil: string;
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(createQuotation, null);
  const [lines, setLines] = useState<Line[]>([emptyLine()]);

  const total = lines.reduce((sum, l) => sum + (Number(l.qty) || 0) * (Number(l.unitPrice) || 0), 0);

  const update = (i: number, patch: Partial<Line>) =>
    setLines((rows) => rows.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  const add = () => setLines((rows) => [...rows, emptyLine()]);
  const remove = (i: number) => setLines((rows) => (rows.length > 1 ? rows.filter((_, idx) => idx !== i) : rows));

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="q-customer" className="mb-1 block text-xs font-medium text-mist-800">Client</label>
          <input id="q-customer" name="customer" required placeholder="Client or company name" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="q-location" className="mb-1 block text-xs font-medium text-mist-800">Location</label>
          <select id="q-location" name="location" defaultValue={locations[0]} className={inputClasses}>
            {locations.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="q-email" className="mb-1 block text-xs font-medium text-mist-800">Email <span className="font-normal text-mist-500">(optional)</span></label>
          <input id="q-email" name="customerEmail" type="email" placeholder="client@example.com" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="q-phone" className="mb-1 block text-xs font-medium text-mist-800">Phone <span className="font-normal text-mist-500">(optional)</span></label>
          <input id="q-phone" name="customerPhone" type="tel" placeholder="+260 …" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="q-issue" className="mb-1 block text-xs font-medium text-mist-800">Issue date</label>
          <input id="q-issue" name="issueDate" type="date" defaultValue={today} className={inputClasses} />
        </div>
        <div>
          <label htmlFor="q-valid" className="mb-1 block text-xs font-medium text-mist-800">Valid until</label>
          <input id="q-valid" name="validUntil" type="date" defaultValue={validUntil} className={inputClasses} />
        </div>
      </div>

      {/* Line items */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-mist-600">Line items</span>
          <button type="button" onClick={add} className="inline-flex items-center gap-1 text-xs font-semibold text-mist-700 hover:text-mist-900">
            <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add line
          </button>
        </div>
        <div className="space-y-2">
          {lines.map((line, i) => (
            <div key={i} className="grid grid-cols-[1fr_4rem_6rem_auto] items-center gap-2">
              <input
                name="description"
                value={line.description}
                onChange={(e) => update(i, { description: e.target.value })}
                placeholder="Description"
                className={inputClasses}
              />
              <input
                name="qty"
                type="number"
                min="1"
                value={line.qty}
                onChange={(e) => update(i, { qty: e.target.value })}
                className={`${inputClasses} text-right`}
                aria-label="Quantity"
              />
              <input
                name="unitPrice"
                type="number"
                min="0"
                step="0.01"
                value={line.unitPrice}
                onChange={(e) => update(i, { unitPrice: e.target.value })}
                placeholder="0.00"
                className={`${inputClasses} text-right`}
                aria-label="Unit price"
              />
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Remove line"
                className="rounded-full p-2 text-mist-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-end gap-3 border-t border-mist-100 pt-3 text-sm">
          <span className="text-mist-600">Total</span>
          <span className="font-serif text-lg font-semibold text-mist-950">{formatMoney(total)}</span>
        </div>
      </div>

      <div>
        <label htmlFor="q-notes" className="mb-1 block text-xs font-medium text-mist-800">Notes <span className="font-normal text-mist-500">(optional)</span></label>
        <textarea id="q-notes" name="notes" rows={2} placeholder="Scope, terms, inclusions…" className={inputClasses} />
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
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-mist-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-mist-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <FileText className="h-4 w-4" aria-hidden="true" />}
        {pending ? "Creating…" : "Create quotation"}
      </button>
    </form>
  );
}
