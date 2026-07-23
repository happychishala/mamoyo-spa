import { Star } from "lucide-react";
import { readDb } from "@/lib/db";
import { SectionHeading } from "./Section";
import Reveal from "./Reveal";
import { locationInfo } from "@/lib/content";

/**
 * Guest reviews, rendered only from records staff transcribed from a verified
 * platform listing and explicitly published in the back office. Nothing here is
 * generated — with no published reviews the section points at the live Google
 * listing instead of showing placeholder quotes.
 */
const reviewsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `MaMoyo ${locationInfo.Kabulonga.address}`
)}`;

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-4 w-4 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-mist-300"}`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

export default async function Reviews() {
  const db = await readDb();
  const reviews = db.reviews
    .filter((r) => r.published)
    .sort((a, b) => b.reviewedOn.localeCompare(a.reviewedOn))
    .slice(0, 3);

  return (
    <section className="bg-mist-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          overline="Guest Reviews"
          title="Care people remember"
          description={
            reviews.length > 0
              ? "In the words of guests who have visited MaMoyo."
              : "Our guests share their experience on Google. Read what they have said in their own words."
          }
        />

        {reviews.length > 0 && (
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={r.id} delay={(i % 3) * 80}>
                <figure className="flex h-full flex-col rounded-2xl border border-mist-200 bg-white p-7 shadow-soft">
                  <Stars rating={r.rating} />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-mist-800">
                    &ldquo;{r.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 border-t border-mist-100 pt-4 text-xs text-mist-600">
                    <span className="font-semibold text-mist-900">{r.author}</span>
                    <span className="mx-1.5" aria-hidden="true">
                      ·
                    </span>
                    {r.source}
                    {r.location && ` · ${r.location}`}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <a
            href={reviews[0]?.sourceUrl ?? reviewsUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-mist-300 bg-white px-7 py-3.5 text-sm font-semibold text-mist-800 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
          >
            Read Guest Reviews
          </a>
        </div>
      </div>
    </section>
  );
}
