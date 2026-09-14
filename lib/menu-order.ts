import type { CafeMenuItem } from "./db";

export interface OrderedMenuSection {
  title: string;
  items: CafeMenuItem[];
}

/**
 * Group café items into sections in the owner-arranged order, items sorted by
 * their per-section `sort` index (drag-to-arrange). Any section present in the
 * items but missing from the saved order is appended alphabetically, so nothing
 * is ever dropped. Empty sections are omitted.
 */
export function orderCafeMenu(items: CafeMenuItem[], sectionOrder?: string[]): OrderedMenuSection[] {
  const present = [...new Set(items.map((i) => i.section))];
  const order = sectionOrder && sectionOrder.length ? [...sectionOrder] : [...present].sort();
  for (const s of [...present].sort()) if (!order.includes(s)) order.push(s);

  return order
    .map((title) => ({
      title,
      items: items
        .filter((i) => i.section === title)
        .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0) || a.name.localeCompare(b.name)),
    }))
    .filter((s) => s.items.length > 0);
}
