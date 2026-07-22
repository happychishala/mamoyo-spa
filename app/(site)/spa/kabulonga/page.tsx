import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Clock, Car, ArrowRight } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/Section";
import Reveal from "@/components/site/Reveal";
import FaqList from "@/components/site/FaqList";
import { locationInfo } from "@/lib/content";

export const metadata: Metadata = {
  title: "MaMoyo Kabulonga",
  description:
    "Visit MaMoyo Kabulonga for boutique spa care, professional facials, advanced skincare, café rituals and MaMoyo Suites on Reedbuck Road.",
};

const loc = locationInfo.Kabulonga;
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`;

const ritual = [
  { title: "Arrive gently", text: "Begin with a welcome, a short consultation and water or the day’s MaMoyo tea. Arrive early enough to leave the pace of the road outside." },
  { title: "Receive precise care", text: "Your therapist confirms pressure, focus areas, skin goals and sensitivities before treatment begins." },
  { title: "Stay a little longer", text: "Continue in the café, garden or pool area where your booking permits. The time after treatment is part of the experience." },
  { title: "Return with intention", text: "Leave with practical guidance on what to book next, what to use at home or when your body may need support again." },
];

const bestFor = [
  "Regular massage and body care",
  "Professional facials and advanced skincare",
  "Weekday appointments and workday resets",
  "Post-treatment café time",
  "Small private wellness days",
  "MaMoyo Suites and stay combinations",
];

const features = [
  {
    title: "Professional skincare without guesswork",
    text: "Kabulonga is MaMoyo’s primary destination for professional facials and advanced aesthetic care — peels, dermaplaning, HydraFacial, microneedling, LED and focused eye care. First-time advanced treatment requires consultation.",
    cta: { label: "View Facial Care", href: "/treatments" },
  },
  {
    title: "Let the treatment change the rest of the day",
    text: "The café lets a Kabulonga visit unfold rather than end abruptly — coffee or breakfast before, a balanced lunch or tea ritual after. The café remains open to guests without spa bookings.",
    cta: { label: "Explore MaMoyo Café", href: "/cafe" },
  },
  {
    title: "Stay within the grounds",
    text: "MaMoyo Suites offer a private base for business travellers, bridal parties, medical visitors, couples and residents planning a staycation. Spa timing can be coordinated directly with the team.",
    cta: { label: "Explore the Suites", href: "/suites" },
  },
];

const faqs = [
  { q: "Is MaMoyo Kabulonga only for spa guests?", a: "No. The café welcomes walk-in guests, and MaMoyo Suites may be booked independently. Guests can connect the different parts of the property when they choose." },
  { q: "Can I use the pool with a treatment booking?", a: "Pool access is included only where stated in a package, suite stay or confirmed day experience. Stand-alone access remains subject to capacity." },
  { q: "Do you offer same-day appointments?", a: "Same-day appointments may be available, particularly on weekdays. WhatsApp the Kabulonga team for the fastest confirmation." },
  { q: "Can I book a private group?", a: "Yes. Smaller wellness-led gatherings are available by prior arrangement, with treatment capacity and guest flow confirmed in advance." },
];

export default function KabulongaPage() {
  return (
    <>
      <PageHero
        eyebrow="MaMoyo Kabulonga"
        title="A quieter way to move through the city"
        intro="At 16 Reedbuck Road, MaMoyo Kabulonga brings spa care, professional skincare, nourishing food, calm gardens and serviced suites into one personal city address — an early treatment before the day gets busy, a facial between commitments, or a longer stay when Lusaka needs to feel more settled."
        primary={{ label: "Book Kabulonga", href: "/booking" }}
        secondary={{ label: "Get Directions", href: mapsUrl }}
      />

      {/* Ritual */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading overline="The Kabulonga Ritual" title="Personal care, held at a human scale" />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ritual.map((r, i) => (
            <Reveal key={r.title} delay={(i % 4) * 70}>
              <div className="h-full rounded-2xl border border-mist-200 bg-white p-6 shadow-soft">
                <span className="font-serif text-2xl text-mist-400">0{i + 1}</span>
                <h3 className="mt-2 font-serif text-lg font-semibold text-mist-950">{r.title}</h3>
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
                <span>{loc.phone} <span className="text-mist-500">· {loc.phoneLabel}</span></span>
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
                Book Kabulonga
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <SectionHeading overline="Kabulonga FAQ" title="Good to know" />
        <div className="mt-8">
          <FaqList items={faqs} />
        </div>
      </section>
    </>
  );
}
