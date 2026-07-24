import type { Metadata } from "next";
import { Gift, Printer } from "lucide-react";
import Link from "next/link";
import { readDb, LOCATIONS, type GiftCard } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { formatMoney, formatDate, todayISO } from "@/lib/format";
import { giftCardMessage } from "@/lib/notify";
import {
  GIFT_VALUES,
  GIFT_EXPERIENCES,
  GIFT_MESSAGES,
  GIFT_MIN_CUSTOM,
  giftValueLabel,
  expiryFrom,
} from "@/lib/gift-cards";
import { PageHeader, Card, NoAccess } from "@/components/admin/ui";
import GiftCardDesign, { GiftCardTerms } from "@/components/admin/GiftCardDesign";
import IssueForm from "./IssueForm";
import CardActions from "./CardActions";

export const metadata: Metadata = { title: "Gift Cards" };
export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-800",
  Redeemed: "bg-mist-100 text-mist-700",
  Expired: "bg-amber-100 text-amber-900",
  Void: "bg-rose-100 text-rose-800",
};

/** A worked example, so staff can see the design before issuing anything. */
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

export default async function GiftCardsPage() {
  const session = await getSession();
  if (session?.role === "Staff") return <NoAccess area="Gift Cards" />;

  const db = await readDb();
  const today = todayISO();
  const cards = [...(db.giftCards ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const active = cards.filter((c) => c.status === "Active");
  const outstanding = active.reduce((sum, c) => sum + c.balance, 0);
  const sample = sampleCard();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Gift Cards"
        description="Issue a MaMoyo gift card, send it by email or WhatsApp, print it as a presentation card, and redeem it when the guest visits."
      />

      {/* The design, shown as a worked example */}
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-semibold text-mist-950">The card</h2>
            <p className="mt-1 max-w-xl text-sm text-mist-700">
              This is exactly what a guest receives — the same design is used in the email, on
              WhatsApp and on the printed presentation card.
            </p>
          </div>
          <Link
            href="/admin/gift-cards/sample/print"
            className="inline-flex items-center gap-1.5 rounded-full border border-mist-300 px-4 py-2 text-xs font-semibold text-mist-700 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden="true" />
            Print this sample
          </Link>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
          <GiftCardDesign card={sample} />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-mist-600">
              Printed on the back
            </h3>
            <div className="mt-3">
              <GiftCardTerms card={sample} />
            </div>
            <p className="mt-5 rounded-xl bg-mist-50 px-4 py-3 text-xs leading-relaxed text-mist-700">
              Codes avoid characters that get misread over the phone — no O, 0, I, 1, S, B or 5.
              Cards run for six months from issue, and a value card keeps any unspent balance until
              it expires.
            </p>
          </div>
        </div>
      </Card>

      {/* Issue */}
      <Card className="p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mist-100 text-mist-600">
            <Gift className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-serif text-xl font-semibold text-mist-950">Issue a gift card</h2>
            <p className="mt-1 text-sm text-mist-700">
              A value from K{GIFT_MIN_CUSTOM}, or one of the named experiences.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <IssueForm
            values={GIFT_VALUES}
            experiences={GIFT_EXPERIENCES}
            prompts={GIFT_MESSAGES}
            minCustom={GIFT_MIN_CUSTOM}
            locations={LOCATIONS}
          />
        </div>
      </Card>

      {/* Issued cards */}
      <Card className="p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-serif text-xl font-semibold text-mist-950">
            {cards.length} {cards.length === 1 ? "card" : "cards"} issued
          </h2>
          <p className="text-sm text-mist-700">
            {active.length} active
            {outstanding > 0 && (
              <span className="font-semibold text-mist-900"> · {formatMoney(outstanding)} outstanding</span>
            )}
          </p>
        </div>

        {cards.length === 0 ? (
          <p className="mt-6 rounded-xl bg-mist-50 px-5 py-8 text-center text-sm text-mist-700">
            No cards issued yet. Use the form above — the design at the top shows what the guest gets.
          </p>
        ) : (
          <div className="mt-6 space-y-5">
            {cards.map((c) => {
              const expired = c.status === "Active" && c.expiresOn < today;
              return (
                <div
                  key={c.id}
                  className="grid gap-5 rounded-2xl border border-mist-200 p-5 lg:grid-cols-[minmax(0,300px)_1fr]"
                >
                  <GiftCardDesign card={c} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-semibold tracking-wider text-mist-950">
                        {c.code}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[expired ? "Expired" : c.status]
                        }`}
                      >
                        {expired ? "Expired" : c.status}
                      </span>
                      {c.corporateAccount && (
                        <span className="inline-flex rounded-full bg-mist-100 px-2.5 py-1 text-xs text-mist-700">
                          {c.corporateAccount}
                        </span>
                      )}
                    </div>

                    <dl className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
                      <div className="flex gap-2">
                        <dt className="text-mist-600">Gift</dt>
                        <dd className="font-medium text-mist-950">{giftValueLabel(c)}</dd>
                      </div>
                      {!c.experience && (
                        <div className="flex gap-2">
                          <dt className="text-mist-600">Balance</dt>
                          <dd className="font-medium text-mist-950">{formatMoney(c.balance)}</dd>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <dt className="text-mist-600">For</dt>
                        <dd className="text-mist-800">{c.recipientName}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-mist-600">From</dt>
                        <dd className="text-mist-800">{c.senderName}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-mist-600">Issued</dt>
                        <dd className="text-mist-800">{formatDate(c.issuedOn)}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-mist-600">Expires</dt>
                        <dd className="text-mist-800">{formatDate(c.expiresOn)}</dd>
                      </div>
                    </dl>

                    {c.redemptions.length > 0 && (
                      <ul className="mt-3 space-y-1 border-t border-mist-100 pt-3 text-xs text-mist-600">
                        {c.redemptions.map((r, i) => (
                          <li key={i}>
                            {formatDate(r.date)} — {r.amount > 0 ? formatMoney(r.amount) : "redeemed"}
                            {r.note ? ` · ${r.note}` : ""}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-4 border-t border-mist-100 pt-4">
                      <CardActions
                        id={c.id}
                        code={c.code}
                        email={c.recipientEmail}
                        phone={c.recipientPhone}
                        whatsappBody={giftCardMessage(c).text}
                        status={expired ? "Expired" : c.status}
                        isExperience={Boolean(c.experience)}
                        balance={c.balance}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
