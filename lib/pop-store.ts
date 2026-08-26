import { promises as fs } from "node:fs";
import path from "node:path";
import { Redis } from "@upstash/redis";

/**
 * Proof-of-payment blobs (receipt photos / screenshots) are stored one key per
 * file, separate from the main DB JSON — so reading the DB on every request
 * never drags the image data along. Mirrors the storage strategy in lib/db.ts:
 * Upstash Redis in production, local files for `npm run dev`.
 */

let redisClient: Redis | null = null;
function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  redisClient ??= new Redis({ url, token });
  return redisClient;
}

const DIR = path.join(process.cwd(), "data", "pops");
const key = (id: string) => `mamoyo:pop:${id}`;

/** Ids are generated with crypto.randomUUID — reject anything else (traversal). */
export function isValidPopId(id: string): boolean {
  return /^[a-z0-9-]{8,64}$/i.test(id);
}

export async function savePop(id: string, dataUrl: string): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.set(key(id), dataUrl);
    return;
  }
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(path.join(DIR, `${id}.txt`), dataUrl, "utf-8");
}

export async function readPop(id: string): Promise<string | null> {
  const redis = getRedis();
  if (redis) return (await redis.get<string>(key(id))) ?? null;
  try {
    return await fs.readFile(path.join(DIR, `${id}.txt`), "utf-8");
  } catch {
    return null;
  }
}

export async function deletePop(id: string): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.del(key(id));
    return;
  }
  try {
    await fs.unlink(path.join(DIR, `${id}.txt`));
  } catch {
    /* already gone */
  }
}
