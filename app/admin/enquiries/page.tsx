import type { Metadata } from "next";
import { readDb } from "@/lib/db";
import { PageHeader, Card } from "@/components/admin/ui";
import EnquiriesTable from "./EnquiriesTable";

export const metadata: Metadata = { title: "Enquiries" };
export const dynamic = "force-dynamic";

export default async function EnquiriesPage() {
  const db = await readDb();
  const enquiries = [...db.enquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const newCount = enquiries.filter((e) => e.status === "New").length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Enquiries"
        description="Membership applications, corporate proposals, gift-card requests, café bookings and general messages from the website land here."
      />
      <Card className="p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-serif text-xl font-semibold text-mist-950">
            {enquiries.length} {enquiries.length === 1 ? "enquiry" : "enquiries"}
          </h2>
          <p className="text-sm text-mist-700">
            {newCount > 0 ? (
              <span className="font-semibold text-amber-700">{newCount} new</span>
            ) : (
              "All caught up"
            )}
          </p>
        </div>
        <div className="mt-5">
          <EnquiriesTable enquiries={enquiries} />
        </div>
      </Card>
    </div>
  );
}
