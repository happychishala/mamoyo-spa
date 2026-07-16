"use client";

import { useMemo, useState } from "react";
import { Save, Search } from "lucide-react";
import type { Booking, Location } from "@/lib/db";
import { updateAdminBooking } from "@/lib/actions";

const inputClasses =
  "w-full rounded-xl border border-mist-200 bg-white px-3 py-2 text-sm text-mist-950 placeholder:text-mist-400 transition-colors duration-200 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200";

interface ServiceOption {
  name: string;
  price: number;
  durationMin: number;
  section: string;
}

export default function EditBookingForm({
  booking,
  serviceOptions,
  therapists,
  returnTo,
}: {
  booking: Booking;
  serviceOptions: ServiceOption[];
  therapists: string[];
  returnTo: string;
}) {
  const existingService =
    serviceOptions.find((s) => s.name === booking.service) ?? {
      name: booking.service,
      price: booking.price,
      durationMin: booking.durationMin,
      section: "Current booking",
    };
  const initialDiscount = Math.max(0, existingService.price - booking.price);
  const [query, setQuery] = useState(existingService.name);
  const [selectedService, setSelectedService] = useState<ServiceOption>(existingService);
  const [discount, setDiscount] = useState(initialDiscount);

  const filteredServices = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matches = normalized
      ? serviceOptions.filter((s) =>
          `${s.name} ${s.section}`.toLowerCase().includes(normalized)
        )
      : serviceOptions;

    return matches.slice(0, 6);
  }, [query, serviceOptions]);

  const safeDiscount = Math.min(
    selectedService.price,
    Math.max(0, Number.isFinite(discount) ? discount : 0)
  );
  const finalPrice = Math.max(0, selectedService.price - safeDiscount);

  function selectService(service: ServiceOption) {
    setSelectedService(service);
    setQuery(service.name);
    setDiscount(0);
  }

  return (
    <form action={updateAdminBooking} className="mt-4 rounded-xl border border-mist-200 bg-mist-50 p-4">
      <input type="hidden" name="id" value={booking.id} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <input type="hidden" name="service" value={selectedService.name} />
      <input type="hidden" name="durationMin" value={selectedService.durationMin} />
      <input type="hidden" name="discount" value={safeDiscount} />

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label htmlFor={`edit-customer-${booking.id}`} className="mb-1 block text-xs font-medium text-mist-800">
            Guest name
          </label>
          <input id={`edit-customer-${booking.id}`} name="customer" defaultValue={booking.customer} required className={inputClasses} />
        </div>
        <div>
          <label htmlFor={`edit-phone-${booking.id}`} className="mb-1 block text-xs font-medium text-mist-800">
            Phone
          </label>
          <input id={`edit-phone-${booking.id}`} name="phone" type="tel" defaultValue={booking.phone} className={inputClasses} />
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor={`edit-service-${booking.id}`} className="mb-1 block text-xs font-medium text-mist-800">
          Product / service
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-400" aria-hidden="true" />
          <input
            id={`edit-service-${booking.id}`}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className={`${inputClasses} pl-9`}
          />
        </div>
        <div className="mt-2 max-h-44 overflow-y-auto rounded-xl border border-mist-200 bg-white">
          {filteredServices.map((service) => (
            <button
              key={service.name}
              type="button"
              onClick={() => selectService(service)}
              className={`flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2 text-left text-xs transition-colors duration-150 active:scale-[0.99] ${
                selectedService.name === service.name ? "bg-mist-100 text-mist-950" : "text-mist-800 hover:bg-mist-50"
              }`}
            >
              <span>
                <span className="block font-medium">{service.name}</span>
                <span className="block text-mist-500">{service.section}</span>
              </span>
              <span className="shrink-0 font-semibold">K{service.price.toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div>
          <label htmlFor={`edit-discount-${booking.id}`} className="mb-1 block text-xs font-medium text-mist-800">
            Discount (K)
          </label>
          <input
            id={`edit-discount-${booking.id}`}
            type="number"
            min="0"
            max={selectedService.price}
            step="0.01"
            value={discount}
            onChange={(event) => setDiscount(Number(event.target.value))}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor={`edit-price-${booking.id}`} className="mb-1 block text-xs font-medium text-mist-800">
            Final price (K)
          </label>
          <input id={`edit-price-${booking.id}`} name="price" type="number" value={finalPrice} readOnly className={`${inputClasses} bg-white font-semibold`} />
        </div>
        <div>
          <label htmlFor={`edit-location-${booking.id}`} className="mb-1 block text-xs font-medium text-mist-800">
            Location
          </label>
          <select id={`edit-location-${booking.id}`} name="location" defaultValue={booking.location ?? "Kabulonga"} className={inputClasses}>
            {(["Kabulonga", "Twangale"] satisfies Location[]).map((location) => (
              <option key={location}>{location}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div>
          <label htmlFor={`edit-date-${booking.id}`} className="mb-1 block text-xs font-medium text-mist-800">
            Date
          </label>
          <input id={`edit-date-${booking.id}`} name="date" type="date" required defaultValue={booking.date} className={inputClasses} />
        </div>
        <div>
          <label htmlFor={`edit-time-${booking.id}`} className="mb-1 block text-xs font-medium text-mist-800">
            Time
          </label>
          <input id={`edit-time-${booking.id}`} name="time" type="time" required defaultValue={booking.time} className={inputClasses} />
        </div>
        <div>
          <label htmlFor={`edit-therapist-${booking.id}`} className="mb-1 block text-xs font-medium text-mist-800">
            Therapist
          </label>
          <select id={`edit-therapist-${booking.id}`} name="therapist" defaultValue={booking.therapist ?? ""} className={inputClasses}>
            <option value="">Assign later</option>
            {therapists.map((therapist) => (
              <option key={therapist} value={therapist}>
                {therapist}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor={`edit-notes-${booking.id}`} className="mb-1 block text-xs font-medium text-mist-800">
          Notes
        </label>
        <input id={`edit-notes-${booking.id}`} name="notes" defaultValue={booking.notes ?? ""} className={inputClasses} />
      </div>

      <button
        type="submit"
        className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-mist-600 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
      >
        <Save className="h-3.5 w-3.5" aria-hidden="true" />
        Save changes
      </button>
    </form>
  );
}
