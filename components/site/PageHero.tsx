import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Cta = { label: string; href: string };

export default function PageHero({
  eyebrow,
  title,
  intro,
  primary,
  secondary,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  primary?: Cta;
  secondary?: Cta;
}) {
  return (
    <section className="relative overflow-hidden pt-32 pb-14 sm:pt-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-mist-100 via-mist-50 to-white" />
        <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-mist-200/60 blur-3xl" />
      </div>
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mist-600">{eyebrow}</p>
        <h1 className="mt-5 text-balance font-serif text-4xl font-semibold leading-[1.12] text-mist-950 sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-mist-700">{intro}</p>
        {(primary || secondary) && (
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {primary && (
              <Link
                href={primary.href}
                className="inline-flex items-center gap-2 rounded-full bg-mist-600 px-8 py-4 text-sm font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-mist-700"
              >
                {primary.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
            {secondary && (
              <Link
                href={secondary.href}
                className="inline-flex items-center gap-2 rounded-full border border-mist-300 px-8 py-4 text-sm font-semibold text-mist-800 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
              >
                {secondary.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
