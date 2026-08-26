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
  const products: RetailItem[] = db.inventory
    .filter((item) => typeof item.retailPrice === "number" && item.retailPrice > 0)
    .map((item) => ({
      id: item.id,
      name: item.name,
      brand: item.brand,
      volume: item.volume,
      unit: item.unit,
      category: item.category,
      retailPrice: item.retailPrice as number,
      quantity: item.quantity,
    }))
    .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

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

  return (
    <div className="space-y-8">
      <PageHeader
        title="Point of sale"
        description="Ring up café orders and retail products, split payment across methods, and print the receipt. Product sales adjust inventory automatically."
      />
      <PosTabs products={products} menu={menu} />
    </div>
  );
}
