import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, CalendarCheck } from "lucide-react";
import { SectionHeading, ServiceIcon } from "@/components/site/Section";
import Reveal from "@/components/site/Reveal";
import Wave from "@/components/site/Wave";
import SplashScreen from "@/components/site/SplashScreen";
import { services, cafeMenu } from "@/lib/content";
import { formatMoney } from "@/lib/format";
import JsonLd from "@/components/site/JsonLd";
import { homeGraphSchema } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: "MaMoyo | Spa, Wellness, Café and Suites in Lusaka",
    description:
      "Discover MaMoyo, Lusaka's premier wellness destination for spa treatments, professional skincare, café rituals, serviced suites and curated experiences.",
    url: "/",
  },
};

const pillars = [
  {
    title: "The Spa",
    text: "Massage, body rituals, professional facials and advanced skincare",
    image: "/photos/hot-stone.jpg",
    alt: "Hot stone massage during a treatment at MaMoyo",
    href: "/spa/menu",
  },
  {
    title: "MaMoyo Café",
    text: "Considered breakfast, lunch, coffee and tea rituals — open to everyone",
    image: "/photos/salad-bowl.jpg",
    alt: "A fresh, garden-led plate at MaMoyo Café",
    href: "/cafe",
  },
  {
    title: "MaMoyo Suites",
    text: "Fully serviced studio stays within the Kabulonga grounds",
    image: "/photos/suites/studio-2.jpg",
    alt: "A MaMoyo Suites studio with lounge, dining table and kitchenette",
    href: "/suites",
  },
];

const gallery = [
  { src: "/photos/suites/studio-2.jpg", alt: "The MaMoyo pool and garden terrace" },
  { src: "/photos/towels-candle.jpg", alt: "Spa towels and candles ready for a treatment" },
  { src: "/photos/meditation.jpg", alt: "Guest meditating at sunrise" },
  { src: "/photos/interior.jpg", alt: "Calm, light-filled retreat interior" },
];

export default function HomePage() {
  const featured = services.slice(0, 6);

  return (
    <>
      <JsonLd data={homeGraphSchema()} />
      <SplashScreen />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-mist-100 via-mist-50 to-mist-50" />
          <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-mist-200/70 blur-3xl" />
          <div className="absolute top-40 -left-32 h-80 w-80 rounded-full bg-sand-100/80 blur-3xl" />

          {/* Drifting waves */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
            <div className="animate-wave-slow flex w-[200%]">
              {[0, 1].map((i) => (
                <svg
                  key={i}
                  viewBox="0 0 1440 90"
                  preserveAspectRatio="none"
                  fill="currentColor"
                  className="h-16 w-1/2 shrink-0 text-mist-200/70 sm:h-20"
                >
                  <path d="M0,48 C240,88 480,8 720,48 C960,88 1200,8 1440,48 L1440,90 L0,90 Z" />
                </svg>
              ))}
            </div>
            <div className="animate-wave absolute bottom-0 left-0 flex w-[200%]">
              {[0, 1].map((i) => (
                <svg
                  key={i}
                  viewBox="0 0 1440 90"
                  preserveAspectRatio="none"
                  fill="currentColor"
                  className="h-10 w-1/2 shrink-0 text-mist-300/50 sm:h-14"
                >
                  <path d="M0,56 C180,20 420,84 720,52 C1020,20 1260,84 1440,56 L1440,90 L0,90 Z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <p className="animate-rise text-xs font-semibold uppercase tracking-[0.25em] text-mist-600">
                Lusaka&rsquo;s Premier Wellness Destination
              </p>
              <h1
                className="animate-rise mt-6 font-serif text-4xl font-semibold leading-[1.12] tracking-tight text-mist-950 sm:text-5xl xl:text-6xl"
                style={{ animationDelay: "80ms" }}
              >
                Return to
                <span className="relative mx-2 inline-block align-baseline">
                  <span className="animate-write inline-block font-brush text-[1.2em] font-normal tracking-normal text-mist-600">
                    yourself
                  </span>
                  <svg
                    aria-hidden="true"
                    className="absolute -bottom-3 left-0 w-full text-mist-300"
                    viewBox="0 0 200 12"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      className="animate-swoosh"
                      d="M3 9c50-6 144-6 194 0"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
              <p
                className="animate-rise mx-auto mt-7 max-w-xl text-lg leading-relaxed text-mist-800 lg:mx-0"
                style={{ animationDelay: "160ms" }}
              >
                MaMoyo brings together restorative spa care, professional skincare, nourishing
                food, considered stays and experiences designed around how you want to feel when
                you leave.
              </p>
              <div
                className="animate-rise mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
                style={{ animationDelay: "240ms" }}
              >
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 rounded-full bg-mist-600 px-8 py-4 text-sm font-semibold text-white shadow-lift transition-colors duration-200 hover:bg-mist-700"
                >
                  Book Your Visit
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full border border-mist-300 bg-white/80 px-8 py-4 text-sm font-semibold text-mist-800 backdrop-blur transition-colors duration-200 hover:border-mist-400 hover:bg-white"
                >
                  Discover MaMoyo
                </Link>
              </div>
            </div>

            {/* Image collage */}
            <div className="animate-rise relative mx-auto w-full max-w-lg lg:max-w-none" style={{ animationDelay: "200ms" }}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-lift sm:aspect-[5/5]">
                <Image
                  src="/photos/hero-massage.jpg"
                  alt="Therapist pouring warm oil during a massage at MaMoyo"
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-4 w-40 overflow-hidden rounded-2xl border-4 border-mist-50 shadow-lift sm:-left-8 sm:w-48">
                <div className="relative aspect-square">
                  <Image
                    src="/photos/facial.jpg"
                    alt="Professional facial treatment in progress at MaMoyo"
                    fill
                    sizes="12rem"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute -top-6 -right-3 w-32 overflow-hidden rounded-2xl border-4 border-mist-50 shadow-lift sm:-right-6 sm:w-40">
                <div className="relative aspect-square">
                  <Image
                    src="/photos/coffee.jpg"
                    alt="A coffee ritual at MaMoyo Café"
                    fill
                    sizes="10rem"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two settings + offerings */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          overline="Kabulonga & Twangale Resort"
          title="Two settings, one standard of care"
          description="MaMoyo brings restorative spa care, professional skincare, nourishing food and considered stays into two distinct destinations across Lusaka — boutique city care in Kabulonga and resort-scale wellness at Twangale."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 80}>
              <Link
                href={p.href}
                className="group relative block overflow-hidden rounded-2xl shadow-soft transition-shadow duration-300 hover:shadow-lift"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={p.image}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 1024px) 32vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-mist-950/85 via-mist-950/20 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-serif text-lg text-white">{p.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-mist-200">{p.text}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Treatments preview */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          overline="The Spa"
          title="Care that is precise, personal and deeply restorative"
          description="From trusted massage and African-inspired body rituals to professional facials and advanced aesthetic care, every booking begins with what your body or skin needs now."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((service, i) => (
            <Reveal key={service.name} delay={(i % 3) * 90}>
              <article className="group h-full rounded-2xl border border-mist-200 bg-white p-7 shadow-soft transition-shadow duration-300 hover:shadow-lift">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mist-100 text-mist-600 transition-colors duration-300 group-hover:bg-mist-600 group-hover:text-white">
                  <ServiceIcon icon={service.icon} />
                </div>
                <h3 className="mt-5 font-serif text-xl font-semibold text-mist-950">{service.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-800">{service.description}</p>
                <div className="mt-5 flex items-center justify-between border-t border-mist-100 pt-4 text-sm">
                  <span className="inline-flex items-center gap-1.5 text-mist-600">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    {service.durationMin} min
                  </span>
                  <span className="font-semibold text-mist-800">{formatMoney(service.price)}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/spa/menu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-mist-700 transition-colors duration-200 hover:text-mist-900"
          >
            View the Treatment Menu
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Café teaser */}
      <Wave className="text-mist-900" speed={0} />
      <section className="bg-mist-900 pb-20 pt-14 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mist-300">MaMoyo Café · Kabulonga</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              Food that belongs to the way you want to feel
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-mist-200">
              Thoughtful breakfast and lunch plates, excellent coffee, ceremonial teas, matcha,
              cold-pressed juices and desserts made with restraint. Open to everyone — no spa
              booking required.
            </p>
            <Link
              href="/cafe"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-mist-900 transition-colors duration-200 hover:bg-mist-100"
            >
              Explore the Café
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="relative overflow-hidden rounded-3xl shadow-lift">
            <div className="relative aspect-[4/3]">
              <Image
                src="/photos/cafe-latte.jpg"
                alt="A coffee ritual being served at MaMoyo Café"
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-mist-950/75 p-5 backdrop-blur">
              <ul className="space-y-2 text-sm">
                {cafeMenu[0].items.slice(0, 2).map((item) => (
                  <li key={item.name} className="flex items-baseline justify-between gap-3">
                    <span className="font-medium text-white">{item.name}</span>
                    <span className="shrink-0 text-mist-300">{formatMoney(item.price)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-mist-300">Made fresh, every morning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-4">
        <SectionHeading overline="The Grounds" title="A glimpse of the calm" />
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {gallery.map((g, i) => (
            <Reveal key={g.src} delay={i * 100} className={i % 2 === 0 ? "" : "mt-6 md:mt-10"}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-soft">
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  sizes="(min-width: 768px) 22vw, 45vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl px-8 py-20 text-center text-white shadow-lift sm:px-16">
          <Image
            src="/photos/towels-candle.jpg"
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 1280px) 72rem, 100vw"
            className="object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-mist-800/90 to-mist-950/80" />
          <h2 className="relative font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Your time is worth protecting
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-mist-100">
            Choose the location, treatment or experience that meets you where you are today. We
            will take care of the details from there.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-mist-800 transition-colors duration-200 hover:bg-mist-100"
            >
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              Book MaMoyo
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10"
            >
              Speak to Our Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
