import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

/**
 * Fixed-window rate limiting for the endpoints an anonymous visitor can reach:
 * the login form and the three public write actions (booking, stay, enquiry).
 *
 * Backed by Upstash Redis when it is configured — the same instance the DB
 * uses — so limits hold across serverless instances. Without Redis it falls
 * back to an in-process map, which is correct for `npm run dev` but resets per
 * instance in production. Mirrors the storage strategy in lib/db.ts.
 */

let redisClient: Redis | null = null;

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  redisClient ??= new Redis({ url, token });
  return redisClient;
}

const memoryHits = new Map<string, { count: number; resetAt: number }>();

function memoryLimit(key: string, limit: number, windowSeconds: number): boolean {
  const now = Date.now();
  const entry = memoryHits.get(key);
  if (!entry || entry.resetAt <= now) {
    memoryHits.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    // Opportunistic cleanup so the map cannot grow without bound.
    if (memoryHits.size > 5000) {
      for (const [k, v] of memoryHits) if (v.resetAt <= now) memoryHits.delete(k);
    }
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}

/**
 * Best-effort client identity. `x-forwarded-for` is set by Vercel's edge and
 * cannot be spoofed past it, but treat this as a throttle, not an identity.
 */
export async function clientKey(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return ip;
}

/**
 * Returns true when the caller is within budget, false when it should be
 * refused. Fails open: if Redis errors we would rather take the booking than
 * drop a real guest's enquiry.
 */
export async function allow(
  action: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  const key = `mamoyo:rl:${action}:${await clientKey()}`;
  const redis = getRedis();
  if (!redis) return memoryLimit(key, limit, windowSeconds);

  try {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, windowSeconds);
    return count <= limit;
  } catch {
    return memoryLimit(key, limit, windowSeconds);
  }
}

/** Budgets, tuned so a real guest never notices and a script gives up quickly. */
export const LIMITS = {
  login: { limit: 8, windowSeconds: 15 * 60 },
  publicForm: { limit: 6, windowSeconds: 10 * 60 },
} as const;
