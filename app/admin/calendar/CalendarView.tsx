"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, BedDouble } from "lucide-react";
import { Card } from "@/components/admin/ui";

export interface CalendarEvent {
  id: string;
  kind: "spa" | "stay";
  start: string; // YYYY-MM-DD
  end: string; // exclusive for stays; same as start for spa
  time: string;
  title: string;
  subtitle: string;
  detail: string;
  location: string;
  pending: boolean;
}

type View = "month" | "week" | "day";

// --- date helpers (local, string-based to dodge timezone drift) ---
function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}
function fromISO(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function addDays(s: string, n: number): string {
  const d = fromISO(s);
  d.setDate(d.getDate() + n);
  return toISO(d);
}
function startOfWeek(s: string): string {
  const d = fromISO(s);
  return addDays(s, -((d.getDay() + 6) % 7)); // Monday start
}
function sameMonth(a: string, b: string): boolean {
  return a.slice(0, 7) === b.slice(0, 7);
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function EventChip({ ev, compact = false }: { ev: CalendarEvent; compact?: boolean }) {
  const palette =
    ev.kind === "spa"
      ? "border-mist-500 bg-mist-100 text-mist-900"
      : "border-cocoa-500 bg-sand-100 text-cocoa-800";
  return (
    <div
      className={`truncate rounded-md border-l-2 px-1.5 py-0.5 text-[0.68rem] leading-snug ${palette} ${
        ev.pending ? "opacity-60" : ""
      }`}
      title={`${ev.time ? ev.time + " · " : ""}${ev.title} — ${ev.subtitle}${ev.pending ? " (pending)" : ""}`}
    >
      {ev.kind === "spa" && ev.time && <span className="font-semibold">{ev.time} </span>}
      {compact ? ev.subtitle : `${ev.title} · ${ev.subtitle}`}
    </div>
  );
}

export default function CalendarView({ events }: { events: CalendarEvent[] }) {
  const todayISO = toISO(new Date());
  const [view, setView] = useState<View>("month");
  const [anchor, setAnchor] = useState(todayISO);
  const [locationFilter, setLocationFilter] = useState("All");

  const visible = events.filter(
    (e) => locationFilter === "All" || e.location === locationFilter
  );

  function eventsOn(day: string): CalendarEvent[] {
    return visible
      .filter((e) =>
        e.kind === "spa" ? e.start === day : e.start <= day && day < e.end
      )
      .sort((a, b) =>
        a.kind === b.kind ? (a.time || "").localeCompare(b.time || "") : a.kind === "stay" ? -1 : 1
      );
  }

  function navigate(direction: -1 | 1) {
    if (view === "month") {
      const d = fromISO(anchor);
      d.setDate(1);
      d.setMonth(d.getMonth() + direction);
      setAnchor(toISO(d));
    } else {
      setAnchor(addDays(anchor, direction * (view === "week" ? 7 : 1)));
    }
  }

  // --- header label ---
  const monthLabel = fromISO(anchor).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
  const weekStart = startOfWeek(anchor);
  const weekEnd = addDays(weekStart, 6);
  const fmtShort = (s: string) =>
    fromISO(s).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const label =
    view === "month"
      ? monthLabel
      : view === "week"
        ? `${fmtShort(weekStart)} – ${fmtShort(weekEnd)} ${fromISO(weekEnd).getFullYear()}`
        : fromISO(anchor).toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          });

  // --- month grid ---
  const gridStart = startOfWeek(anchor.slice(0, 7) + "-01");
  const monthCells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const dayEvents = eventsOn(anchor);
  const dayStays = dayEvents.filter((e) => e.kind === "stay");
  const daySpa = dayEvents.filter((e) => e.kind === "spa");

  return (
    <Card className="p-5 sm:p-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Previous"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-mist-200 text-mist-700 transition-colors duration-200 hover:bg-mist-50"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => navigate(1)}
            aria-label="Next"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-mist-200 text-mist-700 transition-colors duration-200 hover:bg-mist-50"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setAnchor(todayISO)}
            className="cursor-pointer rounded-full border border-mist-200 px-4 py-2 text-xs font-semibold text-mist-700 transition-colors duration-200 hover:bg-mist-50"
          >
            Today
          </button>
          <h2 className="ml-2 font-serif text-xl text-mist-950">{label}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="cal-location" className="sr-only">
            Filter by location
          </label>
          <select
            id="cal-location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="rounded-full border border-mist-200 bg-white px-3 py-2 text-xs text-mist-800 focus:border-mist-500 focus:outline-none"
          >
            <option>All</option>
            <option>Kabulonga</option>
            <option>Twangale</option>
          </select>

          <div className="flex rounded-full border border-mist-200 p-0.5" role="group" aria-label="Calendar view">
            {(["month", "week", "day"] as View[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-colors duration-200 ${
                  view === v ? "bg-mist-600 text-white shadow-soft" : "text-mist-700 hover:bg-mist-50"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-mist-700">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border-l-2 border-mist-500 bg-mist-100" aria-hidden="true" />
          Spa booking
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border-l-2 border-cocoa-500 bg-sand-100" aria-hidden="true" />
          Suite stay
        </span>
        <span className="text-mist-500">Faded = awaiting confirmation</span>
      </div>

      {/* Month view */}
      {view === "month" && (
        <div className="mt-5 overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-7 border-b border-mist-200 pb-2 text-center text-xs font-semibold uppercase tracking-wide text-mist-600">
              {WEEKDAYS.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl bg-mist-200 ring-1 ring-mist-200">
              {monthCells.map((day) => {
                const evs = eventsOn(day);
                const inMonth = sameMonth(day, anchor);
                const isToday = day === todayISO;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      setAnchor(day);
                      setView("day");
                    }}
                    className={`flex min-h-24 cursor-pointer flex-col gap-1 p-1.5 text-left align-top transition-colors duration-200 hover:bg-mist-50 ${
                      inMonth ? "bg-white" : "bg-mist-50/70"
                    }`}
                  >
                    <span
                      className={`self-start rounded-full px-1.5 text-xs leading-5 ${
                        isToday
                          ? "bg-mist-600 font-semibold text-white"
                          : inMonth
                            ? "font-medium text-mist-900"
                            : "text-mist-400"
                      }`}
                    >
                      {Number(day.slice(8))}
                    </span>
                    {evs.slice(0, 3).map((ev) => (
                      <EventChip key={`${ev.kind}-${ev.id}`} ev={ev} compact />
                    ))}
                    {evs.length > 3 && (
                      <span className="text-[0.65rem] font-medium text-mist-600">
                        +{evs.length - 3} more
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Week view */}
      {view === "week" && (
        <div className="mt-5 overflow-x-auto">
          <div className="grid min-w-[840px] grid-cols-7 gap-px overflow-hidden rounded-xl bg-mist-200 ring-1 ring-mist-200">
            {weekDays.map((day) => {
              const evs = eventsOn(day);
              const isToday = day === todayISO;
              return (
                <div key={day} className="flex min-h-64 flex-col bg-white">
                  <button
                    type="button"
                    onClick={() => {
                      setAnchor(day);
                      setView("day");
                    }}
                    className={`cursor-pointer border-b border-mist-100 px-2 py-2 text-center transition-colors duration-200 hover:bg-mist-50 ${
                      isToday ? "bg-mist-50" : ""
                    }`}
                  >
                    <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-mist-600">
                      {fromISO(day).toLocaleDateString("en-GB", { weekday: "short" })}
                    </p>
                    <p
                      className={`mx-auto mt-0.5 w-7 rounded-full text-sm leading-7 ${
                        isToday ? "bg-mist-600 font-semibold text-white" : "font-medium text-mist-900"
                      }`}
                    >
                      {Number(day.slice(8))}
                    </p>
                  </button>
                  <div className="flex flex-1 flex-col gap-1 p-1.5">
                    {evs.map((ev) => (
                      <EventChip key={`${ev.kind}-${ev.id}`} ev={ev} />
                    ))}
                    {evs.length === 0 && (
                      <p className="mt-2 text-center text-[0.65rem] text-mist-400">—</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Day view */}
      {view === "day" && (
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-mist-600">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Spa bookings
            </h3>
            <ul className="mt-3 space-y-2">
              {daySpa.map((ev) => (
                <li
                  key={ev.id}
                  className={`flex items-start gap-4 rounded-xl border border-mist-200 bg-white p-4 ${
                    ev.pending ? "border-dashed opacity-75" : ""
                  }`}
                >
                  <span className="w-14 shrink-0 pt-0.5 font-serif text-lg text-mist-700">
                    {ev.time || "—"}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-mist-950">{ev.title}</p>
                    <p className="text-sm text-mist-700">{ev.subtitle}</p>
                    <p className="mt-0.5 text-xs text-mist-600">
                      {ev.detail}
                      {ev.pending && " · awaiting confirmation"}
                    </p>
                  </div>
                </li>
              ))}
              {daySpa.length === 0 && (
                <li className="rounded-xl border border-dashed border-mist-200 p-6 text-center text-sm text-mist-600">
                  No spa bookings this day.
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-mist-600">
              <BedDouble className="h-3.5 w-3.5" aria-hidden="true" />
              In the suites
            </h3>
            <ul className="mt-3 space-y-2">
              {dayStays.map((ev) => (
                <li
                  key={ev.id}
                  className={`rounded-xl border border-cocoa-200 bg-sand-50 p-4 ${
                    ev.pending ? "border-dashed opacity-75" : ""
                  }`}
                >
                  <p className="font-medium text-cocoa-800">{ev.title}</p>
                  <p className="text-sm text-mist-800">{ev.subtitle}</p>
                  <p className="mt-0.5 text-xs text-mist-600">
                    {ev.detail}
                    {ev.pending && " · awaiting confirmation"}
                  </p>
                </li>
              ))}
              {dayStays.length === 0 && (
                <li className="rounded-xl border border-dashed border-mist-200 p-6 text-center text-sm text-mist-600">
                  No guests in house.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </Card>
  );
}
