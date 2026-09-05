import { getSession } from "@/lib/auth";
import { readPop, isValidPopId } from "@/lib/pop-store";

/** Serves a stored proof-of-payment image/PDF to signed-in Manager/Owner users. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role === "Staff") {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  if (!isValidPopId(id)) return new Response("Bad request", { status: 400 });

  const dataUrl = await readPop(id);
  if (!dataUrl) return new Response("Not found", { status: 404 });

  const match = /^data:([^;]+);base64,([\s\S]+)$/.exec(dataUrl);
  if (!match) return new Response("Unsupported", { status: 415 });

  const body = Buffer.from(match[2], "base64");
  // Only images and PDFs are shown inline; anything else is forced to download
  // so a stored text/html data URL can't execute in the admin origin.
  const mime = match[1];
  const inline = /^image\//.test(mime) || mime === "application/pdf";
  return new Response(body, {
    headers: {
      "Content-Type": inline ? mime : "application/octet-stream",
      "Content-Disposition": inline ? "inline" : `attachment; filename="pop-${id}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
