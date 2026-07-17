"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";

const COOKIE_NAME = "mamoyo-cookie-consent";

function hasConsent(): boolean {
  return document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE_NAME}=`));
}

function setConsent(value: "accepted" | "declined") {
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=31536000; samesite=lax`;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only decide on the client, after mount, to avoid a hydration mismatch.
    if (!hasConsent()) setVisible(true);
  }, []);

  if (!visible) return null;

  function choose(value: "accepted" | "declined") {
    setConsent(value);
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-2xl rounded-2xl border border-mist-200 bg-white/95 p-4 shadow-soft backdrop-blur-md motion-safe:animate-[cookieIn_.3s_ease-out] sm:inset-x-auto sm:right-4 sm:left-auto sm:p-5"
    >
      <style>{`@keyframes cookieIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`}</style>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist-100 text-mist-600">
            <Cookie className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <p className="text-sm leading-relaxed text-mist-700">
            We use only essential cookies to run this site and remember your choice. See our{" "}
            <Link href="/cookies" className="font-medium text-mist-800 underline hover:text-mist-950">
              Cookie Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 gap-2 sm:flex-col">
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="flex-1 cursor-pointer rounded-full bg-mist-600 px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => choose("declined")}
            className="flex-1 cursor-pointer rounded-full border border-mist-200 px-5 py-2 text-sm font-medium text-mist-700 transition-colors duration-200 hover:bg-mist-50"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
