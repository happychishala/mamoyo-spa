import type { Metadata } from "next";
import PagePlaceholder from "@/components/site/PagePlaceholder";

export const metadata: Metadata = {
  title: "The Spa",
  description:
    "Explore MaMoyo spa care across Kabulonga and Twangale Resort — massage, facials, body rituals, advanced skincare and wellness experiences.",
};

export default function SpaOverviewPage() {
  return (
    <PagePlaceholder
      eyebrow="The Spa at MaMoyo"
      title="Treatment begins with listening"
      intro="Across Kabulonga and Twangale Resort, MaMoyo offers massage, body rituals, professional facials, advanced aesthetic care, hand and foot care and hydrotherapy — delivered with warmth, discretion and attention to detail."
      primary={{ label: "View Treatment Menu", href: "/treatments" }}
    />
  );
}
