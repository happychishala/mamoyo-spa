"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronsUpDown, Check, Search, X } from "lucide-react";
import type { BookableService } from "@/lib/content";

export default function ServiceCombobox({
  services,
  name,
  preselected,
  triggerClassName,
}: {
  services: BookableService[];
  name: string;
  preselected?: string;
  triggerClassName: string;
}) {
  const [value, setValue] = useState(preselected ?? "");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = services.find((s) => s.name === value);

  const flat = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter(
      (s) => s.name.toLowerCase().includes(q) || s.section.toLowerCase().includes(q)
    );
  }, [services, query]);

  const groups = useMemo(() => {
    const sections = [...new Set(flat.map((s) => s.section))];
    return sections.map((section) => ({
      section,
      items: flat.filter((s) => s.section === section),
    }));
  }, [flat]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Focus search when opening; reset active to selected or top
  useEffect(() => {
    if (open) {
      searchRef.current?.focus();
      const idx = flat.findIndex((s) => s.name === value);
      setActive(idx >= 0 ? idx : 0);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the active option scrolled into view
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function choose(serviceName: string) {
    setValue(serviceName);
    setOpen(false);
    setQuery("");
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flat[active]) choose(flat[active].name);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`${triggerClassName} flex items-center justify-between gap-2 text-left`}
      >
        <span className={selected ? "truncate text-mist-950" : "text-mist-400"}>
          {selected ? `${selected.name} · K${selected.price.toLocaleString()}` : "Choose a treatment…"}
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-mist-400" aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-mist-200 bg-white shadow-lg">
          <div className="border-b border-mist-100 p-2">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-400"
                aria-hidden="true"
              />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Search treatments…"
                aria-label="Search treatments"
                className="w-full rounded-lg border border-mist-200 bg-white py-2 pl-9 pr-9 text-sm text-mist-900 placeholder:text-mist-400 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    searchRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-mist-400 hover:bg-mist-100 hover:text-mist-700"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <ul ref={listRef} role="listbox" className="max-h-72 overflow-y-auto p-1">
            {flat.length === 0 && (
              <li className="px-3 py-8 text-center text-sm text-mist-500">
                No treatments match “{query}”.
              </li>
            )}
            {groups.map((g) => (
              <li key={g.section}>
                <p className="px-3 pb-1 pt-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-mist-500">
                  {g.section}
                </p>
                <ul>
                  {g.items.map((s) => {
                    const idx = flat.indexOf(s);
                    const isSel = s.name === value;
                    const isActive = idx === active;
                    return (
                      <li key={s.name}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={isSel}
                          data-idx={idx}
                          onClick={() => choose(s.name)}
                          onMouseEnter={() => setActive(idx)}
                          className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                            isActive ? "bg-mist-100" : "hover:bg-mist-50"
                          }`}
                        >
                          <span className="text-mist-900">{s.name}</span>
                          <span className="flex shrink-0 items-center gap-2">
                            <span className="tabular-nums text-mist-600">
                              K{s.price.toLocaleString()}
                            </span>
                            {isSel && <Check className="h-4 w-4 text-mist-600" aria-hidden="true" />}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
