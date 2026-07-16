"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SEEN_KEY = "mamoyo-splash-seen";

/**
 * Three-second welcome: the logo pulses twice, then swells and fades away.
 * Plays once per browser session and skips entirely for reduced motion.
 */
export default function SplashScreen() {
  const [phase, setPhase] = useState<"pulse" | "exit" | "done">("pulse");

  useEffect(() => {
    if (
      sessionStorage.getItem(SEEN_KEY) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setPhase("done");
      return;
    }
    sessionStorage.setItem(SEEN_KEY, "1");
    document.body.style.overflow = "hidden";
    const exit = setTimeout(() => setPhase("exit"), 2200);
    const done = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
    }, 5000);
    return () => {
      clearTimeout(exit);
      clearTimeout(done);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-mist-50 transition-opacity duration-700 ease-out ${
        phase === "exit" ? "opacity-0" : "opacity-100"
      }`}
    >
      <Image
        src="/logo-mamoyo.png"
        alt=""
        width={2595}
        height={795}
        priority
        className={`h-auto w-60 transition-transform duration-700 ease-out sm:w-80 ${
          phase === "exit" ? "scale-150" : "scale-100 animate-splash-pulse"
        }`}
      />
    </div>
  );
}
