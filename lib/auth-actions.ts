"use server";

import { redirect } from "next/navigation";
import { passwordMatches, passwordHashMatches } from "./auth-token";
import { endSession, startSession } from "./auth";
import { readDb } from "./db";

export interface LoginState {
  message: string;
}

export async function login(
  _prev: LoginState | null,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "");

  if (!process.env.ADMIN_PASSWORD) {
    return {
      message: "ADMIN_PASSWORD is not configured — add it to .env.local and restart the server.",
    };
  }

  // Root owner account, always available: username "admin" + ADMIN_PASSWORD.
  if (username === "admin" && passwordMatches(password)) {
    await startSession({ username: "admin", role: "Owner" });
    redirect(from.startsWith("/admin") ? from : "/admin");
  }

  const db = await readDb();
  const user = db.users.find((u) => u.active && u.username.toLowerCase() === username);
  if (user && passwordHashMatches(password, user.passwordHash)) {
    await startSession({ username: user.username, role: user.role });
    redirect(from.startsWith("/admin") ? from : "/admin");
  }

  // Small delay to slow down password guessing.
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { message: "Username or password isn't right. Try again." };
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/login");
}
