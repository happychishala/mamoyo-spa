import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { cafeMenu, type MenuSection } from "@/lib/content";
import { PageHeader } from "@/components/admin/ui";
import PosTabs from "@/components/admin/PosTabs";
import type { RetailItem } from "@/components/admin/ProductPOS";

export const metadata: Metadata = { title: "POS" };
export const dynamic = "force-dynamic";

export default async function PosPage() {
  const session = await getSession();
  if (!session) return null;

  const db = await readDb();
  const isRetail = (item: (typeof db.inventory)[number]) =>
    (item.purpose ?? (item.retailPrice ? "retail" : "internal")) === "retail";

  // Products tab: retail stock that isn't Bar (spa products, café retail).
  const products: RetailItem[] = db.inventory
    .filter((item) => item.category !== "Bar" && isRetail(item) && typeof item.retailPrice === "number" && item.retailPrice > 0)
    .map((item) => ({
      id: item.id,
      name: item.name,
      brand: item.brand,
      volume: item.volume,
      unit: item.unit,
      category: item.category,
      retailPrice: item.retailPrice as number,
      quantity: item.quantity,
      location: item.location ?? "Kabulonga",
    }))
    .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

  // Bar tab: Bar-category stock, sold by the bottle (retailPrice) and/or by the
  // shot. Shot ids are prefixed so the sale action pours a shot (fractional stock).
  const barItems: RetailItem[] = [];
  for (const item of db.inventory) {
    if (item.category !== "Bar" || !isRetail(item)) continue;
    const loc = item.location ?? "Kabulonga";
    if (typeof item.retailPrice === "number" && item.retailPrice > 0) {
      barItems.push({
        id: item.id,
        name: item.name,
        brand: item.brand,
        volume: item.volume,
        unit: item.unit,
        category: "Bar",
        retailPrice: item.retailPrice,
        quantity: item.quantity,
        location: loc,
      });
    }
    if (typeof item.shotPrice === "number" && item.shotPrice > 0 && typeof item.shotsPerUnit === "number" && item.shotsPerUnit > 0) {
      barItems.push({
        id: `shot:${item.id}`,
        name: `${item.name} (shot)`,
        brand: item.brand,
        volume: undefined,
        unit: "shot",
        category: "Bar",
        retailPrice: item.shotPrice,
        quantity: Math.floor(item.quantity * item.shotsPerUnit),
        location: loc,
      });
    }
  }
  barItems.sort((a, b) => a.name.localeCompare(b.name));

  // The chef-managed café menu drives the POS once any items exist; until then
  // the built-in menu is used so the till works out of the box.
  const availableItems = db.cafeMenuItems.filter((m) => m.available);
  const menu: MenuSection[] =
    availableItems.length > 0
      ? [...new Set(availableItems.map((m) => m.section))].map((section) => ({
          title: section,
          note: "",
          items: availableItems
            .filter((m) => m.section === section)
            .map((m) => ({ name: m.name, description: m.description ?? "", price: m.price })),
        }))
      : cafeMenu;

  // What can be added to an open tab: café items (no stock) + bar + products.
  const pickables = [
    { title: "Café", items: menu.flatMap((s) => s.items.map((i) => ({ description: i.name, unitPrice: i.price }))) },
    {
      title: "Bar",
      items: barItems.map((b) => ({
        description: b.name,
        unitPrice: b.retailPrice,
        itemId: b.id.startsWith("shot:") ? b.id.slice(5) : b.id,
        shot: b.id.startsWith("shot:"),
      })),
    },
    {
      title: "Products",
      items: products.map((p) => ({ description: p.name, unitPrice: p.retailPrice, itemId: p.id })),
    },
  ].filter((s) => s.items.length > 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Point of sale"
        description="Ring up café orders, bar drinks and retail products, or keep open customer tabs. Split payment across methods and print the receipt; stock adjusts automatically."
      />
      <PosTabs products={products} bar={barItems} menu={menu} tabs={db.openTabs} pickables={pickables} />
    </div>
  );
}
