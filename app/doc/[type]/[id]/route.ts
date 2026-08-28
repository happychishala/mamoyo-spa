import { readDb } from "@/lib/db";
import { isDocType, verifyDocToken } from "@/lib/doc-link";
import { renderDocPdf } from "@/lib/pdf/render";

export const dynamic = "force-dynamic";

/**
 * Public, signed PDF endpoint for guest documents (invoice / receipt /
 * quotation / gift card). The token in `?t=` is an HMAC of the document, so the
 * link is unguessable but needs no login — safe to send by WhatsApp or email.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  const { type, id } = await params;
  const token = new URL(request.url).searchParams.get("t") ?? "";

  if (!isDocType(type) || !token || !verifyDocToken(type, id, token)) {
    return new Response("Not found", { status: 404 });
  }

  const db = await readDb();
  const doc = await renderDocPdf(db, type, id);
  if (!doc) return new Response("Not found", { status: 404 });

  return new Response(Buffer.from(doc.bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${doc.filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
