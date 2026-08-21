"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, PackageX } from "lucide-react";
import { createProductSale } from "@/lib/actions";
import { formatMoney } from "@/lib/format";
import type { Location } from "@/lib/db";
import PaymentSplitFields from "./PaymentSplitFields";

const methods = ["Cash", "Card", "Mobile Money", "Bank Transfer"];
const locations: Location[] = ["Kabulonga", "Twangale"];

export type RetailItem = {
  id: string;
  name: string;
  brand?: string;
  volume?: string;
  unit: string;
  category: string;
  retailPrice: number;
  quantity: number; // stock on hand
};

export default function ProductPOS({ items }: { items: RetailItem[] }) {
  const [customer, setCustomer] = useState("");
  const [location, setLocation] = useState<Location>("Kabulonga");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [balanced, setBalanced] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const byId = useMemo(() => new Map(items.map((it) => [it.id, it])), [items]);
  const lines = Object.entries(cart)
    .map(([id, qty]) => ({ item: byId.get(id)!, qty }))
    .filter((l) => l.item && l.qty > 0);
  const total = lines.reduce((sum, l) => sum + l.qty * l.item.retailPrice, 0);

  const setQty = (id: string, qty: number) => {
    const item = byId.get(id);
    if (!item) return;
    const clamped = Math.max(0, Math.min(qty, item.quantity));
    setCart((c) => {
      const next = { ...c };
      if (clamped <= 0) delete next[id];
      else next[id] = clamped;
      return next;
    });
  };
  const add = (id: string) => setQty(id, (cart[id] ?? 0) + 1);
  const sub = (id: string) => setQty(id, (cart[id] ?? 0) - 1);

  return (
    <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
      {/* Product grid */}
      <div className="rounded-2xl border border-mist-200 bg-white p-6 shadow-soft">
        <h2 className="font-serif text-xl font-semibold text-mist-950">Products</h2>
        <p className="mt-2 text-sm leading-relaxed text-mist-700">
          Retail items from inventory. Selling here reduces stock automatically and prints a receipt.
        </p>

        {items.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-mist-300 bg-mist-50 p-10 text-center">
            <PackageX className="h-6 w-6 text-mist-400" aria-hidden="true" />
            <p className="text-sm text-mist-700">
              No products have a retail price yet. Set a sale price on an inventory item to sell it here.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {items.map((item) => {
              const inCart = cart[item.id] ?? 0;
              const soldOut = item.quantity <= 0;
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-4 ${soldOut ? "border-mist-100 bg-mist-50 opacity-70" : "border-mist-200 bg-white"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-mist-950">{item.name}</p>
                      <p className="text-xs text-mist-600">
                        {[item.brand, item.volume].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <span className="shrink-0 font-semibold text-mist-900">{formatMoney(item.retailPrice)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`text-xs ${item.quantity <= 3 ? "text-amber-700" : "text-mist-600"}`}>
                      {soldOut ? "Out of stock" : `${item.quantity} ${item.unit} in stock`}
                    </span>
                    {inCart > 0 ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => sub(item.id)}
                          aria-label={`Remove one ${item.name}`}
                          className="rounded-full border border-mist-300 p-1.5 text-mist-700 hover:bg-mist-50"
                        >
                          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-mist-950">{inCart}</span>
                        <button
                          type="button"
                          onClick={() => add(item.id)}
                          disabled={inCart >= item.quantity}
                          aria-label={`Add one ${item.name}`}
                          className="rounded-full border border-mist-300 p-1.5 text-mist-700 hover:bg-mist-50 disabled:opacity-40"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => add(item.id)}
                        disabled={soldOut}
                        className="rounded-full border border-mist-300 bg-white px-4 py-1.5 text-sm font-semibold text-mist-700 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50 disabled:opacity-40"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cart + checkout */}
      <div className="rounded-2xl border border-mist-200 bg-white p-6 shadow-soft">
        <h3 className="font-serif text-lg font-semibold text-mist-950">Sale</h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-mist-700">Customer</span>
            <input
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="Walk-in customer"
              className="mt-1.5 w-full rounded-xl border border-mist-200 bg-mist-50 px-3.5 py-2.5 text-sm text-mist-900 outline-none focus:border-mist-400 focus:bg-white"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-mist-700">Location</span>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value as Location)}
              className="mt-1.5 w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-mist-900 outline-none focus:border-mist-400"
            >
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 space-y-2">
          {lines.length === 0 ? (
            <p className="rounded-xl border border-dashed border-mist-200 bg-mist-50 p-4 text-center text-sm text-mist-600">
              Add products to start a sale.
            </p>
          ) : (
            lines.map((l) => (
              <div key={l.item.id} className="flex items-center justify-between gap-3 rounded-xl bg-mist-50 px-3.5 py-2.5 text-sm">
                <span className="text-mist-800">
                  {l.qty} × {l.item.name}
                </span>
                <span className="font-semibold text-mist-950">{formatMoney(l.qty * l.item.retailPrice)}</span>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-mist-900 px-4 py-3 text-white">
          <span className="text-sm">Total</span>
          <span className="font-serif text-xl font-semibold">{formatMoney(total)}</span>
        </div>

        <form action={createProductSale} onSubmit={() => setSubmitting(true)} className="mt-4 space-y-4">
          {lines.map((l) => (
            <span key={l.item.id}>
              <input type="hidden" name="itemId" value={l.item.id} />
              <input type="hidden" name="qty" value={l.qty} />
            </span>
          ))}
          <input type="hidden" name="customer" value={customer} />
          <input type="hidden" name="location" value={location} />

          <PaymentSplitFields total={total} methods={methods} onBalancedChange={setBalanced} />

          <button
            type="submit"
            disabled={lines.length === 0 || !balanced || submitting}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-mist-600 px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700 disabled:cursor-not-allowed disabled:bg-mist-300"
          >
            {submitting ? "Processing…" : "Complete sale & print receipt"}
          </button>
        </form>
      </div>
    </section>
  );
}
