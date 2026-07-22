import type { Metadata } from "next";
import PagePlaceholder from "@/components/site/PagePlaceholder";

export const metadata: Metadata = {
  title: "Corporate Wellness",
  description:
    "MaMoyo creates corporate wellness programmes, executive care, employee vouchers, workplace activations, team days and Twangale retreats across Zambia.",
};

export default function CorporateWellnessPage() {
  return (
    <PagePlaceholder
      eyebrow="MaMoyo for Organisations"
      title="Wellbeing is an investment in the people carrying the work"
      intro="MaMoyo creates credible, well-delivered wellbeing programmes for banks, embassies, NGOs, mining companies, law firms, international organisations and corporate offices across Zambia."
      primary={{ label: "Request a Proposal", href: "/contact" }}
    />
  );
}
