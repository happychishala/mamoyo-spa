import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/site/LegalPage";
import { contactInfo } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How MaMoyo Wellness & Beauty collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | MaMoyo",
    description:
      "How MaMoyo Wellness & Beauty collects, uses and protects your personal information.",
    url: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="July 2026"
      intro="MaMoyo Wellness & Beauty respects your privacy. This policy explains what personal information we collect when you book with us or use our website, how we use it, and the choices you have."
    >
      <LegalSection heading="Who we are">
        <p>
          MaMoyo Wellness &amp; Beauty operates a spa, salon &amp; barber, health café, events venue and
          serviced apartments in Kabulonga, Lusaka, and a spa at Twangale, Lilayi. In this policy,
          &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;MaMoyo&rdquo; refer to MaMoyo Wellness &amp; Beauty.
        </p>
        <p>
          If you have any questions about your data, contact us at{" "}
          <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a> or {contactInfo.phone}.
        </p>
      </LegalSection>

      <LegalSection heading="Information we collect">
        <p>We only collect what we need to serve you:</p>
        <ul>
          <li><strong>Booking details</strong> — your name, email, phone number, chosen treatment, preferred date and time, location, and any notes you share (for example allergies or preferences).</li>
          <li><strong>Suite reservations</strong> — guest name, contact details, number of guests and stay dates.</li>
          <li><strong>Messages</strong> — anything you send us by email, phone or our forms.</li>
        </ul>
        <p>
          We do <strong>not</strong> take card or mobile-money payments online — payment is made in person at
          the retreat — so we do not collect or store your payment details on this website.
        </p>
      </LegalSection>

      <LegalSection heading="How we use your information">
        <ul>
          <li>To confirm, prepare for and manage your bookings and stays.</li>
          <li>To contact you about your appointment (for example to confirm, remind or reschedule).</li>
          <li>To keep accurate business records of the services we provide.</li>
          <li>To respond to your enquiries.</li>
        </ul>
        <p>We rely on your consent and on our legitimate interest in running the business to process this information.</p>
      </LegalSection>

      <LegalSection heading="Sharing your information">
        <p>
          We do not sell your personal information. We only share it where necessary:
        </p>
        <ul>
          <li>With trusted service providers who help us run the website and our operations, under confidentiality obligations.</li>
          <li>For suite stays booked through a travel platform (such as Airbnb, Booking.com or Expedia), with that platform, to manage your reservation.</li>
          <li>Where we are required to by law.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Keeping your information">
        <p>
          We keep your information only for as long as needed to serve you and to meet our legal and
          accounting obligations, after which it is securely deleted or anonymised.
        </p>
      </LegalSection>

      <LegalSection heading="Your rights">
        <p>
          You may ask us to access, correct or delete the personal information we hold about you, or to stop
          contacting you. To make a request, email <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>.
          These rights are supported by Zambia&rsquo;s Data Protection Act No. 3 of 2021.
        </p>
      </LegalSection>

      <LegalSection heading="Security">
        <p>
          We take reasonable measures to protect your information. Our staff portal is password-protected and
          access is limited to authorised team members.
        </p>
      </LegalSection>

      <LegalSection heading="Changes to this policy">
        <p>
          We may update this policy from time to time. The date at the top shows when it was last revised.
          Please check back occasionally.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
