import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/Section";
import Reveal from "@/components/site/Reveal";
import FaqList from "@/components/site/FaqList";
import EnquiryForm from "@/components/site/EnquiryForm";

export const metadata: Metadata = {
  title: "Corporate Wellness",
  description:
    "MaMoyo creates corporate wellness programmes, executive care, employee vouchers, workplace activations, team days and Twangale retreats across Zambia.",
};

const services = [
  { name: "Employee Wellness Wallet", price: "from K25,000 per organisation", text: "Prepaid, flexible value that approved employees use against eligible MaMoyo treatments — recognition, retention and flexible benefit programmes." },
  { name: "Executive Care Programme", price: "from K1,500 per participant / month", text: "A monthly treatment and recovery structure for senior leaders and high-responsibility roles: Executive Reset, massage, professional facial care, priority scheduling and quarterly review." },
  { name: "Employee Reset Vouchers", price: "from K650 per person", text: "Named or open vouchers for selected massage, facial care or a defined MaMoyo experience — delivered digitally or as presentation cards." },
  { name: "On-Site Wellbeing Activation", price: "from K12,500", text: "A controlled workplace experience: seated back, neck and shoulder care, reflexology, hand and scalp therapy, skin consultation, a drink station and a practical wellbeing talk." },
  { name: "Team Wellness Day", price: "from K1,450 per person", text: "A half or full day at MaMoyo with rotating treatments, food and structured wellbeing content." },
  { name: "Twangale Corporate Retreat", price: "from K2,450 per person, excl. accommodation", text: "Meeting space, gardens, dining, treatment and pool time within a complete retreat setting." },
  { name: "Corporate Gifting", price: "from K500 per recipient", text: "Digital or presented gift cards, executive gift experiences and festive programmes with consolidated invoicing and scheduled delivery." },
  { name: "Company Membership", price: "Tailored", text: "Named Silver, Gold or Platinum memberships funded by the organisation, or a tailored executive tier managed through one corporate account." },
];

const sectors = [
  "Banks & financial institutions",
  "Embassies & diplomatic missions",
  "NGOs & development organisations",
  "Mining & energy companies",
  "Law firms & professional services",
  "International organisations",
  "Corporate head offices",
  "Hospitality & aviation teams",
  "Executive leadership groups",
  "Project & field-based teams",
];

const faqs = [
  { q: "Can MaMoyo register as an approved vendor?", a: "Yes. Provide the procurement, compliance and tax documentation requirements during enquiry so the process can begin early." },
  { q: "Can employees book privately?", a: "Yes. Voucher and wallet programmes can allow employees to book directly without disclosing treatment details to the employer." },
  { q: "Do you provide impact reports?", a: "Aggregate reporting can include participation, redemption, service category and anonymous feedback. MaMoyo does not claim clinical outcomes without appropriate evidence." },
];

export default function CorporateWellnessPage() {
  return (
    <>
      <PageHero
        eyebrow="MaMoyo for Organisations"
        title="Wellbeing is an investment in the people carrying the work"
        intro="MaMoyo creates credible, well-delivered wellbeing programmes for banks, embassies, NGOs, mining companies, law firms, international organisations and corporate offices across Zambia — built around the workforce, the pressure pattern and the practical constraints of delivery."
        primary={{ label: "Request a Proposal", href: "#proposal" }}
        secondary={{ label: "Speak to Our Team", href: "/contact" }}
        image={{ src: "/photos/interior.jpg", alt: "A calm MaMoyo interior set for a corporate wellbeing session" }}
      />

      {/* Services */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading
          overline="Corporate Services"
          title="Move beyond the annual wellness day"
          description="A good programme gives employees care at relevant moments, supports leaders under sustained pressure and communicates that wellbeing is part of how the organisation operates."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.name} delay={(i % 3) * 70}>
              <article className="flex h-full flex-col rounded-2xl border border-mist-200 bg-white p-7 shadow-soft">
                <h3 className="font-serif text-lg font-semibold text-mist-950">{s.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-mist-600">{s.price}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-mist-700">{s.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Sectors + privacy */}
      <section className="bg-mist-50 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-mist-950">Who we work with</h2>
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {sectors.map((s) => (
                <li key={s} className="flex items-baseline gap-2.5 text-sm text-mist-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mist-400" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-mist-200 bg-white p-8 shadow-soft">
            <h2 className="font-serif text-xl font-semibold text-mist-950">Privacy &amp; reporting</h2>
            <p className="mt-4 text-sm leading-relaxed text-mist-700">
              The organisation may receive aggregate participation, redemption and programme-use information.
              Personal health disclosures, treatment notes and individual preferences remain confidential unless
              the participant gives explicit consent or disclosure is required by law. MaMoyo does not provide
              employers with diagnostic, medical or psychological information about employees.
            </p>
          </div>
        </div>
      </section>

      {/* Proposal form → back office */}
      <section id="proposal" className="mx-auto max-w-2xl px-6 py-16 scroll-mt-28">
        <SectionHeading
          overline="Request a Proposal"
          title="Built around the organisation, not a copied template"
          description="Share a brief and a MaMoyo representative will contact you within one business day to clarify scope and the next step."
        />
        <div className="mt-10">
          <EnquiryForm
            type="Corporate"
            submitLabel="Request a Corporate Proposal"
            messageLabel="Objective & context"
            messagePlaceholder="Workforce, main pressure points, desired outcome, timing…"
            showLocation={false}
            extraFields={[
              { label: "Organisation", required: true, placeholder: "Company or organisation name" },
              { label: "Industry", placeholder: "e.g. Banking, NGO, Mining" },
              { label: "Participants", placeholder: "Approx. number of employees" },
              {
                label: "Service of interest",
                type: "select",
                options: [
                  "Employee Wellness Wallet",
                  "Executive Care Programme",
                  "Employee Reset Vouchers",
                  "On-Site Activation",
                  "Team Wellness Day",
                  "Twangale Corporate Retreat",
                  "Corporate Gifting",
                  "Company Membership",
                  "Not sure yet",
                ],
              },
              { label: "Budget range", placeholder: "Optional" },
            ]}
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <SectionHeading overline="Corporate FAQ" title="Good to know" />
        <div className="mt-8">
          <FaqList items={faqs} />
        </div>
      </section>
    </>
  );
}
