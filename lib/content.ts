import type { Location } from "./db";

export interface Service {
  name: string;
  description: string;
  durationMin: number;
  price: number;
  icon: "waves" | "hand" | "stone" | "flower" | "leaf" | "sparkles" | "steam" | "hearts";
}

// Signature treatments shown on the home page — prices from the official menu.
export const services: Service[] = [
  {
    name: "MaMoyo Signature Massage",
    description: "A traditional African rhythmic massage incorporating rungu, bamboo sticks and hot towel compress.",
    durationMin: 60,
    price: 750,
    icon: "waves",
  },
  {
    name: "Hot Stone Massage",
    description: "A relaxing massage with hot basalt stones to stimulate blood flow and leave a lasting warmth.",
    durationMin: 60,
    price: 750,
    icon: "stone",
  },
  {
    name: "Swedish Massage",
    description: "The original massage — stimulates circulation while releasing muscle tension, stroke by stroke.",
    durationMin: 60,
    price: 650,
    icon: "hand",
  },
  {
    name: "MaMoyo Touch",
    description: "An ultra-relaxing African rhythmic massage with cupping therapy to release stubborn stress knots.",
    durationMin: 60,
    price: 750,
    icon: "leaf",
  },
  {
    name: "Body Envelopment",
    description: "Anti-stress, firming and detoxing: full body polish, full body wrap, then a back, neck and shoulder massage.",
    durationMin: 90,
    price: 850,
    icon: "sparkles",
  },
  {
    name: "Deep Cleanse Facial",
    description: "A deep, glow-restoring cleanse — choose Dermalogica, Esse or Sknlogic products.",
    durationMin: 60,
    price: 650,
    icon: "flower",
  },
];

// --- Full spa menu (official MaMoyo Spa price list) ---

export interface PricedOption {
  label: string; // "60 min", "Dermalogica", "per person"…
  price: number;
  durationMin?: number;
}

export interface MenuTreatment {
  name: string;
  description?: string;
  note?: string;
  options: PricedOption[];
}

export interface SpaMenuSection {
  id: string;
  title: string;
  intro?: string;
  treatments: MenuTreatment[];
}

export const spaMenu: SpaMenuSection[] = [
  {
    id: "body",
    title: "All About Body",
    intro: "Massages and body rituals, from a 30-minute reset to a 90-minute journey.",
    treatments: [
      { name: "MaMoyo Signature Massage", description: "Traditional African rhythmic massage incorporating rungu, bamboo sticks and hot towel compress.", options: [{ label: "60 min", price: 750, durationMin: 60 }, { label: "90 min", price: 900, durationMin: 90 }] },
      { name: "MaMoyo Touch", description: "An ultra-relaxing African rhythmic massage incorporating cupping therapy to relieve stress knots.", options: [{ label: "60 min", price: 750, durationMin: 60 }] },
      { name: "Body Envelopment", description: "Anti-stress, firming, detoxing: full body polish, full body wrap, then a back, neck and shoulder massage.", options: [{ label: "90 min", price: 850, durationMin: 90 }] },
      { name: "Life Saving Back Treatment", description: "Back exfoliation followed by a creamy back mask, finished with a back, neck and shoulder massage.", options: [{ label: "60 min", price: 750, durationMin: 60 }] },
      { name: "Swedish Massage", description: "The original massage — stimulates blood circulation whilst releasing muscle tension.", options: [{ label: "60 min", price: 650, durationMin: 60 }, { label: "90 min", price: 750, durationMin: 90 }] },
      { name: "Deep Tissue Massage", description: "The power of arnica and peppermint oil to reduce muscle pain.", options: [{ label: "60 min", price: 680, durationMin: 60 }, { label: "90 min", price: 790, durationMin: 90 }] },
      { name: "Hot Stone Massage", description: "Relaxing massage with hot basalt stones to stimulate blood flow and leave a lasting warmth.", options: [{ label: "60 min", price: 750, durationMin: 60 }, { label: "90 min", price: 850, durationMin: 90 }] },
      { name: "Aromatherapy Massage", description: "Choose one of our therapeutic oils to work on a specific condition.", options: [{ label: "60 min", price: 650, durationMin: 60 }] },
      { name: "Back, Neck & Shoulder Massage", description: "A classic treatment focusing on the back and shoulders to work out specific tension.", note: "Add hot stones or bamboo sticks K120", options: [{ label: "30 min", price: 450, durationMin: 30 }, { label: "45 min", price: 500, durationMin: 45 }] },
      { name: "Pregnancy Massage", options: [{ label: "60 min", price: 750, durationMin: 60 }] },
      { name: "Stress Relief Foot Massage", options: [{ label: "30 min", price: 350, durationMin: 30 }] },
      { name: "Scalp Massage", options: [{ label: "30 min", price: 300, durationMin: 30 }] },
    ],
  },
  {
    id: "skin",
    title: "Caring For Your Skin",
    intro: "Facials the MaMoyo way — choose your product house: Dermalogica, Esse or Sknlogic.",
    treatments: [
      { name: "Express Radiant Facial", options: [{ label: "Sknlogic · 30 min", price: 450, durationMin: 30 }] },
      { name: "Deep Cleanse Facial", options: [{ label: "Dermalogica · 60 min", price: 850, durationMin: 60 }, { label: "Esse · 60 min", price: 750, durationMin: 60 }, { label: "Sknlogic · 60 min", price: 650, durationMin: 60 }] },
      { name: "Ultra-calming Hydrating Facial", options: [{ label: "Dermalogica · 60 min", price: 875, durationMin: 60 }, { label: "Esse · 60 min", price: 825, durationMin: 60 }] },
      { name: "Energizing Teen Facial", options: [{ label: "Sknlogic · 45 min", price: 450, durationMin: 45 }] },
      { name: "Regenerating Anti-aging Facial", options: [{ label: "Dermalogica · 75 min", price: 1200, durationMin: 75 }, { label: "Esse · 75 min", price: 980, durationMin: 75 }] },
      { name: "Spa Facial Peel", options: [{ label: "Dermalogica", price: 1500 }, { label: "Sknlogic", price: 850 }] },
      { name: "Eye Treatment", options: [{ label: "Dermalogica", price: 350 }, { label: "Sknlogic", price: 250 }] },
    ],
  },
  {
    id: "hands-feet",
    title: "Hands & Feet",
    intro: "Meticulous care for hands and feet, finished exactly how you like it.",
    treatments: [
      { name: "Classic Manicure", options: [{ label: "45 min", price: 250, durationMin: 45 }] },
      { name: "Gel Manicure", options: [{ label: "60 min", price: 400, durationMin: 60 }] },
      { name: "MaMoyo Medical Manicure", note: "K500 with gel paint", options: [{ label: "60 min", price: 400, durationMin: 60 }] },
      { name: "Classic Pedicure", options: [{ label: "60 min", price: 350, durationMin: 60 }] },
      { name: "Gel Pedicure", options: [{ label: "90 min", price: 450, durationMin: 90 }] },
      { name: "MaMoyo Medical Pedicure", note: "K550 with gel paint", options: [{ label: "75 min", price: 450, durationMin: 75 }] },
      { name: "File & Paint", note: "K150 with gel paint · K100 with normal paint", options: [{ label: "30 min", price: 150, durationMin: 30 }] },
      { name: "Acrylic", note: "Plus K20 per nail for nail art", options: [{ label: "90 min", price: 350, durationMin: 90 }] },
      { name: "Acrylic Fill", options: [{ label: "45 min", price: 200, durationMin: 45 }] },
      { name: "Rubbergel", note: "Plus K50 per nail for nail art", options: [{ label: "90 min", price: 400, durationMin: 90 }] },
      { name: "Gel Application", options: [{ label: "30 min", price: 100, durationMin: 30 }] },
      { name: "Gel Soak Off", options: [{ label: "30 min", price: 150, durationMin: 30 }] },
      { name: "Acrylic Soak Off", note: "Price differs for nails not done by MaMoyo", options: [{ label: "60 min", price: 200, durationMin: 60 }] },
    ],
  },
  {
    id: "final-touches",
    title: "Final Touches",
    intro: "Waxing, threading and tinting — the details that finish the look.",
    treatments: [
      { name: "Waxing", options: [
        { label: "Lip", price: 70 }, { label: "Neck", price: 90 }, { label: "Brow", price: 100 }, { label: "Cheek", price: 100 }, { label: "Chin", price: 100 },
        { label: "Underarm", price: 150 }, { label: "Stomach", price: 170 }, { label: "Half arm", price: 170 }, { label: "Full arm", price: 230 },
        { label: "Bikini", price: 255 }, { label: "Half leg", price: 290 }, { label: "Back", price: 350 }, { label: "¾ leg", price: 350 },
        { label: "Full leg", price: 400 }, { label: "Brazilian", price: 400 }, { label: "Hollywood", price: 460 },
      ] },
      { name: "Threading", options: [{ label: "Brows", price: 100 }, { label: "Chin, cheeks or lip", price: 350 }] },
      { name: "Tinting", options: [{ label: "Eyelash", price: 100 }, { label: "Brow", price: 100 }, { label: "Lash & brow", price: 180 }] },
    ],
  },
  {
    id: "wellness",
    title: "Water & Steam",
    intro: "Warm water, eucalyptus steam and a quiet pool — book alongside any treatment.",
    treatments: [
      { name: "Jacuzzi", options: [{ label: "30 & 60 min", price: 300, durationMin: 60 }] },
      { name: "Steam Room", options: [{ label: "20 min", price: 200, durationMin: 20 }] },
      { name: "Swimming", options: [{ label: "60 min", price: 150, durationMin: 60 }] },
    ],
  },
  {
    id: "packages",
    title: "Packages",
    intro: "Half days, full days and celebrations — create your own package and get 5% off for groups of 4+.",
    treatments: [
      { name: "Zorora Pano", description: "Face and body in one: full body polish, soya body wrap, steam therapy, full body massage, express facial and a classic pedicure.", options: [{ label: "2 hrs 30 min", price: 2250, durationMin: 150 }] },
      { name: "Mom-To-Be Package", description: "Gentle exfoliation, soothing pregnancy massage and foot massage, then a well-balanced poolside lunch.", options: [{ label: "3 hrs", price: 1700, durationMin: 180 }] },
      { name: "Half Day Package", description: "60-minute Swedish massage, 60-minute facial, classic manicure and pedicure, swimming pool access, lunch and a smoothie.", note: "5% discount for groups of 3+", options: [{ label: "4 hrs · per person", price: 2100, durationMin: 240 }] },
      { name: "Full Day Package", description: "Full body exfoliation and wrap, steam therapy, 60-minute Swedish massage, 60-minute facial, lunch, then a classic manicure and pedicure.", note: "5% discount for groups of 3+", options: [{ label: "6 hrs · per person", price: 2850, durationMin: 360 }] },
      { name: "Men's Executive Package", description: "Purifying back treatment, deep tissue massage and a gent's facial to rejuvenate and restore the skin.", options: [{ label: "3.5 hrs", price: 1700, durationMin: 210 }] },
      { name: "Teen Package", description: "Fun-packed: teen facial, manicure, pedicure, swimming, steam therapy, jacuzzi, food and mocktails.", note: "7.5% discount for groups of 4+", options: [{ label: "3 hrs · per person", price: 1200, durationMin: 180 }] },
      { name: "Blissful", description: "Back, neck & shoulder massage plus 30 minutes in the jacuzzi.", options: [{ label: "75 min", price: 550, durationMin: 75 }] },
    ],
  },
  {
    id: "weddings",
    title: "Wedding Packages",
    intro: "Relax, relieve tension and refresh the bridal party in the run-up to the big day.",
    treatments: [
      { name: "For The Bride", description: "Full body scrub, Swedish massage, glowing facial, manicure, pedicure, 30 minutes of jacuzzi, steam room and swimming pool, canapés and mimosas.", options: [{ label: "4 hrs", price: 2500, durationMin: 240 }] },
      { name: "For The Bridesmaids", description: "Classic manicure, classic pedicure, 30 minutes jacuzzi, steam therapy, swimming, canapés and mimosas.", options: [{ label: "4 hrs · per person", price: 850, durationMin: 240 }] },
      { name: "For The Groom", description: "Deep tissue massage, men's facial, steam therapy, 30 minutes jacuzzi, food and drinks.", options: [{ label: "3 hrs · per person", price: 1700, durationMin: 180 }] },
      { name: "For The Groomsmen", description: "Full body massage, steam therapy, jacuzzi, swimming, platter and drinks.", options: [{ label: "3 hrs · per person", price: 1100, durationMin: 180 }] },
      { name: "Post-Wedding Bride & Groom Relaxation", description: "Steam therapy, then a hot stone Swedish massage and relaxing facial for two in our romantic outdoor treatment area overlooking the pond — with sparkling wine.", options: [{ label: "3 hrs · per couple", price: 3500, durationMin: 180 }] },
    ],
  },
];

/** Composed bookable name for a treatment option, e.g. "Swedish Massage — 90 min". */
export function bookableName(treatment: string, option: PricedOption): string {
  return `${treatment} — ${option.label}`;
}

export interface BookableService {
  name: string;
  price: number;
  durationMin: number;
  section: string;
}

/** Flat list of everything a guest can book, grouped by menu section. */
export const bookableServices: BookableService[] = spaMenu.flatMap((section) =>
  section.treatments.flatMap((t) =>
    t.options.map((o) => ({
      name: bookableName(t.name, o),
      price: o.price,
      durationMin: o.durationMin ?? 60,
      section: section.title,
    }))
  )
);

export const bookablePriceMap: Record<string, { price: number; durationMin: number }> =
  Object.fromEntries(bookableServices.map((s) => [s.name, { price: s.price, durationMin: s.durationMin }]));

export interface MenuItem {
  name: string;
  description: string;
  price: number;
}

export interface MenuSection {
  title: string;
  note: string;
  items: MenuItem[];
}

export const cafeMenu: MenuSection[] = [
  {
    title: "Fresh & Cold-Pressed",
    note: "Juiced to order every morning",
    items: [
      { name: "Sunrise Glow", description: "Orange, carrot, ginger & turmeric", price: 75 },
      { name: "Garden Green", description: "Cucumber, kale, apple & mint", price: 80 },
      { name: "Baobab Smoothie", description: "Baobab, banana, honey & oat milk", price: 90 },
      { name: "Hibiscus Cooler", description: "Iced hibiscus, lime & raw honey", price: 65 },
    ],
  },
  {
    title: "Teas & Coffee",
    note: "Zambian beans, roasted in Lusaka",
    items: [
      { name: "MaMoyo Herbal Blend", description: "Lemongrass, rooibos & wild mint", price: 55 },
      { name: "Flat White", description: "Double shot, silky micro-foam", price: 60 },
      { name: "Honey Lavender Latte", description: "Espresso, steamed milk & lavender", price: 70 },
      { name: "Chai of the Day", description: "Slow-simmered with fresh spices", price: 60 },
    ],
  },
  {
    title: "Light & Nourishing",
    note: "Kitchen open 08:00 – 16:00",
    items: [
      { name: "Retreat Bowl", description: "Quinoa, roasted veg, avocado & seeds", price: 145 },
      { name: "Chicken & Mango Wrap", description: "Grilled chicken, mango salsa, greens", price: 130 },
      { name: "Village Salad", description: "Heirloom tomato, feta & pumpkin seeds", price: 115 },
      { name: "Soup of the Day", description: "Always seasonal, served with sourdough", price: 95 },
    ],
  },
  {
    title: "Sweet Endings",
    note: "Baked in-house daily",
    items: [
      { name: "Honey Oat Cake", description: "With mascarpone & citrus zest", price: 85 },
      { name: "Dark Chocolate Torte", description: "Flourless, with berry compote", price: 95 },
      { name: "Fruit & Yoghurt Parfait", description: "Seasonal fruit, granola & local yoghurt", price: 75 },
    ],
  },
];

export interface Suite {
  id: string;
  name: string;
  tagline: string;
  description: string;
  ratePerNight: number;
  sleeps: number;
  sizeSqm: number;
  image: string;
  imageAlt: string;
  amenities: string[];
}

const studioDescription =
  "A generous open-plan studio: king bed, lounge with velvet armchairs, dining table, full kitchenette and en-suite bathroom — with the spa, MaMoyo Café, pool and gardens just downstairs.";

const studioAmenities = [
  "King bed",
  "Kitchenette",
  "En-suite bathroom",
  "Pool access",
  "Fibre Wi-Fi",
  "Smart TV",
  "Daily housekeeping",
];

// All four studios are identical; two on the ground floor, two upstairs.
export const STUDIO_RATE = 1400;

export const suites: Suite[] = [
  {
    id: "studio-1",
    name: "Studio One",
    tagline: "Ground floor",
    description: studioDescription,
    ratePerNight: STUDIO_RATE,
    sleeps: 2,
    sizeSqm: 35,
    image: "/photos/suites/studio-7.jpg",
    imageAlt: "Studio One — king bed, lounge chairs and kitchenette",
    amenities: [...studioAmenities, "Step-free access"],
  },
  {
    id: "studio-2",
    name: "Studio Two",
    tagline: "Ground floor",
    description: studioDescription,
    ratePerNight: STUDIO_RATE,
    sleeps: 2,
    sizeSqm: 35,
    image: "/photos/suites/studio-1.jpg",
    imageAlt: "Studio Two — open-plan studio with kitchenette and lounge",
    amenities: [...studioAmenities, "Step-free access"],
  },
  {
    id: "studio-3",
    name: "Studio Three",
    tagline: "Upper floor",
    description: studioDescription,
    ratePerNight: STUDIO_RATE,
    sleeps: 2,
    sizeSqm: 35,
    image: "/photos/suites/studio-3.jpg",
    imageAlt: "Studio Three — king bed, dining corner and kitchenette",
    amenities: studioAmenities,
  },
  {
    id: "studio-4",
    name: "Studio Four",
    tagline: "Upper floor",
    description: studioDescription,
    ratePerNight: STUDIO_RATE,
    sleeps: 2,
    sizeSqm: 35,
    image: "/photos/suites/studio-6.jpg",
    imageAlt: "Studio Four — fresh towels laid out at the foot of the bed",
    amenities: studioAmenities,
  },
];

export const contactInfo = {
  email: "info@mamoyospa.com",
  instagram: "@real_mamoyo",
  instagramUrl: "https://instagram.com/real_mamoyo",
  // Kabulonga is the primary public contact; per-branch details live in locationInfo.
  address: "16 Reedbuck Road, Kabulonga, Lusaka",
  phone: "+260 967 245833",
  hours: [
    { days: "Monday", time: "Closed" },
    { days: "Tuesday – Saturday", time: "09:00 – 18:00" },
    { days: "Sunday", time: "12:00 – 18:00" },
  ],
};

/** Per-branch details for the site, invoices, receipts and directions. */
export const locationInfo: Record<
  Location,
  {
    name: string;
    address: string;
    phone: string;
    phoneLabel: string;
    hours: { days: string; time: string }[];
    blurb: string;
  }
> = {
  Kabulonga: {
    name: "MaMoyo Kabulonga",
    address: "16 Reedbuck Road, Kabulonga, Lusaka, Zambia",
    phone: "+260 967 245833",
    phoneLabel: "Telephone & WhatsApp",
    hours: [
      { days: "Monday", time: "Closed" },
      { days: "Tuesday – Saturday", time: "09:00 – 18:00" },
      { days: "Sunday", time: "12:00 – 18:00" },
    ],
    blurb: "Boutique spa, professional skincare, MaMoyo Café and MaMoyo Suites.",
  },
  Twangale: {
    name: "MaMoyo at Twangale Resort",
    address: "Plot PP, Mukwa Drive, Lilayi, Lusaka, Zambia",
    phone: "+260 765 022713",
    phoneLabel: "Spa bookings",
    hours: [
      { days: "Monday – Friday", time: "10:00 – 21:00" },
      { days: "Saturday", time: "08:00 – 21:00" },
      { days: "Sunday & public holidays", time: "10:00 – 20:00" },
    ],
    blurb: "Garden spa, longer treatment days, hydrotherapy, couples, groups and corporate retreats.",
  },
};
