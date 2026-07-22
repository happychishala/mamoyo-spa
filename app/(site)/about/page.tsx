import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/Section";
import Reveal from "@/components/site/Reveal";
import FaqList from "@/components/site/FaqList";

export const metadata: Metadata = {
  title: "About MaMoyo",
  description:
    "Read the MaMoyo story, founder vision and philosophy behind a Zambian wellness destination built on trust, care, professional expertise and hospitality.",
};

const promise = [
  "Care that is personal rather than mechanical",
  "Professionals who listen before recommending",
  "Beautiful environments that support the service rather than distract from it",
  "Clear communication and honest claims",
  "A consistent standard across Kabulonga and Twangale Resort",
  "A Zambian brand with an international level of hospitality",
];

const values = [
  { name: "Wellness", text: "Care for body, skin, mind and the rhythms that support them." },
  { name: "Hospitality", text: "Attention to the guest before, during and after the service." },
  { name: "Beauty", text: "Confidence supported by professional care rather than impossible ideals." },
  { name: "Nutrition", text: "Food that is pleasurable, balanced and worth returning for." },
  { name: "Transformation", text: "Meaningful change built through appropriate care and consistency." },
  { name: "Community", text: "A destination that people return to, contribute to and recognise as part of Lusaka life." },
  { name: "Belonging", text: "An environment where different guests can feel welcome without having to perform." },
  { name: "Authenticity", text: "Claims, service and storytelling that remain believable and rooted in what MaMoyo can deliver." },
];

const difference = [
  "Two destinations with distinct identities: boutique city care in Kabulonga and resort-scale wellness at Twangale.",
  "Wellness and hospitality connected through treatment, food, stays, gifting, membership and corporate care.",
  "Professional skincare supported by consultation rather than trend-driven selling.",
  "A café designed to stand on its own, not merely serve as a waiting area.",
  "Direct booking that protects the guest relationship and makes stays and treatments easier to coordinate.",
  "Growth that deepens the brand instead of turning MaMoyo into unrelated offers.",
];

const faqs = [
  { q: "Who founded MaMoyo?", a: "MaMoyo was founded by Tambudzai Chola, whose experience seeking trusted skincare and wellness care helped shape the brand." },
  { q: "Is MaMoyo a Zambian brand?", a: "Yes. MaMoyo is rooted in Lusaka, with two spa locations and a wider wellness, café and hospitality direction." },
  { q: "Is MaMoyo only a spa?", a: "No. MaMoyo includes spa care, MaMoyo Café, MaMoyo Suites, curated experiences, membership, corporate wellness, gift cards and the MaMoyo Journal." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="MaMoyo began with trust"
        intro="Before MaMoyo existed, our founder, Tambudzai Chola, regularly travelled to South Africa for skincare and wellness treatments because she struggled to find somewhere locally that she trusted completely. She valued expertise, consistency and the confidence of knowing what standard of care she would receive."
        primary={{ label: "Explore MaMoyo", href: "/spa" }}
        secondary={{ label: "Book Your Visit", href: "/booking" }}
      />

      {/* The question */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="space-y-5 text-base leading-relaxed text-mist-700">
          <p>
            When the pandemic stopped international travel, the routine she had relied on disappeared. Like
            many women, she found herself asking a practical and deeply personal question:{" "}
            <span className="font-medium text-mist-900">
              where can I go in Lusaka and know that I will receive exceptional care every single time?
            </span>
          </p>
          <p>
            She realised she could not be the only person feeling this way. Lusaka was growing, its people
            were working harder, travelling more and expecting more, yet there was still space for a wellness
            destination built around genuine care rather than appearance alone.
          </p>
          <p className="font-serif text-2xl font-semibold text-mist-950">That question became MaMoyo.</p>
        </div>
      </section>

      {/* Images */}
      <section className="mx-auto max-w-6xl px-6 pb-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl shadow-soft">
              <div className="relative h-72">
                <Image
                  src="/photos/interior.jpg"
                  alt="Light-filled interior at MaMoyo"
                  fill
                  sizes="(min-width: 640px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative overflow-hidden rounded-2xl shadow-soft">
              <div className="relative h-72">
                <Image
                  src="/photos/meditation.jpg"
                  alt="A quiet moment in the morning sun at MaMoyo"
                  fill
                  sizes="(min-width: 640px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why MaMoyo exists */}
      <section className="mt-12 bg-mist-50 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-2xl font-semibold text-mist-950">Why MaMoyo exists</h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-mist-700">
            <p>
              MaMoyo was created to be a place people could trust with their skin, their bodies, their time
              and the moments when they did not want to explain how tired they felt.
            </p>
            <p>
              The vision was never limited to a treatment room. It was a place with trained professionals,
              beautiful surroundings, nourishing food, considered hospitality and enough warmth to make
              regular care feel natural — not somewhere visited only when something was wrong, but somewhere
              that could become part of a person&rsquo;s life.
            </p>
            <p>
              What began with skincare and spa care is growing into a connected Zambian wellness and
              hospitality brand: two distinct spa settings, a café, suites, curated experiences, membership,
              corporate wellness, gifting and useful editorial guidance.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-mist-200 bg-white p-8 shadow-soft">
            <h3 className="font-serif text-xl font-semibold text-mist-950">Our philosophy</h3>
            <p className="mt-3 text-sm leading-relaxed text-mist-700">
              People do not simply buy massages. They buy restoration. They buy confidence, health, time,
              transformation and the feeling of being properly cared for. Every part of MaMoyo should support
              how the guest feels when they leave.
            </p>
          </div>
        </div>
      </section>

      {/* Promise + difference */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-mist-950">Our promise</h2>
            <ul className="mt-6 space-y-2.5">
              {promise.map((p) => (
                <li key={p} className="flex items-baseline gap-2.5 text-sm text-mist-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mist-400" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-semibold text-mist-950">The MaMoyo difference</h2>
            <ul className="mt-6 space-y-2.5">
              {difference.map((d) => (
                <li key={d} className="flex items-baseline gap-2.5 text-sm text-mist-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mist-400" aria-hidden="true" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <SectionHeading overline="Our Values" title="What we hold to" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.name} delay={(i % 4) * 60}>
              <div className="h-full rounded-2xl border border-mist-200 bg-white p-6 shadow-soft">
                <h3 className="font-serif text-lg font-semibold text-mist-950">{v.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-700">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <SectionHeading overline="About FAQ" title="Good to know" />
        <div className="mt-8">
          <FaqList items={faqs} />
        </div>
      </section>
    </>
  );
}
