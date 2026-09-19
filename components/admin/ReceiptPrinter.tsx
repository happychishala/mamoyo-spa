"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Printer, Wifi, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { buildEposXml, eposEndpoint, type EposReceipt } from "@/lib/epos";

const MODE_KEY = "mamoyo-print-mode"; // "browser" | "epos"
const URL_KEY = "mamoyo-epos-url";
const FMT_KEY = "mamoyo-receipt-format"; // "a4" | "thermal"
const DEFAULT_EPOS_URL = "https://192.168.1.171";

function ls(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function setLs(key: string, val: string) {
  try {
    localStorage.setItem(key, val);
  } catch {
    /* ignore */
  }
}

export default function ReceiptPrinter({ backHref, receipt }: { backHref: string; receipt: EposReceipt }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const format = sp.get("format") === "thermal" ? "thermal" : "a4";
  const auto = sp.get("auto") === "1";

  const [mode, setMode] = useState<"browser" | "epos">("browser");
  const [eposUrl, setEposUrl] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [sending, setSending] = useState(false);
  const printedRef = useRef(false);

  // Load per-device preferences on mount.
  useEffect(() => {
    setMode(ls(MODE_KEY) === "epos" ? "epos" : "browser");
    setEposUrl(ls(URL_KEY) || DEFAULT_EPOS_URL);
  }, []);

  async function sendEpos(host: string) {
    if (!host || printedRef.current) return;
    printedRef.current = true;
    setSending(true);
    setStatus(null);
    try {
      const res = await fetch(eposEndpoint(host), {
        method: "POST",
        headers: { "Content-Type": "text/xml; charset=utf-8", SOAPAction: '""' },
        body: buildEposXml(receipt),
      });
      const text = await res.text();
      const ok = /success="true"/.test(text) || res.ok;
      setStatus(
        ok
          ? { ok: true, msg: "Sent to the Epson printer." }
          : { ok: false, msg: "The printer rejected the job. Check it's on and the address is right." }
      );
    } catch {
      setStatus({
        ok: false,
        msg: "Couldn't reach the printer. Make sure this device is on the same network and the printer's certificate is trusted.",
      });
      printedRef.current = false; // allow retry
    } finally {
      setSending(false);
    }
  }

  // Auto flow after a POS sale, and remembered browser format.
  useEffect(() => {
    const m = ls(MODE_KEY) === "epos" ? "epos" : "browser";
    if (m === "epos") {
      if (auto) sendEpos(ls(URL_KEY) || DEFAULT_EPOS_URL);
      return;
    }
    // browser mode: apply remembered format, then auto-print
    if (!sp.get("format")) {
      const pref = ls(FMT_KEY);
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
          /* ignore */
        }
      }, 500);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp, auto, pathname, router]);

  const chooseMode = (m: "browser" | "epos") => {
    setMode(m);
    setLs(MODE_KEY, m);
    setStatus(null);
  };
  const chooseFormat = (fmt: "a4" | "thermal") => {
    setLs(FMT_KEY, fmt);
    const q = new URLSearchParams(sp.toString());
    q.set("format", fmt);
    q.delete("auto");
    router.replace(`${pathname}?${q.toString()}`);
  };
  const saveUrl = () => {
    setLs(URL_KEY, eposUrl.trim());
    setStatus({ ok: true, msg: "Printer address saved." });
  };

  const pill = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${
      active ? "bg-mist-600 text-white" : "border border-mist-300 text-mist-700 hover:bg-mist-50"
    }`;

  return (
    <div className="mb-6 space-y-3 print:hidden">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-mist-700 transition-colors duration-200 hover:text-mist-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to receipts
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-mist-500">Print via:</span>
          <button type="button" onClick={() => chooseMode("browser")} className={pill(mode === "browser")}>
            Browser
          </button>
          <button type="button" onClick={() => chooseMode("epos")} className={pill(mode === "epos")}>
            Epson (ePOS)
          </button>

          {mode === "browser" ? (
            <>
              <span className="ml-2 text-xs text-mist-500">Paper:</span>
              <button type="button" onClick={() => chooseFormat("a4")} className={pill(format === "a4")}>
                A4
              </button>
              <button type="button" onClick={() => chooseFormat("thermal")} className={pill(format === "thermal")}>
                80mm
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="ml-1 inline-flex items-center gap-2 rounded-full bg-mist-600 px-5 py-2 text-sm font-semibold text-white hover:bg-mist-700"
              >
                <Printer className="h-4 w-4" aria-hidden="true" /> Print
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => sendEpos(eposUrl)}
              disabled={sending || !eposUrl}
              className="ml-1 inline-flex items-center gap-2 rounded-full bg-mist-600 px-5 py-2 text-sm font-semibold text-white hover:bg-mist-700 disabled:opacity-60"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Wifi className="h-4 w-4" aria-hidden="true" />}
              {sending ? "Sending…" : "Print to Epson"}
            </button>
          )}
        </div>
      </div>

      {mode === "epos" && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-mist-200 bg-mist-50 px-3 py-2">
          <span className="text-xs font-medium text-mist-700">Printer address</span>
          <input
            value={eposUrl}
            onChange={(e) => {
              setEposUrl(e.target.value);
              printedRef.current = false;
            }}
            placeholder="https://192.168.1.171"
            className="min-w-[200px] flex-1 rounded-lg border border-mist-200 bg-white px-2.5 py-1.5 text-sm text-mist-900 focus:border-mist-500 focus:outline-none"
          />
          <button type="button" onClick={saveUrl} className="rounded-full bg-mist-100 px-3 py-1.5 text-xs font-semibold text-mist-700 hover:bg-mist-200">
            Save
          </button>
          <span className="w-full text-[0.7rem] text-mist-500">
            The printer&apos;s ePOS address (usually https://&lt;printer-ip&gt;). Open it once in this browser and accept its
            certificate so prints go through. Remembered on this device.
          </span>
        </div>
      )}

      {status && (
        <p
          className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs ${
            status.ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {status.ok ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
          {status.msg}
        </p>
      )}
    </div>
  );
}
