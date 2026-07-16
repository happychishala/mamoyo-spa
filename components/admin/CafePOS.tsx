"use client";

import { useMemo, useState } from "react";
import { createCafeSale } from "@/lib/actions";
import { cafeMenu } from "@/lib/content";
import { formatMoney } from "@/lib/format";
import type { Location, PaymentMethod } from "@/lib/db";

const methods: PaymentMethod[] = ["Cash", "Card", "Mobile Money", "Bank Transfer"];
const locations: Location[] = ["Kabulonga", "Twangale"];

type CartItem = {
  description: string;
  qty: number;
  unitPrice: number;
};

function findCartItem(cart: CartItem[], description: string) {
  return cart.find((item) => item.description === description);
}

export default function CafePOS() {
  const [customer, setCustomer] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("Cash");
  const [location, setLocation] = useState<Location>("Kabulonga");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty * item.unitPrice, 0),
    [cart]
  );

  const addItem = (description: string, unitPrice: number) => {
    setCart((current) => {
      const existing = findCartItem(current, description);
      if (existing) {
        return current.map((item) =>
          item.description === description ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...current, { description, qty: 1, unitPrice }];
    });
  };

  const updateQty = (description: string, qty: number) => {
    setCart((current) =>
      current
        .map((item) => (item.description === description ? { ...item, qty } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (description: string) => {
    setCart((current) => current.filter((item) => item.description !== description));
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-mist-200 bg-white p-6 shadow-soft">
          <h2 className="font-serif text-xl font-semibold text-mist-950">Café POS</h2>
          <p className="mt-2 text-sm leading-relaxed text-mist-700">
            Add menu items to the sale, choose payment type and customer details, then print the receipt.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-mist-700">Customer</span>
              <input
                type="text"
                value={customer}
                onChange={(event) => setCustomer(event.target.value)}
                placeholder="Walk-in customer"
                className="mt-2 w-full rounded-2xl border border-mist-200 bg-mist-50 px-4 py-3 text-sm text-mist-900 outline-none transition duration-200 focus:border-mist-400 focus:bg-white"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-mist-700">Payment method</span>
              <select
                value={method}
                onChange={(event) => setMethod(event.target.value as PaymentMethod)}
                className="mt-2 w-full rounded-2xl border border-mist-200 bg-white px-4 py-3 text-sm text-mist-900 outline-none transition duration-200 focus:border-mist-400"
              >
                {methods.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-mist-700">Location</span>
              <select
                value={location}
                onChange={(event) => setLocation(event.target.value as Location)}
                className="mt-2 w-full rounded-2xl border border-mist-200 bg-white px-4 py-3 text-sm text-mist-900 outline-none transition duration-200 focus:border-mist-400"
              >
                {locations.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-mist-100 bg-mist-50 p-4">
            <h3 className="font-medium text-mist-900">Sale summary</h3>
            <dl className="mt-4 grid gap-3 text-sm text-mist-700">
              <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                <dt>Items</dt>
                <dd>{cart.length}</dd>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                <dt>Total</dt>
                <dd className="font-semibold text-mist-950">{formatMoney(total)}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="rounded-2xl border border-mist-200 bg-white p-6 shadow-soft">
          <h3 className="font-serif text-lg font-semibold text-mist-950">Cart</h3>
          {cart.length === 0 ? (
            <p className="mt-4 text-sm text-mist-700">Add items from the menu to begin the sale.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {cart.map((item) => (
                <div key={item.description} className="rounded-2xl border border-mist-200 bg-mist-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-mist-950">{item.description}</p>
                      <p className="mt-1 text-sm text-mist-700">{formatMoney(item.unitPrice)} each</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.description)}
                      className="text-xs font-semibold uppercase tracking-[0.24em] text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-sm text-mist-700">
                    <label className="inline-flex items-center gap-2">
                      Qty
                      <input
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={(event) => updateQty(item.description, Number(event.target.value))}
                        className="w-20 rounded-2xl border border-mist-200 bg-white px-3 py-2 text-sm text-mist-900 outline-none"
                      />
                    </label>
                    <span className="font-medium text-mist-950">
                      {formatMoney(item.qty * item.unitPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form
            action={createCafeSale}
            className="mt-6"
            onSubmit={() => setIsSubmitting(true)}
          >
            {cart.map((item, index) => (
              <div key={item.description}>
                <input type="hidden" name="description" value={item.description} />
                <input type="hidden" name="qty" value={item.qty} />
                <input type="hidden" name="unitPrice" value={item.unitPrice} />
              </div>
            ))}
            <input type="hidden" name="customer" value={customer} />
            <input type="hidden" name="method" value={method} />
            <input type="hidden" name="location" value={location} />
            <button
              type="submit"
              disabled={cart.length === 0 || isSubmitting}
              className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-mist-600 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-mist-700 disabled:cursor-not-allowed disabled:bg-mist-300"
            >
              {isSubmitting ? "Processing…" : "Complete sale and print receipt"}
            </button>
          </form>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-mist-200 bg-white p-6 shadow-soft">
        <h3 className="font-serif text-xl font-semibold text-mist-950">Café menu</h3>
        <div className="grid gap-5 lg:grid-cols-2">
          {cafeMenu.map((section) => (
            <div key={section.title} className="rounded-2xl border border-mist-100 bg-mist-50 p-4">
              <div className="flex items-center justify-between gap-3 border-b border-mist-200 pb-3">
                <div>
                  <h4 className="font-medium text-mist-950">{section.title}</h4>
                  <p className="text-xs uppercase tracking-[0.18em] text-mist-600">{section.note}</p>
                </div>
                <span className="text-xs font-semibold text-mist-700">{section.items.length} items</span>
              </div>
              <ul className="mt-4 space-y-3">
                {section.items.map((item) => (
                  <li key={item.name} className="flex flex-col gap-3 rounded-2xl border border-mist-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-mist-950">{item.name}</p>
                      <p className="mt-1 text-sm text-mist-700">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-mist-900">{formatMoney(item.price)}</span>
                      <button
                        type="button"
                        onClick={() => addItem(item.name, item.price)}
                        className="rounded-full border border-mist-300 bg-white px-4 py-2 text-sm font-semibold text-mist-700 transition duration-200 hover:border-mist-400 hover:bg-mist-50"
                      >
                        Add
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
