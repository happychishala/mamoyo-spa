import type { Booking, Invoice, Receipt, Location, GiftCard, Quotation, StayBooking } from "../db";
import { invoiceTotal, invoicePaid, invoiceBalance } from "../db";
import { locationInfo } from "../content";
import { formatMoney, formatAmount, formatDate } from "../format";
import { giftValueLabel } from "../gift-cards";
import { docUrl, type DocType } from "../doc-link";

/** A plain-text line pointing at the signed PDF (used for WhatsApp + email text). */
function pdfTextLine(type: DocType, id: string, label: string): string {
  return `${label} (PDF): ${docUrl(type, id)}`;
}

/** A branded button linking to the signed PDF, for the HTML email. */
function pdfButtonHtml(type: DocType, id: string, label: string): string {
  return `<p style="margin:18px 0 0;"><a href="${docUrl(type, id)}" style="display:inline-block;background:${BRAND_BROWN};color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;padding:11px 20px;border-radius:999px;">${label}</a></p>`;
}

/** A message rendered for both channels: email gets subject + html, WhatsApp gets text. */
export interface Message {
  subject: string;
  text: string;
  html: string;
}

const BRAND_TEAL = "#178995";
const BRAND_BROWN = "#603E26";

function branch(location?: Location) {
  return locationInfo[location ?? "Kabulonga"];
}

function shell(heading: string, bodyHtml: string, location?: Location): string {
  const b = branch(location);
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f1fafb;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#175a63;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1fafb;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #bde6eb;">
        <tr><td style="background:${BRAND_TEAL};padding:20px 28px;">
          <span style="color:#ffffff;font-size:20px;letter-spacing:.06em;">MaMoyo</span>
        </td></tr>
        <tr><td style="padding:28px;">
          <h1 style="margin:0 0 16px;font-size:20px;color:${BRAND_BROWN};font-weight:600;">${heading}</h1>
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:18px 28px;background:#f1fafb;border-top:1px solid #dcf2f5;font-size:12px;line-height:1.6;color:#166f7a;">
          <strong>${b.name}</strong><br>
          ${b.address}<br>
          ${b.phone} &middot; info@mamoyospa.com
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function itemsTableHtml(items: { description: string; qty: number; unitPrice: number }[], currency?: "USD"): string {
  const rows = items
    .map(
      (i) => `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #dcf2f5;font-size:14px;">${i.description}${
          i.qty > 1 ? ` <span style="color:#54b8c5;">&times;${i.qty}</span>` : ""
        }</td>
        <td style="padding:8px 0;border-bottom:1px solid #dcf2f5;font-size:14px;text-align:right;white-space:nowrap;">${formatAmount(
          i.qty * i.unitPrice, currency
        )}</td>
      </tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">${rows}</table>`;
}

function itemsTextLines(items: { description: string; qty: number; unitPrice: number }[], currency?: "USD"): string {
  return items
    .map((i) => `• ${i.description}${i.qty > 1 ? ` x${i.qty}` : ""} — ${formatAmount(i.qty * i.unitPrice, currency)}`)
    .join("\n");
}

/** Alert to the therapist (or branch inbox) when a booking needs attention. */
export function bookingAlert(booking: Booking, forName?: string): Message {
  const b = branch(booking.location);
  const who = forName ? `${forName}, ` : "";
  const subject = `New booking ${booking.ref} — ${booking.service}, ${formatDate(booking.date)} ${booking.time}`;

  const text = [
    `${who}a booking has come in at ${b.name}.`,
    ``,
    `Reference: ${booking.ref}`,
    `Treatment: ${booking.service}`,
    `When: ${formatDate(booking.date)} at ${booking.time} (${booking.durationMin} min)`,
    `Guest: ${booking.customer}`,
    booking.phone ? `Phone: ${booking.phone}` : "",
    booking.email ? `Email: ${booking.email}` : "",
    `Value: ${formatMoney(booking.price)}`,
    booking.therapist ? `Therapist: ${booking.therapist}` : `Therapist: not yet assigned`,
    booking.notes ? `\nNotes: ${booking.notes}` : "",
    ``,
    `Status: ${booking.status}. Open the back office to confirm.`,
  ]
    .filter(Boolean)
    .join("\n");

  const row = (k: string, v: string) =>
    `<tr><td style="padding:6px 0;font-size:14px;color:#166f7a;width:110px;">${k}</td><td style="padding:6px 0;font-size:14px;font-weight:600;">${v}</td></tr>`;

  const html = shell(
    `New booking — ${booking.ref}`,
    `<p style="margin:0 0 12px;font-size:14px;line-height:1.6;">${who}a booking has come in at <strong>${b.name}</strong>.</p>
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0;">
       ${row("Treatment", booking.service)}
       ${row("When", `${formatDate(booking.date)} at ${booking.time}`)}
       ${row("Duration", `${booking.durationMin} min`)}
       ${row("Guest", booking.customer)}
       ${booking.phone ? row("Phone", booking.phone) : ""}
       ${booking.email ? row("Email", booking.email) : ""}
       ${row("Value", formatMoney(booking.price))}
       ${row("Therapist", booking.therapist || "Not yet assigned")}
     </table>
     ${booking.notes ? `<p style="margin:12px 0;padding:12px;background:#f1fafb;border-radius:10px;font-size:13px;line-height:1.6;"><strong>Notes:</strong> ${booking.notes}</p>` : ""}
     <p style="margin:16px 0 0;font-size:13px;color:#166f7a;">Status: ${booking.status}. Open the back office to confirm.</p>`,
    booking.location
  );

  return { subject, text, html };
}

/** Confirmation to the guest that their booking request has been received. */
export function bookingConfirmation(booking: Booking): Message {
  const b = branch(booking.location);
  const subject = `We've got your MaMoyo booking — ${booking.ref}`;
  const row = (k: string, v: string) =>
    `<tr><td style="padding:6px 0;font-size:14px;color:#166f7a;width:110px;">${k}</td><td style="padding:6px 0;font-size:14px;font-weight:600;">${v}</td></tr>`;

  const text = [
    `Hello ${booking.customer.split(" ")[0]},`,
    ``,
    `Thank you — we've received your booking request at ${b.name}.`,
    ``,
    `Reference: ${booking.ref}`,
    `Treatment: ${booking.service}`,
    `When: ${formatDate(booking.date)} at ${booking.time}`,
    `Value: ${formatMoney(booking.price)}`,
    ``,
    `Our team will confirm your appointment shortly. If you need to change anything, reply to this message or call ${b.phone}.`,
    `MaMoyo`,
  ].join("\n");

  const html = shell(
    `Booking received — ${booking.ref}`,
    `<p style="margin:0;font-size:14px;line-height:1.6;">Hello ${booking.customer.split(" ")[0]},</p>
     <p style="margin:8px 0 0;font-size:14px;line-height:1.6;">Thank you — we've received your booking request at <strong>${b.name}</strong>. Our team will confirm it shortly.</p>
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:14px 0;">
       ${row("Reference", booking.ref)}
       ${row("Treatment", booking.service)}
       ${row("When", `${formatDate(booking.date)} at ${booking.time}`)}
       ${row("Value", formatMoney(booking.price))}
     </table>
     <p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:#166f7a;">Need to change something? Reply to this email or call ${b.phone}.</p>`,
    booking.location
  );

  return { subject, text, html };
}

/** Confirmation to the guest that their suite stay request has been received. */
export function stayConfirmation(stay: StayBooking, suiteName: string): Message {
  const b = branch();
  const subject = `We've got your MaMoyo stay — ${stay.ref}`;
  const money = (n: number) => formatAmount(n, "USD");
  const row = (k: string, v: string) =>
    `<tr><td style="padding:6px 0;font-size:14px;color:#166f7a;width:110px;">${k}</td><td style="padding:6px 0;font-size:14px;font-weight:600;">${v}</td></tr>`;
  const nightsLabel = `${stay.nights} ${stay.nights === 1 ? "night" : "nights"}`;

  const text = [
    `Hello ${stay.guest.split(" ")[0]},`,
    ``,
    `Thank you — we've received your stay request for ${suiteName}.`,
    ``,
    `Reference: ${stay.ref}`,
    `Studio: ${suiteName}`,
    `Check-in: ${formatDate(stay.checkIn)}`,
    `Check-out: ${formatDate(stay.checkOut)}`,
    `Nights: ${nightsLabel}`,
    `Total: ${money(stay.total)}`,
    ``,
    `We'll confirm availability and next steps shortly. Reply to this message or call ${b.phone} with any questions.`,
    `MaMoyo Suites`,
  ].join("\n");

  const html = shell(
    `Stay received — ${stay.ref}`,
    `<p style="margin:0;font-size:14px;line-height:1.6;">Hello ${stay.guest.split(" ")[0]},</p>
     <p style="margin:8px 0 0;font-size:14px;line-height:1.6;">Thank you — we've received your stay request for <strong>${suiteName}</strong>. We'll confirm availability shortly.</p>
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:14px 0;">
       ${row("Reference", stay.ref)}
       ${row("Studio", suiteName)}
       ${row("Check-in", formatDate(stay.checkIn))}
       ${row("Check-out", formatDate(stay.checkOut))}
       ${row("Nights", nightsLabel)}
       ${row("Total", money(stay.total))}
     </table>
     <p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:#166f7a;">Questions? Reply to this email or call ${b.phone}.</p>`
  );

  return { subject, text, html };
}

/** The invoice itself, for the guest. */
export function invoiceMessage(invoice: Invoice): Message {
  const total = invoiceTotal(invoice);
  const paid = invoicePaid(invoice);
  const balance = invoiceBalance(invoice);
  const cur = invoice.currency;
  const m = (n: number) => formatAmount(n, cur);
  const b = branch(invoice.location);
  const subject = `Your MaMoyo invoice ${invoice.number}`;

  const text = [
    `Hello ${invoice.customer.split(" ")[0]},`,
    ``,
    `Here is your invoice from ${b.name}.`,
    ``,
    `Invoice: ${invoice.number}`,
    `Issued: ${formatDate(invoice.issueDate)}`,
    `Due: ${formatDate(invoice.dueDate)}`,
    ``,
    itemsTextLines(invoice.items, cur),
    ``,
    `Total: ${m(total)}`,
    paid > 0 ? `Paid: ${m(paid)}` : "",
    balance > 0 ? `Balance due: ${m(balance)}` : `Settled in full — thank you.`,
    ``,
    pdfTextLine("invoice", invoice.id, "View or download your invoice"),
    ``,
    `Any questions, reply to this message or call ${b.phone}.`,
    `MaMoyo`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = shell(
    `Invoice ${invoice.number}`,
    `<p style="margin:0;font-size:14px;line-height:1.6;">Hello ${invoice.customer.split(" ")[0]},</p>
     <p style="margin:8px 0 0;font-size:14px;line-height:1.6;">Here is your invoice from <strong>${b.name}</strong>, issued ${formatDate(
       invoice.issueDate
     )} and due ${formatDate(invoice.dueDate)}.</p>
     ${itemsTableHtml(invoice.items, cur)}
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
       <tr><td style="padding:6px 0;font-size:14px;">Total</td><td style="padding:6px 0;font-size:14px;text-align:right;font-weight:600;">${m(total)}</td></tr>
       ${paid > 0 ? `<tr><td style="padding:6px 0;font-size:14px;">Paid</td><td style="padding:6px 0;font-size:14px;text-align:right;">${m(paid)}</td></tr>` : ""}
       <tr><td style="padding:10px 0 0;font-size:15px;font-weight:600;color:${BRAND_BROWN};">${
         balance > 0 ? "Balance due" : "Settled in full"
       }</td><td style="padding:10px 0 0;font-size:15px;text-align:right;font-weight:600;color:${BRAND_BROWN};">${
         balance > 0 ? m(balance) : "&mdash;"
       }</td></tr>
     </table>
     ${pdfButtonHtml("invoice", invoice.id, "Download invoice (PDF)")}
     <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#166f7a;">Any questions, reply to this email or call ${b.phone}.</p>`,
    invoice.location
  );

  return { subject, text, html };
}

/** The receipt, for the guest. */
export function receiptMessage(receipt: Receipt): Message {
  const cur = receipt.currency;
  const m = (n: number) => formatAmount(n, cur);
  const b = branch(receipt.location);
  const subject = `Your MaMoyo receipt ${receipt.number}`;

  const text = [
    `Hello ${receipt.customer.split(" ")[0]},`,
    ``,
    `Thank you — here is your receipt from ${b.name}.`,
    ``,
    `Receipt: ${receipt.number}`,
    `Date: ${formatDate(receipt.date)}`,
    `Reference: ${receipt.invoiceNumber}`,
    receipt.items?.length ? `\n${itemsTextLines(receipt.items, cur)}\n` : "",
    `Amount received: ${m(receipt.amount)}`,
    `Method: ${receipt.method}`,
    ``,
    pdfTextLine("receipt", receipt.id, "View or download your receipt"),
    ``,
    `We look forward to seeing you again.`,
    `MaMoyo`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = shell(
    `Receipt ${receipt.number}`,
    `<p style="margin:0;font-size:14px;line-height:1.6;">Hello ${receipt.customer.split(" ")[0]},</p>
     <p style="margin:8px 0 0;font-size:14px;line-height:1.6;">Thank you — here is your receipt from <strong>${b.name}</strong>, dated ${formatDate(
       receipt.date
     )}.</p>
     ${receipt.items?.length ? itemsTableHtml(receipt.items, cur) : ""}
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
       <tr><td style="padding:6px 0;font-size:15px;font-weight:600;color:${BRAND_BROWN};">Amount received</td><td style="padding:6px 0;font-size:15px;text-align:right;font-weight:600;color:${BRAND_BROWN};">${m(
         receipt.amount
       )}</td></tr>
       <tr><td style="padding:6px 0;font-size:13px;color:#166f7a;">Method</td><td style="padding:6px 0;font-size:13px;text-align:right;color:#166f7a;">${receipt.method}</td></tr>
       <tr><td style="padding:6px 0;font-size:13px;color:#166f7a;">Reference</td><td style="padding:6px 0;font-size:13px;text-align:right;color:#166f7a;">${receipt.invoiceNumber}</td></tr>
     </table>
     ${pdfButtonHtml("receipt", receipt.id, "Download receipt (PDF)")}
     <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#166f7a;">We look forward to seeing you again.</p>`,
    receipt.location
  );

  return { subject, text, html };
}

/** The gift card itself, for the recipient. */
export function giftCardMessage(card: GiftCard): Message {
  const b = branch(card.location);
  const worth = giftValueLabel(card);
  const first = card.recipientName.split(" ")[0];
  const subject = `${card.senderName} has sent you a MaMoyo gift card`;

  const text = [
    `Hello ${first},`,
    ``,
    `${card.senderName} has sent you a MaMoyo gift card.`,
    card.message ? `\n"${card.message}"\n` : "",
    card.experience ? `Experience: ${card.experience}` : `Value: ${worth}`,
    `Card code: ${card.code}`,
    `Valid until: ${formatDate(card.expiresOn)}`,
    ``,
    `To use it, book at ${b.name} and give the code when you book.`,
    `${b.phone} · info@mamoyospa.com`,
    ``,
    pdfTextLine("gift-card", card.id, "Download a printable copy of your gift card"),
    ``,
    `Not exchangeable for cash.${card.experience ? " Any upgrade is payable on the day." : " Any remaining value stays on the card until it expires."}`,
    ``,
    `MaMoyo`,
  ]
    .filter(Boolean)
    .join("\n");

  // The card is drawn in the email itself — no attachment to open, and it
  // survives clients that block remote images because it is all table markup.
  const html = shell(
    `A gift from ${card.senderName}`,
    `<p style="margin:0 0 16px;font-size:14px;line-height:1.6;">Hello ${first}, ${card.senderName} has sent you a MaMoyo gift card.</p>

     <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:18px;overflow:hidden;background:${BRAND_TEAL};background-image:linear-gradient(135deg,#1CA3B1 0%,#178995 45%,#166F7A 100%);">
       <tr><td style="padding:26px 24px;">
         <p style="margin:0;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:rgba(255,255,255,.8);">MaMoyo Gift Card</p>
         <p style="margin:14px 0 0;font-size:${card.experience ? "22px" : "34px"};color:#ffffff;font-weight:600;line-height:1.1;">${worth}</p>
         <p style="margin:18px 0 0;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.7);">For</p>
         <p style="margin:2px 0 0;font-size:20px;color:#ffffff;">${card.recipientName}</p>
         ${card.message ? `<p style="margin:12px 0 0;font-size:13px;font-style:italic;line-height:1.5;color:rgba(255,255,255,.92);">&ldquo;${card.message}&rdquo;</p>` : ""}
         <p style="margin:16px 0 0;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.65);">Card code</p>
         <p style="margin:2px 0 0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:18px;letter-spacing:.14em;color:#ffffff;font-weight:600;">${card.code}</p>
         <p style="margin:16px 0 0;font-size:12px;color:rgba(255,255,255,.78);">Valid until ${formatDate(card.expiresOn)}</p>
       </td></tr>
     </table>

     <p style="margin:20px 0 0;font-size:14px;line-height:1.6;">To use it, book at <strong>${b.name}</strong> and give the code when you book.</p>
     ${pdfButtonHtml("gift-card", card.id, "Download printable gift card (PDF)")}
     <p style="margin:12px 0 0;font-size:12px;line-height:1.6;color:#166f7a;">
       Not exchangeable for cash.${card.experience ? " Any upgrade is payable on the day." : " Any remaining value stays on the card until it expires."}
       Standard booking and cancellation terms apply.
     </p>`,
    card.location
  );

  return { subject, text, html };
}

/** The quotation, for the prospective client. */
export function quotationMessage(q: Quotation): Message {
  const b = branch(q.location);
  const total = q.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const first = q.customer.split(" ")[0];
  const subject = `Your MaMoyo quotation ${q.number}`;

  const text = [
    `Hello ${first},`,
    ``,
    `Thank you for your interest in MaMoyo. Here is your quotation from ${b.name}.`,
    ``,
    `Quotation: ${q.number}`,
    `Issued: ${formatDate(q.issueDate)}`,
    `Valid until: ${formatDate(q.validUntil)}`,
    ``,
    itemsTextLines(q.items),
    ``,
    `Total: ${formatMoney(total)}`,
    q.notes ? `\n${q.notes}\n` : "",
    ``,
    pdfTextLine("quotation", q.id, "View or download your quotation"),
    ``,
    `To go ahead or ask a question, reply to this message or call ${b.phone}.`,
    `MaMoyo`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = shell(
    `Quotation ${q.number}`,
    `<p style="margin:0;font-size:14px;line-height:1.6;">Hello ${first},</p>
     <p style="margin:8px 0 0;font-size:14px;line-height:1.6;">Thank you for your interest in <strong>${b.name}</strong>. Your quotation is below, valid until ${formatDate(
       q.validUntil
     )}.</p>
     ${itemsTableHtml(q.items)}
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
       <tr><td style="padding:10px 0 0;font-size:15px;font-weight:600;color:${BRAND_BROWN};">Total</td><td style="padding:10px 0 0;font-size:15px;text-align:right;font-weight:600;color:${BRAND_BROWN};">${formatMoney(total)}</td></tr>
     </table>
     ${q.notes ? `<p style="margin:14px 0 0;font-size:13px;line-height:1.6;color:#166f7a;">${q.notes}</p>` : ""}
     ${pdfButtonHtml("quotation", q.id, "Download quotation (PDF)")}
     <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#166f7a;">To go ahead or ask a question, reply to this email or call ${b.phone}.</p>`,
    q.location
  );

  return { subject, text, html };
}
