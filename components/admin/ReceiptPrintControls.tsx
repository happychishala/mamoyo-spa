"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";

const PREF_KEY = "mamoyo-receipt-format";

function readPref(): string | null {
  try {
    return localStorage.getItem(PREF_KEY);
  } catch {
    return null;
  }
}

/**
 * Print controls for a receipt: Back, Print, and an A4 / 80mm receipt-printer
 * toggle remembered per device. Auto-prints when the URL carries ?auto=1 (set
 * by the POS after a sale), and honours the remembered format even on that
 * auto flow. All chrome is hidden when printing.
 */
export default function ReceiptPrintControls({ backHref }: { backHref: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const format = sp.get("format") === "thermal" ? "thermal" : "a4";
  const auto = sp.get("auto") === "1";

  useEffect(() => {
    // Apply the remembered format if the URL doesn't already name one.
    if (!sp.get("format")) {
      const pref = readPref();
      if (pref === "thermal" || pref === "a4") {
        const q = new URLSearchParams(sp.toString());
        q.set("format", pref);
        router.replace(`${pathname}?${q.toString()}`);
        return;
      }
    }
    if (auto) {
      const t = setTimeout(() => {
        try {
          window.print();
        } catch {
          /* no-op */
        }
      }, 500);
      return () => clearTimeout(t);
    }
  }, [sp, pathname, router, auto]);

  const choose = (fmt: "a4" | "thermal") => {
    try {
      localStorage.setItem(PREF_KEY, fmt);
    } catch {
      /* ignore */
    }
    const q = new URLSearchParams(sp.toString());
    q.set("format", fmt);
    q.delete("auto"); // don't re-trigger auto-print when switching format
    router.replace(`${pathname}?${q.toString()}`);
  };

  const pill = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${
      active ? "bg-mist-600 text-white" : "border border-mist-300 text-mist-700 hover:bg-mist-50"
    }`;

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm font-medium text-mist-700 transition-colors duration-200 hover:text-mist-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to receipts
      </Link>

      <div className="flex items-center gap-2">
        <span className="text-xs text-mist-500">Printer:</span>
        <button type="button" onClick={() => choose("a4")} className={pill(format === "a4")}>
          A4
        </button>
        <button type="button" onClick={() => choose("thermal")} className={pill(format === "thermal")}>
          80mm receipt
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="ml-1 inline-flex items-center gap-2 rounded-full bg-mist-600 px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
        >
          <Printer className="h-4 w-4" aria-hidden="true" />
          Print
        </button>
      </div>
    </div>
  );
}
