import type { Metadata } from "next";
import Link from "next/link";
import { Clock, HeartPulse, CalendarClock } from "lucide-react";
import PageHero from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Spa Etiquette",
  description:
    "How to prepare for your MaMoyo visit — arrival times, what to tell us, and our booking and cancellation terms.",
  alternates: { canonical: "/spa/etiquette" },
  openGraph: {
    title: "Spa Etiquette | MaMoyo",
    description:
      "How to prepare for your MaMoyo visit — arrival times, what to tell us, and our booking and cancellation terms.",
    url: "/spa/etiquette",
  },
};

const sections = [
  {
    icon: Clock,
    title: "Arrive with a little time to spare",
    text: "Please arrive 15 minutes before a standard treatment and 20 minutes before a first facial, advanced skin consultation, package or group booking. Late arrival may reduce treatment time so the next guest is not delayed, while the full booked price remains payable.",
  },
  {
    icon: HeartPulse,
    title: "Tell us what matters",
    text: "Tell us about allergies, pregnancy, recent procedures, injuries, medication, skin sensitivity and any concern that may affect treatment. Phones should be on silent in treatment and relaxation areas, and alcohol should not be consumed before treatment.",
  },
  {
    icon: CalendarClock,
    title: "Changes and cancellations",
    text: "Individual appointments may be moved once when more than 24 hours notice is given. Deposits are forfeited for changes within 24 hours or failure to attend. Group and private bookings follow the terms confirmed in writing.",
  },
];

export default function SpaEtiquettePage() {
  return (
    <>
      <PageHero
        eyebrow="Before Your Visit"
        title="A little preparation protects the quality of your time"
        intro="A few simple things help us give you the calm, unhurried treatment you came for — and keep the day running smoothly for every guest."
        primary={{ label: "Book Now", href: "/booking" }}
        secondary={{ label: "Read Booking Terms", href: "/terms" }}
      />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="space-y-6">
          {sections.map((s) => (
            <div key={s.title} className="flex gap-5 rounded-2xl border border-mist-200 bg-white p-7 shadow-soft">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mist-100 text-mist-600">
                <s.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-serif text-lg font-semibold text-mist-950">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-mist-700">{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-mist-50 p-6 text-center">
          <p className="text-sm text-mist-700">
            Questions before you arrive? Our team is glad to help — by phone, WhatsApp or the contact form.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-mist-600 px-7 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
          >
            Speak to Our Team
          </Link>
        </div>
      </section>
    </>
  );
}
