import Image from "next/image";
import type { GiftCard } from "@/lib/db";
import { formatMoney, formatDate } from "@/lib/format";
import { locationInfo } from "@/lib/content";

/**
 * The MaMoyo gift card.
 *
 * Every size is expressed in `cqw` — a percentage of the card's own width — so
 * the whole design scales as one piece and always fits its frame, whether it is
 * a 300px preview in a list, a 420px sample, or 152mm on paper. Fixed font sizes
 * were tried first and overflowed the card as soon as a dedication ran long.
 *
 * Colours are the brand kit's: the teal field with a brown wash, matching how
 * the logo itself is set.
 */
export default function GiftCardDesign({
  card,
  className = "",
}: {
  card: GiftCard;
  className?: string;
}) {
  const branch = locationInfo[card.location ?? "Kabulonga"];
  const isExperience = Boolean(card.experience);

  return (
    <div
      className={`gift-card relative isolate overflow-hidden text-white shadow-lift ${className}`}
      style={{
        containerType: "inline-size",
        aspectRatio: "1.75 / 1",
        borderRadius: "4cqw",
        background:
          "linear-gradient(135deg, #1CA3B1 0%, #178995 45%, #166F7A 78%, #175A63 100%)",
      }}
    >
      {/* Light bloom top-right, warm brown wash bottom-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 90% at 88% 8%, rgba(255,255,255,.26) 0%, rgba(255,255,255,0) 55%), radial-gradient(85% 75% at 2% 100%, rgba(96,62,38,.40) 0%, rgba(96,62,38,0) 62%)",
        }}
      />
      {/* Wave motif from the website */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 w-full"
        style={{ height: "26cqw" }}
        fill="rgba(255,255,255,.09)"
      >
        <path d="M0,56 C240,110 480,10 720,56 C960,102 1200,16 1440,56 L1440,120 L0,120 Z" />
      </svg>

      <div
        className="flex h-full flex-col justify-between"
        style={{ padding: "5cqw 5.5cqw" }}
      >
        {/* Head: wordmark + what it is worth */}
        <div className="flex items-start justify-between" style={{ gap: "3cqw" }}>
          <div className="min-w-0">
            <Image
              src="/logo-mamoyo-white.png"
              alt="MaMoyo"
              width={1200}
              height={368}
              className="h-auto"
              style={{ width: "26cqw" }}
              priority
            />
            <p
              className="font-semibold uppercase text-white/75"
              style={{ fontSize: "2.1cqw", letterSpacing: "0.28em", marginTop: "1.6cqw" }}
            >
              Gift Card
            </p>
          </div>

          <div className="shrink-0 text-right" style={{ maxWidth: "44cqw" }}>
            <p
              className="font-semibold uppercase text-white/65"
              style={{ fontSize: "2cqw", letterSpacing: "0.2em" }}
            >
              {isExperience ? "Experience" : "Value"}
            </p>
            <p
              className="font-serif leading-none"
              style={{ fontSize: isExperience ? "4.4cqw" : "9cqw", marginTop: "0.8cqw" }}
            >
              {isExperience ? card.experience : formatMoney(card.value)}
            </p>
          </div>
        </div>

        {/* Middle: the dedication */}
        <div className="min-w-0" style={{ marginTop: "2cqw" }}>
          <p
            className="font-semibold uppercase text-white/65"
            style={{ fontSize: "2cqw", letterSpacing: "0.2em" }}
          >
            For
          </p>
          <p
            className="font-brush leading-tight text-white"
            style={{ fontSize: "7cqw", marginTop: "0.4cqw" }}
          >
            {card.recipientName}
          </p>
          {card.message && (
            <p
              className="italic leading-snug text-white/90"
              style={{
                fontSize: "2.5cqw",
                marginTop: "1.4cqw",
                maxWidth: "76%",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              &ldquo;{card.message}&rdquo;
            </p>
          )}
          {card.senderName && (
            <p className="text-white/75" style={{ fontSize: "2.3cqw", marginTop: "1.2cqw" }}>
              From {card.senderName}
            </p>
          )}
        </div>

        {/* Foot: code, expiry, branch */}
        <div
          className="flex items-end justify-between"
          style={{ gap: "3cqw", marginTop: "2cqw" }}
        >
          <div className="min-w-0">
            <p
              className="font-semibold uppercase text-white/60"
              style={{ fontSize: "1.9cqw", letterSpacing: "0.2em" }}
            >
              Card code
            </p>
            <p
              className="font-mono font-semibold text-white"
              style={{ fontSize: "3.4cqw", letterSpacing: "0.12em", marginTop: "0.4cqw" }}
            >
              {card.code}
            </p>
          </div>
          <div
            className="shrink-0 text-right leading-snug text-white/75"
            style={{ fontSize: "1.95cqw" }}
          >
            <p>Valid until {formatDate(card.expiresOn)}</p>
            <p>
              {branch.name} &middot; {branch.phone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The terms that accompany the card, per the handoff deck. */
export function GiftCardTerms({ card }: { card: GiftCard }) {
  return (
    <ul className="space-y-1.5 text-xs leading-relaxed text-mist-700">
      <li>
        Valid for six months from issue &mdash; until {formatDate(card.expiresOn)}. Not exchangeable
        for cash.
      </li>
      <li>
        {card.experience
          ? "Redeemable against the named experience. Any upgrade is payable by the guest."
          : "Any remaining value stays on the card until it expires."}
      </li>
      <li>Standard booking and cancellation terms apply. Present the code when booking.</li>
      <li>Suite redemption is available on direct MaMoyo bookings, subject to availability.</li>
    </ul>
  );
}
