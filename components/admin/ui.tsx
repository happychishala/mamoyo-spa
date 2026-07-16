import type { BookingStatus, InvoiceStatus, StayStatus, TransactionType } from "@/lib/db";

const badgeStyles: Record<string, string> = {
  // Bookings
  Pending: "bg-amber-50 text-amber-800 border-amber-200",
  Confirmed: "bg-mist-100 text-mist-800 border-mist-300",
  Completed: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Cancelled: "bg-slate-100 text-slate-600 border-slate-200",
  // Invoices
  Draft: "bg-slate-100 text-slate-600 border-slate-200",
  Sent: "bg-mist-100 text-mist-800 border-mist-300",
  Paid: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Overdue: "bg-red-50 text-red-800 border-red-200",
  // Transactions
  Income: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Expense: "bg-red-50 text-red-700 border-red-200",
  // Stays
  CheckedIn: "bg-mist-100 text-mist-800 border-mist-300",
  CheckedOut: "bg-slate-100 text-slate-600 border-slate-200",
};

const badgeLabels: Record<string, string> = {
  CheckedIn: "Checked in",
  CheckedOut: "Checked out",
};

// Statuses that still need eyes on them get a live "ping" dot: a new request
// awaiting confirmation, and a confirmed booking that's coming up.
const pingStatuses = new Set<string>(["Pending", "Confirmed"]);

export function StatusBadge({
  status,
}: {
  status: BookingStatus | InvoiceStatus | StayStatus | TransactionType;
}) {
  const ping = pingStatuses.has(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        badgeStyles[status] ?? "bg-slate-100 text-slate-600 border-slate-200"
      }`}
    >
      {ping && (
        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full rounded-full bg-current opacity-60 motion-safe:animate-ping" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {badgeLabels[status] ?? status}
    </span>
  );
}

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-mist-950">{title}</h1>
      <p className="mt-1.5 text-sm text-mist-700">{description}</p>
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-mist-200 bg-white shadow-soft ${className}`}>
      {children}
    </div>
  );
}

export function NoAccess({ area }: { area: string }) {
  return (
    <Card className="mx-auto mt-20 max-w-md p-10 text-center">
      <h1 className="font-serif text-xl font-semibold text-mist-950">Managers only</h1>
      <p className="mt-2 text-sm text-mist-700">
        {area} is available to managers and the owner. Ask them if you need something here.
      </p>
    </Card>
  );
}
