import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/Section";
import Reveal from "@/components/site/Reveal";

export const metadata: Metadata = {
  title: "The Spa",
  description:
    "Explore MaMoyo spa care across Kabulonga and Twangale Resort — massage, facials, body rituals, advanced skincare, grooming and hydrotherapy.",
};

const locations = [
  {
    name: "Kabulonga",
    blurb:
      "Choose Kabulonga for boutique treatment rooms, advanced skincare, the café, suites and a personal pace that fits naturally into the week.",
    points: [
      "Regular massage and skincare",
      "Advanced facial treatments",
      "Weekday and express appointments",
      "Workday resets",
      "Café time before or after treatment",
      "Stay and spa combinations",
    ],
    explore: "/spa/kabulonga",
  },
  {
    name: "Twangale Resort",
    blurb:
      "Choose Twangale for gardens, pool time, hydrotherapy, group occasions and spa journeys that feel connected to a full resort day.",
    points: [
      "Full and half-day packages",
      "Couples experiences",
      "Groups and family days",
      "Corporate retreats",
      "Pool and spa combinations",
      "Resort stays and weekend visits",
    ],
    explore: "/spa/twangale",
  },
];

const care = [
  {
    name: "Massage",
    text: "Swedish, deep tissue, hot stone, aromatherapy, prenatal, reflexology, scalp care and focused back treatments.",
  },
  {
    name: "MaMoyo Rituals",
    text: "African-inspired signature massage, traditional touch, body polishing, exfoliation and complete body rituals.",
  },
  {
    name: "Facial Care",
    text: "Professional treatment for cleansing, sensitivity, hydration, ageing concerns and regular skin maintenance.",
  },
  {
    name: "Advanced Aesthetics",
    text: "Professional peels, dermaplaning, HydraFacial, microneedling, meso skincare, LED and focused eye care.",
  },
  {
    name: "Hands, Feet & Grooming",
    text: "Manicures, pedicures, detailed foot care, waxing, threading and tinting.",
  },
  {
    name: "Hydrotherapy",
    text: "Pool and steam room time as stand-alone care or part of selected experiences and packages.",
  },
];

const ritual = [
  "A calm welcome, hydration and a short consultation.",
  "A warm towel or foot ritual appropriate to the treatment and location.",
  "Professional care adapted to pressure, focus, skin needs and relevant health information.",
  "A gradual return with water or a MaMoyo tea ritual.",
  "Clear aftercare and an honest recommendation for what, if anything, should come next.",
];

export default function SpaOverviewPage() {
  return (
    <>
      <PageHero
        eyebrow="The Spa at MaMoyo"
        title="Treatment begins with listening"
        intro="The best treatment is the one that responds accurately to the body, skin and state of mind in front of us. Across Kabulonga and Twangale Resort, MaMoyo offers massage, body rituals, professional facials, advanced aesthetic care, hand and foot care and hydrotherapy — delivered with warmth and discretion."
        primary={{ label: "View Treatment Menu", href: "/treatments" }}
        secondary={{ label: "Ask a Treatment Host", href: "/contact" }}
      />

      {/* Location choice */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading
          overline="Choose a Location"
          title="How would you like to spend your time?"
          description="One standard of care, two distinct settings. Treatment availability may vary by location — select your destination during booking for current availability."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {locations.map((loc, i) => (
            <Reveal key={loc.name} delay={i * 90}>
              <div className="flex h-full flex-col rounded-2xl border border-mist-200 bg-white p-8 shadow-soft">
                <h3 className="font-serif text-2xl font-semibold text-mist-950">{loc.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist-700">{loc.blurb}</p>
                <ul className="mt-5 flex-1 space-y-2">
                  {loc.points.map((p) => (
                    <li key={p} className="flex items-baseline gap-2.5 text-sm text-mist-700">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mist-400" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap gap-3 border-t border-mist-100 pt-5">
                  <Link
                    href={loc.explore}
                    className="inline-flex items-center gap-1.5 rounded-full bg-mist-600 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
                  >
                    Explore {loc.name}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/booking"
                    className="inline-flex items-center gap-1.5 rounded-full border border-mist-300 px-4 py-2 text-xs font-semibold text-mist-700 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
                  >
                    Book {loc.name.split(" ")[0]}
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Explore spa care */}
      <section className="bg-mist-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            overline="Explore Spa Care"
            title="Results and feeling belong in the same room"
            description="Our menu combines internationally recognised skincare with treatments rooted in touch, African tradition and the realities of modern life."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {care.map((c, i) => (
              <Reveal key={c.name} delay={(i % 3) * 80}>
                <article className="h-full rounded-2xl border border-mist-200 bg-white p-7 shadow-soft">
                  <h3 className="font-serif text-lg font-semibold text-mist-950">{c.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mist-700">{c.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/treatments"
              className="inline-flex items-center gap-2 text-sm font-semibold text-mist-700 transition-colors duration-200 hover:text-mist-900"
            >
              View the full Treatment Menu
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Treatment ritual */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <SectionHeading overline="The MaMoyo Treatment Ritual" title="Every visit, the same care" />
        <ol className="mt-10 space-y-5">
          {ritual.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mist-600 text-sm font-semibold text-white">
                {i + 1}
              </span>
              <p className="pt-1 text-sm leading-relaxed text-mist-700">{step}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 rounded-2xl border border-mist-200 bg-white p-8 text-center shadow-soft">
          <h2 className="font-serif text-xl font-semibold text-mist-950">Not sure what to book?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-mist-700">
            Tell us what your body or skin is asking for. Our team can guide you according to your goals,
            available time, treatment history, sensitivity, pregnancy, current health considerations and
            preferred pressure.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-mist-600 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
            >
              Ask a Treatment Host
            </Link>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 rounded-full border border-mist-300 px-7 py-3.5 text-sm font-semibold text-mist-800 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
