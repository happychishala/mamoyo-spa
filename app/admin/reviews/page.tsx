import type { Metadata } from "next";
import { readDb, REVIEW_SOURCES, LOCATIONS } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { todayISO } from "@/lib/format";
import { PageHeader, Card, NoAccess } from "@/components/admin/ui";
import NewReviewForm from "./NewReviewForm";
import ReviewsTable from "./ReviewsTable";

export const metadata: Metadata = { title: "Reviews" };
export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const session = await getSession();
  if (session?.role === "Staff") return <NoAccess area="Reviews" />;

  const db = await readDb();
  const reviews = [...db.reviews].sort((a, b) => b.reviewedOn.localeCompare(a.reviewedOn));
  const published = reviews.filter((r) => r.published).length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reviews"
        description="Verified guest reviews shown in the 'Care people remember' section on the home page."
      />

      <Card className="border-amber-200 bg-amber-50/60 p-5">
        <h2 className="font-serif text-base font-semibold text-amber-900">Only real reviews</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-amber-900/90">
          Every review here must be copied from a review the guest actually published — Google,
          Facebook, TripAdvisor or a written note they gave you permission to quote. Never write a
          review on a guest&rsquo;s behalf, edit their wording or invent a name or rating. Add the link to
          the original wherever you can, so anything published can be checked later.
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="font-serif text-xl font-semibold text-mist-950">Add a verified review</h2>
        <div className="mt-5">
          <NewReviewForm today={todayISO()} sources={REVIEW_SOURCES} locations={LOCATIONS} />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-serif text-xl font-semibold text-mist-950">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </h2>
          <p className="text-sm text-mist-700">
            {published > 0 ? (
              <span className="font-semibold text-emerald-700">{published} live on the website</span>
            ) : (
              "None published yet"
            )}
          </p>
        </div>
        <div className="mt-5">
          <ReviewsTable reviews={reviews} />
        </div>
      </Card>
    </div>
  );
}
