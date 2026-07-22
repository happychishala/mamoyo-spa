import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/Section";
import Reveal from "@/components/site/Reveal";
import FaqList from "@/components/site/FaqList";
import EnquiryForm from "@/components/site/EnquiryForm";

export const metadata: Metadata = {
  title: { absolute: "MaMoyo Gift Cards | Spa and Wellness Gifts in Lusaka" },
  description:
    "Send a MaMoyo digital or presentation gift card for massage, facials, wellness experiences, café rituals or a direct MaMoyo Suites stay.",
  alternates: { canonical: "/gift-cards" },
  openGraph: {
    title: "MaMoyo Gift Cards | Spa and Wellness Gifts in Lusaka",
    description:
      "Send a MaMoyo digital or presentation gift card for massage, facials, wellness experiences, café rituals or a direct MaMoyo Suites stay.",
    url: "/gift-cards",
  },
};

const options = [
  { title: "Value cards", text: "K500, K1,000, K1,500, K2,500, K5,000 or a custom value from K300." },
  { title: "Named experiences", text: "MaMoyo Signature Massage, Executive Reset, Mom To Be, Couples Retreat, Full Day Escape or a café ritual." },
  { title: "Digital or printed", text: "Delivered immediately or scheduled for a chosen date, or a presentation card prepared for collection at Kabulonga." },
  { title: "Corporate gifting", text: "Consolidated invoicing, recipient upload and scheduled delivery for teams." },
];

const messages = [
  { occasion: "Birthday", text: "Time for you, chosen with love. Happy birthday." },
  { occasion: "Thank you", text: "Thank you for everything you carry and everything you give." },
  { occasion: "New mother", text: "For your body, your rest and a little time that belongs only to you." },
  { occasion: "Wedding", text: "A beautiful beginning deserves time to pause within it." },
  { occasion: "No occasion", text: "You do not need a reason to be cared for." },
];

const faqs = [
  { q: "Can I send the gift immediately?", a: "Yes. Digital cards are sent after successful payment or scheduled for a future date and time." },
  { q: "Can the recipient choose another service?", a: "Yes. A named experience may be exchanged for another eligible service of equal or greater value, with any difference paid by the recipient." },
  { q: "Can a card be used for a suite?", a: "Yes, for a direct MaMoyo Suites booking, subject to dates and availability." },
];

export default function GiftCardsPage() {
  return (
    <>
      <PageHero
        eyebrow="The Gift of MaMoyo"
        title="Give time, care and a feeling that lasts"
        intro="A MaMoyo gift card lets the recipient choose what they need — a massage, facial, full experience, café ritual, direct suite stay or a contribution towards something larger."
        primary={{ label: "Request a Gift Card", href: "#gift" }}
        secondary={{ label: "Speak to Our Team", href: "/contact" }}
        image={{ src: "/photos/towels-candle.jpg", alt: "A considered MaMoyo gift, wrapped with care" }}
      />

      {/* Choose the gift */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading overline="Choose the Gift" title="However you'd like to give it" />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {options.map((o, i) => (
            <Reveal key={o.title} delay={(i % 4) * 70}>
              <article className="h-full rounded-2xl border border-mist-200 bg-white p-6 shadow-soft">
                <h3 className="font-serif text-lg font-semibold text-mist-950">{o.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-700">{o.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Gift request form → back office */}
      <section id="gift" className="bg-mist-50 py-16 scroll-mt-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
          <div>
            <SectionHeading overline="Request a Gift Card" title="Tell us what you'd like to give" />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-mist-700">
              Send the details and our team will confirm the value or experience, delivery method and secure
              payment. Digital cards can be scheduled for a chosen date.
            </p>
            <div className="mt-8 rounded-2xl border border-mist-200 bg-white p-6 shadow-soft">
              <h3 className="text-sm font-semibold text-mist-900">A message to borrow</h3>
              <ul className="mt-3 space-y-2 text-sm text-mist-700">
                {messages.map((m) => (
                  <li key={m.occasion}>
                    <span className="font-medium text-mist-900">{m.occasion}:</span> “{m.text}”
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <EnquiryForm
            type="Gift Card"
            submitLabel="Request a Gift Card"
            messageLabel="Message for the card & any notes"
            messagePlaceholder="Recipient, occasion, the message you'd like on the card…"
            showLocation={false}
            extraFields={[
              {
                label: "Gift",
                type: "select",
                required: true,
                options: [
                  "Value K500",
                  "Value K1,000",
                  "Value K1,500",
                  "Value K2,500",
                  "Value K5,000",
                  "Custom value",
                  "A named experience",
                ],
              },
              { label: "Recipient name", placeholder: "Who is it for?" },
              {
                label: "Delivery",
                type: "select",
                options: ["Digital — send now", "Digital — schedule a date", "Presentation card — collect at Kabulonga"],
              },
            ]}
          />
        </div>
      </section>

      {/* Terms + FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl bg-mist-50 p-6 text-sm leading-relaxed text-mist-700">
          <p>
            <span className="font-semibold text-mist-900">Gift card terms.</span> Valid for six months unless a
            different corporate period is stated. Not exchangeable for cash. Remaining value stays on the card
            until expiry. Standard booking and cancellation terms apply. Suite redemption is available only for
            direct bookings and confirmed availability.
          </p>
        </div>
        <div className="mt-12">
          <SectionHeading overline="Gift Card FAQ" title="Good to know" />
          <div className="mt-8">
            <FaqList items={faqs} />
          </div>
        </div>
      </section>
    </>
  );
}
