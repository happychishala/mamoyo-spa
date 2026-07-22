import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Cta = { label: string; href: string };

export default function PagePlaceholder({
  eyebrow,
  title,
  intro,
  primary = { label: "Book Your Visit", href: "/booking" },
  secondary = { label: "Speak to Our Team", href: "/contact" },
}: {
  eyebrow: string;
  title: string;
  intro: string;
  primary?: Cta;
  secondary?: Cta;
}) {
  return (
    <div className="pt-32 pb-24 sm:pt-40">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mist-600">{eyebrow}</p>
        <h1 className="mt-5 text-balance font-serif text-4xl font-semibold text-mist-950 sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-mist-700">{intro}</p>
        <p className="mt-7 inline-block rounded-full bg-mist-100 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-mist-700">
          Full page coming soon
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={primary.href}
            className="inline-flex items-center gap-2 rounded-full bg-mist-600 px-8 py-4 text-sm font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-mist-700"
          >
            {primary.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href={secondary.href}
            className="inline-flex items-center gap-2 rounded-full border border-mist-300 px-8 py-4 text-sm font-semibold text-mist-800 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
          >
            {secondary.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
