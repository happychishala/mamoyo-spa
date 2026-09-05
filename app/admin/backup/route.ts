import { getSession } from "@/lib/auth";
import { serializeDb } from "@/lib/db";

/** Streams a full database backup as a JSON download. Owner only. */
export async function GET() {
  const session = await getSession();
  if (session?.role !== "Owner") {
    return new Response("Unauthorized", { status: 401 });
  }
  const json = await serializeDb();
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(json, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="mamoyo-backup-${stamp}.json"`,
      "Cache-Control": "private, no-store",
    },
  });
}
