import { getSession } from "@/lib/auth";
import { readDb, TREATMENT_PAYMENTS, LOCATIONS } from "@/lib/db";

function csvCell(v: string | number): string {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function row(...cells: (string | number)[]): string {
  return cells.map(csvCell).join(",");
}

/** Monthly treatments report as CSV (opens in Excel). */
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const url = new URL(request.url);
  const monthParam = url.searchParams.get("month") ?? "";
  const month = /^\d{4}-\d{2}$/.test(monthParam) ? monthParam : new Date().toISOString().slice(0, 7);

  const db = await readDb();
  const rows = db.treatments.filter((t) => t.date.startsWith(month));
  const total = rows.reduce((s, t) => s + t.amount, 0);

  const lines: string[] = [];
  lines.push(row("MaMoyo monthly report", month));
  lines.push("");

  lines.push(row("Revenue by branch", "Amount (K)", "% of month"));
  for (const loc of LOCATIONS) {
    const t = rows.filter((r) => (r.location ?? "Kabulonga") === loc).reduce((s, r) => s + r.amount, 0);
    lines.push(row(loc, t, total > 0 ? Math.round((t / total) * 100) : 0));
  }
  lines.push(row("Total", total, 100));
  lines.push("");

  lines.push(row("By payment method", "Amount (K)"));
  for (const p of TREATMENT_PAYMENTS) {
    lines.push(row(p, rows.filter((r) => r.payment === p).reduce((s, r) => s + r.amount, 0)));
  }
  lines.push("");

  lines.push(row("By therapist", "Target (K)", "Revenue (K)", "% of target"));
  for (const th of db.therapists) {
    const t = rows.filter((r) => r.therapist === th.name).reduce((s, r) => s + r.amount, 0);
    if (!th.active && t === 0) continue;
    lines.push(row(th.name, th.monthlyTarget, t, th.monthlyTarget > 0 ? Math.round((t / th.monthlyTarget) * 100) : 0));
  }
  lines.push("");

  lines.push(row("Treatments", "Date", "Therapist", "Service", "Branch", "Payment", "Amount (K)"));
  for (const r of [...rows].sort((a, b) => a.date.localeCompare(b.date))) {
    lines.push(row("", r.date, r.therapist, r.service, r.location ?? "Kabulonga", r.payment, r.amount));
  }

  const csv = "﻿" + lines.join("\n"); // BOM so Excel reads UTF-8
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="mamoyo-report-${month}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
