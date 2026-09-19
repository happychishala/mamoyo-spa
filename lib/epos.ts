// Epson ePOS-Print: build the XML print document a browser POSTs straight to the
// printer at http(s)://<printer>/cgi-bin/epos/service.cgi. Pure + client-safe.

export interface EposReceipt {
  title: string;
  branch: string;
  address?: string;
  phone?: string;
  number: string;
  date: string;
  reference: string;
  customer: string;
  items: { name: string; qty: number; price: string; amount: string }[];
  subtotal: string;
  vat: string;
  vatRate: string;
  total: string;
  payments?: { method: string; amount: string }[] | null;
  method: string;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** left text + right text padded to `width` columns. */
function row(left: string, right: string, width: number): string {
  let l = left;
  const r = right;
  let gap = width - l.length - r.length;
  if (gap < 1) {
    l = l.slice(0, Math.max(0, width - r.length - 1));
    gap = width - l.length - r.length;
  }
  return l + " ".repeat(Math.max(1, gap)) + r;
}

/** Build the ePOS-Print XML for a receipt. `width` = characters per line. */
export function buildEposXml(rec: EposReceipt, width = 42): string {
  const line = (s: string) => `<text>${esc(s)}&#10;</text>`;
  const rule = `<text>${"-".repeat(width)}&#10;</text>`;

  const parts: string[] = [];
  parts.push(`<text align="center"/>`);
  parts.push(`<text em="true" dw="true" dh="true">${esc(rec.title)}&#10;</text>`);
  parts.push(`<text em="false" dw="false" dh="false"/>`);
  parts.push(line(rec.branch));
  if (rec.address) parts.push(line(rec.address));
  if (rec.phone) parts.push(line(rec.phone));
  parts.push(`<text align="left"/>`);
  parts.push(rule);
  parts.push(line(row("Receipt", rec.number, width)));
  parts.push(line(row("Date", rec.date, width)));
  parts.push(line(row("Ref", rec.reference, width)));
  parts.push(line(row("Customer", rec.customer, width)));
  parts.push(rule);
  for (const it of rec.items) {
    parts.push(line(it.name));
    parts.push(line(row(`  ${it.qty} x ${it.price}`, it.amount, width)));
  }
  parts.push(rule);
  parts.push(line(row("Subtotal excl. VAT", rec.subtotal, width)));
  parts.push(line(row(`VAT (${rec.vatRate})`, rec.vat, width)));
  parts.push(`<text em="true" dw="true">${esc(row("TOTAL", rec.total, Math.floor(width / 2)))}&#10;</text>`);
  parts.push(`<text em="false" dw="false"/>`);
  parts.push(rule);
  if (rec.payments && rec.payments.length > 0) {
    parts.push(line("Paid by:"));
    for (const p of rec.payments) parts.push(line(row(p.method, p.amount, width)));
  } else {
    parts.push(line(row("Paid by", rec.method, width)));
  }
  parts.push(`<text align="center"/>`);
  parts.push(line(""));
  parts.push(line("Thank you - see you again!"));
  parts.push(line("spa - cafe - suites - wellness"));
  parts.push(`<feed line="2"/>`);
  parts.push(`<cut type="feed"/>`);

  return (
    `<?xml version="1.0" encoding="utf-8"?>` +
    `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body>` +
    `<epos-print xmlns="http://www.epson-pos.com/schemas/2011/03/epos-print">` +
    parts.join("") +
    `</epos-print></s:Body></s:Envelope>`
  );
}

/** Normalise a printer address into its ePOS-Print service URL. */
export function eposEndpoint(host: string): string {
  let h = host.trim().replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(h)) h = `https://${h}`;
  return `${h}/cgi-bin/epos/service.cgi?devid=local_printer&timeout=10000`;
}
