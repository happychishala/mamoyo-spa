import type { GiftCard, DB } from "./db";

/** Values the deck offers, plus a custom amount from K300. */
export const GIFT_VALUES = [500, 1000, 1500, 2500, 5000] as const;
export const GIFT_MIN_CUSTOM = 300;

/** Named experiences that can be gifted instead of a value. */
export const GIFT_EXPERIENCES = [
  "MaMoyo Signature Massage",
  "Executive Reset",
  "Mom To Be",
  "Couples Retreat",
  "Full Day Escape",
  "Café ritual",
] as const;

/** The deck's message prompts, offered as one-click dedications. */
export const GIFT_MESSAGES: { occasion: string; message: string }[] = [
  { occasion: "Birthday", message: "Time for you, chosen with love. Happy birthday." },
  { occasion: "Thank you", message: "Thank you for everything you carry and everything you give." },
  { occasion: "New mother", message: "For your body, your rest and a little time that belongs only to you." },
  { occasion: "Wedding", message: "A beautiful beginning deserves time to pause within it." },
  { occasion: "No occasion", message: "You do not need a reason to be cared for." },
];

/**
 * Card codes avoid characters that get misread when someone reads a code down
 * the phone or copies it off a printed card: no O/0, I/1, S/5, B/8.
 */
const ALPHABET = "ACDEFGHJKLMNPQRTUVWXYZ2346789";

function block(len: number): string {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

/** Generates a code unique within the database, e.g. "MM-7Q4K-2XPA". */
export function generateCode(db: DB): string {
  for (let attempt = 0; attempt < 20; attempt++) {
    const code = `MM-${block(4)}-${block(4)}`;
    if (!db.giftCards?.some((c) => c.code === code)) return code;
  }
  // Astronomically unlikely; fall back to something certainly unique.
  return `MM-${block(4)}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
}

/** Six months from the issue date, per the deck's terms. */
export function expiryFrom(issuedOn: string): string {
  const d = new Date(`${issuedOn}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + 6);
  return d.toISOString().slice(0, 10);
}

/** What the card is worth, described for a human. */
export function giftValueLabel(card: Pick<GiftCard, "value" | "experience">): string {
  if (card.experience) return card.experience;
  return new Intl.NumberFormat("en-ZM", {
    style: "currency",
    currency: "ZMW",
    maximumFractionDigits: 0,
  })
    .format(card.value)
    .replace("ZMW", "K")
    .replace(/\s/g, "");
}

/** True when the card can still be used today. */
export function isRedeemable(card: GiftCard, today: string): boolean {
  if (card.status !== "Active") return false;
  if (card.expiresOn < today) return false;
  return card.experience ? true : card.balance > 0;
}
