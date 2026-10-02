"use client";

import { useMemo, useRef, useState } from "react";
import { Search, Check, X, ChevronDown } from "lucide-react";

export type ExperienceGroup = { group: string; items: string[] };

/**
 * Searchable, category-grouped, multi-select picker for gift experiences.
 * Selected values are submitted as repeated hidden inputs under `name`, so the
 * server reads them with formData.getAll(name).
 */
export default function ExperiencePicker({
  name,
  groups,
  initial = [],
}: {
  name: string;
  groups: ExperienceGroup[];
  initial?: string[];
}) {
  const [selected, setSelected] = useState<string[]>(initial);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      groups
        .map((g) => ({ group: g.group, items: q ? g.items.filter((i) => i.toLowerCase().includes(q)) : g.items }))
        .filter((g) => g.items.length > 0),
    [groups, q]
  );

  const toggle = (item: string) =>
    setSelected((cur) => (cur.includes(item) ? cur.filter((i) => i !== item) : [...cur, item]));
  const remove = (item: string) => setSelected((cur) => cur.filter((i) => i !== item));

  return (
    <div
      className="relative"
      onBlur={() => {
        blurTimer.current = setTimeout(() => setOpen(false), 120);
      }}
      onFocus={() => {
        if (blurTimer.current) clearTimeout(blurTimer.current);
      }}
    >
      {selected.map((s) => (
        <input key={s} type="hidden" name={name} value={s} />
      ))}

      {selected.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {selected.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 rounded-full bg-mist-100 px-2.5 py-1 text-xs font-medium text-mist-800">
              {s}
              <button type="button" onClick={() => remove(s)} aria-label={`Remove ${s}`} className="text-mist-500 hover:text-red-600">
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-400" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={selected.length ? "Add another treatment…" : "Search treatments…"}
          className="w-full rounded-xl border border-mist-200 bg-white py-2.5 pl-9 pr-9 text-sm text-mist-950 placeholder:text-mist-400 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200"
        />
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-400" aria-hidden="true" />
      </div>

      {open && (
        <div className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-mist-200 bg-white shadow-lift">
          {filtered.length === 0 ? (
            <p className="px-3 py-4 text-sm text-mist-500">No treatments match “{query.trim()}”.</p>
          ) : (
            filtered.map((g) => (
              <div key={g.group}>
                <p className="sticky top-0 bg-mist-50 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-wide text-mist-500">
                  {g.group}
                </p>
                {g.items.map((item) => {
                  const on = selected.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        toggle(item);
                      }}
                      className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors duration-150 hover:bg-mist-50 ${
                        on ? "text-mist-950" : "text-mist-800"
                      }`}
                    >
                      {item}
                      {on && <Check className="h-4 w-4 shrink-0 text-mist-600" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
