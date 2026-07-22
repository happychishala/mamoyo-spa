import type { Metadata } from "next";
import PagePlaceholder from "@/components/site/PagePlaceholder";

export const metadata: Metadata = {
  title: "Experiences",
  description:
    "Discover Executive Reset, Couples Retreat, Bridal Glow, Girls Wellness Days, Mom To Be, full-day spa journeys and private events in Lusaka.",
};

export default function ExperiencesPage() {
  return (
    <PagePlaceholder
      eyebrow="MaMoyo Experiences"
      title="More than one treatment, arranged with intention"
      intro="Our experiences bring together massage, skin, body care, nourishment, tea, water and time in a sequence that makes sense. Choose according to the state you need, the people you are bringing and the time you can protect."
      primary={{ label: "Find Your Experience", href: "/booking" }}
    />
  );
}
