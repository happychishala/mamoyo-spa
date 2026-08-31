"use client";

import { useActionState, useState } from "react";
import { CalendarPlus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createAdminBooking, type ActionResult } from "@/lib/actions";
import BookingItemsPicker, { type PickerService, type PickerProduct } from "@/components/site/BookingItemsPicker";
import { formatMoney } from "@/lib/format";

const inputClasses =
  "w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-mist-950 placeholder:text-mist-400 transition-colors duration-200 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200";

export default function NewBookingForm({
  serviceOptions,
  products,
  therapists,
  defaultDate,
}: {
  serviceOptions: PickerService[];
  products: PickerProduct[];
  therapists: string[];
  defaultDate: string;
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(createAdminBooking, null);
  const [subtotal, setSubtotal] = useState(0);
  const [count, setCount] = useState(0);
  const [discount, setDiscount] = useState(0);

  const safeDiscount = Math.min(subtotal, Math.max(0, Number.isFinite(discount) ? discount : 0));
  const finalPrice = Math.max(0, subtotal - safeDiscount);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="nb-customer" className="mb-1 block text-xs font-medium text-mist-800">Guest name</label>
          <input id="nb-customer" name="customer" type="text" required placeholder="Walk-in guest" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="nb-phone" className="mb-1 block text-xs font-medium text-mist-800">Phone <span className="font-normal text-mist-500">(optional)</span></label>
          <input id="nb-phone" name="phone" type="tel" placeholder="+260 …" className={inputClasses} />
        </div>
      </div>

      <div>
        <label htmlFor="nb-email" className="mb-1 block text-xs font-medium text-mist-800">
          Email <span className="font-normal text-mist-500">(optional — to email the invoice &amp; receipt)</span>
        </label>
        <input id="nb-email" name="email" type="email" autoComplete="off" placeholder="guest@example.com" className={inputClasses} />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-mist-800">Services &amp; products</label>
        <BookingItemsPicker
          services={serviceOptions}
          products={products}
          onChange={(info) => {
            setSubtotal(info.subtotal);
            setCount(info.count);
          }}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-mist-800">Subtotal</label>
          <input value={formatMoney(subtotal)} readOnly className={`${inputClasses} bg-mist-50`} />
        </div>
        <div>
          <label htmlFor="nb-discount" className="mb-1 block text-xs font-medium text-mist-800">Discount (K)</label>
          <input
            id="nb-discount"
            name="discount"
            type="number"
            min="0"
            max={subtotal}
            step="0.01"
            value={discount || ""}
            onChange={(e) => setDiscount(Number(e.target.value))}
            placeholder="0.00"
            className={inputClasses}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-mist-800">Final price</label>
          <input value={formatMoney(finalPrice)} readOnly className={`${inputClasses} bg-mist-50 font-semibold`} />
        </div>
      </div>

      <div>
        <label htmlFor="nb-location" className="mb-1 block text-xs font-medium text-mist-800">Location</label>
        <select id="nb-location" name="location" required defaultValue="Kabulonga" className={inputClasses}>
          <option>Kabulonga</option>
          <option>Twangale</option>
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="nb-date" className="mb-1 block text-xs font-medium text-mist-800">Date</label>
          <input id="nb-date" name="date" type="date" required defaultValue={defaultDate} className={inputClasses} />
        </div>
        <div>
          <label htmlFor="nb-time" className="mb-1 block text-xs font-medium text-mist-800">Time</label>
          <input id="nb-time" name="time" type="time" required className={inputClasses} />
        </div>
        <div>
          <label htmlFor="nb-therapist" className="mb-1 block text-xs font-medium text-mist-800">Therapist</label>
          <select id="nb-therapist" name="therapist" defaultValue="" className={inputClasses}>
            <option value="">Assign later</option>
            {therapists.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {state && (
        <p
          role="status"
          className={`flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-xs ${
            state.ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {state.ok ? <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || count === 0}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-mist-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-mist-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <CalendarPlus className="h-4 w-4" aria-hidden="true" />}
        {pending ? "Creating…" : count === 0 ? "Add a service or product" : "Create booking"}
      </button>
    </form>
  );
}
