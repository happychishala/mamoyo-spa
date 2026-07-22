import type { Metadata } from "next";
import PagePlaceholder from "@/components/site/PagePlaceholder";

export const metadata: Metadata = {
  title: "MaMoyo Kabulonga",
  description:
    "Visit MaMoyo Kabulonga for boutique spa care, professional facials, advanced skincare, café rituals and MaMoyo Suites on Reedbuck Road.",
};

export default function KabulongaPage() {
  return (
    <PagePlaceholder
      eyebrow="MaMoyo Kabulonga"
      title="A quieter way to move through the city"
      intro="At 16 Reedbuck Road, MaMoyo Kabulonga brings spa care, professional skincare, nourishing food, calm gardens and serviced suites into one personal city address."
      primary={{ label: "Book Kabulonga", href: "/booking" }}
    />
  );
}
