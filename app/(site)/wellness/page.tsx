import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/Section";
import Reveal from "@/components/site/Reveal";
import PhotoStrip from "@/components/site/PhotoStrip";

export const metadata: Metadata = {
  title: { absolute: "MaMoyo Wellness Lusaka | A More Complete Way to Live Well" },
  description:
    "Explore the MaMoyo approach to body care, skin, nourishment, movement, rest, membership and holistic wellbeing in everyday Lusaka life.",
  alternates: { canonical: "/wellness" },
  openGraph: {
    title: "MaMoyo Wellness Lusaka | A More Complete Way to Live Well",
    description:
      "Explore the MaMoyo approach to body care, skin, nourishment, movement, rest, membership and holistic wellbeing in everyday Lusaka life.",
    url: "/wellness",
  },
};

const dimensions = [
  { name: "Restore the body", text: "Massage, hydrotherapy, sleep, movement and physical care that help the body release what it has been carrying." },
  { name: "Support the skin", text: "Professional consultation, consistent treatment and clear home care that build confidence without chasing every trend." },
  { name: "Nourish well", text: "Food and drink that are desirable, balanced and rooted in ingredients that make sense in Lusaka." },
  { name: "Protect the mind", text: "Quiet, boundaries, ritual and moments without performance or demand." },
  { name: "Move with intention", text: "Partnerships and programmes that make movement sustainable, socially connected and appropriate to the individual." },
  { name: "Belong somewhere", text: "Membership, events and shared experiences that turn wellbeing from a private intention into a supported rhythm." },
];

const starts = [
  { feel: "I am physically tense", start: "Begin with focused massage, the MaMoyo Signature Massage or Executive Reset.", href: "/booking" },
  { feel: "My skin feels different", start: "Begin with a professional facial consultation at Kabulonga.", href: "/spa/kabulonga" },
  { feel: "I am tired but cannot slow down", start: "Begin with aromatherapy, scalp therapy or a Self Care Sunday.", href: "/experiences" },
  { feel: "I need a complete day", start: "Begin with a full-day journey or a Twangale spa day.", href: "/spa/twangale" },
  { feel: "I need a regular routine", start: "Begin with the MaMoyo Circle membership.", href: "/membership" },
  { feel: "My team is depleted", start: "Begin with a corporate wellness consultation.", href: "/corporate-wellness" },
];

const promise = [
  "A welcome that feels attentive, not scripted",
  "Professional consultation before treatment",
  "Honest guidance about what is and is not appropriate",
  "Clean, prepared spaces",
  "Respect for privacy, time and personal boundaries",
  "Food and drink with genuine quality",
  "Clear prices and booking terms",
  "A consistent standard across both locations",
  "Care that does not end the moment the treatment does",
];

const principles = [
  { name: "Personal before prescriptive", text: "A recommendation should respond to the individual, not force everybody into the same programme." },
  { name: "Consistency before intensity", text: "One dramatic day cannot replace regular care. We help guests build a rhythm they can return to." },
  { name: "Pleasure belongs in wellbeing", text: "Food can be beautiful. Rest can feel generous. Skincare can be enjoyable. Health does not need to be communicated through deprivation." },
  { name: "Expertise should feel human", text: "Professional knowledge is most useful when it is explained clearly and delivered without intimidation." },
  { name: "Zambia is not an afterthought", text: "MaMoyo draws from local ingredients, African touch traditions, Lusaka life and the warmth of Zambian hospitality while holding an international standard of execution." },
];

export default function WellnessPage() {
  return (
    <>
      <PageHero
        eyebrow="The MaMoyo Philosophy"
        title="Wellness is the life built around the appointment"
        intro={[
          "A treatment matters. So do sleep, nourishment, movement, confidence, connection and the ability to notice what the body has been saying before it has to shout.",
          "MaMoyo exists to make wellbeing more complete, more personal and more possible within everyday Lusaka life.",
        ]}
        primary={{ label: "Explore Our Approach", href: "#approach" }}
        secondary={{ label: "Book a Starting Point", href: "/booking" }}
        image={{ src: "/photos/wide-wellness.jpg", alt: "A guest sitting quietly outdoors at the start of the day" }}
      />

      {/* Approach */}
      <section id="approach" className="mx-auto max-w-3xl scroll-mt-28 px-6 py-16">
        <h2 className="text-balance text-center font-serif text-3xl font-semibold tracking-tight text-mist-950">
          Care that reaches beyond one room
        </h2>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-mist-800">
          <p>
            We do not treat wellness as perfection. There is no ideal morning routine, single body
            type or correct way to rest. People live under different pressures, carry different
            responsibilities and need different forms of support.
          </p>
          <p>
            At MaMoyo, wellness begins with attention. It asks what is depleted, what has become
            difficult, what needs professional care and what can be made gentler. The answer may be
            massage, a skin plan, a proper meal, a quiet night in the suites, a recurring membership
            or time with people who make you feel more like yourself.
          </p>
        </div>
      </section>

      {/* Six dimensions */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <SectionHeading
          overline="Wellbeing at MaMoyo"
          title="Six dimensions of MaMoyo wellbeing"
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dimensions.map((d, i) => (
            <Reveal key={d.name} delay={(i % 3) * 70}>
              <article className="h-full rounded-2xl border border-mist-200 bg-white p-7 shadow-soft">
                <span className="font-serif text-2xl text-mist-400">0{i + 1}</span>
                <h3 className="mt-2 font-serif text-lg font-semibold text-mist-950">{d.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-700">{d.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="bg-mist-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading overline="How We Work" title="Our principles" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal key={p.name} delay={(i % 3) * 70}>
                <article className="h-full rounded-2xl border border-mist-200 bg-white p-7 shadow-soft">
                  <h3 className="font-serif text-lg font-semibold text-mist-950">{p.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist-700">{p.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Begin with how you feel */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading overline="Find Your Starting Point" title="Begin with how you feel" />
          <div className="mt-12 space-y-3">
            {starts.map((s) => (
              <Link
                key={s.feel}
                href={s.href}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-mist-200 bg-white p-5 shadow-soft transition-shadow duration-200 hover:shadow-lift"
              >
                <div>
                  <p className="font-serif text-lg font-semibold text-mist-950">“{s.feel}”</p>
                  <p className="mt-1 text-sm text-mist-700">{s.start}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-mist-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-mist-600" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Photography */}
      <PhotoStrip
        className="py-4"
        photos={[
          { src: "/photos/yoga-outdoor.jpg", alt: "Gentle movement in the morning sun" },
          { src: "/photos/tea-ritual.jpg", alt: "A MaMoyo tea ritual poured slowly" },
          { src: "/photos/meditation.jpg", alt: "A quiet moment of rest at MaMoyo" },
        ]}
      />

      {/* Promise + scope */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-mist-950">The MaMoyo promise</h2>
            <ul className="mt-6 space-y-2.5">
              {promise.map((p) => (
                <li key={p} className="flex items-baseline gap-2.5 text-sm text-mist-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mist-400" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-mist-200 bg-white p-8 shadow-soft">
            <h2 className="font-serif text-xl font-semibold text-mist-950">Important scope</h2>
            <p className="mt-4 text-sm leading-relaxed text-mist-700">
              MaMoyo provides spa, skincare, hospitality, food and wellbeing services. These do not replace
              diagnosis, medical treatment, physiotherapy, psychotherapy or emergency care. The team may
              postpone treatment and request medical clearance when proceeding would not be responsible.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
