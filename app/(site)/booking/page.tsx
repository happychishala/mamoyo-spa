import type { Metadata } from "next";
import { SectionHeading } from "@/components/site/Section";
import { bookableServices } from "@/lib/content";
import { readDb } from "@/lib/db";
import BookingForm from "./BookingForm";

export const metadata: Metadata = {
  title: "Book a Treatment",
  description:
    "Reserve a massage, facial, body ritual or spa package at MaMoyo Kabulonga or MaMoyo at Twangale Resort in Lusaka.",
  alternates: { canonical: "/booking" },
  openGraph: {
    title: "Book a Treatment | MaMoyo",
    description:
      "Reserve a massage, facial, body ritual or spa package at MaMoyo Kabulonga or MaMoyo at Twangale Resort in Lusaka.",
    url: "/booking",
  },
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; location?: string }>;
}) {
  const { service, location } = await searchParams;
  const preselected = bookableServices.some((s) => s.name === service) ? service : undefined;
  const preselectedLocation = location === "Twangale" ? "Twangale" : "Kabulonga";

  const db = await readDb();
  const products = db.inventory
    .filter((item) => typeof item.retailPrice === "number" && item.retailPrice > 0)
    .map((item) => ({ name: item.brand ? `${item.name} — ${item.brand}` : item.name, price: item.retailPrice as number }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="pt-36 pb-8">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          overline="Reservations"
          title="Book your visit"
          description="Choose a treatment, pick a time, and we'll confirm by email — usually within a couple of hours. Payment happens at the retreat, never online."
        />
        <div className="mx-auto mt-14 max-w-2xl">
          <BookingForm
            services={bookableServices}
            products={products}
            preselected={preselected}
            preselectedLocation={preselectedLocation}
          />
        </div>
      </div>
    </div>
  );
}
