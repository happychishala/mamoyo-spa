import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, CalendarCheck } from "lucide-react";
import { SectionHeading, ServiceIcon } from "@/components/site/Section";
import Reveal from "@/components/site/Reveal";
import Wave from "@/components/site/Wave";
import SplashScreen from "@/components/site/SplashScreen";
import Reviews from "@/components/site/Reviews";
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

const destinations = [
  {
    name: "Kabulonga",
    title: "Kabulonga: your city rhythm, made gentler",
    text: "A quiet boutique destination on Reedbuck Road for regular treatments, professional skincare, unhurried café time and stays within the MaMoyo grounds. Come for an hour, spend the afternoon or make it your address in Lusaka.",
    image: "/photos/interior.jpg",
    alt: "The calm, light-filled interior at MaMoyo Kabulonga",
    href: "/spa/kabulonga",
    exploreLabel: "Explore Kabulonga",
    bookLabel: "Book Kabulonga",
  },
  {
    name: "Twangale Resort",
    title: "Twangale Resort: a longer exhale, held by nature",
    text: "Set within the gardens of Twangale Resort in Lilayi, this is MaMoyo at a more expansive pace. Pair treatment time with the pool, landscape and ease of a full resort day. It is especially suited to couples, families, groups and anyone who needs more than a quick appointment.",
    image: "/photos/pool.jpg",
    alt: "The pool and gardens at Twangale Resort",
    href: "/spa/twangale",
    exploreLabel: "Explore Twangale",
    bookLabel: "Book Twangale",
  },
];

const homeExperiences = [
  { name: "Executive Reset", text: "A precise half day for people carrying too much for too long." },
  { name: "Couples Retreat", text: "Shared treatment time, a private tea ritual and a quiet table for two." },
  { name: "Bridal Glow", text: "Skin, body, hands, feet and nourishment brought together before the celebration." },
  { name: "Full Day Escape", text: "A complete face and body journey designed to move the body from tension into renewal." },
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

      {/* Philosophy */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight text-mist-950 sm:text-4xl">
          Wellness becomes meaningful when it becomes part of life
        </h2>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-mist-800">
          <p>
            A massage can release tension. A facial can restore confidence. A quiet lunch can change
            the pace of an afternoon. A thoughtful stay can make a demanding week feel possible again.
          </p>
          <p>
            MaMoyo was created to bring these moments together, not as occasional rewards, but as a
            more consistent way to care for the body, the mind and the life carrying both.
          </p>
        </div>
        <Link
          href="/wellness"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-mist-300 px-7 py-3.5 text-sm font-semibold text-mist-800 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
        >
          Our Philosophy
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>

      {/* Founder story */}
      <section className="bg-mist-50 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift">
              <Image
                src="/photos/meditation.jpg"
                alt="A quiet moment of rest at MaMoyo"
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mist-600">Our Story</p>
            <h2 className="mt-3 text-balance font-serif text-3xl font-semibold tracking-tight text-mist-950 sm:text-4xl">
              Built from a question Lusaka deserved an answer to
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-mist-800">
              <p>
                For years, our founder, Tambudzai Chola, travelled to South Africa for skincare and
                wellness treatments she felt she could trust completely. When international travel
                stopped during the pandemic, one question stayed with her: where in Lusaka could a
                person go knowing that exceptional care would be consistent, personal and beautifully
                delivered every time?
              </p>
              <p>
                She knew she could not be the only person asking. MaMoyo began with the belief that
                Lusaka deserved a place built around genuine care, trusted professionals, beautiful
                surroundings and complete wellbeing. A place to visit before exhaustion, not only
                after it. A place that could become part of a person&rsquo;s rhythm.
              </p>
            </div>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-mist-300 bg-white px-7 py-3.5 text-sm font-semibold text-mist-800 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-100"
            >
              Read Our Story
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Two destinations */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          overline="Kabulonga & Twangale Resort"
          title="Two settings, one standard of care"
        />
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {destinations.map((d, i) => (
            <Reveal key={d.name} delay={i * 100}>
              <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-mist-200 bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift">
                <div className="relative h-60">
                  <Image
                    src={d.image}
                    alt={d.alt}
                    fill
                    sizes="(min-width: 768px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-serif text-xl font-semibold text-mist-950">{d.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-mist-800">{d.text}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={d.href}
                      className="inline-flex items-center gap-1.5 rounded-full bg-mist-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
                    >
                      {d.exploreLabel}
                    </Link>
                    <Link
                      href={`/booking?location=${encodeURIComponent(d.name === "Kabulonga" ? "Kabulonga" : "Twangale")}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-mist-300 px-5 py-2.5 text-xs font-semibold text-mist-800 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
                    >
                      {d.bookLabel}
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Treatments preview */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          overline="The Spa"
          title="Care that is precise, personal and deeply restorative"
          description="Our spa offering moves from trusted massage and African-inspired body rituals to professional facials, advanced aesthetic care, hand and foot care, grooming and hydrotherapy. Every booking begins with what your body or skin needs now, not with a treatment chosen by habit."
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
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/spa"
            className="inline-flex items-center gap-2 rounded-full bg-mist-600 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
          >
            Explore the Spa
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/spa/menu"
            className="inline-flex items-center gap-2 rounded-full border border-mist-300 px-7 py-3.5 text-sm font-semibold text-mist-800 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
          >
            View the Treatment Menu
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
            <div className="mt-4 max-w-md space-y-4 text-base leading-relaxed text-mist-200">
              <p>
                MaMoyo Café is open to everyone. Come before a treatment, stay afterwards or visit
                simply because you want a beautiful breakfast, a polished work lunch, a tea ritual or
                a quiet table with someone you have missed.
              </p>
              <p>
                The menu is generous rather than clinical, with thoughtful breakfast and lunch plates,
                excellent coffee, ceremonial teas, matcha, cold-pressed juices, botanical drinks and
                desserts made with restraint.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/cafe"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-mist-900 transition-colors duration-200 hover:bg-mist-100"
              >
                Explore the Café
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/cafe#reserve"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10"
              >
                Reserve a Table
              </Link>
            </div>
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

      {/* Suites */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mist-600">
              MaMoyo Suites · Kabulonga
            </p>
            <h2 className="mt-3 text-balance font-serif text-3xl font-semibold tracking-tight text-mist-950 sm:text-4xl">
              Stay where wellbeing is already part of the address
            </h2>
            <p className="mt-5 text-base leading-relaxed text-mist-800">
              MaMoyo Suites offer fully serviced studio accommodation within the Kabulonga property.
              Designed for business, longer assignments, medical visits, bridal stays and weekends in
              the city, each stay can be connected to spa care, the café, pool and gardens.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/suites"
                className="inline-flex items-center gap-2 rounded-full bg-mist-600 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
              >
                Explore MaMoyo Suites
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/suites#book"
                className="inline-flex items-center gap-2 rounded-full border border-mist-300 px-7 py-3.5 text-sm font-semibold text-mist-800 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
              >
                Check Direct Availability
              </Link>
            </div>
          </div>
          <Reveal delay={100}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift">
              <Image
                src="/photos/suites/studio-2.jpg"
                alt="A MaMoyo Suites studio with lounge, dining table and kitchenette"
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Experiences */}
      <section className="bg-mist-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            overline="MaMoyo Experiences"
            title="Make more of the time you set aside"
            description="Some days need more than one treatment. MaMoyo experiences bring together touch, skincare, food, water, rest and thoughtful details in one clear journey."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {homeExperiences.map((e, i) => (
              <Reveal key={e.name} delay={(i % 4) * 70}>
                <article className="h-full rounded-2xl border border-mist-200 bg-white p-7 shadow-soft">
                  <h3 className="font-serif text-lg font-semibold text-mist-950">{e.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist-700">{e.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/experiences"
              className="inline-flex items-center gap-2 rounded-full bg-mist-600 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
            >
              Explore All Experiences
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Membership + Corporate */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <article className="flex h-full flex-col rounded-3xl border border-mist-200 bg-white p-8 shadow-soft sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mist-600">
                The MaMoyo Circle
              </p>
              <h2 className="mt-3 font-serif text-2xl font-semibold text-mist-950">
                Belong to a more consistent way of caring for yourself
              </h2>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-mist-800">
                The MaMoyo Circle creates a regular rhythm of treatment, priority access, café
                rituals, selected suite privileges and member gatherings across Kabulonga and
                Twangale Resort.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/membership"
                  className="inline-flex items-center gap-2 rounded-full bg-mist-600 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
                >
                  Explore Membership
                </Link>
                <Link
                  href="/membership#apply"
                  className="inline-flex items-center gap-2 rounded-full border border-mist-300 px-6 py-3 text-sm font-semibold text-mist-800 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
                >
                  Apply to Join
                </Link>
              </div>
            </article>
          </Reveal>
          <Reveal delay={100}>
            <article className="flex h-full flex-col rounded-3xl border border-mist-200 bg-white p-8 shadow-soft sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mist-600">
                Corporate Wellness
              </p>
              <h2 className="mt-3 font-serif text-2xl font-semibold text-mist-950">
                Care for the people carrying the organisation
              </h2>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-mist-800">
                MaMoyo works with banks, embassies, NGOs, mining companies, law firms, international
                organisations and corporate teams to create wellbeing programmes that feel useful,
                credible and properly delivered.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/corporate-wellness"
                  className="inline-flex items-center gap-2 rounded-full bg-mist-600 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
                >
                  Explore Corporate Wellness
                </Link>
                <Link
                  href="/corporate-wellness#proposal"
                  className="inline-flex items-center gap-2 rounded-full border border-mist-300 px-6 py-3 text-sm font-semibold text-mist-800 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
                >
                  Request a Proposal
                </Link>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      {/* Journal */}
      <section className="mx-auto max-w-3xl px-6 pb-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mist-600">
          The MaMoyo Journal
        </p>
        <h2 className="mt-3 text-balance font-serif text-3xl font-semibold tracking-tight text-mist-950 sm:text-4xl">
          Useful thinking for living well
        </h2>
        <p className="mt-5 text-base leading-relaxed text-mist-800">
          The MaMoyo Journal brings together grounded guidance across skincare, nutrition, wellbeing,
          travel, hospitality and the way modern life asks us to care for ourselves.
        </p>
        <Link
          href="/journal"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-mist-300 px-7 py-3.5 text-sm font-semibold text-mist-800 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
        >
          Read the Journal
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>

      {/* Reviews — published from the back office, never invented */}
      <Reviews />

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
