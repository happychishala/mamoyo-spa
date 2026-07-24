"use client";

import { Mail, MessageCircle } from "lucide-react";
import { emailInvoice, emailReceipt, logWhatsappSend } from "@/lib/actions";

/**
 * Send an invoice or receipt to the guest.
 *
 * Email goes through the provider configured in Notifications. WhatsApp opens a
 * chat with the message already written for a member of staff to send — see
 * lib/notify/README.md for why it is not automatic.
 */
export default function SendButtons({
  kind,
  id,
  reference,
  email,
  phone,
  whatsappBody,
}: {
  kind: "invoice" | "receipt";
  id: string;
  reference: string;
  email?: string;
  phone?: string;
  whatsappBody: string;
}) {
  const waHref = phone
    ? `https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(whatsappBody)}`
    : null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {email ? (
        <form action={kind === "invoice" ? emailInvoice : emailReceipt}>
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            title={`Email to ${email}`}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-mist-300 px-3 py-1.5 text-xs font-semibold text-mist-700 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            Email
          </button>
        </form>
      ) : (
        <span
          title="No email address on this record"
          className="inline-flex items-center gap-1.5 rounded-full border border-mist-200 px-3 py-1.5 text-xs font-semibold text-mist-400"
        >
          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
          No email
        </span>
      )}

      {waHref ? (
        <form action={logWhatsappSend}>
          <input type="hidden" name="kind" value={kind} />
          <input type="hidden" name="reference" value={reference} />
          <input type="hidden" name="recipient" value={phone} />
          <button
            type="submit"
            formTarget="_blank"
            onClick={() => window.open(waHref, "_blank", "noopener")}
            title={`Open WhatsApp to ${phone}`}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-mist-300 px-3 py-1.5 text-xs font-semibold text-mist-700 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            WhatsApp
          </button>
        </form>
      ) : (
        <span
          title="No phone number on this record"
          className="inline-flex items-center gap-1.5 rounded-full border border-mist-200 px-3 py-1.5 text-xs font-semibold text-mist-400"
        >
          <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
          No number
        </span>
      )}
    </div>
  );
}
