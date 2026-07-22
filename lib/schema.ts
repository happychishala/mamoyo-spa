import { SITE_URL } from "./site";
import { contactInfo, locationInfo } from "./content";
import type { Location } from "./db";

const abs = (p: string) => `${SITE_URL}${p}`;

/** Machine-readable hours, kept beside the human-readable ones in content.ts. */
const openingHours: Record<Location, { days: string[]; opens: string; closes: string }[]> = {
  Kabulonga: [
    { days: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "09:00", closes: "18:00" },
    { days: ["Sunday"], opens: "12:00", closes: "18:00" },
  ],
  Twangale: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "21:00" },
    { days: ["Saturday"], opens: "08:00", closes: "21:00" },
    { days: ["Sunday"], opens: "10:00", closes: "20:00" },
  ],
};

const branchPath: Record<Location, string> = {
  Kabulonga: "/spa/kabulonga",
  Twangale: "/spa/twangale",
};

const branchImage: Record<Location, string> = {
  Kabulonga: "/photos/interior.jpg",
  Twangale: "/photos/hot-stone.jpg",
};

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "MaMoyo",
    url: SITE_URL,
    logo: abs("/logo-mamoyo.png"),
    email: contactInfo.email,
    telephone: locationInfo.Kabulonga.phone,
    sameAs: [contactInfo.instagramUrl],
    address: {
      "@type": "PostalAddress",
      streetAddress: "16 Reedbuck Road",
      addressLocality: "Lusaka",
      addressRegion: "Kabulonga",
      addressCountry: "ZM",
    },
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "MaMoyo",
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
  };
}

export function localBusinessSchema(key: Location) {
  const b = locationInfo[key];
  const [streetAddress] = b.address.split(",");
  return {
    "@type": "DaySpa",
    "@id": `${SITE_URL}${branchPath[key]}#localbusiness`,
    name: b.name,
    description: b.blurb,
    url: abs(branchPath[key]),
    image: abs(branchImage[key]),
    telephone: b.phone,
    email: contactInfo.email,
    priceRange: "$$",
    currenciesAccepted: "ZMW",
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    address: {
      "@type": "PostalAddress",
      streetAddress: streetAddress.trim(),
      addressLocality: "Lusaka",
      addressCountry: "ZM",
    },
    openingHoursSpecification: openingHours[key].map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
  };
}

export function faqPageSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Site-wide graph for the home page. */
export function homeGraphSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      websiteSchema(),
      localBusinessSchema("Kabulonga"),
      localBusinessSchema("Twangale"),
    ],
  };
}

/** Single-branch graph for a location page. */
export function branchSchema(key: Location) {
  return { "@context": "https://schema.org", ...localBusinessSchema(key) };
}
