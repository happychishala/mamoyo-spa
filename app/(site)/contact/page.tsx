import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ArrowRight, Navigation } from "lucide-react";
import { SectionHeading } from "@/components/site/Section";
import { contactInfo, locationInfo } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact & Directions",
  description:
    "Two MaMoyo homes in Lusaka — Kabulonga (spa, salon, café & suites) and Twangale (spa at Twangale Lodge, Lilayi). Opening hours, phone, email and directions.",
};

const branches = [
  {
    key: "Kabulonga" as const,
    services: "Spa · Salon & Barber · Health Café · Suites",
    note: "In the leafy heart of Kabulonga, ten minutes from the city centre.",
  },
  {
    key: "Twangale" as const,
    services: "Spa & wellness",
    note: "Set in the gardens of Twangale Lodge, Lilayi.",
  },
];

function mapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`MaMoyo ${address}`)}`;
}

export default function ContactPage() {
  return (
    <div className="pt-36 pb-8">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          overline="Contact"
          title="Come find your quiet"
          description="Two homes across Lusaka — the full MaMoyo in Kabulonga, and our spa in the gardens of Twangale Resort and Spa. Call, write, or simply arrive."
        />

        {/* Two locations */}
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {branches.map((b) => {
            const branch = locationInfo[b.key];
            return (
              <div key={b.key} className="rounded-2xl border border-mist-200 bg-white p-8 shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mist-100 text-mist-600">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="rounded-full bg-mist-50 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-mist-600">
                    {b.key}
                  </span>
                </div>
                <h2 className="mt-4 font-serif text-xl font-semibold text-mist-950">{branch.name}</h2>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-mist-600">{b.services}</p>
                <p className="mt-3 text-sm leading-relaxed text-mist-800">{branch.address}</p>
                <p className="mt-2 text-sm text-mist-700">{b.note}</p>
                <a
                  href={mapsUrl(branch.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-mist-700 transition-colors duration-200 hover:text-mist-900"
                >
                  <Navigation className="h-4 w-4" aria-hidden="true" />
                  Get directions
                </a>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-mist-200 bg-white p-8 shadow-soft">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mist-100 text-mist-600">
              <Phone className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="mt-4 font-serif text-lg font-semibold text-mist-950">Talk to us</h2>
            <ul className="mt-2 space-y-2 text-sm text-mist-800">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-mist-500" aria-hidden="true" />
                <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`} className="transition-colors duration-200 hover:text-mist-950">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-mist-500" aria-hidden="true" />
                <a href={`mailto:${contactInfo.email}`} className="transition-colors duration-200 hover:text-mist-950">
                  {contactInfo.email}
                </a>
              </li>
            </ul>
            <p className="mt-3 text-sm text-mist-700">
              WhatsApp bookings welcome — we reply within the hour during opening times.
            </p>
          </div>

          <div className="rounded-2xl border border-mist-200 bg-white p-8 shadow-soft">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mist-100 text-mist-600">
              <Clock className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="mt-4 font-serif text-lg font-semibold text-mist-950">Hours</h2>
            <ul className="mt-2 space-y-2 text-sm text-mist-800">
              {contactInfo.hours.map((h) => (
                <li key={h.days} className="flex justify-between gap-3">
                  <span>{h.days}</span>
                  <span className="font-medium text-mist-950">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-mist-200 bg-mist-100/60 p-8 text-center">
          <p className="text-sm text-mist-800">
            Ready to book? Skip the phone queue entirely.
          </p>
          <Link
            href="/booking"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-mist-600 px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-mist-700"
          >
            Book online
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
