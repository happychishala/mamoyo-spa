import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Clock, Car, ArrowRight } from "lucide-react";
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
    text: "Pool and steam room access can be booked independently or included within selected packages. Hydrotherapy is subject to capacity, resort operations and individual health considerations. Swimming costumes are required.",
    cta: { label: "Add Hydrotherapy", href: "/booking" },
  },
  {
    title: "Time for two",
    text: "Twangale’s natural setting makes it especially suited to couples — treatments followed by pool time, a meal, a walk through the grounds or an overnight stay booked directly with the resort.",
    cta: { label: "View Couples Retreat", href: "/experiences" },
  },
  {
    title: "A better setting for important conversations",
    text: "Corporate retreats combine MaMoyo treatments with resort meeting rooms, gardens, dining and accommodation — executive massage, guided recovery, team wellbeing and structured reflection.",
    cta: { label: "Explore Corporate Retreats", href: "/corporate-wellness" },
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
        intro="Within the gardens of Twangale Resort in Lilayi, MaMoyo unfolds at a slower, more expansive pace. Treatment rooms, pool time, open air and the landscape create space for a complete day rather than a single hour — come as a couple, family, group of friends, corporate team or resort guest."
        primary={{ label: "Book Twangale", href: "/booking" }}
        secondary={{ label: "Get Directions", href: mapsUrl }}
        image={{ src: "/photos/interior.jpg", alt: "The garden-set calm of MaMoyo at Twangale Resort" }}
      />

      {/* Rhythm */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading overline="The Twangale Rhythm" title="The setting changes what the body can release" />
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
      </section>

      {/* Features */}
      <section className="bg-mist-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="flex h-full flex-col rounded-2xl border border-mist-200 bg-white p-7 shadow-soft">
                  <h3 className="font-serif text-lg font-semibold text-mist-950">{f.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-mist-700">{f.text}</p>
                  <Link
                    href={f.cta.href}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-mist-700 transition-colors duration-200 hover:text-mist-900"
                  >
                    {f.cta.label}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Best for + practical info */}
      <section className="mx-auto max-w-6xl px-6 py-16">
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
                Complimentary on-site parking · allow extra time to enter the resort
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={mapsUrl}
                className="inline-flex items-center gap-1.5 rounded-full bg-mist-600 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
              >
                Open in Maps
              </Link>
              <Link
                href="/booking"
                className="inline-flex items-center gap-1.5 rounded-full border border-mist-300 px-4 py-2 text-xs font-semibold text-mist-700 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
              >
                Book Twangale
              </Link>
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
