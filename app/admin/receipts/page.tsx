import type { Metadata } from "next";
import { readDb } from "@/lib/db";
import { formatMoney } from "@/lib/format";
import { PageHeader, Card, NoAccess } from "@/components/admin/ui";
import { getSession } from "@/lib/auth";
import ReceiptsTable from "./ReceiptsTable";

export const metadata: Metadata = { title: "Receipts" };
export const dynamic = "force-dynamic";

export default async function ReceiptsPage() {
  const session = await getSession();
  if (session?.role === "Staff") return <NoAccess area="Receipts" />;

  const db = await readDb();
  const receipts = [...db.receipts].sort((a, b) => b.date.localeCompare(a.date));
  const total = receipts.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Receipts"
        description="Proof of payment issued to guests. Receipts are generated automatically when an invoice is marked paid."
      />

      <Card className="p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-serif text-xl font-semibold text-mist-950">
            {receipts.length} receipts issued
          </h2>
          <p className="text-sm text-mist-700">
            Total collected: <span className="font-semibold text-mist-950">{formatMoney(total)}</span>
          </p>
        </div>
        <div className="mt-5">
          <ReceiptsTable receipts={receipts} />
        </div>
      </Card>
    </div>
  );
}
