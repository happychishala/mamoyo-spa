"use client";

import { Eye, EyeOff, Trash2, Star, ExternalLink } from "lucide-react";
import type { Review } from "@/lib/db";
import { setReviewPublished, deleteReview } from "@/lib/actions";
import { formatDate } from "@/lib/format";
import { DataTable, type DataColumn } from "@/components/admin/DataTable";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-3.5 w-3.5 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-mist-300"}`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

const columns: DataColumn<Review>[] = [
  {
    key: "author",
    header: "Guest",
    cellClassName: "font-medium text-mist-950",
    cell: (r) => (
      <div>
        <p className="font-medium text-mist-950">{r.author}</p>
        <Stars rating={r.rating} />
      </div>
    ),
  },
  {
    key: "quote",
    header: "Review",
    cell: (r) => <p className="max-w-md text-mist-800">{r.quote}</p>,
  },
  {
    key: "source",
    header: "Source",
    filterable: true,
    cell: (r) =>
      r.sourceUrl ? (
        <a
          href={r.sourceUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-mist-700 underline underline-offset-2 hover:text-mist-950"
        >
          {r.source}
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      ) : (
        r.source
      ),
  },
  { key: "location", header: "Location", value: (r) => r.location ?? "—", filterable: true },
  { key: "reviewedOn", header: "Reviewed", cell: (r) => formatDate(r.reviewedOn) },
  {
    key: "published",
    header: "Status",
    filterable: true,
    value: (r) => (r.published ? "Published" : "Hidden"),
    cell: (r) => (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
          r.published ? "bg-emerald-100 text-emerald-800" : "bg-mist-100 text-mist-700"
        }`}
      >
        {r.published ? "Published" : "Hidden"}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    align: "right",
    sortable: false,
    searchable: false,
    exportable: false,
    cell: (r) => (
      <div className="flex justify-end gap-2">
        <form action={setReviewPublished}>
          <input type="hidden" name="id" value={r.id} />
          <input type="hidden" name="published" value={r.published ? "false" : "true"} />
          <button
            type="submit"
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${
              r.published
                ? "border border-mist-300 text-mist-700 hover:border-mist-400 hover:bg-mist-50"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            {r.published ? (
              <>
                <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> Hide
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" aria-hidden="true" /> Publish
              </>
            )}
          </button>
        </form>
        <form action={deleteReview}>
          <input type="hidden" name="id" value={r.id} />
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 transition-colors duration-200 hover:border-rose-300 hover:bg-rose-50"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Delete
          </button>
        </form>
      </div>
    ),
  },
];

export default function ReviewsTable({ reviews }: { reviews: Review[] }) {
  return (
    <DataTable
      rows={reviews}
      columns={columns}
      filename="mamoyo-reviews"
      title="MaMoyo Guest Reviews"
      searchPlaceholder="Search guest or review text…"
      initialSort={{ key: "reviewedOn", dir: "desc" }}
      emptyMessage="No reviews yet — add a verified review from Google or another platform above."
    />
  );
}
