import type { Metadata } from "next";
import PagePlaceholder from "@/components/site/PagePlaceholder";

export const metadata: Metadata = {
  title: "The MaMoyo Journal",
  description:
    "Grounded guidance from MaMoyo across wellness, skincare, nutrition, lifestyle, travel, hospitality and corporate wellbeing.",
};

export default function JournalPage() {
  return (
    <PagePlaceholder
      eyebrow="Useful Thinking for Living Well"
      title="Clear guidance, thoughtful stories and grounded expertise"
      intro="The Journal exists to help readers make better decisions, not to make ordinary life feel inadequate. It covers wellness, beauty, nutrition, lifestyle, skincare, travel, hospitality and corporate wellbeing."
      primary={{ label: "Explore MaMoyo", href: "/" }}
      secondary={{ label: "Contact Us", href: "/contact" }}
    />
  );
}
