import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/site/Section";
import Reveal from "@/components/site/Reveal";
import SpaMenuNav from "@/components/site/SpaMenuNav";
import Wave from "@/components/site/Wave";
import { spaMenu, contactInfo, bookableName, type MenuTreatment } from "@/lib/content";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = {
  title: { absolute: "MaMoyo Spa Menu and Prices | Lusaka" },
  description:
    "View MaMoyo massage, facial, body, grooming, hydrotherapy and spa package options, with location availability across Kabulonga and Twangale.",
  alternates: { canonical: "/spa/menu" },
  openGraph: {
    title: "MaMoyo Spa Menu and Prices | Lusaka",
    description:
      "View MaMoyo massage, facial, body, grooming, hydrotherapy and spa package options, with location availability across Kabulonga and Twangale.",
    url: "/spa/menu",
  },
};

function TreatmentCard({ t, dark = false }: { t: MenuTreatment; dark?: boolean }) {
  const many = t.options.length > 4; // waxing-style price grids
  return (
    <div
      className={`flex h-full flex-col rounded-2xl border p-6 shadow-soft transition-shadow duration-300 hover:shadow-lift ${
        dark ? "border-mist-700 bg-mist-800/60" : "border-mist-200 bg-white"
      }`}
    >
      <h3 className={`font-serif text-lg ${dark ? "text-white" : "text-cocoa-700"}`}>{t.name}</h3>
      {t.description && (
        <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-mist-200" : "text-mist-800"}`}>
          {t.description}
        </p>
      )}
      <ul
        className={`mt-4 flex-1 ${
          many ? "grid grid-cols-2 gap-x-5" : ""
        } divide-y ${dark ? "divide-mist-700" : "divide-mist-100"} ${many ? "divide-y-0" : ""}`}
      >
        {t.options.map((o) => (
          <li key={o.label} className="flex items-baseline justify-between gap-3 py-1.5">
            <span className={`text-sm ${dark ? "text-mist-200" : "text-mist-700"}`}>{o.label}</span>
            <span className={`flex items-baseline gap-2 text-sm font-semibold ${dark ? "text-white" : "text-mist-900"}`}>
              {formatMoney(o.price)}
              {!many && (
                <Link
                  href={`/booking?service=${encodeURIComponent(bookableName(t.name, o))}`}
                  aria-label={`Book ${t.name}, ${o.label}`}
                  className={`text-xs font-semibold underline-offset-2 hover:underline ${
                    dark ? "text-mist-300" : "text-mist-600"
                  }`}
                >
                  book
                </Link>
              )}
            </span>
          </li>
        ))}
      </ul>
      {t.note && (
        <p className={`mt-3 text-xs italic ${dark ? "text-mist-300" : "text-mist-600"}`}>{t.note}</p>
      )}
    </div>
  );
}

export default function TreatmentsPage() {
  return (
    <div className="pt-32">
      {/* Intro with drifting waves */}
      <section className="relative overflow-hidden bg-gradient-to-b from-mist-100 to-mist-50 pb-20 pt-8">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            overline="MaMoyo Treatment Menu"
            title="Choose care with purpose"
            description="Explore massage, body rituals, facial care, advanced aesthetics, grooming, hand and foot care, hydrotherapy and complete spa packages. Treatment availability may vary by location — select Kabulonga or Twangale Resort during booking for current availability."
          />
          <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-mist-700">
            All prices are shown in Zambian kwacha. The price confirmed at booking applies to the
            appointment.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 rounded-full bg-mist-600 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
            >
              Book a Treatment
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-mist-300 px-7 py-3.5 text-sm font-semibold text-mist-800 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
            >
              Ask for Guidance
            </Link>
          </div>

          {/* Category pills — dock to a left rail as you scroll */}
          <SpaMenuNav sections={spaMenu.map((s) => ({ id: s.id, title: s.title }))} />

          <Reveal className="mt-12">
            <div className="relative overflow-hidden rounded-3xl shadow-lift">
              <div className="relative h-56 sm:h-72">
                <Image
                  src="/photos/wide-massage-couple.jpg"
                  alt="A treatment underway in a MaMoyo room"
                  fill
                  priority
                  sizes="(min-width: 1280px) 72rem, 100vw"
                  className="object-cover"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-mist-950/50 to-transparent" />
                <p className="absolute bottom-8 left-6 font-serif text-xl text-white sm:text-2xl">
                  Unhurried, always
                </p>
                {/* drifting wave over the photo edge */}
                <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
                  <div className="animate-wave flex w-[200%]">
                    {[0, 1].map((i) => (
                      <svg key={i} viewBox="0 0 1440 60" preserveAspectRatio="none" fill="currentColor" className="h-8 w-1/2 shrink-0 text-mist-50">
                        <path d="M0,32 C240,58 480,6 720,32 C960,58 1200,6 1440,32 L1440,60 L0,60 Z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {spaMenu.map((section, idx) => {
        const tone = idx % 3; // 0 white, 1 mist, 2 dark — a calm rhythm down the page
        const dark = tone === 2;
        const bg = tone === 0 ? "bg-white" : tone === 1 ? "bg-mist-100" : "bg-mist-900";
        const waveInto = tone === 0 ? "text-white" : tone === 1 ? "text-mist-100" : "text-mist-900";
        const prevBg = idx === 0 ? "bg-mist-50" : "";

        return (
          <section key={section.id} id={section.id} className={`${bg} scroll-mt-24`}>
            <div className={prevBg || (idx % 3 === 0 ? "bg-mist-50" : idx % 3 === 1 ? "bg-white" : "bg-mist-100")}>
              <Wave className={waveInto} speed={idx} />
            </div>
            <div className="mx-auto max-w-6xl px-6 pb-20 pt-10">
              <Reveal>
                <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${dark ? "text-mist-300" : "text-mist-600"}`}>
                  {String(idx + 1).padStart(2, "0")}
                </p>
                <h2 className={`mt-2 font-serif text-3xl sm:text-4xl ${dark ? "text-white" : "text-cocoa-700"}`}>
                  {section.title}
                </h2>
                {section.intro && (
                  <p className={`mt-3 max-w-2xl text-base leading-relaxed ${dark ? "text-mist-200" : "text-mist-800"}`}>
                    {section.intro}
                  </p>
                )}
              </Reveal>

              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {section.treatments.map((t, i) => (
                  <Reveal
                    key={t.name}
                    delay={(i % 3) * 90}
                    className={t.options.length > 4 ? "sm:col-span-2 lg:col-span-2" : ""}
                  >
                    <TreatmentCard t={t} dark={dark} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Closing CTA */}
      <section className="bg-mist-100">
        <Wave className="text-mist-100" speed={1} />
        <div className="mx-auto max-w-6xl px-6 pb-8 pt-6">
          <Reveal>
            <div className="rounded-3xl border border-mist-200 bg-white p-10 text-center shadow-soft">
              <h2 className="font-serif text-2xl text-cocoa-700">Ready when you are</h2>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-mist-800">
                {`Open ${contactInfo.hours[0].time} weekdays, ${contactInfo.hours[1].time} Saturdays. Advance bookings recommended — we'll confirm within hours.`}
              </p>
              <Link
                href="/booking"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-mist-600 px-8 py-4 text-sm font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-mist-700"
              >
                Book a treatment
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
