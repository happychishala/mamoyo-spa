const kwacha = new Intl.NumberFormat("en-ZM", {
  maximumFractionDigits: 0,
});

export function formatMoney(amount: number): string {
  // Zambian convention: K1,250 rather than the ZK prefix Intl produces for ZMW
  return amount < 0 ? `-K${kwacha.format(-amount)}` : `K${kwacha.format(amount)}`;
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function monthLabel(yyyyMm: string): string {
  return new Date(`${yyyyMm}-01T00:00:00`).toLocaleDateString("en-GB", {
    month: "short",
  });
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysISO(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
