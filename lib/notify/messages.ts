import type { Booking, Invoice, Receipt, Location } from "../db";
import { invoiceTotal, invoicePaid, invoiceBalance } from "../db";
import { locationInfo } from "../content";
import { formatMoney, formatDate } from "../format";

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

function itemsTableHtml(items: { description: string; qty: number; unitPrice: number }[]): string {
  const rows = items
    .map(
      (i) => `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #dcf2f5;font-size:14px;">${i.description}${
          i.qty > 1 ? ` <span style="color:#54b8c5;">&times;${i.qty}</span>` : ""
        }</td>
        <td style="padding:8px 0;border-bottom:1px solid #dcf2f5;font-size:14px;text-align:right;white-space:nowrap;">${formatMoney(
          i.qty * i.unitPrice
        )}</td>
      </tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">${rows}</table>`;
}

function itemsTextLines(items: { description: string; qty: number; unitPrice: number }[]): string {
  return items
    .map((i) => `• ${i.description}${i.qty > 1 ? ` x${i.qty}` : ""} — ${formatMoney(i.qty * i.unitPrice)}`)
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

/** The invoice itself, for the guest. */
export function invoiceMessage(invoice: Invoice): Message {
  const total = invoiceTotal(invoice);
  const paid = invoicePaid(invoice);
  const balance = invoiceBalance(invoice);
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
    itemsTextLines(invoice.items),
    ``,
    `Total: ${formatMoney(total)}`,
    paid > 0 ? `Paid: ${formatMoney(paid)}` : "",
    balance > 0 ? `Balance due: ${formatMoney(balance)}` : `Settled in full — thank you.`,
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
     ${itemsTableHtml(invoice.items)}
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
       <tr><td style="padding:6px 0;font-size:14px;">Total</td><td style="padding:6px 0;font-size:14px;text-align:right;font-weight:600;">${formatMoney(total)}</td></tr>
       ${paid > 0 ? `<tr><td style="padding:6px 0;font-size:14px;">Paid</td><td style="padding:6px 0;font-size:14px;text-align:right;">${formatMoney(paid)}</td></tr>` : ""}
       <tr><td style="padding:10px 0 0;font-size:15px;font-weight:600;color:${BRAND_BROWN};">${
         balance > 0 ? "Balance due" : "Settled in full"
       }</td><td style="padding:10px 0 0;font-size:15px;text-align:right;font-weight:600;color:${BRAND_BROWN};">${
         balance > 0 ? formatMoney(balance) : "&mdash;"
       }</td></tr>
     </table>
     <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#166f7a;">Any questions, reply to this email or call ${b.phone}.</p>`,
    invoice.location
  );

  return { subject, text, html };
}

/** The receipt, for the guest. */
export function receiptMessage(receipt: Receipt): Message {
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
    receipt.items?.length ? `\n${itemsTextLines(receipt.items)}\n` : "",
    `Amount received: ${formatMoney(receipt.amount)}`,
    `Method: ${receipt.method}`,
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
     ${receipt.items?.length ? itemsTableHtml(receipt.items) : ""}
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
       <tr><td style="padding:6px 0;font-size:15px;font-weight:600;color:${BRAND_BROWN};">Amount received</td><td style="padding:6px 0;font-size:15px;text-align:right;font-weight:600;color:${BRAND_BROWN};">${formatMoney(
         receipt.amount
       )}</td></tr>
       <tr><td style="padding:6px 0;font-size:13px;color:#166f7a;">Method</td><td style="padding:6px 0;font-size:13px;text-align:right;color:#166f7a;">${receipt.method}</td></tr>
       <tr><td style="padding:6px 0;font-size:13px;color:#166f7a;">Reference</td><td style="padding:6px 0;font-size:13px;text-align:right;color:#166f7a;">${receipt.invoiceNumber}</td></tr>
     </table>
     <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#166f7a;">We look forward to seeing you again.</p>`,
    receipt.location
  );

  return { subject, text, html };
}
