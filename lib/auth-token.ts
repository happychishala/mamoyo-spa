import { createHash, createHmac, timingSafeEqual, randomBytes, scryptSync } from "node:crypto";
import type { UserRole } from "./db";

// Pure token helpers with no next/headers dependency, so the proxy can
// verify sessions without pulling in request-scoped APIs.

export const SESSION_COOKIE = "mamoyo_admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface Session {
  username: string;
  role: UserRole;
}

// Deriving the signing key from ADMIN_PASSWORD means rotating the password
// also invalidates every existing session.
function signingKey(): Buffer | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHash("sha256").update(`mamoyo-session-v2:${password}`).digest();
}

function sign(payload: string, key: Buffer): string {
  return createHmac("sha256", key).update(payload).digest("hex");
}

/** Token format: `{expiresAtMs}.{usernameB64url}.{role}.{hmacHex}` */
export function createSessionToken(session: Session): string {
  const key = signingKey();
  if (!key) throw new Error("ADMIN_PASSWORD env var is not set.");
  const expiresAt = String(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
  const user = Buffer.from(session.username, "utf8").toString("base64url");
  const payload = `${expiresAt}.${user}.${session.role}`;
  return `${payload}.${sign(payload, key)}`;
}

export function verifySessionToken(token: string | undefined): Session | null {
  const key = signingKey();
  if (!key || !token) return null;

  const parts = token.split(".");
  if (parts.length !== 4) return null;
  const [expires, user, role, signature] = parts;
  const payload = `${expires}.${user}.${role}`;

  const expiresAt = Number(expires);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;
  if (!["Owner", "Manager", "Staff"].includes(role)) return null;

  const expected = Buffer.from(sign(payload, key), "hex");
  const actual = Buffer.from(signature, "hex");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;

  try {
    return {
      username: Buffer.from(user, "base64url").toString("utf8"),
      role: role as UserRole,
    };
  } catch {
    return null;
  }
}

/** True when the candidate matches the root ADMIN_PASSWORD from .env.local. */
export function passwordMatches(candidate: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !candidate) return false;
  // Hash both sides so timingSafeEqual gets equal-length buffers.
  const a = createHash("sha256").update(candidate).digest();
  const b = createHash("sha256").update(password).digest();
  return timingSafeEqual(a, b);
}

// --- Per-user password hashing (scrypt) ---

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 32);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function passwordHashMatches(candidate: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex || !candidate) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(candidate, Buffer.from(saltHex, "hex"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
