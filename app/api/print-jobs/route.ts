import { readDb, writeDb } from "@/lib/db";
import { locationInfo, contactInfo } from "@/lib/content";
import { inclusiveVatBreakdown, VAT_RATE } from "@/lib/tax";
import { formatAmount } from "@/lib/format";

/**
 * Print-bridge queue. A small program on the café LAN polls GET (with the
 * PRINT_BRIDGE_TOKEN) to fetch pending POS receipts as structured data, prints
 * them to the Epson via ESC/POS, then POSTs the job ids back as printed.
 * Protected by PRINT_BRIDGE_TOKEN so only the bridge can read the queue.
 */
function authorized(request: Request): boolean {
  const token = process.env.PRINT_BRIDGE_TOKEN;
  return Boolean(token) && request.headers.get("authorization") === `Bearer ${token}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) return new Response("Unauthorized", { status: 401 });

  const db = await readDb();
  const pending = (db.printJobs ?? []).filter((j) => j.status === "pending").slice(0, 20);

  const jobs = pending
    .map((job) => {
      const r = db.receipts.find((x) => x.id === job.receiptId);
      if (!r) return null;
      const m = (n: number) => formatAmount(n, r.currency);
      const vat = inclusiveVatBreakdown(r.amount);
      const branch = locationInfo[r.location ?? "Kabulonga"];
      const items = (r.items ?? []).map((it) => ({
        name: it.description,
        qty: it.qty,
        price: m(it.unitPrice),
        amount: m(it.qty * it.unitPrice),
      }));
      return {
        id: job.id,
        receipt: {
          title: r.invoiceNumber.startsWith("POS-") ? "MaMoyo Cafe" : "MaMoyo",
          branch: branch.name,
          address: branch.address,
          phone: contactInfo.phone,
          number: r.number,
          date: r.date,
          reference: r.invoiceNumber,
          customer: r.customer,
          items,
          subtotal: m(vat.netAmount),
          vat: m(vat.vatAmount),
          vatRate: `${VAT_RATE * 100}%`,
          total: m(r.amount),
          payments:
            r.payments && r.payments.length > 1
              ? r.payments.map((p) => ({ method: p.method, amount: m(p.amount) }))
              : null,
          method: r.method,
        },
      };
    })
    .filter(Boolean);

  return Response.json({ jobs });
}

export async function POST(request: Request) {
  if (!authorized(request)) return new Response("Unauthorized", { status: 401 });

  let body: { ids?: string[] };
  try {
    body = await request.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  const ids = Array.isArray(body.ids) ? body.ids.map(String) : [];
  if (ids.length === 0) return Response.json({ ok: true, marked: 0 });

  const db = await readDb();
  const now = new Date().toISOString();
  let marked = 0;
  for (const job of db.printJobs ?? []) {
    if (ids.includes(job.id) && job.status === "pending") {
      job.status = "printed";
      job.printedAt = now;
      marked++;
    }
  }
  // Trim old printed jobs so the queue stays small.
  db.printJobs = (db.printJobs ?? []).filter((j) => j.status === "pending").concat(
    (db.printJobs ?? []).filter((j) => j.status === "printed").slice(0, 50)
  );
  if (marked > 0) await writeDb(db);
  return Response.json({ ok: true, marked });
}
