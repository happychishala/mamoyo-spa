import type { DB } from "../db";
import type { DocType } from "../doc-link";
import { invoicePdf, receiptPdf, quotationPdf, giftCardPdf } from "./documents";

/** Render a guest document to a PDF, resolving the entity from the db. */
export async function renderDocPdf(
  db: DB,
  type: DocType,
  id: string
): Promise<{ bytes: Uint8Array; filename: string } | null> {
  switch (type) {
    case "invoice": {
      const inv = db.invoices.find((i) => i.id === id);
      return inv ? { bytes: await invoicePdf(inv), filename: `${inv.number}.pdf` } : null;
    }
    case "receipt": {
      const r = db.receipts.find((x) => x.id === id);
      return r ? { bytes: await receiptPdf(r), filename: `${r.number}.pdf` } : null;
    }
    case "quotation": {
      const q = db.quotations.find((x) => x.id === id);
      return q ? { bytes: await quotationPdf(q), filename: `${q.number}.pdf` } : null;
    }
    case "gift-card": {
      const c = db.giftCards.find((x) => x.id === id);
      return c ? { bytes: await giftCardPdf(c), filename: `MaMoyo-Gift-${c.code}.pdf` } : null;
    }
  }
}

/** Base64 attachment for the email sender. */
export async function docAttachment(
  db: DB,
  type: DocType,
  id: string
): Promise<{ filename: string; content: string } | null> {
  const doc = await renderDocPdf(db, type, id);
  if (!doc) return null;
  return { filename: doc.filename, content: Buffer.from(doc.bytes).toString("base64") };
}
