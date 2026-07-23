import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BedDouble, Ruler, Users, CalendarX2, ArrowRight, MessageCircle } from "lucide-react";
import { SectionHeading } from "@/components/site/Section";
import { suites } from "@/lib/content";
import { readDb } from "@/lib/db";
import { formatMoney, formatDate, todayISO } from "@/lib/format";
import Reveal from "@/components/site/Reveal";
import FaqList from "@/components/site/FaqList";
import StayBookingForm from "./StayBookingForm";

export const metadata: Metadata = {
  title: { absolute: "MaMoyo Suites | Serviced Apartments in Kabulonga Lusaka" },
  description:
    "Book MaMoyo Suites directly for private serviced studio accommodation in Kabulonga, ideal for business, long stays, wellness visits and bridal stays.",
  alternates: { canonical: "/suites" },
  openGraph: {
    title: "MaMoyo Suites | Serviced Apartments in Kabulonga Lusaka",
    description:
      "Book MaMoyo Suites directly for private serviced studio accommodation in Kabulonga, ideal for business, long stays, wellness visits and bridal stays.",
    url: "/suites",
  },
};

const atAGlance = [
  "Fully serviced studio accommodation for one or two guests",
  "Private bathroom and kitchen facilities",
  "Wi-Fi and television",
  "Complimentary parking",
  "Pool and garden access for registered suite guests",
  "Spa care by appointment",
  "Supported self check-in",
  "Short and long stays",
  "Direct corporate and long-stay quotations",
];

const whoFor = [
  { name: "Business travellers", text: "Focused trips and executive travel where a kitchen, Wi-Fi, parking and a quiet base matter more than a busy lobby." },
  { name: "Corporate guests & diplomats", text: "Short assignments and visiting consultants who value discretion, neighbourhood convenience and direct hosting support." },
  { name: "Wellness stays", text: "Guests who want treatment time to be part of the stay rather than an appointment squeezed between other plans." },
  { name: "Bridal parties", text: "The bride, close family or selected bridal party who want to stay, prepare and move into spa care within one setting." },
  { name: "Medical travellers", text: "Visitors attending consultations or follow-ups who need private accommodation. The suites do not provide clinical care." },
  { name: "Staycations", text: "Lusaka residents wanting a change of pace without leaving the city, with suite, treatment and café arranged together." },
];

const bookDirect = [
  { name: "Best available direct rate", text: "The best publicly available MaMoyo rate for the same suite, dates, occupancy and terms." },
  { name: "Priority spa support", text: "Coordinate spa timing before arrival, reducing the risk that the treatment you want is unavailable." },
  { name: "A MaMoyo welcome", text: "Begin the stay with a seasonal wellness drink." },
  { name: "Long-stay quotations", text: "Request weekly or monthly pricing according to dates, occupancy and service requirements." },
  { name: "One conversation", text: "Plan the suite, spa, café and itinerary needs with one MaMoyo contact." },
  { name: "Corporate arrangements", text: "Approved companies may request direct invoicing and repeat guest support." },
];

const stayExperiences = [
  { name: "Stay & Restore", text: "Two nights with one 60-minute massage per registered adult, a MaMoyo welcome drink, priority spa scheduling and pool and garden access." },
  { name: "Executive Stay", text: "Three nights with an Executive Reset, a café credit and priority assistance coordinating treatment around the working day." },
  { name: "Bridal Stay", text: "One or two nights across the required suites, coordinated Bridal Glow experiences, a refreshment ritual and a planned preparation schedule." },
  { name: "MaMoyo Weekend", text: "Two nights for two guests with a Couples Retreat, afternoon tea, pool and garden access and late checkout where confirmed." },
];

const faqs = [
  { q: "Is breakfast included?", a: "Breakfast is included only where stated in the confirmed rate or package. Café arrangements can be added before arrival." },
  { q: "Is pool access included?", a: "Registered suite guests have access to the pool and gardens, subject to property hours, maintenance and safety rules." },
  { q: "Are long stays available?", a: "Yes. Stays of seven nights or more may qualify for a direct quotation according to dates, occupancy and service needs." },
  { q: "Why should I book directly?", a: "Direct booking provides the best available MaMoyo rate for equivalent terms, priority spa planning and one point of contact for the stay." },
];

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
          overline="MaMoyo Suites, Kabulonga"
          title="Stay within the rhythm of MaMoyo"
          description="A collection of fully serviced studio suites offers a private, composed way to stay in Lusaka, set within the MaMoyo Kabulonga property with the spa, café, pool and gardens close at hand."
        />
        <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-mist-800">
          Designed for short visits and longer assignments, the suites give guests the ease of a
          kitchen, Wi-Fi, parking, self check-in support and a quiet base in one of Lusaka&rsquo;s most
          established neighbourhoods.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="#book"
            className="inline-flex items-center gap-2 rounded-full bg-mist-600 px-8 py-4 text-sm font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-mist-700"
          >
            Check Direct Availability
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="#suites"
            className="inline-flex items-center gap-2 rounded-full border border-mist-300 px-8 py-4 text-sm font-semibold text-mist-800 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
          >
            Explore the Suites
          </Link>
        </div>

        {/* Suite cards */}
        <div id="suites" className="mt-16 grid scroll-mt-28 gap-6 md:grid-cols-2">
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
                    <h2 className="font-serif text-2xl font-semibold text-cocoa-700">{s.name}</h2>
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

        {/* Not a conventional hotel */}
        <div className="mx-auto mt-20 max-w-3xl text-center">
          <h2 className="text-balance font-serif text-2xl font-semibold text-cocoa-700 sm:text-3xl">
            Everything needed, nothing made complicated
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-mist-700">
            <p>
              MaMoyo Suites are not a conventional hotel. They are self-contained studios created for
              guests who value privacy, practical comfort and a setting that feels personal. A
              treatment can be arranged without crossing the city. Shopping, dining, healthcare
              services and important business areas are within convenient reach.
            </p>
            <p>
              The stay works equally well for a focused business trip, a longer assignment, a bridal
              weekend, a medical visit, a couple&rsquo;s city break or a quiet staycation.
            </p>
          </div>
        </div>

        {/* At a glance + who the suites are for */}
        <div className="mt-20 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-cocoa-700">At a glance</h2>
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {atAGlance.map((a) => (
                <li key={a} className="flex items-baseline gap-2.5 text-sm text-mist-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mist-400" aria-hidden="true" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-semibold text-cocoa-700">Who the suites are for</h2>
            <div className="mt-6 space-y-4">
              {whoFor.map((w) => (
                <div key={w.name}>
                  <p className="text-sm font-semibold text-mist-950">{w.name}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-mist-700">{w.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy with care */}
        <div className="mx-auto mt-20 max-w-3xl text-center">
          <h2 className="text-balance font-serif text-2xl font-semibold text-cocoa-700 sm:text-3xl">
            Privacy with care close enough to matter
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-mist-700">
            <p>
              A good stay does not need constant ceremony. It needs a room that feels settled,
              reliable essentials, clean surroundings and help that is easy to reach when it is
              genuinely useful.
            </p>
            <p>
              MaMoyo Suites balance independence with the warmth of being hosted. Guests can move
              through the day privately, then ask the team to coordinate treatment, café time, a
              longer stay or a wellness-focused itinerary.
            </p>
          </div>
        </div>

        {/* Book direct */}
        <div className="mt-20">
          <SectionHeading
            overline="Book Directly with MaMoyo"
            title="One conversation, the best direct rate"
            description="Booking direct protects the guest relationship and makes stays and treatments easier to coordinate."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookDirect.map((b, i) => (
              <Reveal key={b.name} delay={(i % 3) * 70}>
                <div className="h-full rounded-2xl border border-mist-200 bg-white p-6 shadow-soft">
                  <h3 className="font-serif text-lg font-semibold text-cocoa-700">{b.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist-700">{b.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="#book"
              className="inline-flex items-center gap-2 rounded-full bg-mist-600 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
            >
              Book Direct
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href="https://wa.me/260967245833?text=Hello%20MaMoyo.%20I%20would%20like%20to%20enquire%20about%20MaMoyo%20Suites."
              className="inline-flex items-center gap-2 rounded-full border border-mist-300 px-7 py-3.5 text-sm font-semibold text-mist-800 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Message Reservations
            </a>
          </div>
        </div>

        {/* Wellness stay experiences */}
        <div className="mt-20">
          <SectionHeading
            overline="Wellness Stay Experiences"
            title="Stays with care built in"
            description="Rates are quoted according to dates, occupancy and the number of suites required."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {stayExperiences.map((s, i) => (
              <Reveal key={s.name} delay={(i % 2) * 80}>
                <div className="h-full rounded-2xl border border-mist-200 bg-white p-7 shadow-soft">
                  <h3 className="font-serif text-xl font-semibold text-cocoa-700">{s.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist-700">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="#book"
              className="inline-flex items-center gap-2 rounded-full bg-mist-600 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
            >
              Plan a Wellness Stay
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Booking module */}
        <div id="book" className="mx-auto mt-20 max-w-2xl scroll-mt-32">
          <SectionHeading
            overline="Direct Availability"
            title="Book direct with MaMoyo"
            description="Send your dates and guest details. Our reservations team will confirm the available suite, the direct rate, payment terms and any wellness additions. Nothing is charged online."
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

        {/* FAQ */}
        <div className="mx-auto mt-20 max-w-3xl">
          <SectionHeading overline="Suites FAQ" title="Good to know" />
          <div className="mt-8">
            <FaqList items={faqs} />
          </div>
        </div>
      </div>
    </div>
  );
}
