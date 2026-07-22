import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles, BedDouble, Coffee, CalendarCheck, Gift, Building2, Compass } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/Section";
import Reveal from "@/components/site/Reveal";
import { locationInfo } from "@/lib/content";

export const metadata: Metadata = {
  title: "Book MaMoyo",
  description:
    "Book a MaMoyo treatment, direct suite stay, café ritual, wellness experience, membership consultation, gift card or corporate programme.",
};

const WHATSAPP_TEXT = encodeURIComponent("Hello MaMoyo. I would like help with a booking or enquiry.");
const digits = (p: string) => p.replace(/[^\d]/g, "");

const paths = [
  { icon: CalendarCheck, name: "Spa Treatment", text: "Massage, body rituals, facial care, advanced aesthetics, hands, feet, grooming and hydrotherapy.", href: "/booking", cta: "Book a treatment" },
  { icon: BedDouble, name: "MaMoyo Suites", text: "Check direct availability for a short stay, long stay, business visit, bridal stay or wellness package.", href: "/suites#book", cta: "Check availability" },
  { icon: Sparkles, name: "Curated Experience", text: "Executive Reset, Couples Retreat, Bridal Glow, Girls Wellness Day, Mom To Be, Full Day Escape and seasonal experiences.", href: "/experiences", cta: "Explore experiences" },
  { icon: Coffee, name: "Café", text: "Reserve afternoon tea, a work lunch, celebration table or private café ritual. Walk-ins remain welcome.", href: "/cafe#reserve", cta: "Reserve a table" },
  { icon: Sparkles, name: "Membership", text: "Apply for Silver, Gold or Platinum membership of the MaMoyo Circle.", href: "/membership#apply", cta: "Apply to join" },
  { icon: Building2, name: "Corporate Wellness", text: "Request a proposal for executive care, employee programmes, on-site activations, retreats or gifting.", href: "/corporate-wellness#proposal", cta: "Request a proposal" },
  { icon: Gift, name: "Gift Card", text: "Send a digital gift or choose a presentation card for collection at Kabulonga.", href: "/gift-cards#gift", cta: "Give a gift" },
  { icon: Compass, name: "Help Me Choose", text: "Tell us how you want to feel and receive a useful starting point before consultation.", href: "/contact", cta: "Ask our team" },
];

const flow = [
  "Choose your location: Kabulonga, Twangale Resort — or ask us to help you choose.",
  "Choose the treatment category and treatment.",
  "Choose an available date and time.",
  "Enter guest details, preferred therapist and relevant health information.",
  "Review location, treatment, duration, price, payment and cancellation terms.",
  "Confirm. A booking is secured only after written confirmation and the required payment.",
];

export default function BookPage() {
  return (
    <>
      <PageHero
        eyebrow="Book MaMoyo"
        title="Begin with what you need today"
        intro="Choose a treatment, stay, table or experience. Each path shows the relevant location, details and next step."
        primary={{ label: "Book a Treatment", href: "/booking" }}
        secondary={{ label: "Speak to Our Team", href: "/contact" }}
      />

      {/* Paths */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {paths.map((p, i) => (
            <Reveal key={p.name} delay={(i % 4) * 60}>
              <Link
                href={p.href}
                className="group flex h-full flex-col rounded-2xl border border-mist-200 bg-white p-6 shadow-soft transition-shadow duration-300 hover:shadow-lift"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-mist-100 text-mist-600 transition-colors duration-300 group-hover:bg-mist-600 group-hover:text-white">
                  <p.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 font-serif text-lg font-semibold text-mist-950">{p.name}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-mist-700">{p.text}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-mist-700">
                  {p.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Spa booking flow */}
      <section className="bg-mist-50 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading
            overline="How Spa Booking Works"
            title="Six steps, no surprises"
            description="No payment is taken online. Your appointment is confirmed by our team."
          />
          <ol className="mt-10 space-y-5">
            {flow.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mist-600 text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <p className="pt-1 text-sm leading-relaxed text-mist-700">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Support */}
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="font-serif text-2xl font-semibold text-mist-950">Booking support</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-mist-700">
          For same-day availability, complex groups, pregnancy, advanced skincare, accessibility requirements
          or help choosing between locations, speak to the relevant team directly.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {(["Kabulonga", "Twangale"] as const).map((key) => (
            <a
              key={key}
              href={`https://wa.me/${digits(locationInfo[key].phone)}?text=${WHATSAPP_TEXT}`}
              className="inline-flex items-center gap-2 rounded-full bg-mist-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp {key}
            </a>
          ))}
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-mist-300 px-6 py-3.5 text-sm font-semibold text-mist-800 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
          >
            Send an Enquiry
          </Link>
        </div>
      </section>
    </>
  );
}
