import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/site/LegalPage";
import { contactInfo } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that apply when you book and visit MaMoyo Wellness & Beauty.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms & Conditions | MaMoyo",
    description:
      "The terms that apply when you book and visit MaMoyo Wellness & Beauty.",
    url: "/terms",
  },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="July 2026"
      intro="These terms apply when you book a treatment, reserve a suite or use the MaMoyo Wellness & Beauty website. By booking with us, you agree to them."
    >
      <LegalSection heading="Bookings & appointments">
        <ul>
          <li>Booking through our website sends us a <strong>request</strong>. Your appointment is confirmed once we reply, usually by email within a couple of hours.</li>
          <li>No payment is taken online — you pay in person at the retreat.</li>
          <li>Please arrive a few minutes early. Late arrivals may lead to a shortened treatment so the next guest is not kept waiting.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Cancellations & rescheduling">
        <p>
          You may cancel or reschedule free of charge up to <strong>24 hours</strong> before your appointment.
          For late cancellations or no-shows we may ask for a contribution towards the reserved time. Just let
          us know as early as you can and we will do our best to accommodate you.
        </p>
      </LegalSection>

      <LegalSection heading="MaMoyo Suites">
        <p>
          Suite stays are subject to the check-in and check-out times and house rules provided at booking.
          Reservations may be cancelled in line with the terms shown when you book, or the terms of the travel
          platform you booked through.
        </p>
      </LegalSection>

      <LegalSection heading="Prices">
        <p>
          All prices are in Zambian Kwacha (K) and include applicable taxes unless stated otherwise. Prices
          and treatments may change; the price confirmed at booking is the price that applies to your visit.
        </p>
      </LegalSection>

      <LegalSection heading="Health & wellness">
        <p>
          Our treatments are for relaxation and wellbeing and are <strong>not a substitute for medical
          advice</strong>. Please tell us about any allergies, injuries, pregnancy or health conditions before
          your treatment so we can care for you safely. If in doubt, consult your doctor first.
        </p>
      </LegalSection>

      <LegalSection heading="Liability">
        <p>
          We take great care of our guests and their belongings, but to the extent permitted by law we are not
          liable for indirect or unforeseeable loss, or for personal items left on the premises. Nothing in
          these terms limits liability that cannot be limited by law.
        </p>
      </LegalSection>

      <LegalSection heading="Our content">
        <p>
          The MaMoyo name, logo, photographs and website content belong to MaMoyo Wellness &amp; Beauty and may
          not be copied or used without our permission.
        </p>
      </LegalSection>

      <LegalSection heading="Governing law">
        <p>These terms are governed by the laws of the Republic of Zambia.</p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about these terms? Email <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a> or
          call {contactInfo.phone}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
