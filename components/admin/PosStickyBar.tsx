"use client";

import { formatMoney } from "@/lib/format";

/**
 * Mobile/tablet-only sticky checkout bar for the POS. Keeps the running total
 * and a jump-to-payment button in view while the operator browses items, so
 * they never scroll to find the cart. Hidden on desktop (xl) — that layout
 * already shows the cart beside the items.
 */
export default function PosStickyBar({
  count,
  total,
  targetId,
}: {
  count: number;
  total: number;
  targetId: string;
}) {
  if (count === 0) return null;
  return (
    <div className="fixed inset-x-0 bottom-4 z-30 px-4 xl:hidden">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-3 rounded-2xl border border-mist-200 bg-white/95 px-4 py-3 shadow-lift backdrop-blur">
        <div>
          <p className="text-xs font-medium text-mist-600">
            {count} {count === 1 ? "item" : "items"}
          </p>
          <p className="font-serif text-lg font-semibold text-mist-950">{formatMoney(total)}</p>
        </div>
        <button
          type="button"
          onClick={() =>
            document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "center" })
          }
          className="rounded-full bg-mist-600 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
        >
          Review &amp; pay
        </button>
      </div>
    </div>
  );
}
