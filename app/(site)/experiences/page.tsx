import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/Section";
import Reveal from "@/components/site/Reveal";

export const metadata: Metadata = {
  title: "Experiences",
  description:
    "Discover Executive Reset, Couples Retreat, Bridal Glow, Girls Wellness Days, Mom To Be, full-day spa journeys and private events in Lusaka.",
};

const signature = [
  {
    name: "Executive Reset",
    price: "K1,650",
    unit: "per person",
    desc: "A focused three-hour sequence for physical tension and mental load. Includes a 60-minute deep tissue massage, 30-minute scalp therapy and a composed wellness lunch with a non-alcoholic drink ritual.",
    href: "/booking",
  },
  {
    name: "Couples Retreat",
    price: "K2,750",
    unit: "per couple",
    desc: "Shared treatment time, two aromatherapy massages, a private tea ritual, a quiet sharing table and a thoughtful parting detail. Treatment pressure may be adapted individually.",
    href: "/booking",
  },
  {
    name: "Bridal Glow",
    price: "K2,950",
    unit: "per person",
    desc: "Body polishing, professional facial care, finished hands and feet, hydration and refreshments brought together before the celebration. Suitable for the bride alone or a carefully scheduled group.",
    href: "/contact",
  },
  {
    name: "Girls Wellness Day",
    price: "K1,650",
    unit: "per person",
    desc: "For three or more guests: a treatment, detailed foot care, a wellness lunch, a botanical drink and pool time arranged around a clear group schedule.",
    href: "/contact",
  },
  {
    name: "Mom To Be",
    price: "K1,650",
    unit: "per person",
    desc: "Gentle exfoliation, adapted prenatal massage, classic foot care and a calming tea ritual designed around the comfort of the expectant mother. Suitability is confirmed before booking.",
    href: "/booking",
  },
  {
    name: "Full Day Escape",
    price: "K2,625",
    unit: "per person",
    desc: "The Zorora Pano journey: full body polish, nourishing wrap and steam, restorative massage, express facial and a choice of classic hand or foot care — moving the body gradually from tension into renewal.",
    href: "/booking",
  },
];

const recurring = [
  {
    name: "Wellness Wednesdays",
    price: "K750",
    unit: "per person",
    desc: "A rotating midweek programme combining a focused treatment, useful conversation and a MaMoyo drink ritual. Each release has a defined theme, time, location and capacity.",
  },
  {
    name: "Self Care Sundays",
    price: "K950",
    unit: "per person",
    desc: "A 60-minute Swedish massage, pool time, still water and a signature tea ritual designed to change the way the next week begins.",
  },
];

const arrivalRitual = [
  "Welcome by name and confirm your intention for the visit.",
  "A warm or cool towel according to the season and location.",
  "Water, an infused drink or the day’s MaMoyo tea.",
  "A discreet consultation and a clear explanation of the sequence.",
  "After treatment, a quiet return before café, pool or departure.",
  "Hydration, aftercare and one clear recommendation — never a hard sell.",
];

const bookingSteps = [
  "Select the experience, preferred location, date and guest count.",
  "The team confirms treatment capacity and the proposed schedule.",
  "A 50% deposit secures the booking.",
  "Dietary, health and treatment information is collected before arrival.",
  "The remaining balance is due 72 hours before the experience unless written terms state otherwise.",
];

export default function ExperiencesPage() {
  return (
    <>
      <PageHero
        eyebrow="MaMoyo Experiences"
        title="More than one treatment, arranged with intention"
        intro="Our experiences bring together massage, skin, body care, nourishment, tea, water and time in a sequence that makes sense. Choose according to the state you need, the people you are bringing and the time you can protect."
        primary={{ label: "Find Your Experience", href: "/booking" }}
        secondary={{ label: "Ask Our Team", href: "/contact" }}
      />

      {/* Signature experiences */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading
          overline="Signature Experiences"
          title="Chosen for the state you need"
          description="Each experience is a complete journey. Prices are held at booking; a 50% deposit secures your place."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {signature.map((x, i) => (
            <Reveal key={x.name} delay={(i % 3) * 80}>
              <article className="flex h-full flex-col rounded-2xl border border-mist-200 bg-white p-7 shadow-soft transition-shadow duration-300 hover:shadow-lift">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-xl font-semibold text-mist-950">{x.name}</h3>
                </div>
                <p className="mt-1 text-sm font-semibold text-mist-700">
                  {x.price} <span className="font-normal text-mist-500">{x.unit}</span>
                </p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-mist-700">{x.desc}</p>
                <div className="mt-6 flex flex-wrap gap-3 border-t border-mist-100 pt-5">
                  <Link
                    href={x.href}
                    className="inline-flex items-center gap-1.5 rounded-full bg-mist-600 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
                  >
                    Book {x.name}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/gift-cards"
                    className="inline-flex items-center gap-1.5 rounded-full border border-mist-300 px-4 py-2 text-xs font-semibold text-mist-700 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
                  >
                    <Send className="h-3.5 w-3.5" aria-hidden="true" />
                    Send as a gift
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Recurring rituals */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading
          overline="Recurring Rituals"
          title="A rhythm to return to"
          description="Smaller, regular releases that keep care in the calendar between the bigger journeys."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {recurring.map((x, i) => (
            <Reveal key={x.name} delay={i * 90}>
              <article className="flex h-full flex-col rounded-2xl border border-mist-200 bg-white p-8 shadow-soft">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-2xl font-semibold text-mist-950">{x.name}</h3>
                  <p className="shrink-0 text-sm font-semibold text-mist-700">
                    {x.price} <span className="font-normal text-mist-500">{x.unit}</span>
                  </p>
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-mist-700">{x.desc}</p>
                <Link
                  href="/contact"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-mist-700 transition-colors duration-200 hover:text-mist-900"
                >
                  Enquire &amp; join
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Arrival ritual + booking steps */}
      <section className="bg-mist-50 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-mist-950">The arrival &amp; departure ritual</h2>
            <ol className="mt-6 space-y-4">
              {arrivalRitual.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mist-600 text-xs font-semibold text-white">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-mist-700">{step}</p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-semibold text-mist-950">How booking works</h2>
            <ol className="mt-6 space-y-4">
              {bookingSteps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-mist-300 text-xs font-semibold text-mist-700">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-mist-700">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Group & seasonal */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Corporate retreats",
              text: "Half and full-day programmes for teams and leaders, delivered at MaMoyo or within Twangale Resort — treatment rotation, food, recovery education, gardens, pool time and meeting space.",
              cta: { label: "Explore Corporate Retreats", href: "/corporate-wellness" },
            },
            {
              title: "Private events",
              text: "Wellness-led birthdays, bridal days and intimate celebrations with controlled guest flow. Celebration is welcome; disruption is not — no speakers, glitter, confetti or high-volume entertainment.",
              cta: { label: "Plan a Private Event", href: "/contact" },
            },
            {
              title: "Seasonal experiences",
              text: "Limited releases shaped around the season and the Zambian calendar. Each has a defined date, location, capacity, price and booking deadline.",
              cta: { label: "Join Early Access", href: "/contact" },
            },
          ].map((b, i) => (
            <Reveal key={b.title} delay={i * 80}>
              <div className="flex h-full flex-col rounded-2xl border border-mist-200 bg-white p-7 shadow-soft">
                <h3 className="font-serif text-lg font-semibold text-mist-950">{b.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-mist-700">{b.text}</p>
                <Link
                  href={b.cta.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-mist-700 transition-colors duration-200 hover:text-mist-900"
                >
                  {b.cta.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
