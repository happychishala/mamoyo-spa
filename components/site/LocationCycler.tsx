"use client";

import { useEffect, useState } from "react";

const LOCATIONS = ["Kabulonga", "Twangale"];

// Scattered per-letter delays (deterministic) so the word dissolves like ash
// rather than wiping cleanly left-to-right.
function scatterDelays(len: number): number[] {
  return Array.from({ length: len }, (_, i) => {
    const seed = ((i * 9301 + 49297) % 233280) / 233280;
    return Math.round(seed * 320);
  });
}

export default function LocationCycler() {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<"in" | "out">("in");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      const swap = setInterval(() => setIndex((i) => (i + 1) % LOCATIONS.length), 4500);
      return () => clearInterval(swap);
    }

    let swapTimer: ReturnType<typeof setTimeout>;
    const cycle = setInterval(() => {
      setMode("out");
      swapTimer = setTimeout(() => {
        setIndex((i) => (i + 1) % LOCATIONS.length);
        setMode("in");
      }, 1050); // let the dust finish drifting before the new word forms
    }, 4200);

    return () => {
      clearInterval(cycle);
      clearTimeout(swapTimer);
    };
  }, []);

  const word = LOCATIONS[index];
  const letters = word.split("");
  const delays = scatterDelays(letters.length);

  return (
    <span
      className="relative inline-block whitespace-nowrap align-baseline text-mist-500"
      aria-label={LOCATIONS.join(" and ")}
    >
      {/* Reserve width for the longest label so the line never jumps */}
      <span aria-hidden="true" className="invisible">
        {LOCATIONS.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>
      <span aria-hidden="true" className="absolute left-0 top-0" key={index}>
        {letters.map((ch, i) => (
          <span
            key={i}
            className={`ash-letter ${mode === "out" ? "ash-out" : "ash-in"}`}
            style={{ animationDelay: `${mode === "out" ? delays[i] : delays[letters.length - 1 - i]}ms` }}
          >
            {ch}
          </span>
        ))}
      </span>
    </span>
  );
}
