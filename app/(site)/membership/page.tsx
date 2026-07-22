import type { Metadata } from "next";
import PagePlaceholder from "@/components/site/PagePlaceholder";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "Join Silver, Gold or Platinum MaMoyo membership for monthly treatment credits, priority access, café rituals, suite benefits and member gatherings.",
};

export default function MembershipPage() {
  return (
    <PagePlaceholder
      eyebrow="The MaMoyo Circle"
      title="Belong to a more consistent way of living well"
      intro="The MaMoyo Circle creates a monthly rhythm of treatment, priority access, café rituals, selected suite privileges and member gatherings across Kabulonga and Twangale Resort."
      primary={{ label: "Apply to Join", href: "/contact" }}
    />
  );
}
