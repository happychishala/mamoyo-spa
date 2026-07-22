"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  CalendarCheck,
  BedDouble,
  Sparkles,
  Gift,
  MessageCircle,
} from "lucide-react";

const spaLinks = [
  { href: "/spa", label: "Spa Overview" },
  { href: "/spa/kabulonga", label: "Kabulonga" },
  { href: "/spa/twangale", label: "Twangale Resort" },
  { href: "/spa/menu", label: "Treatment Menu" },
  { href: "/spa/etiquette", label: "Spa Etiquette" },
];

const mainLinks = [
  { href: "/suites", label: "Suites" },
  { href: "/cafe", label: "Café" },
  { href: "/wellness", label: "Wellness" },
  { href: "/experiences", label: "Experiences" },
  { href: "/membership", label: "Membership" },
  { href: "/corporate-wellness", label: "Corporate" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const quickActions = [
  { href: "/booking", label: "Book a treatment", icon: CalendarCheck },
  { href: "/suites", label: "Book a suite", icon: BedDouble },
  { href: "/experiences", label: "Plan an experience", icon: Sparkles },
  { href: "/gift-cards", label: "Buy a gift card", icon: Gift },
  { href: "/contact", label: "Speak to our team", icon: MessageCircle },
];

const utilityLinks = [
  { href: "/gift-cards", label: "Gift Cards" },
  { href: "/journal", label: "Journal" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [spaOpen, setSpaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const spaRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSpaOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!spaOpen) return;
    const onDown = (e: MouseEvent) => {
      if (spaRef.current && !spaRef.current.contains(e.target as Node)) setSpaOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [spaOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const spaActive = pathname.startsWith("/spa") || pathname === "/spa/menu";

  const linkClass = (active: boolean) =>
    `rounded-full px-2.5 py-2 text-[0.8rem] font-medium transition-colors duration-200 ${
      active ? "bg-mist-100 text-mist-800" : "text-mist-700 hover:bg-mist-50 hover:text-mist-900"
    }`;

  return (
    <header className="fixed inset-x-4 top-10 z-40">
      <nav
        aria-label="Main navigation"
        className={`mx-auto max-w-7xl rounded-2xl border transition-all duration-300 ${
          scrolled || open
            ? "border-mist-200 bg-white/90 shadow-soft backdrop-blur-lg"
            : "border-white/40 bg-white/70 backdrop-blur-md"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
          <Link href="/" className="flex shrink-0 items-center" aria-label="MaMoyo home">
            <Image
              src="/logo-mamoyo.png"
              alt="MaMoyo"
              width={2595}
              height={795}
              priority
              className="h-10 w-auto sm:h-11"
            />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-0.5 xl:flex">
            <li>
              <Link href="/" className={linkClass(isActive("/"))}>
                Home
              </Link>
            </li>
            <li
              ref={spaRef}
              className="relative"
              onMouseEnter={() => setSpaOpen(true)}
              onMouseLeave={() => setSpaOpen(false)}
            >
              <button
                type="button"
                onClick={() => setSpaOpen((v) => !v)}
                aria-expanded={spaOpen}
                aria-haspopup="true"
                className={`inline-flex cursor-pointer items-center gap-1 ${linkClass(spaActive)}`}
              >
                Spa
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${spaOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {spaOpen && (
                <div className="absolute left-0 top-full z-50 pt-2">
                  <ul className="w-56 overflow-hidden rounded-xl border border-mist-200 bg-white p-1.5 shadow-lift">
                    {spaLinks.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className={`block rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${
                            isActive(l.href)
                              ? "bg-mist-100 text-mist-900"
                              : "text-mist-700 hover:bg-mist-50 hover:text-mist-900"
                          }`}
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
            {mainLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass(isActive(l.href))}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/book"
                className="ml-2 rounded-full bg-mist-600 px-5 py-2.5 text-[0.8rem] font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-mist-700"
              >
                Book Now
              </Link>
            </li>
          </ul>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-mist-800 transition-colors duration-200 hover:bg-mist-100 xl:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="max-h-[75vh] overflow-y-auto border-t border-mist-100 px-4 pb-5 pt-4 xl:hidden">
            <p className="px-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-mist-500">
              What do you need today?
            </p>
            <div className="mt-3 grid gap-2">
              {quickActions.map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  className="flex items-center gap-3 rounded-xl border border-mist-200 bg-white px-4 py-3 text-sm font-medium text-mist-900 transition-colors duration-200 hover:border-mist-300 hover:bg-mist-50"
                >
                  <a.icon className="h-4.5 w-4.5 text-mist-600" aria-hidden="true" />
                  {a.label}
                </Link>
              ))}
            </div>

            <div className="mt-5 border-t border-mist-100 pt-4">
              <div className="flex flex-col gap-0.5">
                <Link href="/" className={`rounded-xl px-4 py-3 text-sm font-medium ${isActive("/") ? "bg-mist-100 text-mist-800" : "text-mist-700 hover:bg-mist-50"}`}>
                  Home
                </Link>
                <p className="px-4 pb-1 pt-3 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-mist-500">Spa</p>
                {spaLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`rounded-xl px-4 py-2.5 pl-6 text-sm font-medium ${isActive(l.href) ? "bg-mist-100 text-mist-800" : "text-mist-700 hover:bg-mist-50"}`}
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="my-1 border-t border-mist-100" />
                {mainLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`rounded-xl px-4 py-3 text-sm font-medium ${isActive(l.href) ? "bg-mist-100 text-mist-800" : "text-mist-700 hover:bg-mist-50"}`}
                  >
                    {l.label === "Corporate" ? "Corporate Wellness" : l.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-mist-100 px-1 pt-4 text-sm text-mist-600">
              {utilityLinks.map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-mist-900">
                  {l.label}
                </Link>
              ))}
            </div>

            <Link
              href="/book"
              className="mt-4 block rounded-xl bg-mist-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
            >
              Book Now
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
