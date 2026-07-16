import type { Metadata } from "next";
import { readDb } from "@/lib/db";
import { PageHeader, Card } from "@/components/admin/ui";
import InventoryItemForm from "./InventoryItemForm";
import InventoryTable from "./InventoryTable";

export const metadata: Metadata = { title: "Inventory" };
export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const db = await readDb();
  const lowCount = db.inventory.filter((i) => i.quantity <= i.reorderLevel).length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Inventory"
        description={`${db.inventory.length} items tracked · ${lowCount} below reorder level. Stock in when deliveries arrive, stock out as products are used or sold.`}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="p-6 xl:col-span-2">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-serif text-lg font-semibold text-mist-950">Stock</h2>
            <p className="text-xs text-mist-600">
              {lowCount > 0 ? `${lowCount} item(s) need reordering` : "All stocked"}
            </p>
          </div>
          <div className="mt-3">
            <InventoryTable items={db.inventory} />
          </div>
        </Card>

        <Card className="h-fit p-6">
          <h2 className="font-serif text-lg font-semibold text-mist-950">Add an item</h2>
          <p className="mt-1 text-sm text-mist-700">New products for the spa shelves or café pantry.</p>
          <div className="mt-5">
            <InventoryItemForm />
          </div>
        </Card>
      </div>
    </div>
  );
}
