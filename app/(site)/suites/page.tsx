import type { Metadata } from "next";
import Image from "next/image";
import { BedDouble, Ruler, Users, CalendarX2 } from "lucide-react";
import { SectionHeading } from "@/components/site/Section";
import { suites } from "@/lib/content";
import { readDb } from "@/lib/db";
import { formatMoney, formatDate, todayISO } from "@/lib/format";
import Reveal from "@/components/site/Reveal";
import StayBookingForm from "./StayBookingForm";

export const metadata: Metadata = {
  title: "MaMoyo Suites — Serviced Apartments in Kabulonga",
  description:
    "Four serviced studio apartments in Kabulonga, Lusaka — stay a night or a season at MaMoyo Suites, with the spa and health café downstairs.",
};

export const dynamic = "force-dynamic";

export default async function SuitesPage({
  searchParams,
}: {
  searchParams: Promise<{ suite?: string }>;
}) {
  const { suite } = await searchParams;
  const preselected = suites.some((s) => s.id === suite) ? suite : undefined;

  const db = await readDb();
  const today = todayISO();
  const bookedBySuite = new Map<string, { checkIn: string; checkOut: string }[]>();
  for (const s of db.stays) {
    if (s.status === "Cancelled" || s.checkOut <= today) continue;
    const list = bookedBySuite.get(s.suiteId) ?? [];
    list.push({ checkIn: s.checkIn, checkOut: s.checkOut });
    bookedBySuite.set(
      s.suiteId,
      list.sort((a, b) => a.checkIn.localeCompare(b.checkIn))
    );
  }

  return (
    <div className="pt-36 pb-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex justify-center">
          <Image
            src="/logo-mamoyo-suites.png"
            alt="MaMoyo Suites — Kabulonga"
            width={1350}
            height={630}
            priority
            className="h-auto w-64 sm:w-80"
          />
        </div>
        <SectionHeading
          overline="Serviced Apartments"
          title="Stay a night, or a season"
          description="Four identical studio apartments — two on the ground floor, two upstairs — with hotel-soft beds, real kitchenettes, and the spa, salon and Café MaMoyo at your doorstep. Breakfast is included with every stay."
        />

        {/* Suite cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {suites.map((s, i) => {
            const booked = bookedBySuite.get(s.id) ?? [];
            return (
              <Reveal key={s.id} delay={(i % 2) * 100}>
              <article className="group h-full overflow-hidden rounded-3xl border border-mist-200 bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift">
                <div className="relative h-60">
                  <Image
                    src={s.image}
                    alt={s.imageAlt}
                    fill
                    sizes="(min-width: 768px) 45vw, 90vw"
                    className="object-cover"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-mist-800 backdrop-blur">
                    {formatMoney(s.ratePerNight)} / night
                  </div>
                </div>
                <div className="p-7">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="font-serif text-2xl font-semibold text-mist-950">{s.name}</h2>
                    <p className="text-xs font-medium uppercase tracking-wide text-mist-600">{s.tagline}</p>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-mist-800">{s.description}</p>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-mist-700">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-mist-500" aria-hidden="true" />
                      Sleeps {s.sleeps}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Ruler className="h-4 w-4 text-mist-500" aria-hidden="true" />
                      {s.sizeSqm} m²
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <BedDouble className="h-4 w-4 text-mist-500" aria-hidden="true" />
                      {s.amenities[0]}
                    </span>
                  </div>

                  <ul className="mt-4 flex flex-wrap gap-2">
                    {s.amenities.slice(1).map((a) => (
                      <li
                        key={a}
                        className="rounded-full border border-mist-200 bg-mist-50 px-3 py-1 text-xs text-mist-700"
                      >
                        {a}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-mist-100 pt-4">
                    {booked.length > 0 ? (
                      <p className="inline-flex items-center gap-1.5 text-xs text-mist-600">
                        <CalendarX2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Booked: {booked.map((b) => `${formatDate(b.checkIn)} – ${formatDate(b.checkOut)}`).join(" · ")}
                      </p>
                    ) : (
                      <p className="text-xs text-mist-600">No upcoming bookings — all yours.</p>
                    )}
                    <a
                      href={`/suites?suite=${s.id}#book`}
                      className="text-sm font-semibold text-mist-700 transition-colors duration-200 hover:text-mist-900"
                    >
                      Check availability ↓
                    </a>
                  </div>
                </div>
              </article>
              </Reveal>
            );
          })}
        </div>

        {/* A closer look */}
        <div className="mt-16">
          <h2 className="sr-only">More photos of the studios</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Reveal>
            <div className="relative overflow-hidden rounded-2xl shadow-soft">
              <div className="relative h-56">
                <Image
                  src="/photos/suites/studio-2.jpg"
                  alt="MaMoyo Suites pool and garden terrace"
                  fill
                  sizes="(min-width: 640px) 30vw, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
            </Reveal>
            <Reveal delay={100}>
            <div className="relative overflow-hidden rounded-2xl shadow-soft">
              <div className="relative h-56">
                <Image
                  src="/photos/suites/studio-5.jpg"
                  alt="En-suite bathroom with walk-in shower and vessel sink"
                  fill
                  sizes="(min-width: 640px) 30vw, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
            </Reveal>
            <Reveal delay={200}>
            <div className="relative overflow-hidden rounded-2xl shadow-soft">
              <div className="relative h-56">
                <Image
                  src="/photos/suites/studio-4.jpg"
                  alt="Bathroom with built-in wardrobe and vanity"
                  fill
                  sizes="(min-width: 640px) 30vw, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
            </Reveal>
          </div>
        </div>

        {/* Booking module */}
        <div id="book" className="mx-auto mt-20 max-w-2xl scroll-mt-32">
          <SectionHeading
            overline="Reserve a Studio"
            title="Book your stay"
            description="Tell us your dates and we'll hold the studio while we confirm. Nothing is charged online — pay on arrival by card, cash or mobile money."
          />
          <div className="mt-10">
            <StayBookingForm
              suites={suites.map((s) => ({
                id: s.id,
                name: s.name,
                ratePerNight: s.ratePerNight,
                sleeps: s.sleeps,
              }))}
              preselected={preselected}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
