import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readDb, type GiftCard } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { todayISO, formatDate } from "@/lib/format";
import { expiryFrom } from "@/lib/gift-cards";
import { locationInfo } from "@/lib/content";
import PrintDocument from "@/components/admin/PrintDocument";
import GiftCardDesign, { GiftCardTerms } from "@/components/admin/GiftCardDesign";

export const metadata: Metadata = { title: "Print gift card" };
export const dynamic = "force-dynamic";

function sampleCard(): GiftCard {
  const issued = todayISO();
  return {
    id: "sample",
    code: "MM-7Q4K-2XPA",
    value: 1500,
    balance: 1500,
    recipientName: "Chanda Mwale",
    senderName: "Tambudzai",
    message: "Time for you, chosen with love. Happy birthday.",
    occasion: "Birthday",
    delivery: "Email",
    status: "Active",
    issuedOn: issued,
    expiresOn: expiryFrom(issued),
    location: "Kabulonga",
    redemptions: [],
    createdAt: new Date().toISOString(),
  };
}

export default async function GiftCardPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const { id } = await params;
  // "sample" prints the worked example from the Gift Cards page.
  const card = id === "sample" ? sampleCard() : (await readDb()).giftCards?.find((c) => c.id === id);
  if (!card) notFound();

  const branch = locationInfo[card.location ?? "Kabulonga"];

  return (
    <PrintDocument
      backHref="/admin/gift-cards"
      backLabel="Back to gift cards"
      location={card.location}
    >
      <div className="mt-6">
        <h1 className="font-serif text-2xl text-mist-950">
          Gift card {card.code}
          {id === "sample" && <span className="ml-2 text-sm font-normal text-mist-600">(sample)</span>}
        </h1>
        <p className="mt-1 text-sm text-mist-700">
          Cut along the outer edge. Prints two to a sheet on A4 at 100% scale.
        </p>

        {/* The card, at a fixed physical size so it prints consistently */}
        <div className="mt-8 gift-card-sheet">
          <div style={{ width: "152mm" }}>
            <GiftCardDesign card={card} />
          </div>

          {/* Reverse: terms and how to use it */}
          <div
            className="mt-6 rounded-[22px] border border-mist-200 p-6"
            style={{ width: "152mm" }}
          >
            <p className="font-serif text-lg text-cocoa-700">How to use this card</p>
            <p className="mt-2 text-xs leading-relaxed text-mist-700">
              Book at {branch.name} and give the code <strong>{card.code}</strong> when you book.
              Valid until {formatDate(card.expiresOn)}.
            </p>
            <div className="mt-4 border-t border-mist-100 pt-4">
              <GiftCardTerms card={card} />
            </div>
            <p className="mt-4 text-xs text-mist-600">
              {branch.name} · {branch.address} · {branch.phone} · info@mamoyospa.com
            </p>
          </div>
        </div>
      </div>
    </PrintDocument>
  );
}
