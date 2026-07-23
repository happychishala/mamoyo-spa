import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Clock, Car, ArrowRight, MessageCircle, CalendarClock } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/Section";
import Reveal from "@/components/site/Reveal";
import PhotoStrip from "@/components/site/PhotoStrip";
import FaqList from "@/components/site/FaqList";
import { locationInfo } from "@/lib/content";
import JsonLd from "@/components/site/JsonLd";
import { branchSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "MaMoyo Kabulonga | Boutique Spa and Skincare Lusaka" },
  description:
    "Visit MaMoyo Kabulonga for boutique spa care, professional facials, advanced skincare, café rituals and MaMoyo Suites on Reedbuck Road.",
  alternates: { canonical: "/spa/kabulonga" },
  openGraph: {
    title: "MaMoyo Kabulonga | Boutique Spa and Skincare Lusaka",
    description:
      "Visit MaMoyo Kabulonga for boutique spa care, professional facials, advanced skincare, café rituals and MaMoyo Suites on Reedbuck Road.",
    url: "/spa/kabulonga",
  },
};

const loc = locationInfo.Kabulonga;
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`;
const whatsappUrl = `https://wa.me/${loc.phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
  "Hello MaMoyo Kabulonga. I would like help with a booking."
)}`;
const bookUrl = "/booking?location=Kabulonga";

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
    paragraphs: [
      "Kabulonga is MaMoyo’s primary destination for professional facials and advanced aesthetic care. Treatment selection responds to the skin in front of us, supported by consultation, recognised product systems and appropriate aftercare.",
      "Advanced options may include professional peels, dermaplaning, HydraFacial, microneedling, meso skincare, high frequency, LED light therapy and focused eye care. First-time advanced treatment requires consultation, and treatment may be postponed when it is not appropriate to proceed.",
    ],
    ctas: [
      { label: "View Facial Care", href: "/spa/menu" },
      { label: "Ask About Your Skin", href: "/contact" },
    ],
  },
  {
    title: "Let the treatment change the rest of the day",
    paragraphs: [
      "The café allows a Kabulonga visit to unfold rather than end abruptly. Come early for coffee, matcha or breakfast. After treatment, choose a balanced lunch, botanical drink or tea ritual that feels satisfying without heaviness. The café remains open to guests without spa bookings.",
    ],
    ctas: [
      { label: "Explore MaMoyo Café", href: "/cafe" },
      { label: "Reserve a Table", href: "/cafe#reserve" },
    ],
  },
  {
    title: "Stay within the grounds",
    paragraphs: [
      "MaMoyo Suites offer a private base for business travellers, diplomats, bridal parties, medical visitors, couples, solo travellers and Lusaka residents planning a staycation. Spa timing can be coordinated directly with the MaMoyo team.",
    ],
    ctas: [
      { label: "Explore the Suites", href: "/suites" },
      { label: "Check Availability", href: "/suites#book" },
    ],
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
      <JsonLd data={branchSchema("Kabulonga")} />
      <PageHero
        eyebrow="MaMoyo Kabulonga"
        title="A quieter way to move through the city"
        intro={[
          "At 16 Reedbuck Road, MaMoyo Kabulonga brings spa care, professional skincare, nourishing food, calm gardens and serviced suites into one personal city address.",
          "It is designed for the rhythm of real life: an early treatment before the day becomes busy, a facial between commitments, lunch after a massage, a private afternoon with friends or a longer stay when Lusaka needs to feel more settled.",
        ]}
        primary={{ label: "Book Kabulonga", href: bookUrl }}
        secondary={{ label: "Get Directions", href: mapsUrl }}
        note={
          <>
            WhatsApp:{" "}
            <a href={whatsappUrl} className="font-semibold text-mist-800 hover:text-mist-950">
              {loc.phone}
            </a>
          </>
        }
        image={{ src: "/photos/facial-massage.jpg", alt: "A therapist performing a facial massage at MaMoyo Kabulonga" }}
      />

      {/* Human scale */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-balance text-center font-serif text-3xl font-semibold tracking-tight text-cocoa-700">
          Personal care, held at a human scale
        </h2>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-mist-800">
          <p>
            Kabulonga is the everyday heart of MaMoyo. The experience is intimate, composed and
            attentive without being formal. Our team has time to learn preferences, notice changes and
            help guests build a rhythm of care that can be maintained.
          </p>
          <p>
            The café is close enough to become part of the treatment journey. The pool and gardens
            create room to stay. The suites make it possible to sleep within the same calm
            environment. Each element works on its own; together they create a complete day or stay.
          </p>
        </div>
      </section>

      {/* Ritual */}
      <section className="bg-mist-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading overline="The Kabulonga Ritual" title="How a visit unfolds" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ritual.map((r, i) => (
              <Reveal key={r.title} delay={(i % 4) * 70}>
                <div className="h-full rounded-2xl border border-mist-200 bg-white p-6 shadow-soft">
                  <span className="font-serif text-2xl text-mist-400">0{i + 1}</span>
                  <h3 className="mt-2 font-serif text-lg font-semibold text-cocoa-700">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist-700">{r.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="flex h-full flex-col rounded-2xl border border-mist-200 bg-white p-7 shadow-soft">
                <h3 className="font-serif text-lg font-semibold text-cocoa-700">{f.title}</h3>
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

      {/* Photography */}
      <PhotoStrip
        className="py-4"
        photos={[
          { src: "/photos/wide-skin-consult.jpg", alt: "A professional skin consultation at Kabulonga" },
          { src: "/photos/manicure.jpg", alt: "Detailed hand care at MaMoyo Kabulonga" },
          { src: "/photos/cafe-breakfast.jpg", alt: "Breakfast served at MaMoyo Café" },
        ]}
      />

      {/* Private days */}
      <section className="bg-mist-50 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight text-cocoa-700">
            Private days at Kabulonga
          </h2>
          <p className="mt-5 text-base leading-relaxed text-mist-800">
            Kabulonga can host smaller wellness occasions with a personal atmosphere: bridal mornings,
            birthdays, sister days, mother and daughter time, team appreciation and intimate
            celebrations. Every booking is built around treatment capacity, a clear schedule and food
            or drink that suits the pace of the group.
          </p>
          <Link
            href="/experiences#private"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-mist-600 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
          >
            Plan a Private Experience
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Best for + practical info */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-cocoa-700">Best suited to</h2>
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
            <h2 className="font-serif text-xl font-semibold text-cocoa-700">Practical information</h2>
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
              <li className="flex items-start gap-3">
                <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-mist-500" aria-hidden="true" />
                Arrive 15 minutes before a standard treatment and 20 minutes before a first facial or
                advanced skin appointment
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
                WhatsApp Kabulonga
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <SectionHeading overline="Kabulonga FAQ" title="Good to know" />
        <div className="mt-8">
          <FaqList items={faqs} />
        </div>
      </section>
    </>
  );
}
