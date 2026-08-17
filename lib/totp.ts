import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import QRCode from "qrcode";

/**
 * RFC 6238 TOTP — the free, offline second factor used by Google Authenticator,
 * Authy, 1Password, etc. No external service and no per-message cost: the phone
 * and the server share a secret and both derive the same 6-digit code from the
 * current 30-second time step. Implemented on node:crypto so there is nothing to
 * pay for or keep online.
 */

export const TOTP_PERIOD = 30; // seconds per code
export const TOTP_DIGITS = 6;
export const TOTP_ISSUER = "MaMoyo";

// RFC 4648 base32 alphabet — the encoding authenticator apps expect for secrets.
const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Encode(buf: Buffer): string {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += BASE32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += BASE32[(value << (5 - bits)) & 31];
  return out;
}

function base32Decode(input: string): Buffer {
  const clean = input.toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of clean) {
    value = (value << 5) | BASE32.indexOf(ch);
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

/** A fresh 160-bit base32 secret to seed an authenticator enrollment. */
export function generateSecret(bytes = 20): string {
  return base32Encode(randomBytes(bytes));
}

function hotp(secret: string, counter: number): string {
  const key = base32Decode(secret);
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const digest = createHmac("sha1", key).update(buf).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);
  return (binary % 10 ** TOTP_DIGITS).toString().padStart(TOTP_DIGITS, "0");
}

function equalCodes(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/**
 * Verify a code against the secret, allowing ±1 time step (±30s) so a slightly
 * out-of-sync phone clock still works. Returns false for anything but a clean
 * 6-digit match.
 */
export function verifyTOTP(secret: string, code: string, atMs = Date.now()): boolean {
  const clean = (code || "").replace(/\D/g, "");
  if (!secret || clean.length !== TOTP_DIGITS) return false;
  const counter = Math.floor(atMs / 1000 / TOTP_PERIOD);
  for (let window = -1; window <= 1; window++) {
    if (equalCodes(hotp(secret, counter + window), clean)) return true;
  }
  return false;
}

/** The `otpauth://` URI encoded into the enrollment QR code. */
export function otpauthURL(secret: string, account: string, issuer = TOTP_ISSUER): string {
  const label = encodeURIComponent(`${issuer}:${account}`);
  const params = new URLSearchParams({
    secret,
    issuer,
    algorithm: "SHA1",
    digits: String(TOTP_DIGITS),
    period: String(TOTP_PERIOD),
  });
  return `otpauth://totp/${label}?${params.toString()}`;
}

/** Render an otpauth URI to an inline SVG QR code (server-side, no canvas). */
export function qrSvg(text: string): Promise<string> {
  return QRCode.toString(text, { type: "svg", margin: 1, errorCorrectionLevel: "M" });
}

/** Group the secret in 4-character blocks for readable manual entry. */
export function formatSecret(secret: string): string {
  return secret.replace(/(.{4})/g, "$1 ").trim();
}
