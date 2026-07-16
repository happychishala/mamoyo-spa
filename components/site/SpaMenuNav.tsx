"use client";

import { useEffect, useRef, useState } from "react";

interface SectionLink {
  id: string;
  title: string;
}

/**
 * Category pills that dock to a floating left rail once you scroll past them,
 * with the current section highlighted as you move down the page.
 */
export default function SpaMenuNav({ sections }: { sections: SectionLink[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [docked, setDocked] = useState(false);
  const pillsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    // Scrollspy: whichever section crosses the upper-middle band is active.
    const spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) spy.observe(el);
    }

    // Dock the rail once the inline pills leave the viewport.
    const pills = pillsRef.current;
    const dock = new IntersectionObserver(([entry]) => setDocked(!entry.isIntersecting), {
      rootMargin: "-96px 0px 0px 0px",
    });
    if (pills) dock.observe(pills);

    return () => {
      spy.disconnect();
      dock.disconnect();
    };
  }, [sections]);

  return (
    <>
      {/* Inline pills (top of page, all screens) */}
      <nav ref={pillsRef} aria-label="Menu sections" className="mt-8 flex flex-wrap justify-center gap-2">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-full border border-mist-300 bg-white/80 px-4 py-2 text-xs font-semibold text-mist-800 backdrop-blur transition-colors duration-200 hover:border-mist-400 hover:bg-white"
          >
            {s.title}
          </a>
        ))}
      </nav>

      {/* Floating left rail (docks in once you scroll) */}
      <nav
        aria-label="On this page"
        className={`fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 transition-all duration-500 xl:block ${
          docked ? "translate-x-0 opacity-100" : "pointer-events-none -translate-x-3 opacity-0"
        }`}
      >
        <ul className="space-y-1">
          {sections.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className="group flex items-center gap-2.5 py-1"
                >
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 shrink-0 rounded-full transition-all duration-300 ${
                      isActive ? "scale-125 bg-mist-600" : "bg-mist-300 group-hover:bg-mist-500"
                    }`}
                  />
                  <span
                    className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium shadow-soft backdrop-blur transition-all duration-300 ${
                      isActive
                        ? "bg-mist-600 text-white opacity-100"
                        : "bg-white/90 text-mist-700 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {s.title}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
