import type { Metadata } from "next";
import PagePlaceholder from "@/components/site/PagePlaceholder";

export const metadata: Metadata = {
  title: "MaMoyo at Twangale Resort",
  description:
    "Plan a MaMoyo spa day at Twangale Resort in Lilayi — massage, body rituals, pool time, couples experiences, groups and corporate retreats.",
};

export default function TwangalePage() {
  return (
    <PagePlaceholder
      eyebrow="MaMoyo at Twangale Resort"
      title="Let the day become larger than the appointment"
      intro="Within the gardens of Twangale Resort in Lilayi, MaMoyo unfolds at a slower, more expansive pace. Treatment rooms, pool time, open air and the landscape create space for a complete day rather than a single hour."
      primary={{ label: "Book Twangale", href: "/booking" }}
    />
  );
}
