"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  BedDouble,
  BarChart3,
  Boxes,
  FileText,
  ReceiptText,
  Wallet,
  Calculator,
  Users,
  Settings2,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShoppingCart,
} from "lucide-react";
import { logout } from "@/lib/auth-actions";
import type { UserRole } from "@/lib/db";
import { useMemo, useState } from "react";

const roleRank: Record<string, number> = { Staff: 0, Manager: 1, Owner: 2 };

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, minRank: 0, module: "dashboard" },
  { href: "/admin/calendar", label: "Calendar", icon: CalendarDays, minRank: 0, module: "calendar" },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck, minRank: 0, module: "bookings" },
  { href: "/admin/pos", label: "POS", icon: ShoppingCart, minRank: 0, module: "pos" },
  { href: "/admin/stays", label: "Stays", icon: BedDouble, minRank: 0, module: "stays" },
  { href: "/admin/reports", label: "Reports", icon: BarChart3, minRank: 0, module: "reports" },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes, minRank: 0, module: "inventory" },
  { href: "/admin/invoices", label: "Invoices", icon: FileText, minRank: 1, module: "invoices" },
  { href: "/admin/receipts", label: "Receipts", icon: ReceiptText, minRank: 1, module: "receipts" },
  { href: "/admin/finance", label: "Finance", icon: Wallet, minRank: 1, module: "finance" },
  { href: "/admin/tax", label: "Tax", icon: Calculator, minRank: 1, module: "tax" },
  { href: "/admin/team", label: "Team", icon: Users, minRank: 1, module: "team" },
  { href: "/admin/integrations", label: "Integrations", icon: Settings2, minRank: 1, module: "integrations" },
];

export default function Sidebar({
  username,
  role,
  allowedModules,
}: {
  username: string;
  role: UserRole;
  allowedModules: string[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = useMemo(() => nav.filter((item) => roleRank[role] >= item.minRank && allowedModules.includes(item.module)), [allowedModules, role]);

  const signOutButton = (
    <form action={logout}>
      <button
        type="submit"
        className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-mist-700 transition-colors duration-200 hover:bg-mist-100 hover:text-mist-900"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Sign out
      </button>
    </form>
  );

  const linkList = (
    <ul className="space-y-1">
      {items.map((item) => {
        const active =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                active
                  ? "bg-mist-600 text-white shadow-soft"
                  : "text-mist-800 hover:bg-mist-100"
              }`}
            >
              <item.icon className="h-4.5 w-4.5" aria-hidden="true" />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-mist-200 bg-white px-5 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src="/logo-mamoyo.png"
            alt="MaMoyo Wellness & Beauty"
            width={2595}
            height={795}
            className="h-9 w-auto"
          />
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-mist-600">
            Back Office
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-mist-800 transition-colors duration-200 hover:bg-mist-100"
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <div className="border-b border-mist-200 bg-white px-5 py-4 lg:hidden">
          {linkList}
          <div className="mt-2 border-t border-mist-100 pt-2">{signOutButton}</div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-mist-200 bg-white px-5 py-8 lg:flex">
        <Link href="/admin" className="block px-2">
          <Image
            src="/logo-mamoyo.png"
            alt="MaMoyo Wellness & Beauty"
            width={2595}
            height={795}
            className="h-12 w-auto"
          />
          <p className="mt-2 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-mist-600">
            Back Office
          </p>
        </Link>

        <nav aria-label="Admin navigation" className="mt-10 flex-1">
          {linkList}
        </nav>

        <div className="space-y-1">
          <div className="px-4 pb-1">
            <p className="truncate text-sm font-medium text-mist-900">{username}</p>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-mist-500">{role}</p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-mist-700 transition-colors duration-200 hover:bg-mist-100 hover:text-mist-900"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            View public site
          </Link>
          {signOutButton}
        </div>
      </aside>
    </>
  );
}
