"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Star,
  BellRing,
  Gift,
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
  Inbox,
  ClipboardList,
  TrendingDown,
  FileSignature,
  ChefHat,
  CalendarRange,
} from "lucide-react";
import { logout } from "@/lib/auth-actions";
import type { UserRole } from "@/lib/db";
import { useMemo, useState } from "react";

const roleRank: Record<string, number> = { Staff: 0, Manager: 1, Owner: 2 };

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard; minRank: number; module: string };

// Grouped so the back office stays scannable as modules grow. A group only
// renders when the user can see at least one item inside it.
const navGroups: { group: string; items: NavItem[] }[] = [
  {
    group: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, minRank: 0, module: "dashboard" },
      { href: "/admin/calendar", label: "Calendar", icon: CalendarDays, minRank: 0, module: "calendar" },
      { href: "/admin/reports", label: "Reports", icon: BarChart3, minRank: 0, module: "reports" },
    ],
  },
  {
    group: "Operations",
    items: [
      { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck, minRank: 0, module: "bookings" },
      { href: "/admin/enquiries", label: "Enquiries", icon: Inbox, minRank: 0, module: "enquiries" },
      { href: "/admin/daysheet", label: "Day Sheet", icon: ClipboardList, minRank: 0, module: "daysheet" },
      { href: "/admin/worksheet", label: "Work Sheet", icon: CalendarRange, minRank: 0, module: "worksheet" },
      { href: "/admin/stays", label: "Stays", icon: BedDouble, minRank: 0, module: "stays" },
      { href: "/admin/inventory", label: "Inventory", icon: Boxes, minRank: 0, module: "inventory" },
    ],
  },
  {
    group: "Café & Kitchen",
    items: [
      { href: "/admin/pos", label: "POS", icon: ShoppingCart, minRank: 0, module: "pos" },
      { href: "/admin/chef", label: "Chef", icon: ChefHat, minRank: 0, module: "chef" },
    ],
  },
  {
    group: "Sales & Billing",
    items: [
      { href: "/admin/quotations", label: "Quotations", icon: FileSignature, minRank: 1, module: "quotations" },
      { href: "/admin/invoices", label: "Invoices", icon: FileText, minRank: 1, module: "invoices" },
      { href: "/admin/receipts", label: "Receipts", icon: ReceiptText, minRank: 1, module: "receipts" },
      { href: "/admin/gift-cards", label: "Gift Cards", icon: Gift, minRank: 1, module: "gift-cards" },
    ],
  },
  {
    group: "Finance",
    items: [
      { href: "/admin/finance", label: "Finance", icon: Wallet, minRank: 1, module: "finance" },
      { href: "/admin/expenses", label: "Expenses", icon: TrendingDown, minRank: 1, module: "expenses" },
      { href: "/admin/tax", label: "Tax", icon: Calculator, minRank: 1, module: "tax" },
    ],
  },
  {
    group: "Marketing",
    items: [
      { href: "/admin/reviews", label: "Reviews", icon: Star, minRank: 1, module: "reviews" },
      { href: "/admin/notifications", label: "Notifications", icon: BellRing, minRank: 1, module: "notifications" },
    ],
  },
  {
    group: "Settings",
    items: [
      { href: "/admin/team", label: "Team", icon: Users, minRank: 1, module: "team" },
      { href: "/admin/integrations", label: "Integrations", icon: Settings2, minRank: 1, module: "integrations" },
    ],
  },
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

  const groups = useMemo(
    () =>
      navGroups
        .map((g) => ({
          group: g.group,
          items: g.items.filter((item) => roleRank[role] >= item.minRank && allowedModules.includes(item.module)),
        }))
        .filter((g) => g.items.length > 0),
    [allowedModules, role]
  );

  const signOutButton = (
    <form action={logout}>
      <button
        type="submit"
        className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-mist-700 transition-colors duration-200 hover:bg-mist-100 hover:text-mist-900"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Sign out
      </button>
    </form>
  );

  const navList = (
    <div className="space-y-4">
      {groups.map((g) => (
        <div key={g.group}>
          <p className="px-3 pb-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-mist-400">
            {g.group}
          </p>
          <ul className="space-y-0.5">
            {g.items.map((item) => {
              const active =
                item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      active ? "bg-mist-600 text-white shadow-soft" : "text-mist-800 hover:bg-mist-100"
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
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
        <div className="max-h-[70vh] overflow-y-auto border-b border-mist-200 bg-white px-5 py-4 lg:hidden">
          {navList}
          <div className="mt-3 border-t border-mist-100 pt-3">{signOutButton}</div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-mist-200 bg-white lg:flex">
        <Link href="/admin" className="block shrink-0 px-6 pt-8 pb-6">
          <Image
            src="/logo-mamoyo.png"
            alt="MaMoyo Wellness & Beauty"
            width={2595}
            height={795}
            className="h-11 w-auto"
          />
          <p className="mt-2 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-mist-600">
            Back Office
          </p>
        </Link>

        <nav aria-label="Admin navigation" className="flex-1 overflow-y-auto px-4 pb-4">
          {navList}
        </nav>

        <div className="shrink-0 space-y-1 border-t border-mist-100 px-4 py-4">
          <div className="px-3 pb-1">
            <p className="truncate text-sm font-medium text-mist-900">{username}</p>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-mist-500">{role}</p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-mist-700 transition-colors duration-200 hover:bg-mist-100 hover:text-mist-900"
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
