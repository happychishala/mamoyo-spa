"use client";

import { useActionState, useMemo, useState } from "react";
import { CalendarPlus, Loader2, CheckCircle2, AlertCircle, Search } from "lucide-react";
import { createAdminBooking, type ActionResult } from "@/lib/actions";

const inputClasses =
  "w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-mist-950 placeholder:text-mist-400 transition-colors duration-200 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200";

interface ServiceOption {
  name: string;
  price: number;
  durationMin: number;
  section: string;
}

export default function NewBookingForm({
  serviceOptions,
  therapists,
  defaultDate,
}: {
  serviceOptions: ServiceOption[];
  therapists: string[];
  defaultDate: string;
}) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    createAdminBooking,
    null
  );
  const [query, setQuery] = useState("");
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null);
  const [discount, setDiscount] = useState(0);

  const filteredServices = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matches = normalized
      ? serviceOptions.filter((s) =>
          `${s.name} ${s.section}`.toLowerCase().includes(normalized)
        )
      : serviceOptions;

    return matches.slice(0, 8);
  }, [query, serviceOptions]);

  const listedPrice = selectedService?.price ?? 0;
  const safeDiscount = Math.min(listedPrice, Math.max(0, Number.isFinite(discount) ? discount : 0));
  const finalPrice = Math.max(0, listedPrice - safeDiscount);

  function selectService(service: ServiceOption) {
    setSelectedService(service);
    setQuery(service.name);
    setDiscount(0);
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="nb-customer" className="mb-1 block text-xs font-medium text-mist-800">
            Guest name
          </label>
          <input id="nb-customer" name="customer" type="text" required placeholder="Walk-in guest" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="nb-phone" className="mb-1 block text-xs font-medium text-mist-800">
            Phone <span className="font-normal text-mist-500">(optional)</span>
          </label>
          <input id="nb-phone" name="phone" type="tel" placeholder="+260 …" className={inputClasses} />
        </div>
      </div>

      <div>
        <label htmlFor="nb-service-search" className="mb-1 block text-xs font-medium text-mist-800">
          Product / service
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-400" aria-hidden="true" />
          <input
            id="nb-service-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedService(null);
              setDiscount(0);
            }}
            placeholder="Search product or treatment..."
            className={`${inputClasses} pl-9`}
            autoComplete="off"
          />
        </div>
        <input type="hidden" name="service" value={selectedService?.name ?? ""} />
        <input type="hidden" name="durationMin" value={selectedService?.durationMin ?? 60} />
        <div className="mt-2 max-h-56 overflow-y-auto rounded-xl border border-mist-200 bg-white shadow-soft">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => {
              const selected = selectedService?.name === service.name;
              return (
                <button
                  key={service.name}
                  type="button"
                  onClick={() => selectService(service)}
                  className={`flex w-full cursor-pointer items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm transition-colors duration-150 active:scale-[0.99] ${
                    selected ? "bg-mist-100 text-mist-950" : "text-mist-800 hover:bg-mist-50"
                  }`}
                >
                  <span>
                    <span className="block font-medium">{service.name}</span>
                    <span className="block text-xs text-mist-500">{service.section}</span>
                  </span>
                  <span className="shrink-0 font-semibold text-mist-950">
                    K{service.price.toLocaleString()}
                  </span>
                </button>
              );
            })
          ) : (
            <p className="px-3.5 py-3 text-sm text-mist-500">No matching product found.</p>
          )}
        </div>
      </div>

      <input type="hidden" name="discount" value={safeDiscount} />

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="nb-listed-price" className="mb-1 block text-xs font-medium text-mist-800">
            Listed price (K)
          </label>
          <input
            id="nb-listed-price"
            type="number"
            min="0"
            step="0.01"
            value={listedPrice}
            readOnly
            className={`${inputClasses} bg-mist-50`}
          />
        </div>
        <div>
          <label htmlFor="nb-discount" className="mb-1 block text-xs font-medium text-mist-800">
            Discount (K)
          </label>
          <input
            id="nb-discount"
            type="number"
            min="0"
            max={listedPrice}
            step="0.01"
            value={discount}
            onChange={(event) => setDiscount(Number(event.target.value))}
            disabled={!selectedService}
            placeholder="0.00"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="nb-price" className="mb-1 block text-xs font-medium text-mist-800">
            Final price (K)
          </label>
          <input
            id="nb-price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={finalPrice}
            readOnly
            required
            className={`${inputClasses} bg-mist-50 font-semibold`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="nb-location" className="mb-1 block text-xs font-medium text-mist-800">
          Location
        </label>
        <select id="nb-location" name="location" required defaultValue="Kabulonga" className={inputClasses}>
          <option>Kabulonga</option>
          <option>Twangale</option>
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="nb-date" className="mb-1 block text-xs font-medium text-mist-800">
            Date
          </label>
          <input id="nb-date" name="date" type="date" required defaultValue={defaultDate} className={inputClasses} />
        </div>
        <div>
          <label htmlFor="nb-time" className="mb-1 block text-xs font-medium text-mist-800">
            Time
          </label>
          <input id="nb-time" name="time" type="time" required className={inputClasses} />
        </div>
        <div>
          <label htmlFor="nb-therapist" className="mb-1 block text-xs font-medium text-mist-800">
            Therapist
          </label>
          <select id="nb-therapist" name="therapist" defaultValue="" className={inputClasses}>
            <option value="">Assign later</option>
            {therapists.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {state && (
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
      )}

      <button
        type="submit"
        disabled={pending || !selectedService}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-mist-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-mist-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <CalendarPlus className="h-4 w-4" aria-hidden="true" />
        )}
        {pending ? "Creating…" : selectedService ? "Create booking" : "Select a product"}
      </button>
    </form>
  );
}
