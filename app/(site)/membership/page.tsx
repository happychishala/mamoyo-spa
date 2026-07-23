import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/Section";
import Reveal from "@/components/site/Reveal";
import PhotoStrip from "@/components/site/PhotoStrip";
import EnquiryForm from "@/components/site/EnquiryForm";

export const metadata: Metadata = {
  title: { absolute: "The MaMoyo Circle | Wellness Membership in Lusaka" },
  description:
    "Join Silver, Gold or Platinum MaMoyo membership for monthly treatment credits, priority access, café rituals, suite benefits and member gatherings.",
  alternates: { canonical: "/membership" },
  openGraph: {
    title: "The MaMoyo Circle | Wellness Membership in Lusaka",
    description:
      "Join Silver, Gold or Platinum MaMoyo membership for monthly treatment credits, priority access, café rituals, suite benefits and member gatherings.",
    url: "/membership",
  },
};

const tiers = [
  {
    name: "Silver",
    price: "K1,250",
    tagline: "A considered monthly ritual",
    featured: false,
    benefits: [
      "One monthly MaMoyo Ritual Credit against an eligible treatment up to K880",
      "Priority access seven days before general promotional release",
      "One complimentary signature tea or botanical tonic each month",
      "10% privilege on café food and non-alcoholic drinks",
      "Member price for selected Wellness Wednesdays and seasonal events",
      "Birthday LED light therapy or scalp therapy",
      "Digital member profile and treatment history",
    ],
    best: "Best for guests who want one reliable treatment moment each month and a closer relationship with MaMoyo without building the entire month around it.",
  },
  {
    name: "Gold",
    price: "K2,450",
    tagline: "A deeper rhythm",
    featured: true,
    benefits: [
      "Two monthly Ritual Credits, each against an eligible treatment up to K950",
      "Priority access fourteen days before general promotional release",
      "One complimentary tea, coffee, matcha or botanical drink each month",
      "10% privilege on café food and non-alcoholic drinks",
      "5% direct booking privilege at MaMoyo Suites",
      "One 30-minute guest treatment each quarter",
      "One treatment enhancement each quarter",
      "Early access to selected seasonal experiences",
      "Birthday 60-minute Swedish or aromatherapy massage",
    ],
    best: "Best for guests who receive treatment more than once a month and want MaMoyo to support both personal care and shared experiences.",
  },
  {
    name: "Platinum",
    price: "K4,800",
    tagline: "MaMoyo woven into the way you live",
    featured: false,
    benefits: [
      "Four monthly Ritual Credits, each against an eligible treatment up to K1,100",
      "Priority access twenty-one days before general promotional release",
      "Personal booking support by WhatsApp",
      "One complimentary café ritual each week",
      "15% privilege on café food and non-alcoholic drinks",
      "10% direct booking privilege at MaMoyo Suites",
      "One 60-minute guest treatment each quarter",
      "One advanced facial enhancement each quarter after consultation",
      "Pool access during eligible spa visits",
      "Birthday 90-minute MaMoyo Signature Massage",
      "Annual personal wellbeing review",
    ],
    best: "Best for guests who use MaMoyo as a regular part of the month, travel through Lusaka often or want a high-touch relationship across spa, café, stays and experiences.",
  },
];

const faqs = [
  {
    q: "Can I use membership at both locations?",
    a: "Yes. Eligible treatment credits may be used at Kabulonga or Twangale Resort, subject to service availability.",
  },
  {
    q: "Can I pause membership?",
    a: "After the initial three-month term, one pause of up to two months may be requested in a twelve-month period for travel, medical reasons or another significant circumstance.",
  },
  {
    q: "Can I share my credits?",
    a: "Membership is personal, except for the specific quarterly guest privilege included in Gold and Platinum.",
  },
  {
    q: "Can a company fund membership?",
    a: "Yes. Organisations may purchase named memberships, executive care plans or employee wellness wallets through Corporate Wellness.",
  },
];

export default function MembershipPage() {
  return (
    <>
      <PageHero
        eyebrow="The MaMoyo Circle"
        title="Belong to a more consistent way of living well"
        intro="Membership is a decision to stop leaving care until everything else has been handled. The MaMoyo Circle creates a monthly rhythm of treatment, priority access, café rituals, selected suite privileges and member gatherings across Kabulonga and Twangale Resort."
        primary={{ label: "Choose Your Membership", href: "#tiers" }}
        secondary={{ label: "Apply to Join", href: "#apply" }}
        image={{ src: "/photos/wide-spa-candles.jpg", alt: "Candles, folded towels and flowers set for a member visit" }}
      />

      {/* Tiers */}
      <section id="tiers" className="mx-auto max-w-6xl scroll-mt-28 px-6 py-16">
        <SectionHeading
          overline="Choose Your Membership"
          title="More than a discount programme"
          description="The value of membership is continuity — your preferences become known, appointments are planned earlier, and the café, suites and spa begin to work together as one relationship."
        />
        <div className="mt-14 grid items-start gap-6 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 80}>
              <div
                className={`flex h-full flex-col rounded-2xl border p-7 shadow-soft ${
                  tier.featured
                    ? "border-mist-500 bg-white ring-2 ring-mist-200"
                    : "border-mist-200 bg-white"
                }`}
              >
                {tier.featured && (
                  <span className="mb-3 self-start rounded-full bg-mist-600 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-white">
                    Most chosen
                  </span>
                )}
                <h3 className="font-serif text-2xl font-semibold text-mist-950">{tier.name}</h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-mist-500">{tier.tagline}</p>
                <p className="mt-4 font-serif text-3xl font-semibold text-mist-950">
                  {tier.price}
                  <span className="text-sm font-normal text-mist-500"> / month</span>
                </p>
                <ul className="mt-6 flex-1 space-y-3 border-t border-mist-100 pt-6">
                  {tier.benefits.map((b) => (
                    <li key={b} className="flex gap-2.5 text-sm text-mist-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-mist-600" aria-hidden="true" />
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 rounded-xl bg-mist-50 p-4 text-xs leading-relaxed text-mist-600">{tier.best}</p>
                <Link
                  href="#apply"
                  className={`mt-5 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-200 ${
                    tier.featured
                      ? "bg-mist-600 text-white hover:bg-mist-700"
                      : "border border-mist-300 text-mist-800 hover:border-mist-400 hover:bg-mist-50"
                  }`}
                >
                  Join {tier.name}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Photography */}
      <PhotoStrip
        className="py-4"
        photos={[
          { src: "/photos/massage-back.jpg", alt: "A monthly massage at MaMoyo" },
          { src: "/photos/wide-tea.jpg", alt: "A member tea ritual at MaMoyo Café" },
          { src: "/photos/facial.jpg", alt: "Professional facial care for members" },
        ]}
      />

      {/* Ritual credits + belonging */}
      <section className="bg-mist-50 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-mist-200 bg-white p-8 shadow-soft">
            <h2 className="font-serif text-xl font-semibold text-mist-950">How Ritual Credits work</h2>
            <p className="mt-4 text-sm leading-relaxed text-mist-700">
              A credit is valid against one eligible treatment up to the value stated for the tier. If the
              treatment costs more, the member pays the difference. If it costs less, the balance is not paid
              in cash. Advanced aesthetics, packages, group experiences, gift cards, alcohol and third-party
              services are excluded unless a written member offer states otherwise.
            </p>
          </div>
          <div className="rounded-2xl border border-mist-200 bg-white p-8 shadow-soft">
            <h2 className="font-serif text-xl font-semibold text-mist-950">Belonging without pressure</h2>
            <p className="mt-4 text-sm leading-relaxed text-mist-700">
              Member gatherings are designed to be useful and genuinely enjoyable: early-morning skin sessions,
              private café tables, garden conversations, movement previews, tea rituals, seasonal dinners and
              small talks with credible practitioners. Attendance is always optional.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <SectionHeading overline="Membership FAQ" title="Good to know" />
        <div className="mt-10 divide-y divide-mist-100">
          {faqs.map((f) => (
            <div key={f.q} className="py-5">
              <h3 className="font-semibold text-mist-950">{f.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist-700">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Application → back office */}
      <section id="apply" className="mx-auto max-w-2xl px-6 pb-16 scroll-mt-28">
        <SectionHeading
          overline="Application"
          title="Apply to join the Circle"
          description="Choose a preferred tier and tell us how you currently use MaMoyo. A host will contact you to confirm payment, home location and your first booking."
        />
        <div className="mt-10">
          <EnquiryForm
            type="Membership"
            submitLabel="Submit Application"
            messageLabel="How do you currently use MaMoyo?"
            messagePlaceholder="Visit frequency, favourite treatments, what you'd like from membership…"
            extraFields={[
              { label: "Preferred tier", type: "select", required: true, options: ["Silver", "Gold", "Platinum"] },
              { label: "Expected visits per month", placeholder: "e.g. 1–2" },
            ]}
          />
        </div>
      </section>
    </>
  );
}
