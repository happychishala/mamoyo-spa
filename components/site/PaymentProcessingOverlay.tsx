"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";

type Phase = "processing" | "success";
type Variant = "payment" | "booking";

const COPY: Record<Variant, { processing: string; success: string; sub: string }> = {
  payment: {
    processing: "Processing payment",
    success: "Payment complete",
    sub: "Completing your sale…",
  },
  booking: {
    processing: "Sending your request",
    success: "Request received",
    sub: "Securing your booking…",
  },
};

/**
 * A MaMoyo-branded full-screen "processing" moment — a card eases down into a
 * card reader, shimmers while it works, then resolves into a success check.
 * Used across POS checkouts, gift-card issue and the public booking flow.
 */
export function PaymentProcessingOverlay({
  open,
  phase,
  variant = "payment",
}: {
  open: boolean;
  phase: Phase;
  variant?: Variant;
}) {
  const copy = COPY[variant];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-mist-950/45 px-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="status"
          aria-live="polite"
        >
          <motion.div
            className="flex flex-col items-center gap-7 rounded-3xl bg-white/95 px-10 py-10 shadow-lift"
            initial={{ scale: 0.92, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
          >
            {/* Scene: card + reader */}
            <div className="relative h-52 w-64">
              {/* Card */}
              <motion.div
                className="absolute left-1/2 top-1 z-10 h-24 w-40 -translate-x-1/2 overflow-hidden rounded-xl shadow-lift"
                style={{
                  background: "linear-gradient(135deg, var(--color-mist-500), var(--color-mist-700))",
                }}
                initial={{ y: -150, rotate: -7, opacity: 0 }}
                animate={{ y: phase === "success" ? 52 : 62, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 14, mass: 0.9 }}
              >
                {/* gold chip */}
                <div className="absolute left-4 top-4 h-5 w-7 rounded-md bg-[#d8b45f] shadow-inner" />
                {/* faux number dots */}
                <div className="absolute bottom-7 left-4 flex gap-1.5 opacity-80">
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className="h-1 w-3 rounded-full bg-white/70" />
                  ))}
                </div>
                {/* brand mark */}
                <span
                  className="absolute bottom-2 left-4 text-lg leading-none text-white"
                  style={{ fontFamily: "var(--font-brush)" }}
                >
                  MaMoyo
                </span>
                {/* shimmer sweep while processing */}
                {phase === "processing" && (
                  <motion.div
                    className="absolute inset-y-0 -left-1/2 w-1/2"
                    style={{
                      background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.55), transparent)",
                    }}
                    animate={{ x: ["0%", "360%"] }}
                    transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </motion.div>

              {/* Reader / terminal — sits in front so the card looks inserted */}
              <div className="absolute bottom-0 left-1/2 z-20 h-28 w-44 -translate-x-1/2 rounded-2xl bg-gradient-to-b from-mist-800 to-mist-950 p-3 shadow-lift">
                {/* card slot */}
                <div className="mx-auto h-1.5 w-28 rounded-full bg-mist-950/80 shadow-inner" />
                {/* screen */}
                <div className="mt-2.5 flex h-[4.75rem] items-center justify-center rounded-xl bg-mist-100">
                  {phase === "success" ? (
                    <motion.div
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white"
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 320, damping: 15 }}
                    >
                      <Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-2 w-2 rounded-full bg-mist-500"
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Copy */}
            <div className="text-center">
              <p className="font-serif text-xl font-semibold text-cocoa-700">
                {phase === "success" ? copy.success : copy.processing}
              </p>
              <p className="mt-1 text-sm text-mist-600">{phase === "success" ? " " : copy.sub}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Plays the branded animation on submit, THEN invokes the action itself.
 * The form must NOT set an `action` prop — this hook captures the FormData,
 * `preventDefault()`s the native submit, plays the choreography, and calls the
 * provided `run` (a server action, or a useActionState dispatch) at the end.
 *
 * - Redirecting actions (POS sales): leave `autoHideAfter` unset — the overlay
 *   stays up until the redirect navigates away.
 * - In-place actions (booking, gift-card issue): pass `autoHideAfter` so the
 *   overlay clears shortly after the action runs, revealing the result beneath.
 */
export function useCheckoutSubmit(
  run: (formData: FormData) => void,
  variant: Variant = "payment",
  opts: { autoHideAfter?: number } = {}
) {
  const [phase, setPhase] = useState<Phase | null>(null);
  const [, startTransition] = useTransition();
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    },
    []
  );

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (phase !== null) return; // already playing
    const formData = new FormData(event.currentTarget);
    setPhase("processing");
    timers.current.push(window.setTimeout(() => setPhase("success"), 1050));
    timers.current.push(
      window.setTimeout(() => {
        startTransition(() => run(formData));
        if (opts.autoHideAfter != null) {
          timers.current.push(window.setTimeout(() => setPhase(null), opts.autoHideAfter));
        }
      }, 1800)
    );
  };

  const overlay = (
    <PaymentProcessingOverlay open={phase !== null} phase={phase ?? "processing"} variant={variant} />
  );
  return { onSubmit, overlay, active: phase !== null };
}
