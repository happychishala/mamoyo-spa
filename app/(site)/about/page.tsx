import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Droplets, TreePalm } from "lucide-react";
import { SectionHeading } from "@/components/site/Section";
import Reveal from "@/components/site/Reveal";

export const metadata: Metadata = {
  title: "Our Story",
  description: "The story and values behind MaMoyo Wellness & Beauty in Kabulonga, Lusaka.",
};

const values = [
  {
    icon: HeartHandshake,
    title: "Care over speed",
    text: "We book fewer guests per day than we could, so no treatment ever feels like a queue.",
  },
  {
    icon: Droplets,
    title: "Honest ingredients",
    text: "Marula, baobab and shea sourced from Zambian and regional producers we know by name.",
  },
  {
    icon: TreePalm,
    title: "Rooted here",
    text: "Our therapists, chefs and gardeners are trained and employed locally — MaMoyo grows with Lusaka.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-36 pb-8">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          overline="Our Story"
          title="MaMoyo means heart"
          description="We opened our gates in 2020 with a simple belief: rest is not a luxury, it's a practice. What began as three treatment rooms and a coffee cart is now Kabulonga's quiet corner — spa, salon & barber, health café, events venue and serviced apartments."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
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
                alt="Guest meditating in the morning sun"
                fill
                sizes="(min-width: 640px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
          </div>
          </Reveal>
        </div>

        <div className="mx-auto mt-14 max-w-3xl space-y-6 text-base leading-relaxed text-mist-900">
          <p>
            The name comes from <em>moyo</em> — heart, life, spirit. It&apos;s what we hope you
            find again here: the unhurried version of yourself that busy weeks tend to bury.
          </p>
          <p>
            Everything on the property is designed around slowness. The gravel path from the gate
            is deliberately long. The café serves lunch on real plates with no Wi-Fi password on
            the wall (ask, and we&apos;ll happily share — but most guests forget to). The
            treatment rooms open onto a private garden where the loudest sound is a turaco.
          </p>
          <p>
            Whether you come for a ninety-minute massage, a slow breakfast, or a full-day retreat,
            our promise is the same: you&apos;ll leave lighter than you arrived.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 100}>
            <div className="h-full rounded-2xl border border-mist-200 bg-white p-7 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mist-100 text-mist-600">
                <v.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-4 font-serif text-lg font-semibold text-mist-950">{v.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-mist-800">{v.text}</p>
            </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 rounded-full bg-mist-600 px-8 py-4 text-sm font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-mist-700"
          >
            Experience it yourself
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
