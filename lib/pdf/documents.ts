import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { Invoice, Receipt, Quotation, GiftCard, Location } from "../db";
import { invoiceTotal, invoicePaid, invoiceBalance } from "../db";
import { inclusiveVatBreakdown, VAT_RATE } from "../tax";
import { formatMoney, formatDate } from "../format";
import { locationInfo } from "../content";
import { giftValueLabel } from "../gift-cards";

const TEAL = rgb(0.09, 0.537, 0.584); // #178995
const BROWN = rgb(0.376, 0.243, 0.149); // #603E26
const INK = rgb(0.09, 0.35, 0.39);
const MUTED = rgb(0.45, 0.55, 0.57);
const LINE = rgb(0.83, 0.9, 0.92);

const A4 = { w: 595.28, h: 841.89 };
const M = 48;

/** pdf-lib's standard fonts are WinAnsi — swap characters it can't encode. */
function san(s: string): string {
  return String(s ?? "")
    .replace(/[—–]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, "...")
    .replace(/×/g, "x")
    .replace(/[•·]/g, "-")
    // eslint-disable-next-line no-control-regex
    .replace(/[^\x00-\xff]/g, "");
}

type Fonts = { reg: PDFFont; bold: PDFFont };

function textWidth(font: PDFFont, text: string, size: number) {
  return font.widthOfTextAtSize(san(text), size);
}

function right(page: PDFPage, font: PDFFont, text: string, xRight: number, y: number, size: number, color = INK) {
  const t = san(text);
  page.drawText(t, { x: xRight - font.widthOfTextAtSize(t, size), y, size, font, color });
}

function branch(location?: Location) {
  return locationInfo[location ?? "Kabulonga"];
}

/** Teal header band with the MaMoyo mark and branch details. Returns next y. */
function header(page: PDFPage, fonts: Fonts, location?: Location): number {
  const b = branch(location);
  page.drawRectangle({ x: 0, y: A4.h - 70, width: A4.w, height: 70, color: TEAL });
  page.drawText("MaMoyo", { x: M, y: A4.h - 46, size: 24, font: fonts.bold, color: rgb(1, 1, 1) });
  right(page, fonts.reg, b.name, A4.w - M, A4.h - 34, 10, rgb(1, 1, 1));
  right(page, fonts.reg, b.phone, A4.w - M, A4.h - 48, 9, rgb(0.85, 0.95, 0.96));
  return A4.h - 70 - 34;
}

function footer(page: PDFPage, fonts: Fonts, note: string, location?: Location) {
  const b = branch(location);
  page.drawLine({ start: { x: M, y: 70 }, end: { x: A4.w - M, y: 70 }, thickness: 0.5, color: LINE });
  page.drawText(san(note), { x: M, y: 54, size: 8, font: fonts.reg, color: MUTED, maxWidth: A4.w - 2 * M, lineHeight: 11 });
  right(page, fonts.reg, san(`${b.address} · ${b.phone}`), A4.w - M, 40, 8, MUTED);
}

/** Shared table-based document for invoice / receipt / quotation. */
async function financeDoc(opts: {
  title: string;
  number: string;
  info: { label: string; value: string }[];
  partyLabel: string;
  partyName: string;
  items: { description: string; qty: number; unitPrice: number }[];
  totals: { label: string; value: string; strong?: boolean; big?: boolean }[];
  note: string;
  location?: Location;
}): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([A4.w, A4.h]);
  const reg = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fonts: Fonts = { reg, bold };

  let y = header(page, fonts, opts.location) - 8;

  // Title + number (left) and party + info (right)
  page.drawText(san(opts.title), { x: M, y: y - 18, size: 26, font: bold, color: BROWN });
  page.drawText(san(opts.number), { x: M, y: y - 36, size: 11, font: reg, color: MUTED });

  right(page, bold, opts.partyLabel.toUpperCase(), A4.w - M, y - 6, 8, MUTED);
  right(page, bold, opts.partyName, A4.w - M, y - 20, 12, INK);
  let iy = y - 36;
  for (const row of opts.info) {
    right(page, reg, `${row.label}: ${row.value}`, A4.w - M, iy, 9, MUTED);
    iy -= 13;
  }

  // Items table
  y -= 70;
  const colQty = 360;
  const colUnit = 452;
  const colAmt = A4.w - M;
  page.drawLine({ start: { x: M, y: y + 6 }, end: { x: A4.w - M, y: y + 6 }, thickness: 1.2, color: BROWN });
  page.drawText("DESCRIPTION", { x: M, y: y - 6, size: 8, font: bold, color: MUTED });
  right(page, bold, "QTY", colQty, y - 6, 8, MUTED);
  right(page, bold, "UNIT", colUnit, y - 6, 8, MUTED);
  right(page, bold, "AMOUNT", colAmt, y - 6, 8, MUTED);
  y -= 22;

  for (const it of opts.items) {
    const lineTotal = it.qty * it.unitPrice;
    page.drawText(san(it.description), { x: M, y, size: 10, font: reg, color: INK, maxWidth: colQty - M - 60 });
    right(page, reg, String(it.qty), colQty, y, 10, INK);
    right(page, reg, formatMoney(it.unitPrice), colUnit, y, 10, INK);
    right(page, bold, formatMoney(lineTotal), colAmt, y, 10, INK);
    y -= 18;
    page.drawLine({ start: { x: M, y: y + 6 }, end: { x: A4.w - M, y: y + 6 }, thickness: 0.4, color: LINE });
  }

  // Totals
  y -= 14;
  for (const t of opts.totals) {
    const size = t.big ? 18 : 10;
    right(page, t.strong ? bold : reg, t.label, colUnit, y, t.big ? 11 : 10, t.strong ? INK : MUTED);
    right(page, t.strong || t.big ? bold : reg, t.value, colAmt, y - (t.big ? 4 : 0), size, t.big ? BROWN : INK);
    y -= t.big ? 26 : 16;
  }

  footer(page, fonts, opts.note, opts.location);
  return doc.save();
}

export function invoicePdf(invoice: Invoice): Promise<Uint8Array> {
  const total = invoiceTotal(invoice);
  const paid = invoicePaid(invoice);
  const balance = invoiceBalance(invoice);
  const vat = inclusiveVatBreakdown(total);
  return financeDoc({
    title: "Invoice",
    number: invoice.number,
    partyLabel: "Billed to",
    partyName: invoice.customer,
    info: [
      { label: "Issued", value: formatDate(invoice.issueDate) },
      { label: "Due", value: formatDate(invoice.dueDate) },
      { label: "Status", value: invoice.status },
    ],
    items: invoice.items,
    totals: [
      { label: "Subtotal excl. VAT", value: formatMoney(vat.netAmount) },
      { label: `VAT (${VAT_RATE * 100}% incl.)`, value: formatMoney(vat.vatAmount) },
      { label: "Total", value: formatMoney(total), strong: true, big: true },
      ...(paid > 0
        ? [
            { label: "Paid to date", value: formatMoney(paid) },
            { label: "Balance due", value: formatMoney(balance), strong: true },
          ]
        : []),
    ],
    note: `Payment by cash, card, mobile money or bank transfer. Please quote ${invoice.number} as the reference.`,
    location: invoice.location,
  });
}

export function receiptPdf(receipt: Receipt): Promise<Uint8Array> {
  const items = receipt.items && receipt.items.length > 0 ? receipt.items : [{ description: `Payment — ${receipt.invoiceNumber}`, qty: 1, unitPrice: receipt.amount }];
  const vat = inclusiveVatBreakdown(receipt.amount);
  const paymentLine = receipt.payments && receipt.payments.length > 1
    ? receipt.payments.map((p) => `${p.method} ${formatMoney(p.amount)}`).join(", ")
    : receipt.method;
  return financeDoc({
    title: "Receipt",
    number: receipt.number,
    partyLabel: "Received from",
    partyName: receipt.customer,
    info: [
      { label: "Date", value: formatDate(receipt.date) },
      { label: "Reference", value: receipt.invoiceNumber },
      { label: "Paid by", value: paymentLine },
    ],
    items,
    totals: [
      { label: "VAT included", value: formatMoney(vat.vatAmount) },
      { label: "Amount received", value: formatMoney(receipt.amount), strong: true, big: true },
    ],
    note: "This receipt confirms payment received for the amount shown above. Thank you.",
    location: receipt.location,
  });
}

export function quotationPdf(q: Quotation): Promise<Uint8Array> {
  const total = q.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const vat = inclusiveVatBreakdown(total);
  return financeDoc({
    title: "Quotation",
    number: q.number,
    partyLabel: "Prepared for",
    partyName: q.customer,
    info: [
      { label: "Issued", value: formatDate(q.issueDate) },
      { label: "Valid until", value: formatDate(q.validUntil) },
      { label: "Status", value: q.status },
    ],
    items: q.items,
    totals: [
      { label: "Subtotal excl. VAT", value: formatMoney(vat.netAmount) },
      { label: `VAT (${VAT_RATE * 100}% incl.)`, value: formatMoney(vat.vatAmount) },
      { label: "Total", value: formatMoney(total), strong: true, big: true },
    ],
    note: `${q.notes ? san(q.notes) + "\n" : ""}This quotation is valid until ${formatDate(q.validUntil)}. Prices are held for the validity period and subject to availability.`,
    location: q.location,
  });
}

export async function giftCardPdf(card: GiftCard): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([560, 320]);
  const reg = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  // Teal card background with a brown footer strip.
  page.drawRectangle({ x: 0, y: 0, width: 560, height: 320, color: TEAL });
  page.drawRectangle({ x: 0, y: 0, width: 560, height: 8, color: BROWN });

  const white = rgb(1, 1, 1);
  const soft = rgb(0.86, 0.96, 0.97);
  page.drawText("MaMoyo", { x: 40, y: 262, size: 30, font: bold, color: white });
  page.drawText("GIFT CARD", { x: 42, y: 244, size: 11, font: reg, color: soft });

  const value = giftValueLabel(card);
  page.drawText(san(value), { x: 40, y: 180, size: 30, font: bold, color: white });

  page.drawText(`For ${san(card.recipientName)}`, { x: 40, y: 148, size: 13, font: reg, color: soft });
  page.drawText(`From ${san(card.senderName)}`, { x: 40, y: 130, size: 13, font: reg, color: soft });
  if (card.message) {
    page.drawText(san(card.message), { x: 40, y: 106, size: 11, font: reg, color: soft, maxWidth: 480, lineHeight: 14 });
  }

  // Code chip
  page.drawRectangle({ x: 40, y: 52, width: 200, height: 30, color: rgb(1, 1, 1), opacity: 0.14 });
  page.drawText(san(card.code), { x: 52, y: 61, size: 14, font: bold, color: white });
  right(page, reg, `Expires ${formatDate(card.expiresOn)}`, 520, 61, 11, soft);
  if (card.balance !== card.value && card.value > 0) {
    right(page, reg, `Balance ${formatMoney(card.balance)}`, 520, 44, 10, soft);
  }
  return doc.save();
}
