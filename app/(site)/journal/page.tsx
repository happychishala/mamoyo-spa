import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/Section";
import Reveal from "@/components/site/Reveal";

export const metadata: Metadata = {
  title: { absolute: "The MaMoyo Journal | Wellness, Skincare and Lusaka Living" },
  description:
    "Read grounded guidance from MaMoyo across wellness, skincare, nutrition, lifestyle, travel, hospitality and corporate wellbeing.",
  alternates: { canonical: "/journal" },
  openGraph: {
    title: "The MaMoyo Journal | Wellness, Skincare and Lusaka Living",
    description:
      "Read grounded guidance from MaMoyo across wellness, skincare, nutrition, lifestyle, travel, hospitality and corporate wellbeing.",
    url: "/journal",
  },
};

const articles = [
  { category: "Wellness", title: "How often should you really book a massage?" },
  { category: "Skincare", title: "The difference between dry skin and dehydrated skin" },
  { category: "Nutrition", title: "What to eat before and after a spa treatment" },
  { category: "Lifestyle", title: "How to build a self-care rhythm that survives a busy month" },
  { category: "Travel", title: "A calm first day in Lusaka after a long flight" },
  { category: "Hospitality", title: "The first ten minutes of a spa visit" },
  { category: "Corporate Wellness", title: "Why the annual wellness day is not a wellbeing strategy" },
  { category: "Beauty", title: "How to plan professional skincare before a wedding or major event" },
];

export default function JournalPage() {
  return (
    <>
      <PageHero
        eyebrow="Useful Thinking for Living Well"
        title="Clear guidance, thoughtful stories and grounded expertise"
        intro="The Journal exists to help readers make better decisions, not to make ordinary life feel inadequate. It covers wellness, beauty, nutrition, lifestyle, skincare, travel, hospitality and corporate wellbeing."
        primary={{ label: "Explore MaMoyo", href: "/" }}
        secondary={{ label: "Notes from MaMoyo", href: "/contact" }}
        image={{ src: "/photos/wide-cafe-brunch.jpg", alt: "Coffee and pastries on a quiet cafe table" }}
      />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading
          overline="Launching Soon"
          title="The first stories"
          description="Our opening set of articles across the topics that matter most to how you live and feel. New pieces are on the way."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <Reveal key={a.title} delay={(i % 3) * 70}>
              <article className="flex h-full flex-col rounded-2xl border border-mist-200 bg-white p-7 shadow-soft">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-mist-600">
                  {a.category}
                </p>
                <h3 className="mt-2 flex-1 font-serif text-lg font-semibold leading-snug text-mist-950">
                  {a.title}
                </h3>
                <p className="mt-4 inline-flex w-fit rounded-full bg-mist-100 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-wide text-mist-600">
                  Coming soon
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Newsletter note */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <div className="rounded-2xl bg-mist-900 p-8 text-center text-white sm:p-10">
          <h2 className="font-serif text-2xl font-semibold">Notes from MaMoyo</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-mist-200">
            Seasonal experiences, useful guidance, new treatments, café stories and first access to member
            events. Thoughtful emails, sent with restraint — be the first to read the Journal when it opens.
          </p>
        </div>
      </section>
    </>
  );
}
