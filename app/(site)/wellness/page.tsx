import type { Metadata } from "next";
import PagePlaceholder from "@/components/site/PagePlaceholder";

export const metadata: Metadata = {
  title: "Wellness",
  description:
    "Explore the MaMoyo approach to body care, skin, nourishment, movement, rest, membership and holistic wellbeing in everyday Lusaka life.",
};

export default function WellnessPage() {
  return (
    <PagePlaceholder
      eyebrow="The MaMoyo Philosophy"
      title="Wellness is the life built around the appointment"
      intro="A treatment matters. So do sleep, nourishment, movement, confidence, connection and the ability to notice what the body has been saying. MaMoyo exists to make wellbeing more complete, more personal and more possible within everyday Lusaka life."
      primary={{ label: "Book a Starting Point", href: "/booking" }}
    />
  );
}
