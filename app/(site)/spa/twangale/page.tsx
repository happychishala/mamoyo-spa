import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Clock, Car, ArrowRight, MessageCircle, CalendarClock } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/Section";
import Reveal from "@/components/site/Reveal";
import FaqList from "@/components/site/FaqList";
import { locationInfo } from "@/lib/content";
import JsonLd from "@/components/site/JsonLd";
import { branchSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "MaMoyo at Twangale Resort | Spa Days in Lilayi" },
  description:
    "Plan a MaMoyo spa day at Twangale Resort in Lilayi with massage, body rituals, pool time, couples experiences, groups and corporate retreats.",
  alternates: { canonical: "/spa/twangale" },
  openGraph: {
    title: "MaMoyo at Twangale Resort | Spa Days in Lilayi",
    description:
      "Plan a MaMoyo spa day at Twangale Resort in Lilayi with massage, body rituals, pool time, couples experiences, groups and corporate retreats.",
    url: "/spa/twangale",
  },
};

const loc = locationInfo.Twangale;
const resortEnquiries = "+260 962 489097";
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`;
const whatsappUrl = `https://wa.me/${loc.phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
  "Hello MaMoyo at Twangale. I would like help with a spa booking."
)}`;
const bookUrl = "/booking?location=Twangale";

const rhythm = [
  { title: "Morning", text: "Begin with a swim, a quiet walk through the grounds or an early treatment. The body arrives differently when the day has not yet become rushed." },
  { title: "Midday", text: "Move into massage, a body ritual, facial or complete package. Longer treatments work especially well when there is no need to leave immediately." },
  { title: "Afternoon", text: "Return to the pool, continue with hand and foot care or share a meal. Couples and groups can stagger treatments while remaining together." },
  { title: "Evening", text: "Extended hours make Twangale suitable for after-work care, couples time and slower weekend transitions." },
];

const bestFor = [
  "Full and half-day spa journeys",
  "Couples retreats",
  "Friends, families and group days",
  "Pool and hydrotherapy combinations",
  "Corporate off-sites and leadership resets",
  "Resort stays and weekend visits",
];

const features = [
  {
    title: "Water changes the pace",
    paragraphs: [
      "Pool and steam room access can be booked independently or included within selected packages. Swimming supports gentle movement and allows groups to share the day even when treatment times differ. Steam may be used as part of a planned sequence where appropriate.",
      "Hydrotherapy is subject to capacity, resort operations and individual health considerations. Swimming costumes are required.",
    ],
    ctas: [{ label: "Add Hydrotherapy", href: bookUrl }],
  },
  {
    title: "Time for two",
    paragraphs: [
      "Twangale’s natural setting makes it especially suited to couples. Treatments can be followed by pool time, a meal, a walk through the grounds or an overnight stay booked directly with the resort. Treatment pairings can be adapted when guests need different pressure or skincare support.",
    ],
    ctas: [
      { label: "View Couples Retreat", href: "/experiences" },
      { label: "Book for Two", href: bookUrl },
    ],
  },
  {
    title: "One destination, different ways to spend it",
    paragraphs: [
      "The wider Twangale property includes pools, gardens, accommodation, dining, fitness facilities and family activities. This allows families and groups to plan a shared day while individual adults move through treatments. Spa areas remain quiet, and children remain under the supervision of the accompanying adult.",
    ],
    ctas: [{ label: "Plan a Group Day", href: "/contact" }],
  },
  {
    title: "A better setting for important conversations",
    paragraphs: [
      "Twangale combines MaMoyo treatment experiences with resort meeting rooms, gardens, dining and accommodation. Corporate retreats may include executive massage, guided recovery, team wellbeing sessions, pool time, lunch and structured reflection without turning the day into a generic conference package.",
    ],
    ctas: [
      { label: "Explore Corporate Retreats", href: "/corporate-wellness" },
      { label: "Plan a Private Event", href: "/corporate-wellness#proposal" },
    ],
  },
];

const faqs = [
  { q: "Do I need to stay at Twangale Resort to book MaMoyo?", a: "No. Day guests may book MaMoyo directly. Wider resort facilities may have separate access fees, reservations or operating rules." },
  { q: "Is pool access included with every treatment?", a: "No. Pool access is included only where stated in a package or confirmed experience." },
  { q: "Can we book simultaneous treatments?", a: "Simultaneous treatments depend on therapist and room availability. Groups should book early so the day can be scheduled well." },
  { q: "Can we combine the spa with a Twangale room?", a: "Yes. Spa treatments are booked with MaMoyo and accommodation is confirmed separately by Twangale Resort." },
];

export default function TwangalePage() {
  return (
    <>
      <JsonLd data={branchSchema("Twangale")} />
      <PageHero
        eyebrow="MaMoyo at Twangale Resort"
        title="Let the day become larger than the appointment"
        intro="Within the gardens of Twangale Resort in Lilayi, MaMoyo unfolds at a slower, more expansive pace. Treatment rooms, pool time, open air, resort facilities and the landscape around them create space for a complete day rather than a single hour."
        primary={{ label: "Book Twangale", href: bookUrl }}
        secondary={{ label: "Plan a Spa Day", href: "/experiences" }}
        note={
          <>
            Spa bookings:{" "}
            <a href={whatsappUrl} className="font-semibold text-mist-800 hover:text-mist-950">
              {loc.phone}
            </a>
          </>
        }
        image={{ src: "/photos/pool.jpg", alt: "The pool and gardens at Twangale Resort" }}
      />

      {/* Setting */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-balance text-center font-serif text-3xl font-semibold tracking-tight text-mist-950">
          The setting changes what the body can release
        </h2>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-mist-800">
          <p>
            Twangale is MaMoyo for days with more room in them. The gardens, pools and bird life make
            the transition into treatment feel gradual. There is time to arrive, move between
            experiences and let the benefits settle before returning to the city.
          </p>
          <p>
            Come as a couple, family, group of friends, corporate team or resort guest. The spa
            remains calm and treatment led, while the wider property allows different generations and
            interests to share one destination.
          </p>
        </div>
      </section>

      {/* Rhythm */}
      <section className="bg-mist-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading overline="The Twangale Rhythm" title="A day with room in it" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {rhythm.map((r, i) => (
              <Reveal key={r.title} delay={(i % 4) * 70}>
                <div className="h-full rounded-2xl border border-mist-200 bg-white p-6 shadow-soft">
                  <h3 className="font-serif text-lg font-semibold text-mist-950">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist-700">{r.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 2) * 80}>
              <div className="flex h-full flex-col rounded-2xl border border-mist-200 bg-white p-7 shadow-soft">
                <h3 className="font-serif text-lg font-semibold text-mist-950">{f.title}</h3>
                <div className="mt-3 flex-1 space-y-3 text-sm leading-relaxed text-mist-700">
                  {f.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-3 border-t border-mist-100 pt-5">
                  {f.ctas.map((c, ci) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className={
                        ci === 0
                          ? "inline-flex items-center gap-1.5 rounded-full bg-mist-600 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
                          : "inline-flex items-center gap-1.5 rounded-full border border-mist-300 px-4 py-2 text-xs font-semibold text-mist-700 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
                      }
                    >
                      {c.label}
                      {ci === 0 && <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Best for + practical info */}
      <section className="bg-mist-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-mist-950">Best suited to</h2>
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {bestFor.map((b) => (
                  <li key={b} className="flex items-baseline gap-2.5 text-sm text-mist-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mist-400" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-mist-200 bg-white p-7 shadow-soft">
              <h2 className="font-serif text-xl font-semibold text-mist-950">Practical information</h2>
              <ul className="mt-5 space-y-3 text-sm text-mist-700">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-mist-500" aria-hidden="true" />
                  {loc.address}
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-mist-500" aria-hidden="true" />
                  <span>
                    <span className="block">{loc.phone} <span className="text-mist-500">· {loc.phoneLabel}</span></span>
                    <span className="block">{resortEnquiries} <span className="text-mist-500">· Twangale Resort enquiries</span></span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-mist-500" aria-hidden="true" />
                  <span>
                    {loc.hours.map((h) => (
                      <span key={h.days} className="block">
                        {h.days}: {h.time}
                      </span>
                    ))}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Car className="mt-0.5 h-4 w-4 shrink-0 text-mist-500" aria-hidden="true" />
                  Complimentary on-site parking
                </li>
                <li className="flex items-start gap-3">
                  <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-mist-500" aria-hidden="true" />
                  Allow additional time to enter the resort and arrive at the spa at least 20 minutes
                  before treatment
                </li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={mapsUrl}
                  className="inline-flex items-center gap-1.5 rounded-full bg-mist-600 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
                >
                  Open in Maps
                </Link>
                <a
                  href={whatsappUrl}
                  className="inline-flex items-center gap-1.5 rounded-full border border-mist-300 px-4 py-2 text-xs font-semibold text-mist-700 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  WhatsApp Twangale Spa
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <SectionHeading overline="Twangale FAQ" title="Good to know" />
        <div className="mt-8">
          <FaqList items={faqs} />
        </div>
      </section>
    </>
  );
}
