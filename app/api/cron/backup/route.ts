import { snapshotDb } from "@/lib/db";

/**
 * Daily database snapshot, called by Vercel Cron (see vercel.json).
 * Protected by CRON_SECRET: Vercel Cron sends `Authorization: Bearer <secret>`.
 * If CRON_SECRET is unset the endpoint refuses, so it can't be triggered openly.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const result = await snapshotDb();
  return Response.json({ ok: true, ...result });
}
