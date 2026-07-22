import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, Navigation, MessageCircle, AtSign } from "lucide-react";
import { SectionHeading } from "@/components/site/Section";
import FaqList from "@/components/site/FaqList";
import EnquiryForm from "@/components/site/EnquiryForm";
import { contactInfo, locationInfo } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Contact MaMoyo | Kabulonga and Twangale Spa Lusaka" },
  description:
    "Contact MaMoyo Kabulonga or MaMoyo at Twangale Resort for spa bookings, directions, suites, café reservations, membership and corporate enquiries.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact MaMoyo | Kabulonga and Twangale Spa Lusaka",
    description:
      "Contact MaMoyo Kabulonga or MaMoyo at Twangale Resort for spa bookings, directions, suites, café reservations, membership and corporate enquiries.",
    url: "/contact",
  },
};

const WHATSAPP_TEXT = encodeURIComponent("Hello MaMoyo. I would like help with a booking or enquiry.");
const digits = (p: string) => p.replace(/[^\d]/g, "");
const mapsUrl = (a: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a)}`;

const branches = ["Kabulonga", "Twangale"] as const;

const typeOptions = [
  { label: "General enquiry", value: "General" },
  { label: "Spa booking", value: "General" },
  { label: "MaMoyo Suites", value: "Suite" },
  { label: "Café & afternoon tea", value: "Café" },
  { label: "Experience or private event", value: "Experience" },
  { label: "Membership", value: "Membership" },
  { label: "Corporate wellness", value: "Corporate" },
  { label: "Gift card", value: "Gift Card" },
  { label: "Press or partnership", value: "General" },
];

const faqs = [
  { q: "What is the fastest way to make a same-day booking?", a: "WhatsApp the relevant location. Same-day availability is not guaranteed, but the team can respond more quickly than through the general form." },
  { q: "Which number should I use for MaMoyo Suites?", a: "Use the Kabulonga number, +260 967 245833, or the direct suite availability form on the Suites page." },
  { q: "Can I book Twangale Resort rooms through MaMoyo?", a: "No. MaMoyo books spa services. Twangale Resort confirms its own rooms and wider resort facilities." },
];

export default function ContactPage() {
  return (
    <div className="pt-32 pb-16 sm:pt-40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mist-600">Contact MaMoyo</p>
          <h1 className="mt-4 text-balance font-serif text-4xl font-semibold text-mist-950 sm:text-5xl">
            Choose the place, then let us help with the details
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-mist-700">
            Contact the relevant location for treatment availability, directions and same-day support. For
            suites, membership, corporate wellness, private events and general enquiries, use the form or WhatsApp.
          </p>
        </div>

        {/* Two locations */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {branches.map((key) => {
            const b = locationInfo[key];
            return (
              <div key={key} className="rounded-2xl border border-mist-200 bg-white p-8 shadow-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mist-100 text-mist-600">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="mt-4 font-serif text-xl font-semibold text-mist-950">{b.name}</h2>
                <p className="mt-1 text-sm text-mist-700">{b.blurb}</p>
                <ul className="mt-4 space-y-2.5 text-sm text-mist-800">
                  <li className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-mist-500" aria-hidden="true" />
                    {b.address}
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-mist-500" aria-hidden="true" />
                    <a href={`tel:${digits(b.phone)}`} className="hover:text-mist-950">
                      {b.phone}
                    </a>
                    <span className="text-mist-500">· {b.phoneLabel}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-mist-500" aria-hidden="true" />
                    <span>
                      {b.hours.map((h) => (
                        <span key={h.days} className="block">
                          {h.days}: {h.time}
                        </span>
                      ))}
                    </span>
                  </li>
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={`https://wa.me/${digits(b.phone)}?text=${WHATSAPP_TEXT}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-mist-600 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    WhatsApp {key}
                  </a>
                  <a
                    href={mapsUrl(b.address)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-mist-300 px-4 py-2 text-xs font-semibold text-mist-700 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
                  >
                    <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
                    Directions
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* General contact */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-mist-200 bg-white px-6 py-5 text-sm text-mist-800 shadow-soft">
          <a href={`mailto:${contactInfo.email}`} className="inline-flex items-center gap-2 hover:text-mist-950">
            <Mail className="h-4 w-4 text-mist-500" aria-hidden="true" />
            {contactInfo.email}
          </a>
          <a href={contactInfo.instagramUrl} className="inline-flex items-center gap-2 hover:text-mist-950">
            <AtSign className="h-4 w-4 text-mist-500" aria-hidden="true" />
            {contactInfo.instagram}
          </a>
        </div>

        {/* Enquiry form → back office */}
        <div className="mt-16 grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SectionHeading overline="Message MaMoyo" title="Send us a note" />
            <p className="mt-4 text-sm leading-relaxed text-mist-700">
              We&rsquo;ll respond through your preferred contact method. Time-sensitive and same-day requests are
              best sent by WhatsApp to the relevant location.
            </p>
          </div>
          <div className="lg:col-span-3">
            <EnquiryForm
              type="General"
              typeOptions={typeOptions}
              submitLabel="Send Enquiry"
              messageLabel="Your message"
              messagePlaceholder="How can we help?"
              extraFields={[
                { label: "Preferred contact method", type: "select", options: ["WhatsApp", "Phone call", "Email"] },
                { label: "Best time to reach you", placeholder: "e.g. weekday mornings" },
              ]}
            />
          </div>
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-16 max-w-3xl">
          <SectionHeading overline="Contact FAQ" title="Good to know" />
          <div className="mt-8">
            <FaqList items={faqs} />
          </div>
        </div>
      </div>
    </div>
  );
}
