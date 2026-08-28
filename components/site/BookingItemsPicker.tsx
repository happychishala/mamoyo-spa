"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Plus, Minus, X, Clock } from "lucide-react";

export type PickerService = { name: string; price: number; durationMin: number; section: string };
export type PickerProduct = { name: string; price: number };
export type PickedItem = {
  key: string;
  name: string;
  price: number;
  kind: "service" | "product";
  qty: number;
  durationMin?: number;
};

function formatK(n: number) {
  return `K${n.toLocaleString()}`;
}

let counter = 0;
const nextKey = () => `it-${Date.now()}-${counter++}`;

export default function BookingItemsPicker({
  services,
  products,
  initial = [],
  onChange,
}: {
  services: PickerService[];
  products: PickerProduct[];
  initial?: PickedItem[];
  onChange?: (info: { subtotal: number; durationMin: number; count: number }) => void;
}) {
  const [items, setItems] = useState<PickedItem[]>(initial);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [customPrice, setCustomPrice] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const durationMin = items
    .filter((i) => i.kind === "service")
    .reduce((s, it) => s + (it.durationMin ?? 0) * it.qty, 0);

  useEffect(() => {
    onChange?.({ subtotal, durationMin, count: items.length });
  }, [subtotal, durationMin, items.length, onChange]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const q = query.trim().toLowerCase();
  const matchedServices = useMemo(
    () => (q ? services.filter((s) => `${s.name} ${s.section}`.toLowerCase().includes(q)) : services).slice(0, 30),
    [services, q]
  );
  const matchedProducts = useMemo(
    () => (q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products).slice(0, 30),
    [products, q]
  );

  const add = (base: Omit<PickedItem, "key" | "qty">) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.name === base.name && p.kind === base.kind);
      if (existing) return prev.map((p) => (p === existing ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { ...base, key: nextKey(), qty: 1 }];
    });
    setQuery("");
  };
  const setQty = (key: string, qty: number) =>
    setItems((prev) => prev.map((p) => (p.key === key ? { ...p, qty } : p)).filter((p) => p.qty > 0));
  const remove = (key: string) => setItems((prev) => prev.filter((p) => p.key !== key));

  const addCustom = () => {
    const name = query.trim();
    const price = Number(customPrice);
    if (!name || !Number.isFinite(price) || price < 0) return;
    add({ name, price, kind: "service", durationMin: 60 });
    setCustomPrice("");
  };

  const inputCls =
    "w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-mist-950 placeholder:text-mist-400 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200";

  return (
    <div className="space-y-3">
      {/* Hidden inputs the server reads back */}
      {items.map((it) => (
        <span key={`h-${it.key}`}>
          <input type="hidden" name="itemName" value={it.name} />
          <input type="hidden" name="itemPrice" value={it.price} />
          <input type="hidden" name="itemKind" value={it.kind} />
          <input type="hidden" name="itemQty" value={it.qty} />
          <input type="hidden" name="itemDuration" value={it.durationMin ?? ""} />
        </span>
      ))}

      {/* Selected items */}
      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map((it) => (
            <li key={it.key} className="flex items-center gap-3 rounded-xl border border-mist-200 bg-white p-2.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-mist-950">{it.name}</p>
                <p className="text-xs text-mist-500">
                  {formatK(it.price)}
                  <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide ${it.kind === "product" ? "bg-amber-50 text-amber-700" : "bg-mist-100 text-mist-600"}`}>
                    {it.kind}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => setQty(it.key, it.qty - 1)} aria-label="Decrease" className="rounded-full border border-mist-300 p-1 text-mist-700 hover:bg-mist-50">
                  <Minus className="h-3 w-3" aria-hidden="true" />
                </button>
                <span className="w-5 text-center text-sm font-semibold text-mist-950">{it.qty}</span>
                <button type="button" onClick={() => setQty(it.key, it.qty + 1)} aria-label="Increase" className="rounded-full border border-mist-300 p-1 text-mist-700 hover:bg-mist-50">
                  <Plus className="h-3 w-3" aria-hidden="true" />
                </button>
              </div>
              <span className="w-16 shrink-0 text-right text-sm font-semibold text-mist-950">{formatK(it.price * it.qty)}</span>
              <button type="button" onClick={() => remove(it.key)} aria-label={`Remove ${it.name}`} className="shrink-0 rounded-full p-1 text-mist-400 hover:bg-red-50 hover:text-red-600">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add search */}
      <div ref={rootRef} className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-400" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={items.length ? "Add another service or product…" : "Search services and products to add…"}
          className={`${inputCls} pl-9`}
          autoComplete="off"
        />

        {open && (
          <div className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-mist-200 bg-white p-1 shadow-lg">
            {matchedServices.length === 0 && matchedProducts.length === 0 && (
              <p className="px-3 py-6 text-center text-sm text-mist-500">Nothing matches “{query}”.</p>
            )}
            {matchedServices.length > 0 && (
              <>
                <p className="px-3 pb-1 pt-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-mist-500">Services</p>
                {matchedServices.map((s) => (
                  <button
                    key={`s-${s.name}`}
                    type="button"
                    onClick={() => add({ name: s.name, price: s.price, kind: "service", durationMin: s.durationMin })}
                    className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-mist-50"
                  >
                    <span className="text-mist-900">{s.name}</span>
                    <span className="shrink-0 tabular-nums text-mist-600">{formatK(s.price)}</span>
                  </button>
                ))}
              </>
            )}
            {matchedProducts.length > 0 && (
              <>
                <p className="px-3 pb-1 pt-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-mist-500">Products</p>
                {matchedProducts.map((p) => (
                  <button
                    key={`p-${p.name}`}
                    type="button"
                    onClick={() => add({ name: p.name, price: p.price, kind: "product" })}
                    className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-mist-50"
                  >
                    <span className="text-mist-900">{p.name}</span>
                    <span className="shrink-0 tabular-nums text-mist-600">{formatK(p.price)}</span>
                  </button>
                ))}
              </>
            )}

            {/* Custom item */}
            {query.trim() && (
              <div className="mt-1 flex items-center gap-2 border-t border-mist-100 p-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  placeholder="Price"
                  className="w-24 rounded-lg border border-mist-200 bg-white px-2.5 py-1.5 text-right text-sm focus:border-mist-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addCustom}
                  className="flex-1 rounded-lg bg-mist-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-mist-700"
                >
                  Add “{query.trim()}” as custom
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Totals */}
      {items.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-mist-50 px-4 py-2.5 text-sm">
          <span className="inline-flex items-center gap-1.5 text-mist-600">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {durationMin > 0 ? `${durationMin} min` : "—"}
          </span>
          <span className="text-mist-700">
            Subtotal <span className="font-serif text-base font-semibold text-mist-950">{formatK(subtotal)}</span>
          </span>
        </div>
      )}
    </div>
  );
}
