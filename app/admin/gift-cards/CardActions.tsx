"use client";

import Link from "next/link";
import { Mail, MessageCircle, Printer, CheckCheck, Ban } from "lucide-react";
import { emailGiftCard, redeemGiftCard, setGiftCardStatus, logWhatsappSend } from "@/lib/actions";

/** Send, print and redeem controls for one gift card. */
export default function CardActions({
  id,
  code,
  email,
  phone,
  whatsappBody,
  status,
  isExperience,
  balance,
}: {
  id: string;
  code: string;
  email?: string;
  phone?: string;
  whatsappBody: string;
  status: string;
  isExperience: boolean;
  balance: number;
}) {
  const waHref = phone
    ? `https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(whatsappBody)}`
    : null;

  const pill =
    "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-mist-300 px-3.5 py-2 text-xs font-semibold text-mist-700 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50";
  const muted =
    "inline-flex items-center gap-1.5 rounded-full border border-mist-200 px-3.5 py-2 text-xs font-semibold text-mist-400";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {email ? (
        <form action={emailGiftCard}>
          <input type="hidden" name="id" value={id} />
          <button type="submit" title={`Email to ${email}`} className={pill}>
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            Email
          </button>
        </form>
      ) : (
        <span className={muted} title="No email on this card">
          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
          No email
        </span>
      )}

      {waHref ? (
        <form action={logWhatsappSend}>
          <input type="hidden" name="kind" value="gift-card" />
          <input type="hidden" name="reference" value={code} />
          <input type="hidden" name="recipient" value={phone} />
          <button
            type="submit"
            onClick={() => window.open(waHref, "_blank", "noopener")}
            title={`Open WhatsApp to ${phone}`}
            className={pill}
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            WhatsApp
          </button>
        </form>
      ) : (
        <span className={muted} title="No number on this card">
          <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
          No number
        </span>
      )}

      <Link href={`/admin/gift-cards/${id}/print`} className={pill} title="Print presentation card">
        <Printer className="h-3.5 w-3.5" aria-hidden="true" />
        Print
      </Link>

      {status === "Active" && (
        <>
          <form action={redeemGiftCard} className="flex items-center gap-1.5">
            <input type="hidden" name="id" value={id} />
            {!isExperience && (
              <input
                type="number"
                name="amount"
                min={1}
                max={balance}
                defaultValue={balance}
                aria-label="Amount to redeem"
                className="w-24 rounded-full border border-mist-200 px-3 py-1.5 text-xs text-mist-950 focus:border-mist-500 focus:outline-none"
              />
            )}
            <button
              type="submit"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-emerald-700"
            >
              <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Redeem
            </button>
          </form>

          <form action={setGiftCardStatus}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="status" value="Void" />
            <button
              type="submit"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-rose-200 px-3.5 py-2 text-xs font-semibold text-rose-700 transition-colors duration-200 hover:border-rose-300 hover:bg-rose-50"
            >
              <Ban className="h-3.5 w-3.5" aria-hidden="true" />
              Void
            </button>
          </form>
        </>
      )}
    </div>
  );
}
