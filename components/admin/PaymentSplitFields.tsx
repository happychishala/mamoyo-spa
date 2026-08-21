"use client";

import { useEffect, useState } from "react";
import { Plus, X, SplitSquareHorizontal } from "lucide-react";
import { formatMoney } from "@/lib/format";

type Row = { method: string; amount: string };

/**
 * Payment entry for a checkout. Defaults to a single method (posts `method`).
 * Toggle "Split" to settle one sale across several methods — each row posts a
 * parallel `payMethod` / `payAmount` pair that the server reads back together.
 * Calls `onBalancedChange` so the parent can block submit until the split adds
 * up to the total.
 */
export default function PaymentSplitFields({
  total,
  methods,
  onBalancedChange,
}: {
  total: number;
  methods: string[];
  onBalancedChange?: (balanced: boolean) => void;
}) {
  const [split, setSplit] = useState(false);
  const [single, setSingle] = useState(methods[0] ?? "Cash");
  const [rows, setRows] = useState<Row[]>([{ method: methods[0] ?? "Cash", amount: "" }]);

  const allocated = rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const remaining = Math.round((total - allocated) * 100) / 100;
  const balanced = !split || (total > 0 && Math.abs(remaining) < 0.005);

  useEffect(() => {
    onBalancedChange?.(balanced);
  }, [balanced, onBalancedChange]);

  const addRow = () =>
    setRows((r) => [...r, { method: methods[0] ?? "Cash", amount: remaining > 0 ? String(remaining) : "" }]);
  const update = (i: number, patch: Partial<Row>) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  const removeRow = (i: number) => setRows((r) => (r.length > 1 ? r.filter((_, idx) => idx !== i) : r));

  const inputCls =
    "w-full rounded-xl border border-mist-200 bg-white px-3 py-2.5 text-sm text-mist-950 outline-none transition-colors duration-200 focus:border-mist-400";

  return (
    <div className="rounded-2xl border border-mist-200 bg-mist-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-mist-800">Payment</span>
        <button
          type="button"
          onClick={() => setSplit((s) => !s)}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${
            split
              ? "border-mist-500 bg-mist-600 text-white"
              : "border-mist-300 bg-white text-mist-700 hover:border-mist-400"
          }`}
        >
          <SplitSquareHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          {split ? "Splitting" : "Split payment"}
        </button>
      </div>

      {!split ? (
        <label className="mt-3 block">
          <span className="sr-only">Payment method</span>
          <select
            name="method"
            value={single}
            onChange={(e) => setSingle(e.target.value)}
            className={inputCls}
          >
            {methods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <div className="mt-3 space-y-2.5">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              <select
                name="payMethod"
                value={row.method}
                onChange={(e) => update(i, { method: e.target.value })}
                className={`${inputCls} flex-1`}
              >
                {methods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <input
                name="payAmount"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={row.amount}
                onChange={(e) => update(i, { amount: e.target.value })}
                placeholder="0.00"
                className={`${inputCls} w-28`}
              />
              <button
                type="button"
                onClick={() => removeRow(i)}
                aria-label="Remove method"
                className="shrink-0 rounded-full p-2 text-mist-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-mist-700 transition-colors duration-200 hover:text-mist-900"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Add method
            </button>
            <p className={`text-xs font-medium ${balanced ? "text-emerald-700" : "text-amber-700"}`}>
              {balanced
                ? `Balanced · ${formatMoney(total)}`
                : remaining > 0
                  ? `${formatMoney(remaining)} left to allocate`
                  : `${formatMoney(-remaining)} over`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
