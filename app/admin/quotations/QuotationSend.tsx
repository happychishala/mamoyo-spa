"use client";

import { Mail, MessageCircle } from "lucide-react";
import { emailQuotation, logWhatsappSend } from "@/lib/actions";

/**
 * Send a quotation to the client. Email attaches the PDF; WhatsApp opens a chat
 * with the message (including a link to the PDF) ready for staff to send.
 */
export default function QuotationSend({
  id,
  number,
  email,
  phone,
  whatsappBody,
}: {
  id: string;
  number: string;
  email?: string;
  phone?: string;
  whatsappBody: string;
}) {
  const waHref = phone
    ? `https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(whatsappBody)}`
    : null;

  return (
    <div className="flex items-center gap-1.5">
      {email && (
        <form action={emailQuotation}>
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            title={`Email quotation to ${email}`}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-mist-300 px-2.5 py-1.5 text-xs font-semibold text-mist-700 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            Email
          </button>
        </form>
      )}
      {waHref && (
        <form action={logWhatsappSend}>
          <input type="hidden" name="kind" value="quotation" />
          <input type="hidden" name="reference" value={number} />
          <input type="hidden" name="recipient" value={phone} />
          <button
            type="submit"
            onClick={() => window.open(waHref, "_blank", "noopener")}
            title={`WhatsApp quotation to ${phone}`}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-mist-300 px-2.5 py-1.5 text-xs font-semibold text-mist-700 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            WhatsApp
          </button>
        </form>
      )}
    </div>
  );
}
