"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import type { Booking, Location } from "@/lib/db";
import { updateAdminBooking } from "@/lib/actions";
import BookingItemsPicker, { type PickerService, type PickerProduct, type PickedItem } from "@/components/site/BookingItemsPicker";
import { formatMoney } from "@/lib/format";

const inputClasses =
  "w-full rounded-xl border border-mist-200 bg-white px-3 py-2 text-sm text-mist-950 placeholder:text-mist-400 transition-colors duration-200 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200";

export default function EditBookingForm({
  booking,
  serviceOptions,
  products,
  therapists,
  returnTo,
}: {
  booking: Booking;
  serviceOptions: PickerService[];
  products: PickerProduct[];
  therapists: string[];
  returnTo: string;
}) {
  const initialItems: PickedItem[] =
    booking.items && booking.items.length > 0
      ? booking.items.map((it, i) => ({ key: `e-${i}`, name: it.name, price: it.price, kind: it.kind, qty: it.qty, durationMin: it.durationMin }))
      : [{ key: "e-0", name: booking.service, price: booking.price, kind: "service", qty: 1, durationMin: booking.durationMin }];
  const initialSubtotal = initialItems.reduce((s, it) => s + it.price * it.qty, 0);

  const [subtotal, setSubtotal] = useState(initialSubtotal);
  const [count, setCount] = useState(initialItems.length);
  const [discount, setDiscount] = useState(Math.max(0, initialSubtotal - booking.price));

  const safeDiscount = Math.min(subtotal, Math.max(0, Number.isFinite(discount) ? discount : 0));
  const finalPrice = Math.max(0, subtotal - safeDiscount);
  const cleanedNotes = (booking.notes ?? "")
    .replace(/(^| — )Discount K[\d,]+/g, "")
    .replace(/^Walk-in( — )?/, "")
    .trim();

  return (
    <form action={updateAdminBooking} className="mt-4 rounded-xl border border-mist-200 bg-mist-50 p-4">
      <input type="hidden" name="id" value={booking.id} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <input type="hidden" name="discount" value={safeDiscount} />

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label htmlFor={`edit-customer-${booking.id}`} className="mb-1 block text-xs font-medium text-mist-800">Guest name</label>
          <input id={`edit-customer-${booking.id}`} name="customer" defaultValue={booking.customer} required className={inputClasses} />
        </div>
        <div>
          <label htmlFor={`edit-phone-${booking.id}`} className="mb-1 block text-xs font-medium text-mist-800">Phone</label>
          <input id={`edit-phone-${booking.id}`} name="phone" type="tel" defaultValue={booking.phone} className={inputClasses} />
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor={`edit-email-${booking.id}`} className="mb-1 block text-xs font-medium text-mist-800">
          Email <span className="font-normal text-mist-500">(for invoice &amp; receipt)</span>
        </label>
        <input id={`edit-email-${booking.id}`} name="email" type="email" defaultValue={booking.email} placeholder="guest@example.com" className={inputClasses} />
      </div>

      <div className="mt-3">
        <label className="mb-1 block text-xs font-medium text-mist-800">Services &amp; products</label>
        <BookingItemsPicker
          services={serviceOptions}
          products={products}
          initial={initialItems}
          onChange={(info) => {
            setSubtotal(info.subtotal);
            setCount(info.count);
          }}
        />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div>
          <label htmlFor={`edit-discount-${booking.id}`} className="mb-1 block text-xs font-medium text-mist-800">Discount (K)</label>
          <input
            id={`edit-discount-${booking.id}`}
            type="number"
            min="0"
            max={subtotal}
            step="0.01"
            value={discount || ""}
            onChange={(event) => setDiscount(Number(event.target.value))}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-mist-800">Final price</label>
          <input value={formatMoney(finalPrice)} readOnly className={`${inputClasses} bg-white font-semibold`} />
        </div>
        <div>
          <label htmlFor={`edit-location-${booking.id}`} className="mb-1 block text-xs font-medium text-mist-800">Location</label>
          <select id={`edit-location-${booking.id}`} name="location" defaultValue={booking.location ?? "Kabulonga"} className={inputClasses}>
            {(["Kabulonga", "Twangale"] satisfies Location[]).map((location) => (
              <option key={location}>{location}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div>
          <label htmlFor={`edit-date-${booking.id}`} className="mb-1 block text-xs font-medium text-mist-800">Date</label>
          <input id={`edit-date-${booking.id}`} name="date" type="date" required defaultValue={booking.date} className={inputClasses} />
        </div>
        <div>
          <label htmlFor={`edit-time-${booking.id}`} className="mb-1 block text-xs font-medium text-mist-800">Time</label>
          <input id={`edit-time-${booking.id}`} name="time" type="time" required defaultValue={booking.time} className={inputClasses} />
        </div>
        <div>
          <label htmlFor={`edit-therapist-${booking.id}`} className="mb-1 block text-xs font-medium text-mist-800">Therapist</label>
          <select id={`edit-therapist-${booking.id}`} name="therapist" defaultValue={booking.therapist ?? ""} className={inputClasses}>
            <option value="">Assign later</option>
            {therapists.map((therapist) => (
              <option key={therapist} value={therapist}>{therapist}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor={`edit-notes-${booking.id}`} className="mb-1 block text-xs font-medium text-mist-800">Notes</label>
        <input id={`edit-notes-${booking.id}`} name="notes" defaultValue={cleanedNotes} className={inputClasses} />
      </div>

      <button
        type="submit"
        disabled={count === 0}
        className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-mist-600 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-mist-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save className="h-3.5 w-3.5" aria-hidden="true" />
        Save changes
      </button>
    </form>
  );
}
