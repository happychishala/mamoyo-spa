import type { Metadata } from "next";
import { readDb } from "@/lib/db";
import { suites } from "@/lib/content";
import { todayISO } from "@/lib/format";
import { PageHeader, Card } from "@/components/admin/ui";
import NewStayForm from "./NewStayForm";
import StaysTable from "./StaysTable";

export const metadata: Metadata = { title: "Stays" };
export const dynamic = "force-dynamic";

export default async function StaysPage() {
  const db = await readDb();
  const today = todayISO();
  const stays = [...db.stays].sort((a, b) => b.checkIn.localeCompare(a.checkIn));

  const inHouse = db.stays.filter((s) => s.status === "CheckedIn").length;
  const arrivingToday = db.stays.filter((s) => s.status === "Confirmed" && s.checkIn === today).length;
  const pending = db.stays.filter((s) => s.status === "Pending").length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Stays — MaMoyo Suites"
        description={`${inHouse} in house · ${arrivingToday} arriving today · ${pending} awaiting confirmation. Four studios: Studio One–Four.`}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="h-fit p-6 xl:col-span-1">
          <h2 className="font-serif text-lg font-semibold text-mist-950">Walk-in / phone stay</h2>
          <p className="mt-1 text-sm text-mist-700">
            Book a studio at the desk — availability is checked against existing stays.
          </p>
          <div className="mt-5">
            <NewStayForm
              suites={suites.map((s) => ({ id: s.id, name: s.name, ratePerNight: s.ratePerNight }))}
              defaultDate={today}
            />
          </div>
        </Card>

        <Card className="p-6 xl:col-span-2">
          <StaysTable stays={stays} />
        </Card>
      </div>
    </div>
  );
}
