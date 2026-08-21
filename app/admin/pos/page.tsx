import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { readDb } from "@/lib/db";
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

  return (
    <div className="space-y-8">
      <PageHeader
        title="Point of sale"
        description="Ring up café orders and retail products, split payment across methods, and print the receipt. Product sales adjust inventory automatically."
      />
      <PosTabs products={products} />
    </div>
  );
}
