"use server";

import { redirect } from "next/navigation";
import { passwordMatches, passwordHashMatches } from "./auth-token";
import {
  endSession,
  startSession,
  startPending,
  getPending,
  endPending,
} from "./auth";
import { readDb, writeDb } from "./db";
import { allow, LIMITS } from "./rate-limit";
import { generateSecret, verifyTOTP } from "./totp";

export interface LoginState {
  message: string;
}

export interface TotpState {
  message: string;
}

/** Keep the post-login destination only if it points back into the back office. */
function safeFrom(from: string): string {
  return from.startsWith("/admin") ? from : "/admin";
}

/** Set the pending cookie and send the user to the right 2FA step. */
async function beginTwoFactor(
  username: string,
  role: string,
  enrolled: boolean,
  from: string
): Promise<never> {
  const stage = enrolled ? "verify" : "enroll";
  await startPending({
    username,
    role,
    stage,
    secret: enrolled ? undefined : generateSecret(),
  });
  const dest = stage === "verify" ? "/login/verify" : "/login/enroll";
  const query = from ? `?from=${encodeURIComponent(from)}` : "";
  redirect(`${dest}${query}`);
}

/**
 * Step 1 — username + password. On success the user is only half authenticated:
 * we set a short-lived pending cookie and hand off to enrollment (first login)
 * or code entry (already enrolled). No session is issued here.
 */
export async function login(
  _prev: LoginState | null,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "");

  if (!(await allow("login", LIMITS.login.limit, LIMITS.login.windowSeconds))) {
    return { message: "Too many sign-in attempts. Wait a few minutes and try again." };
  }

  if (!process.env.ADMIN_PASSWORD) {
    return {
      message: "ADMIN_PASSWORD is not configured — add it to .env.local and restart the server.",
    };
  }

  // Root owner account, always available: username "admin" + ADMIN_PASSWORD.
  if (username === "admin" && passwordMatches(password)) {
    const db = await readDb();
    // Escape hatch: if the owner is locked out of their authenticator, set
    // RESET_ADMIN_2FA=1 in the environment to force fresh enrollment on next
    // admin sign-in, then remove it.
    const enrolled =
      process.env.RESET_ADMIN_2FA !== "1" &&
      Boolean(db.security?.adminTotpEnabled && db.security?.adminTotpSecret);
    return beginTwoFactor("admin", "Owner", enrolled, from);
  }

  const db = await readDb();
  const user = db.users.find((u) => u.active && u.username.toLowerCase() === username);
  if (user && passwordHashMatches(password, user.passwordHash)) {
    const enrolled = Boolean(user.totpEnabled && user.totpSecret);
    return beginTwoFactor(user.username, user.role, enrolled, from);
  }

  // Small delay to slow down password guessing.
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { message: "Username or password isn't right. Try again." };
}

/**
 * Step 2a — first login. Confirm the authenticator by verifying a code against
 * the proposed secret, capture the phone number, then persist and start the
 * session.
 */
export async function enrollTotp(
  _prev: TotpState | null,
  formData: FormData
): Promise<TotpState> {
  const pending = await getPending();
  if (!pending || pending.stage !== "enroll" || !pending.secret) {
    return { message: "Your sign-in timed out. Please enter your password again." };
  }
  if (!(await allow("twofa", LIMITS.twofa.limit, LIMITS.twofa.windowSeconds))) {
    return { message: "Too many attempts. Wait a few minutes and try again." };
  }

  const code = String(formData.get("code") ?? "");
  const phone = String(formData.get("phone") ?? "").trim();
  const from = String(formData.get("from") ?? "");

  if (phone.replace(/\D/g, "").length < 8) {
    return { message: "Enter a valid mobile number, e.g. +260 97 000 0000." };
  }
  if (!verifyTOTP(pending.secret, code)) {
    return { message: "That code didn't match. Check the current 6-digit code in your app and try again." };
  }

  const db = await readDb();
  if (pending.username === "admin") {
    db.security ??= {};
    db.security.adminTotpSecret = pending.secret;
    db.security.adminTotpEnabled = true;
    db.security.adminPhone = phone;
  } else {
    const user = db.users.find((u) => u.active && u.username === pending.username);
    if (!user) {
      await endPending();
      return { message: "That account is no longer available. Please sign in again." };
    }
    user.totpSecret = pending.secret;
    user.totpEnabled = true;
    user.phone = phone;
  }
  await writeDb(db);

  await endPending();
  await startSession({ username: pending.username, role: pending.role });
  redirect(safeFrom(from));
}

/**
 * Step 2b — returning login. Verify the current code against the stored secret,
 * then start the session.
 */
export async function verifyTotp(
  _prev: TotpState | null,
  formData: FormData
): Promise<TotpState> {
  const pending = await getPending();
  if (!pending || pending.stage !== "verify") {
    return { message: "Your sign-in timed out. Please enter your password again." };
  }
  if (!(await allow("twofa", LIMITS.twofa.limit, LIMITS.twofa.windowSeconds))) {
    return { message: "Too many attempts. Wait a few minutes and try again." };
  }

  const code = String(formData.get("code") ?? "");
  const from = String(formData.get("from") ?? "");

  const db = await readDb();
  let secret: string | undefined;
  if (pending.username === "admin") {
    secret = db.security?.adminTotpSecret;
  } else {
    const user = db.users.find((u) => u.active && u.username === pending.username);
    if (!user) {
      await endPending();
      return { message: "That account is no longer available. Please sign in again." };
    }
    secret = user.totpSecret;
  }

  if (!secret || !verifyTOTP(secret, code)) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { message: "That code didn't match. Enter the current 6-digit code from your app." };
  }

  await endPending();
  await startSession({ username: pending.username, role: pending.role });
  redirect(safeFrom(from));
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/login");
}
