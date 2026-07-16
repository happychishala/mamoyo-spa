import type { Metadata } from "next";
import { SectionHeading } from "@/components/site/Section";
import { bookableServices } from "@/lib/content";
import BookingForm from "./BookingForm";

export const metadata: Metadata = {
  title: "Book a Treatment",
  description: "Reserve your massage, facial or retreat package at MaMoyo Wellness & Beauty, Kabulonga, Lusaka.",
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const preselected = bookableServices.some((s) => s.name === service) ? service : undefined;

  return (
    <div className="pt-36 pb-8">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          overline="Reservations"
          title="Book your visit"
          description="Choose a treatment, pick a time, and we'll confirm by email — usually within a couple of hours. Payment happens at the retreat, never online."
        />
        <div className="mx-auto mt-14 max-w-2xl">
          <BookingForm services={bookableServices} preselected={preselected} />
        </div>
      </div>
    </div>
  );
}
