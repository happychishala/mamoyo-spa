import type { Transaction } from "./db";
import { monthLabel } from "./format";

export interface MonthPoint {
  month: string; // YYYY-MM
  label: string; // "Jul"
  income: number;
  expense: number;
}

/** Income & expense totalled per month, oldest→newest, last `months` months. */
export function monthlyIncomeExpense(transactions: Transaction[], months = 6): MonthPoint[] {
  const map = new Map<string, { income: number; expense: number }>();
  for (const t of transactions) {
    const m = t.date.slice(0, 7);
    const entry = map.get(m) ?? { income: 0, expense: 0 };
    if (t.type === "Income") entry.income += t.amount;
    else entry.expense += t.amount;
    map.set(m, entry);
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-months)
    .map(([month, v]) => ({ month, label: monthLabel(month), income: v.income, expense: v.expense }));
}

export interface RankedSlice {
  label: string;
  value: number;
}

/** Sum `value(item)` grouped by `key(item)`, sorted largest first. */
export function sumByKey<T>(
  items: T[],
  key: (item: T) => string,
  value: (item: T) => number
): RankedSlice[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    map.set(k, (map.get(k) ?? 0) + value(item));
  }
  return [...map.entries()]
    .map(([label, v]) => ({ label, value: v }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);
}
