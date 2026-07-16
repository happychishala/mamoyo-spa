import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Coffee, Sun, Clock } from "lucide-react";
import { SectionHeading } from "@/components/site/Section";
import Reveal from "@/components/site/Reveal";
import Wave from "@/components/site/Wave";
import { cafeMenu, contactInfo } from "@/lib/content";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = {
  title: "Café MaMoyo — Kabulonga",
  description: "Cold-pressed juices, Zambian coffee and nourishing plates at Café MaMoyo in Kabulonga, Lusaka.",
};

const promises = [
  {
    icon: Leaf,
    title: "Garden to table",
    text: "Herbs and greens picked steps from your table; produce from Lusaka's market farmers.",
  },
  {
    icon: Coffee,
    title: "Zambian beans",
    text: "Our espresso is roasted in Lusaka and brewed by people who take it personally.",
  },
  {
    icon: Sun,
    title: "Open to all",
    text: "You don't need a spa booking to visit — the veranda is yours from 8am.",
  },
];

export default function CafePage() {
  return (
    <div className="pt-36 pb-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex justify-center">
          <Image
            src="/cafe-mamoyo-logo.png"
            alt="Café MaMoyo — Kabulonga"
            width={420}
            height={297}
            priority
            className="h-auto w-64 sm:w-80"
          />
        </div>
        <SectionHeading
          overline="Kabulonga · Lusaka"
          title="Eat slowly. Sip slower."
          description="Under the jacaranda trees, Café MaMoyo serves nourishing plates, cold-pressed juices and proper coffee — the retreat's beating (and gently caffeinated) heart."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          <Reveal className="sm:col-span-2">
          <div className="relative h-full overflow-hidden rounded-2xl shadow-soft">
            <div className="relative h-64 sm:h-full sm:min-h-72">
              <Image
                src="/photos/coffee.jpg"
                alt="Barista-poured latte at Café MaMoyo"
                fill
                sizes="(min-width: 640px) 60vw, 90vw"
                className="object-cover"
              />
            </div>
          </div>
          </Reveal>
          <Reveal delay={120}>
          <div className="relative h-full overflow-hidden rounded-2xl shadow-soft">
            <div className="relative h-64 sm:h-full sm:min-h-72">
              <Image
                src="/photos/salad-bowl.jpg"
                alt="Fresh retreat bowl with roasted vegetables and avocado"
                fill
                sizes="(min-width: 640px) 30vw, 90vw"
                className="object-cover"
              />
            </div>
          </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {promises.map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
            <div className="h-full rounded-2xl border border-mist-200 bg-white p-7 text-center shadow-soft">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-mist-100 text-mist-600">
                <p.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-4 font-serif text-lg font-semibold text-mist-950">{p.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-mist-800">{p.text}</p>
            </div>
            </Reveal>
          ))}
        </div>

        {/* Menu */}
        <div className="mt-20 grid gap-8 md:grid-cols-2">
          {cafeMenu.map((section, i) => (
            <Reveal key={section.title} delay={(i % 2) * 100}>
            <section className="h-full rounded-2xl border border-mist-200 bg-white p-8 shadow-soft">
              <div className="flex items-baseline justify-between gap-3 border-b border-mist-100 pb-4">
                <h2 className="font-serif text-2xl font-semibold text-mist-950">{section.title}</h2>
                <p className="text-xs font-medium uppercase tracking-wide text-mist-600">{section.note}</p>
              </div>
              <ul className="mt-5 space-y-5">
                {section.items.map((item) => (
                  <li key={item.name} className="flex items-baseline justify-between gap-4">
                    <div>
                      <p className="font-medium text-mist-950">{item.name}</p>
                      <p className="mt-0.5 text-sm text-mist-700">{item.description}</p>
                    </div>
                    <span className="shrink-0 font-semibold text-mist-700">{formatMoney(item.price)}</span>
                  </li>
                ))}
              </ul>
            </section>
            </Reveal>
          ))}
        </div>

        {/* Hours + CTA */}
        <Reveal className="mt-16">
        <div className="relative overflow-hidden rounded-3xl bg-mist-900 text-white">
          <Wave className="text-mist-800/60" speed={2} height="h-8" />
          <div className="grid gap-6 p-10 pt-6 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-serif text-2xl font-semibold">Café hours</h2>
            <ul className="mt-4 space-y-2 text-sm text-mist-200">
              {contactInfo.hours.map((h) => (
                <li key={h.days} className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 text-mist-400" aria-hidden="true" />
                  <span className="w-44">{h.days}</span>
                  <span className="font-medium text-white">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:text-right">
            <p className="text-sm leading-relaxed text-mist-200">
              Pair a treatment with lunch — spa guests get 10% off the café menu on the day of their visit.
            </p>
            <Link
              href="/booking"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-mist-900 transition-colors duration-200 hover:bg-mist-100"
            >
              Book a treatment
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          </div>
        </div>
        </Reveal>
      </div>
    </div>
  );
}
