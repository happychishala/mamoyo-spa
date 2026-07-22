import type { Metadata } from "next";
import PagePlaceholder from "@/components/site/PagePlaceholder";

export const metadata: Metadata = {
  title: "Spa Etiquette",
  description:
    "How to prepare for your MaMoyo visit — arrival times, what to tell us, and our booking and cancellation terms.",
};

export default function SpaEtiquettePage() {
  return (
    <PagePlaceholder
      eyebrow="Before Your Visit"
      title="A little preparation protects the quality of your time"
      intro="Please arrive 15 minutes before a standard treatment and 20 minutes before a first facial, advanced skin consultation, package or group booking. Tell us about allergies, pregnancy, recent procedures, injuries, medication and skin sensitivity so we can care for you safely."
      primary={{ label: "Book Now", href: "/booking" }}
    />
  );
}
