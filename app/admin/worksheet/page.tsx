import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, X, CalendarRange } from "lucide-react";
import { readDb, LOCATIONS } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { deleteWorkShift } from "@/lib/actions";
import { formatDate, todayISO, addDaysISO } from "@/lib/format";
import { PageHeader, Card } from "@/components/admin/ui";
import AddShiftForm from "./AddShiftForm";

export const metadata: Metadata = { title: "Work Sheet" };
export const dynamic = "force-dynamic";

function mondayOf(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  const offset = (d.getDay() + 6) % 7; // 0 = Monday
  return addDaysISO(iso, -offset);
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default async function WorkSheetPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const session = await getSession();
  if (!session) return null;
  const canEdit = session.role === "Owner" || session.role === "Manager";

  const params = await searchParams;
  const today = todayISO();
  const base = /^\d{4}-\d{2}-\d{2}$/.test(params.week ?? "") ? params.week! : today;
  const monday = mondayOf(base);
  const days = Array.from({ length: 7 }, (_, i) => addDaysISO(monday, i));
  const prevWeek = addDaysISO(monday, -7);
  const nextWeek = addDaysISO(monday, 7);

  const db = await readDb();
  const therapists = db.therapists.filter((t) => t.active).map((t) => t.name);

  const shiftsByDay = new Map<string, typeof db.workShifts>();
  for (const day of days) {
    shiftsByDay.set(
      day,
      db.workShifts
        .filter((s) => s.date === day)
        .sort((a, b) => a.location.localeCompare(b.location) || a.therapist.localeCompare(b.therapist))
    );
  }
  const weekShifts = days.flatMap((d) => shiftsByDay.get(d) ?? []);

  const locBadge = (loc: string) =>
    loc === "Twangale"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "border-mist-200 bg-mist-100 text-mist-700";

  const weekLabel = `${formatDate(monday)} – ${formatDate(days[6])}`;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Work Sheet"
        description="The therapist roster — who is working each day and at which location."
      />

      {/* Week navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link href={`/admin/worksheet?week=${prevWeek}`} aria-label="Previous week" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-mist-300 text-mist-700 transition-colors duration-200 hover:bg-mist-50">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
          <div className="flex items-center gap-2 rounded-full bg-mist-100 px-4 py-1.5">
            <CalendarRange className="h-4 w-4 text-mist-500" aria-hidden="true" />
            <span className="text-sm font-semibold text-mist-900">{weekLabel}</span>
          </div>
          <Link href={`/admin/worksheet?week=${nextWeek}`} aria-label="Next week" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-mist-300 text-mist-700 transition-colors duration-200 hover:bg-mist-50">
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="flex items-center gap-3 text-xs text-mist-600">
          <Link href="/admin/worksheet" className="font-semibold text-mist-700 underline-offset-2 hover:underline">This week</Link>
          <span>{weekShifts.length} shifts</span>
        </div>
      </div>

      {/* Add shift (Manager/Owner) */}
      {canEdit && (
        <Card className="p-6">
          <h2 className="font-serif text-lg font-semibold text-mist-950">Add a shift</h2>
          {therapists.length === 0 ? (
            <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-800">
              Add a therapist on the{" "}
              <Link href="/admin/team" className="font-semibold underline">Team</Link> page first.
            </p>
          ) : (
            <div className="mt-4">
              <AddShiftForm therapists={therapists} locations={[...LOCATIONS]} defaultDate={today >= monday && today <= days[6] ? today : monday} />
            </div>
          )}
        </Card>
      )}

      {/* Weekly grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {days.map((day, i) => {
          const shifts = shiftsByDay.get(day) ?? [];
          const isToday = day === today;
          return (
            <Card key={day} className={`flex flex-col p-4 ${isToday ? "ring-2 ring-mist-400" : ""}`}>
              <div className="flex items-baseline justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-mist-500">{WEEKDAYS[i]}</p>
                <p className={`text-xs ${isToday ? "font-semibold text-mist-900" : "text-mist-500"}`}>
                  {new Date(`${day}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </p>
              </div>

              <div className="mt-3 flex-1 space-y-2">
                {shifts.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-mist-200 py-4 text-center text-xs text-mist-400">
                    No one rostered
                  </p>
                ) : (
                  shifts.map((s) => (
                    <div key={s.id} className="rounded-lg border border-mist-100 bg-white p-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium text-mist-950">{s.therapist}</span>
                        {canEdit && (
                          <form action={deleteWorkShift}>
                            <input type="hidden" name="id" value={s.id} />
                            <button type="submit" aria-label={`Remove ${s.therapist} on ${day}`} className="text-mist-300 transition-colors duration-200 hover:text-red-600">
                              <X className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </form>
                        )}
                      </div>
                      <span className={`mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.65rem] font-medium ${locBadge(s.location)}`}>
                        <MapPin className="h-2.5 w-2.5" aria-hidden="true" />
                        {s.location}
                      </span>
                      {s.note && <p className="mt-1 text-[0.7rem] italic text-mist-500">{s.note}</p>}
                    </div>
                  ))
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
