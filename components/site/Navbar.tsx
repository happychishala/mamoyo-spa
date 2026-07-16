"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/treatments", label: "Treatments" },
  { href: "/cafe", label: "Café" },
  { href: "/suites", label: "Suites" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-4 left-4 right-4 z-50">
      <nav
        aria-label="Main navigation"
        className={`mx-auto max-w-6xl rounded-2xl border transition-all duration-300 ${
          scrolled || open
            ? "border-mist-200 bg-white/90 shadow-soft backdrop-blur-lg"
            : "border-white/40 bg-white/70 backdrop-blur-md"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-2.5">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-mamoyo.png"
              alt="MaMoyo Wellness & Beauty — Kabulonga"
              width={2595}
              height={795}
              priority
              className="h-11 w-auto sm:h-12"
            />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  pathname === link.href
                    ? "bg-mist-100 text-mist-800"
                    : "text-mist-700 hover:bg-mist-50 hover:text-mist-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/booking"
              className="ml-3 rounded-full bg-mist-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-mist-700"
            >
              Book Now
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-mist-800 transition-colors duration-200 hover:bg-mist-100 md:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-mist-100 px-5 pb-5 pt-3 md:hidden">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                    pathname === link.href
                      ? "bg-mist-100 text-mist-800"
                      : "text-mist-700 hover:bg-mist-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/booking"
                className="mt-2 rounded-xl bg-mist-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
              >
                Book Now
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
