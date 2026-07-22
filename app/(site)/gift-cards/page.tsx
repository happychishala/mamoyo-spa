import type { Metadata } from "next";
import PagePlaceholder from "@/components/site/PagePlaceholder";

export const metadata: Metadata = {
  title: "Gift Cards",
  description:
    "Send a MaMoyo digital or presentation gift card for massage, facials, wellness experiences, café rituals or a direct MaMoyo Suites stay.",
};

export default function GiftCardsPage() {
  return (
    <PagePlaceholder
      eyebrow="The Gift of MaMoyo"
      title="Give time, care and a feeling that lasts"
      intro="A MaMoyo gift card lets the recipient choose what they need: a massage, facial, full experience, café ritual, direct suite stay or a contribution towards something larger."
      primary={{ label: "Enquire About Gift Cards", href: "/contact" }}
    />
  );
}
