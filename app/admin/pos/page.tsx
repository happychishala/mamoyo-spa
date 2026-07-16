import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { NoAccess, PageHeader } from "@/components/admin/ui";
import CafePOS from "@/components/admin/CafePOS";

export const metadata: Metadata = { title: "Café POS" };
export const dynamic = "force-dynamic";

export default async function PosPage() {
  const session = await getSession();
  if (!session) return null;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Café POS"
        description="Process café sales, print customer receipts, and keep the cash register in sync with finance."
      />
      <CafePOS />
    </div>
  );
}
