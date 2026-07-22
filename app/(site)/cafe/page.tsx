import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Phone, Clock } from "lucide-react";
import { SectionHeading } from "@/components/site/Section";
import Reveal from "@/components/site/Reveal";
import FaqList from "@/components/site/FaqList";
import EnquiryForm from "@/components/site/EnquiryForm";
import { cafeMenu, locationInfo } from "@/lib/content";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = {
  title: "MaMoyo Café",
  description:
    "Visit MaMoyo Café in Kabulonga for considered breakfast and lunch, coffee, matcha, tea rituals, wellness drinks, meetings and afternoon tea.",
};

const loc = locationInfo.Kabulonga;

const rituals = [
  { name: "The MaMoyo Morning Ritual", text: "A composed breakfast, a fresh drink and a tea or coffee ritual selected to set the tone for the day. For individual guests, suite stays and small morning meetings." },
  { name: "The MaMoyo Tea Ritual", text: "A deliberate pour, fresh aromatics and a quiet moment at the table — before treatment, after treatment, or as an experience in its own right." },
  { name: "The MaMoyo Pause", text: "A plate, a botanical drink and a tea or coffee ritual selected according to how you want to feel: restored, balanced, energised or simply well looked after." },
  { name: "Afternoon Tea", text: "A composed sequence of savoury bites, small sweets, fruit and a signature tea ritual for two or more guests — birthdays, bridal afternoons and quiet celebration." },
  { name: "The Post-Treatment Table", text: "Light nourishment, hydration and unhurried service for guests who want the care of the treatment to continue into the rest of the day." },
];

const faqs = [
  { q: "Do I need a spa booking to visit the café?", a: "No. MaMoyo Café is open to walk-in guests, meetings, friends, families and suite guests during opening hours." },
  { q: "Is the food strictly healthy?", a: "The menu is balanced, fresh and thoughtfully prepared, but it is not a restrictive diet menu. Flavour, quality and pleasure come first." },
  { q: "Can allergies be accommodated?", a: "The kitchen will make reasonable efforts. Severe allergies must be disclosed in advance, and complete absence of cross-contact cannot be guaranteed." },
  { q: "Can I hold a birthday or bridal event?", a: "Yes, for smaller groups and by prior arrangement. The menu, service schedule and property rules are confirmed before payment." },
];

export default function CafePage() {
  return (
    <div className="pt-32 pb-8 sm:pt-40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex justify-center">
          <Image
            src="/cafe-mamoyo-logo.png"
            alt="MaMoyo Café"
            width={420}
            height={297}
            priority
            className="h-auto w-64 sm:w-80"
          />
        </div>
        <SectionHeading
          overline="MaMoyo Café, Kabulonga"
          title="A beautiful pause in the middle of real life"
          description="Breakfast after the school run. Coffee before a treatment. A work lunch that does not feel like another meeting. Tea with a friend. MaMoyo Café is open to everyone, whether or not you have a spa booking."
        />
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="#reserve"
            className="inline-flex items-center gap-2 rounded-full bg-mist-600 px-8 py-4 text-sm font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-mist-700"
          >
            Reserve a Table
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="#menu"
            className="inline-flex items-center gap-2 rounded-full border border-mist-300 px-8 py-4 text-sm font-semibold text-mist-800 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
          >
            View the Menu
          </Link>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          <Reveal className="sm:col-span-2">
            <div className="relative h-full overflow-hidden rounded-2xl shadow-soft">
              <div className="relative h-64 sm:h-full sm:min-h-72">
                <Image
                  src="/photos/coffee.jpg"
                  alt="A coffee ritual poured at MaMoyo Café"
                  fill
                  sizes="(min-width: 640px) 60vw, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative h-full overflow-hidden rounded-2xl shadow-soft">
              <div className="relative h-64 sm:h-full sm:min-h-72">
                <Image
                  src="/photos/salad-bowl.jpg"
                  alt="A garden-led plate at MaMoyo Café"
                  fill
                  sizes="(min-width: 640px) 30vw, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Philosophy */}
        <div className="mx-auto mt-16 max-w-3xl text-center">
          <h2 className="font-serif text-2xl font-semibold text-mist-950 sm:text-3xl">
            Food should be wanted before it is explained
          </h2>
          <p className="mt-4 text-base leading-relaxed text-mist-700">
            MaMoyo is not a diet café. The menu is not built around restriction, guilt or food that tastes
            like a compromise. It begins with flavour, freshness, texture, colour and the pleasure of being
            looked after — with wellness in the balance: seasonal produce, garden herbs, whole grains,
            considered proteins, African botanicals and sweets made with restraint.
          </p>
        </div>

        {/* Menu */}
        <div id="menu" className="mt-16 scroll-mt-28 grid gap-8 md:grid-cols-2">
          {cafeMenu.map((section, i) => (
            <Reveal key={section.title} delay={(i % 2) * 100}>
              <section className="h-full rounded-2xl border border-mist-200 bg-white p-8 shadow-soft">
                <div className="flex items-baseline justify-between gap-3 border-b border-mist-100 pb-4">
                  <h2 className="font-serif text-2xl font-semibold text-mist-950">{section.title}</h2>
                  <p className="text-xs font-medium uppercase tracking-wide text-mist-600">{section.note}</p>
                </div>
                <ul className="mt-5 space-y-5">
                  {section.items.map((item) => (
                    <li key={item.name} className="flex items-baseline justify-between gap-4">
                      <div>
                        <p className="font-medium text-mist-950">{item.name}</p>
                        <p className="mt-0.5 text-sm text-mist-700">{item.description}</p>
                      </div>
                      <span className="shrink-0 font-semibold text-mist-700">{formatMoney(item.price)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          ))}
        </div>

        {/* Signature rituals */}
        <div className="mt-20">
          <SectionHeading
            overline="Signature Café Rituals"
            title="Ways to spend the time at the table"
            description="Bookable moments that turn a visit into something composed rather than rushed."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rituals.map((r, i) => (
              <Reveal key={r.name} delay={(i % 3) * 70}>
                <article className="h-full rounded-2xl border border-mist-200 bg-white p-7 shadow-soft">
                  <h3 className="font-serif text-lg font-semibold text-mist-950">{r.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mist-700">{r.text}</p>
                </article>
              </Reveal>
            ))}
            <Reveal delay={210}>
              <div className="flex h-full flex-col justify-center rounded-2xl bg-mist-900 p-7 text-white">
                <h3 className="font-serif text-lg font-semibold">A useful table</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist-200">
                  Discreet meetings, interviews, one-to-one sessions and small team lunches. Reserve ahead when
                  timing, privacy or afternoon tea matters. Smaller celebrations are welcome by prior
                  arrangement — personal, without turning the café into an event venue.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Reservation + practical info */}
        <div id="reserve" className="mt-20 grid scroll-mt-28 gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SectionHeading overline="Reserve a Table" title="Save your seat" />
            <p className="mt-4 text-sm leading-relaxed text-mist-700">
              Walk-ins are welcome, subject to table availability. Reserve ahead for afternoon tea, a work
              table, a set ritual or a small celebration.
            </p>
            <div className="mt-6 rounded-2xl border border-mist-200 bg-white p-6 shadow-soft">
              <h3 className="font-serif text-lg font-semibold text-mist-950">Practical information</h3>
              <ul className="mt-4 space-y-3 text-sm text-mist-700">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-mist-500" aria-hidden="true" />
                  {loc.address}
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-mist-500" aria-hidden="true" />
                  <span>{loc.phone} <span className="text-mist-500">· reservations &amp; WhatsApp</span></span>
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
              </ul>
            </div>
          </div>
          <div className="lg:col-span-3">
            <EnquiryForm
              type="Café"
              submitLabel="Request a Table"
              messageLabel="Date, time & number of guests"
              messagePlaceholder="e.g. Saturday 11:00, four guests — afternoon tea"
              showLocation={false}
              extraFields={[
                {
                  label: "Occasion",
                  type: "select",
                  options: ["A table for breakfast or lunch", "Afternoon tea", "Work table / meeting", "A small celebration", "Café ritual"],
                },
                { label: "Guests", placeholder: "How many people?" },
              ]}
            />
          </div>
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-20 max-w-3xl">
          <SectionHeading overline="Café FAQ" title="Good to know" />
          <div className="mt-8">
            <FaqList items={faqs} />
          </div>
        </div>
      </div>
    </div>
  );
}
