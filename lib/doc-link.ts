import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { SITE_URL } from "./site";

export type DocType = "invoice" | "receipt" | "quotation" | "gift-card";

const DOC_TYPES: DocType[] = ["invoice", "receipt", "quotation", "gift-card"];
export function isDocType(v: string): v is DocType {
  return (DOC_TYPES as string[]).includes(v);
}

// Signed with a key derived from ADMIN_PASSWORD so document links are
// unguessable and can't be forged — no extra secret to manage.
function key(): Buffer {
  return createHash("sha256").update(`mamoyo-doc-v1:${process.env.ADMIN_PASSWORD ?? ""}`).digest();
}

export function docToken(type: DocType, id: string): string {
  return createHmac("sha256", key()).update(`${type}:${id}`).digest("hex").slice(0, 32);
}

export function verifyDocToken(type: DocType, id: string, token: string): boolean {
  const expected = docToken(type, id);
  if (token.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

/** Absolute, signed URL a guest can open to view/download the PDF. */
export function docUrl(type: DocType, id: string): string {
  return `${SITE_URL}/doc/${type}/${id}?t=${docToken(type, id)}`;
}
