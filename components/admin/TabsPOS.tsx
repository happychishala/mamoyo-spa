"use client";

import { useMemo, useState } from "react";
import { Plus, Minus, X, Users, Wine } from "lucide-react";
import { openTab, addTabItem, setTabItemQty, closeTab, settleTab } from "@/lib/actions";
import { formatMoney } from "@/lib/format";
import type { Location, OpenTab } from "@/lib/db";
import PaymentSplitFields from "./PaymentSplitFields";

const methods = ["Cash", "Card", "Mobile Money", "Bank Transfer"];
const locations: Location[] = ["Kabulonga", "Twangale"];

export type Pickable = { description: string; unitPrice: number; itemId?: string; shot?: boolean };
export type PickSection = { title: string; items: Pickable[] };

const tabTotal = (t: OpenTab) => t.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);

export default function TabsPOS({ tabs, pickables }: { tabs: OpenTab[]; pickables: PickSection[] }) {
  const [activeId, setActiveId] = useState<string | null>(tabs[0]?.id ?? null);
  const [newName, setNewName] = useState("");
  const [newLocation, setNewLocation] = useState<Location>("Kabulonga");
  const [balanced, setBalanced] = useState(true);

  const active = useMemo(() => tabs.find((t) => t.id === activeId) ?? tabs[0] ?? null, [tabs, activeId]);
  const total = active ? tabTotal(active) : 0;

  return (
    <div className="space-y-6">
      {/* Open tabs */}
      <div className="rounded-2xl border border-mist-200 bg-white p-5 shadow-soft">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-mist-500" aria-hidden="true" />
          <h2 className="font-serif text-lg font-semibold text-mist-950">Open tabs</h2>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tabs.length === 0 && <p className="text-sm text-mist-600">No open tabs. Open one below to start a running bill.</p>}
          {tabs.map((t) => {
            const on = active?.id === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveId(t.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                  on ? "bg-mist-600 text-white shadow-soft" : "border border-mist-300 bg-white text-mist-700 hover:border-mist-400"
                }`}
              >
                {t.name}
                <span className={on ? "text-white/80" : "text-mist-500"}>{formatMoney(tabTotal(t))}</span>
              </button>
            );
          })}
        </div>

        <form action={openTab} className="mt-4 flex flex-col gap-2 border-t border-mist-100 pt-4 sm:flex-row">
          <input
            name="name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            placeholder="Customer or table name"
            className="w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-mist-900 focus:border-mist-500 focus:outline-none"
          />
          <select
            name="location"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value as Location)}
            className="rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-mist-900 focus:border-mist-500 focus:outline-none"
          >
            {locations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <button
            type="submit"
            onClick={() => setNewName("")}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-mist-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-mist-700"
          >
            <Plus className="h-4 w-4" aria-hidden="true" /> Open tab
          </button>
        </form>
      </div>

      {active && (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          {/* Add items */}
          <div className="rounded-2xl border border-mist-200 bg-white p-5 shadow-soft">
            <div className="flex items-center gap-2">
              <Wine className="h-5 w-5 text-mist-500" aria-hidden="true" />
              <h3 className="font-serif text-lg font-semibold text-mist-950">Add to “{active.name}”</h3>
            </div>
            <div className="mt-4 space-y-5">
              {pickables.map((section) => (
                <div key={section.title}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-mist-500">{section.title}</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {section.items.map((p, i) => (
                      <form
                        key={`${section.title}-${i}`}
                        action={addTabItem}
                        className="flex items-center justify-between gap-2 rounded-xl border border-mist-200 bg-white px-3 py-2"
                      >
                        <input type="hidden" name="tabId" value={active.id} />
                        <input type="hidden" name="description" value={p.description} />
                        <input type="hidden" name="unitPrice" value={p.unitPrice} />
                        <input type="hidden" name="qty" value={1} />
                        {p.itemId && <input type="hidden" name="itemId" value={p.itemId} />}
                        {p.shot && <input type="hidden" name="shot" value="1" />}
                        <span className="min-w-0 truncate text-sm text-mist-900">{p.description}</span>
                        <span className="flex shrink-0 items-center gap-2">
                          <span className="text-xs font-semibold text-mist-700">{formatMoney(p.unitPrice)}</span>
                          <button type="submit" aria-label={`Add ${p.description}`} className="rounded-full bg-mist-100 p-1.5 text-mist-700 hover:bg-mist-600 hover:text-white">
                            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </span>
                      </form>
                    ))}
                  </div>
                </div>
              ))}
              {pickables.every((s) => s.items.length === 0) && (
                <p className="text-sm text-mist-600">Add café items in Chef, or bar stock in Inventory (category Bar), to sell them on a tab.</p>
              )}
            </div>
          </div>

          {/* The tab */}
          <div className="rounded-2xl border border-mist-200 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-serif text-lg font-semibold text-mist-950">{active.name}</h3>
              <form action={closeTab}>
                <input type="hidden" name="tabId" value={active.id} />
                <button type="submit" title="Discard this tab without charging" className="inline-flex items-center gap-1 text-xs font-medium text-mist-400 hover:text-red-600">
                  <X className="h-3.5 w-3.5" aria-hidden="true" /> Discard
                </button>
              </form>
            </div>
            <p className="text-xs text-mist-500">{active.location}</p>

            <div className="mt-4 space-y-2">
              {active.items.length === 0 ? (
                <p className="rounded-xl border border-dashed border-mist-200 bg-mist-50 p-4 text-center text-sm text-mist-600">Add items from the left.</p>
              ) : (
                active.items.map((line, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-xl bg-mist-50 px-3 py-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-mist-900">{line.description}</p>
                      <p className="text-xs text-mist-500">{formatMoney(line.unitPrice)} each</p>
                    </div>
                    <form action={setTabItemQty}>
                      <input type="hidden" name="tabId" value={active.id} />
                      <input type="hidden" name="index" value={idx} />
                      <input type="hidden" name="qty" value={line.qty - 1} />
                      <button type="submit" aria-label="Decrease" className="rounded-full border border-mist-300 p-1 text-mist-700 hover:bg-white">
                        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </form>
                    <span className="w-6 text-center text-sm font-semibold text-mist-950">{line.qty}</span>
                    <form action={setTabItemQty}>
                      <input type="hidden" name="tabId" value={active.id} />
                      <input type="hidden" name="index" value={idx} />
                      <input type="hidden" name="qty" value={line.qty + 1} />
                      <button type="submit" aria-label="Increase" className="rounded-full border border-mist-300 p-1 text-mist-700 hover:bg-white">
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </form>
                    <span className="w-16 shrink-0 text-right text-sm font-semibold text-mist-950">{formatMoney(line.qty * line.unitPrice)}</span>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-mist-900 px-4 py-3 text-white">
              <span className="text-sm">Total</span>
              <span className="font-serif text-xl font-semibold">{formatMoney(total)}</span>
            </div>

            <form action={settleTab} className="mt-4 space-y-4">
              <input type="hidden" name="tabId" value={active.id} />
              <PaymentSplitFields total={total} methods={methods} onBalancedChange={setBalanced} />
              <button
                type="submit"
                disabled={active.items.length === 0 || !balanced}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-mist-600 px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700 disabled:cursor-not-allowed disabled:bg-mist-300"
              >
                Settle tab &amp; print receipt
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
