"use client";

import { useMemo, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  Download,
  Printer,
  X,
} from "lucide-react";

export type DataColumn<T> = {
  /** Unique key; also the default accessor into the row. */
  key: string;
  header: string;
  /** Rich display cell. Falls back to the plain value. */
  cell?: (row: T) => React.ReactNode;
  /** Canonical value used for search, sort and export. Defaults to row[key]. */
  value?: (row: T) => string | number;
  align?: "left" | "right";
  /** Show a dropdown filter of this column's distinct values. */
  filterable?: boolean;
  /** Default true. Set false for an actions column. */
  sortable?: boolean;
  searchable?: boolean;
  exportable?: boolean;
  cellClassName?: string;
};

type SortState = { key: string; dir: "asc" | "desc" } | null;

function rawValue<T>(row: T, col: DataColumn<T>): string | number {
  if (col.value) return col.value(row);
  const v = (row as Record<string, unknown>)[col.key];
  return v == null ? "" : (v as string | number);
}

function text<T>(row: T, col: DataColumn<T>): string {
  return String(rawValue(row, col));
}

function csvCell(v: string): string {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

function downloadBlob(content: string, mime: string, filename: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function DataTable<T>({
  rows,
  columns,
  filename = "export",
  title,
  pageSize = 10,
  searchPlaceholder = "Search…",
  initialSort,
  emptyMessage = "Nothing to show yet.",
  rowClassName,
}: {
  rows: T[];
  columns: DataColumn<T>[];
  filename?: string;
  title?: string;
  pageSize?: number;
  searchPlaceholder?: string;
  initialSort?: { key: string; dir: "asc" | "desc" };
  emptyMessage?: string;
  rowClassName?: (row: T) => string | undefined;
}) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<SortState>(initialSort ?? null);
  const [page, setPage] = useState(1);

  const filterCols = columns.filter((c) => c.filterable);
  const searchCols = columns.filter((c) => c.searchable !== false && c.sortable !== false);

  const filterOptions = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const col of filterCols) {
      map[col.key] = [...new Set(rows.map((r) => text(r, col)).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b)
      );
    }
    return map;
  }, [rows, filterCols]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      for (const [key, val] of Object.entries(filters)) {
        if (!val) continue;
        const col = columns.find((c) => c.key === key);
        if (col && text(row, col) !== val) return false;
      }
      if (!q) return true;
      return searchCols.some((col) => text(row, col).toLowerCase().includes(q));
    });
  }, [rows, query, filters, columns, searchCols]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return filtered;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = rawValue(a, col);
      const bv = rawValue(b, col);
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv), undefined, { numeric: true }) * dir;
    });
  }, [filtered, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);
  const activeFilters = Object.values(filters).filter(Boolean).length;

  function toggleSort(col: DataColumn<T>) {
    if (col.sortable === false) return;
    setPage(1);
    setSort((s) =>
      s?.key === col.key
        ? s.dir === "asc"
          ? { key: col.key, dir: "desc" }
          : null
        : { key: col.key, dir: "asc" }
    );
  }

  const exportCols = columns.filter((c) => c.exportable !== false);
  const stamp = new Date().toISOString().slice(0, 10);

  function exportCsv() {
    const header = exportCols.map((c) => csvCell(c.header)).join(",");
    const body = sorted.map((row) => exportCols.map((c) => csvCell(text(row, c))).join(",")).join("\n");
    downloadBlob(`﻿${header}\n${body}`, "text/csv;charset=utf-8", `${filename}-${stamp}.csv`);
  }

  function exportPdf() {
    const head = exportCols
      .map((c) => `<th style="text-align:${c.align === "right" ? "right" : "left"}">${esc(c.header)}</th>`)
      .join("");
    const body = sorted
      .map(
        (row) =>
          `<tr>${exportCols
            .map(
              (c) =>
                `<td style="text-align:${c.align === "right" ? "right" : "left"}">${esc(text(row, c))}</td>`
            )
            .join("")}</tr>`
      )
      .join("");
    const doc = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(
      title ?? filename
    )}</title><style>
      *{font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;}
      body{margin:32px;color:#174a52;}
      h1{font-size:18px;margin:0 0 2px;color:#0c3137;}
      .meta{color:#6f8b8f;font-size:12px;margin:0 0 18px;}
      table{border-collapse:collapse;width:100%;font-size:12px;}
      th{text-transform:uppercase;letter-spacing:.05em;font-size:10px;color:#166f7a;
        border-bottom:2px solid #bde6eb;padding:8px 10px;}
      td{padding:7px 10px;border-bottom:1px solid #e8f2f3;color:#175a63;}
      tr:nth-child(even) td{background:#f4fafb;}
      @media print{@page{margin:14mm;}}
    </style></head><body>
      <h1>${esc(title ?? filename)}</h1>
      <p class="meta">MaMoyo Wellness &amp; Beauty · ${sorted.length} rows · ${stamp}</p>
      <table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>
      <script>window.onload=function(){setTimeout(function(){window.print();},250);};<\/script>
    </body></html>`;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.open();
    w.document.write(doc);
    w.document.close();
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[180px] flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
            aria-label="Search table"
            className="w-full rounded-full border border-mist-200 bg-white py-2 pl-9 pr-3 text-sm text-mist-900 placeholder:text-mist-400 focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200"
          />
        </div>

        {filterCols.map((col) => (
          <div key={col.key} className="relative">
            <label htmlFor={`filter-${col.key}`} className="sr-only">
              Filter by {col.header}
            </label>
            <select
              id={`filter-${col.key}`}
              value={filters[col.key] ?? ""}
              onChange={(e) => {
                setFilters((f) => ({ ...f, [col.key]: e.target.value }));
                setPage(1);
              }}
              className={`cursor-pointer rounded-full border bg-white py-2 pl-3.5 pr-8 text-sm focus:border-mist-500 focus:outline-none focus:ring-2 focus:ring-mist-200 ${
                filters[col.key]
                  ? "border-mist-400 text-mist-900"
                  : "border-mist-200 text-mist-600"
              }`}
            >
              <option value="">All {col.header.toLowerCase()}</option>
              {filterOptions[col.key]?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}

        {(query || activeFilters > 0) && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilters({});
              setPage(1);
            }}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-2 text-xs font-medium text-mist-600 transition-colors hover:bg-mist-100 hover:text-mist-900"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={exportCsv}
            disabled={sorted.length === 0}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-mist-300 px-3.5 py-2 text-xs font-semibold text-mist-700 transition-colors hover:border-mist-400 hover:bg-mist-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            Excel
          </button>
          <button
            type="button"
            onClick={exportPdf}
            disabled={sorted.length === 0}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-mist-300 px-3.5 py-2 text-xs font-semibold text-mist-700 transition-colors hover:border-mist-400 hover:bg-mist-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden="true" />
            PDF
          </button>
        </div>
      </div>

      {/* Table (tablet & desktop) */}
      <div className="mt-4 hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-mist-200 text-xs font-semibold uppercase tracking-wide text-mist-600">
              {columns.map((col) => {
                const active = sort?.key === col.key;
                const canSort = col.sortable !== false;
                return (
                  <th
                    key={col.key}
                    className={`pb-3 ${col.align === "right" ? "pl-4 text-right" : "pr-4"}`}
                  >
                    {canSort ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col)}
                        className={`inline-flex cursor-pointer items-center gap-1 uppercase tracking-wide transition-colors hover:text-mist-900 ${
                          col.align === "right" ? "flex-row-reverse" : ""
                        } ${active ? "text-mist-900" : ""}`}
                      >
                        {col.header}
                        {active ? (
                          sort?.dir === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-3 w-3 text-mist-300" aria-hidden="true" />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-mist-100">
            {pageRows.map((row, i) => (
              <tr key={i} className={rowClassName?.(row)}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`py-3.5 ${col.align === "right" ? "pl-4 text-right" : "pr-4"} ${
                      col.cellClassName ?? "text-mist-800"
                    }`}
                  >
                    {col.cell ? col.cell(row) : text(row, col)}
                  </td>
                ))}
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-mist-600">
                  {rows.length === 0 ? emptyMessage : "No matches — try a different search or filter."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards (mobile) — no horizontal scroll, easy vertical scrolling */}
      <div className="mt-4 space-y-3 sm:hidden">
        {pageRows.map((row, i) => {
          const [first, ...rest] = columns;
          const rc = rowClassName?.(row);
          return (
            <div
              key={i}
              className={`rounded-xl border border-mist-200 p-4 shadow-soft ${rc ?? "bg-white"}`}
            >
              <div className="mb-2 text-sm font-semibold text-mist-950">
                {first.cell ? first.cell(row) : text(row, first)}
              </div>
              <dl className="space-y-1.5">
                {rest.map((col) =>
                  col.exportable === false ? (
                    <dd key={col.key} className="pt-2">
                      {col.cell ? col.cell(row) : text(row, col)}
                    </dd>
                  ) : (
                    <div key={col.key} className="flex items-baseline justify-between gap-3">
                      <dt className="shrink-0 text-xs font-medium uppercase tracking-wide text-mist-500">
                        {col.header}
                      </dt>
                      <dd className={`text-right text-sm ${col.cellClassName ?? "text-mist-800"}`}>
                        {col.cell ? col.cell(row) : text(row, col)}
                      </dd>
                    </div>
                  )
                )}
              </dl>
            </div>
          );
        })}
        {pageRows.length === 0 && (
          <div className="rounded-xl border border-mist-200 bg-white p-8 text-center text-sm text-mist-600">
            {rows.length === 0 ? emptyMessage : "No matches — try a different search or filter."}
          </div>
        )}
      </div>

      {/* Footer / pagination */}
      {sorted.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-mist-100 pt-4">
          <p className="text-xs text-mist-600">
            Showing {start + 1}–{Math.min(start + pageSize, sorted.length)} of {sorted.length}
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={current === 1}
                aria-label="Previous page"
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-mist-700 transition-colors hover:bg-mist-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="px-2 text-xs font-medium tabular-nums text-mist-700">
                Page {current} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={current === totalPages}
                aria-label="Next page"
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-mist-700 transition-colors hover:bg-mist-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
