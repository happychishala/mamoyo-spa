import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import { getSession } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { getAllowedModules } from "@/lib/permissions";

export const metadata: Metadata = {
  title: {
    default: "Back Office",
    template: "%s | MaMoyo Back Office",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Second line of defense behind the proxy — covers direct renders too.
  const session = await getSession();
  if (!session) redirect("/login");

  const db = await readDb();
  const allowedModules = getAllowedModules(db.roles ?? [], session.role);

  return (
    <div className="flex min-h-screen flex-col bg-mist-50 lg:flex-row print:bg-white">
      <div className="contents print:hidden">
        <Sidebar username={session.username} role={session.role} allowedModules={allowedModules} />
      </div>
      <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10 print:p-0">
        <div className="mx-auto max-w-6xl print:max-w-none">{children}</div>
      </main>
    </div>
  );
}
