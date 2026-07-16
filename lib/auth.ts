import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  verifySessionToken,
  type Session,
} from "./auth-token";
import type { UserRole } from "./db";
import { getAllowedModules } from "./permissions";
import { readDb } from "./db";

export type { Session };

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const session = verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!session) return null;

  // The root "admin" owner account is virtual (authenticated by ADMIN_PASSWORD,
  // not stored in db.users), so it never has a matching user row.
  if (session.username === "admin") return session;

  const db = await readDb();
  const matchingUser = db.users.find((user) => user.username === session.username);
  if (!matchingUser || !matchingUser.active) return null;

  return {
    ...session,
    role: matchingUser.role as UserRole,
  };
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getSession()) !== null;
}

/**
 * Guard for admin-only server actions. Server functions are reachable by
 * direct POST regardless of proxy protection, so every mutation that touches
 * back-office data must call this first.
 */
export async function requireAdmin(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized: sign in to the back office to do this.");
  }
  return session;
}

/** Guard for actions restricted to specific roles. */
export async function requireRole(...roles: UserRole[]): Promise<Session> {
  const session = await requireAdmin();
  if (!roles.includes(session.role)) {
    throw new Error(`Unauthorized: this needs one of: ${roles.join(", ")}.`);
  }
  return session;
}

export async function canAccessModule(module: string, role: UserRole): Promise<boolean> {
  const db = await readDb();
  const customRoles = db.roles ?? [];
  return getAllowedModules(customRoles, role).includes(module as never);
}

export async function startSession(session: Session): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
