import type { Metadata } from "next";
import { readDb } from "@/lib/db";
import { PageHeader, Card, NoAccess } from "@/components/admin/ui";
import { getSession } from "@/lib/auth";
import AuditTable from "./AuditTable";

export const metadata: Metadata = { title: "Audit Log" };
export const dynamic = "force-dynamic";

export default async function AuditPage() {
  const session = await getSession();
  if (session?.role === "Staff") return <NoAccess area="Audit Log" />;

  const db = await readDb();
  const entries = [...(db.auditLog ?? [])].sort((a, b) => b.at.localeCompare(a.at));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Audit Log"
        description="A record of sensitive back-office actions — who did what, and when. Guest details are never stored here; entries reference records by their number."
      />
      {session?.role === "Owner" && (
        <Card className="flex flex-wrap items-center justify-between gap-3 p-6">
          <div>
            <h2 className="font-serif text-lg font-semibold text-mist-950">Database backup</h2>
            <p className="text-sm text-mist-700">
              A full snapshot is taken automatically every night. Download one now before any big change.
            </p>
          </div>
          <a
            href="/admin/backup"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-mist-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
          >
            Download backup
          </a>
        </Card>
      )}
      <Card className="p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-serif text-xl font-semibold text-mist-950">
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </h2>
          <p className="text-sm text-mist-700">Most recent first · last 2,000 kept</p>
        </div>
        <div className="mt-5">
          <AuditTable entries={entries} />
        </div>
      </Card>
    </div>
  );
}
