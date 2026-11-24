"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Phone, X } from "lucide-react";
import { locationInfo } from "@/lib/content";

// Black Friday 2026. Shows once per visit, only while the offer runs (Lusaka
// time, UTC+2), and never on /booking where the guest is already booking.
// For the next campaign: change the id, the dates and the copy below.
const PROMO_ID = "black-friday-2026";
const STARTS = Date.parse("2026-11-24T00:00:00+02:00");
const ENDS = Date.parse("2026-12-01T00:00:00+02:00");
const SEEN_KEY = `mamoyo-promo-seen:${PROMO_ID}`;

const branches = [
  { label: "Kabulonga", phone: locationInfo.Kabulonga.phone },
  { label: "Twangale, Lilayi", phone: locationInfo.Twangale.phone },
];

export default function PromoPopup() {
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const now = Date.now();
    if (now < STARTS || now >= ENDS || pathname === "/booking") return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {
      /* storage blocked: still show it */
    }
    const t = setTimeout(() => setShow(true), 1200); // let the page land first
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (show) ref.current?.showModal();
  }, [show]);

  if (!show) return null;

  const close = () => ref.current?.close();
  const onClose = () => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // A click on the dialog element itself (not its content) is a click on the backdrop.
      onClick={(e) => e.target === e.currentTarget && close()}
      aria-labelledby="promo-title"
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-3xl bg-[#f8f6f1] p-0 text-center shadow-2xl transition duration-300 ease-out backdrop:bg-mist-950/60 backdrop:backdrop-blur-sm starting:open:translate-y-3 starting:open:opacity-0 motion-reduce:transition-none"
    >
      <div className="relative">
        <Image
          src="/photos/twangale/hero-couples.jpg"
          alt="Two treatment tables in the open-air spa at MaMoyo Twangale"
          width={2400}
          height={1138}
          sizes="(min-width: 480px) 448px, 100vw"
          className="h-36 w-full object-cover sm:h-48"
        />
        <button
          type="button"
          onClick={close}
          aria-label="Close offer"
          className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-mist-900 shadow-soft transition-colors duration-200 hover:bg-white"
        >
          <X className="h-4.5 w-4.5" aria-hidden="true" />
        </button>
      </div>

      <div className="px-6 pb-6 pt-5 sm:px-8">
        <Image src="/logo-mamoyo.png" alt="MaMoyo Wellness & Beauty" width={2595} height={795} className="mx-auto h-10 w-auto" />
        <h2 id="promo-title" className="mt-3 font-serif text-3xl font-semibold leading-tight text-neutral-900 sm:text-4xl">
          Black Friday
        </h2>
        <p className="font-serif text-lg text-mist-700 sm:text-xl">at MaMoyo Spa</p>
        <div className="mx-auto my-4 h-px w-16 bg-mist-300" aria-hidden="true" />

        <p className="text-base text-mist-800">
          Spend <strong className="font-semibold">ZMW 1,500</strong> and get
        </p>
        <p className="mt-2 inline-block bg-neutral-900 px-9 py-1.5 font-serif text-3xl text-white [clip-path:polygon(7%_0,93%_0,100%_50%,93%_100%,7%_100%,0_50%)]">
          15% off
        </p>
        <p className="mt-3 text-sm font-semibold text-mist-800">Valid 24–30 November 2026</p>
        <p className="text-sm text-mist-600">Both spa locations</p>

        <Link
          href="/booking"
          onClick={close}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-mist-600 px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-mist-700"
        >
          Book now
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>

        <div className="mt-4 grid grid-cols-2 divide-x divide-mist-200">
          {branches.map((b) => (
            <a
              key={b.label}
              href={`tel:${b.phone.replace(/\s/g, "")}`}
              className="group flex flex-col items-center gap-0.5 px-2 py-1 text-mist-700 transition-colors duration-200 hover:text-mist-950"
            >
              <span className="inline-flex items-center gap-1 text-xs text-mist-500">
                <Phone className="h-3 w-3 shrink-0" aria-hidden="true" />
                {b.label}
              </span>
              <span className="whitespace-nowrap text-sm font-semibold">{b.phone}</span>
            </a>
          ))}
        </div>

        <p className="mt-4 text-[0.7rem] text-mist-500">T&amp;Cs apply</p>
      </div>
    </dialog>
  );
}
