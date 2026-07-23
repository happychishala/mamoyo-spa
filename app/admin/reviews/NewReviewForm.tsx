"use client";

import { Plus } from "lucide-react";
import { createReview } from "@/lib/actions";

const inputClasses =
  "w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-mist-950 placeholder:text-mist-400 transition-colors duration-200 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200";
const labelClasses = "mb-1 block text-xs font-medium text-mist-800";

export default function NewReviewForm({
  today,
  sources,
  locations,
}: {
  today: string;
  sources: readonly string[];
  locations: readonly string[];
}) {
  return (
    <form action={createReview} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="nr-author" className={labelClasses}>
            Guest name (as published)
          </label>
          <input id="nr-author" name="author" type="text" required placeholder="e.g. Chanda M." className={inputClasses} />
        </div>
        <div>
          <label htmlFor="nr-rating" className={labelClasses}>
            Rating
          </label>
          <select id="nr-rating" name="rating" defaultValue="5" className={inputClasses}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} star{n === 1 ? "" : "s"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="nr-source" className={labelClasses}>
            Platform
          </label>
          <select id="nr-source" name="source" defaultValue="Google" className={inputClasses}>
            {sources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="nr-date" className={labelClasses}>
            Date reviewed
          </label>
          <input id="nr-date" name="reviewedOn" type="date" defaultValue={today} className={inputClasses} />
        </div>
      </div>

      <div>
        <label htmlFor="nr-quote" className={labelClasses}>
          Review text <span className="font-normal text-mist-500">(copy it exactly as the guest wrote it)</span>
        </label>
        <textarea
          id="nr-quote"
          name="quote"
          required
          rows={3}
          placeholder="Paste the published review word for word."
          className={inputClasses}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="nr-url" className={labelClasses}>
            Link to the review <span className="font-normal text-mist-500">(optional but recommended)</span>
          </label>
          <input id="nr-url" name="sourceUrl" type="url" placeholder="https://…" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="nr-location" className={labelClasses}>
            Location <span className="font-normal text-mist-500">(optional)</span>
          </label>
          <select id="nr-location" name="location" defaultValue="" className={inputClasses}>
            <option value="">Not specified</option>
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-mist-600 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add Review
      </button>
      <p className="text-xs text-mist-600">
        Saved as hidden. Check it against the original, then press Publish to show it on the website.
      </p>
    </form>
  );
}
