import type { Metadata } from "next";
import { readDb } from "@/lib/db";
import { suites } from "@/lib/content";
import { PageHeader } from "@/components/admin/ui";
import CalendarView, { type CalendarEvent } from "./CalendarView";

export const metadata: Metadata = { title: "Calendar" };
export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const db = await readDb();
  const suiteName = (id: string) => suites.find((s) => s.id === id)?.name ?? id;

  const events: CalendarEvent[] = [
    ...db.bookings
      .filter((b) => b.status !== "Cancelled")
      .map((b) => ({
        id: b.id,
        kind: "spa" as const,
        start: b.date,
        end: b.date,
        time: b.time,
        title: b.service,
        subtitle: b.customer,
        detail: [b.therapist && `with ${b.therapist}`, b.location ?? "Kabulonga"]
          .filter(Boolean)
          .join(" · "),
        location: b.location ?? "Kabulonga",
        pending: b.status === "Pending",
      })),
    ...db.stays
      .filter((s) => s.status !== "Cancelled")
      .map((s) => ({
        id: s.id,
        kind: "stay" as const,
        start: s.checkIn,
        end: s.checkOut, // exclusive: guests sleep checkIn..checkOut-1
        time: "",
        title: suiteName(s.suiteId),
        subtitle: s.guest,
        detail: `${s.nights} ${s.nights === 1 ? "night" : "nights"}`,
        location: "Kabulonga",
        pending: s.status === "Pending",
      })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="Spa bookings and suite stays in one view — switch between month, week and day."
      />
      <CalendarView events={events} />
    </div>
  );
}
