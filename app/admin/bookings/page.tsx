import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { Check, X, CheckCheck, Pencil, UserCheck } from "lucide-react";
import { readDb, TREATMENT_PAYMENTS, type Booking } from "@/lib/db";
import { updateBookingStatus, assignBookingTherapist } from "@/lib/actions";
import { bookableServices } from "@/lib/content";
import { formatMoney, formatDate, todayISO } from "@/lib/format";
import { PageHeader, Card, StatusBadge } from "@/components/admin/ui";
import NewBookingForm from "./NewBookingForm";
import EditBookingForm from "./EditBookingForm";

export const metadata: Metadata = { title: "Bookings" };
export const dynamic = "force-dynamic";

const BOOKINGS_PER_PAGE = 6;

function bookingStartsAt(date: string, time: string): Date {
  return new Date(`${date}T${time || "00:00"}:00`);
}

async function currentTimestamp(): Promise<number> {
  return Date.now();
}

/** Therapist assignment control (open bookings) or plain name — shared by table & cards. */
function TherapistControl({
  booking,
  therapistNames,
  open,
}: {
  booking: Booking;
  therapistNames: string[];
  open: boolean;
}) {
  if (!open) return <span className="text-mist-800">{booking.therapist ?? "—"}</span>;
  return (
    <form action={assignBookingTherapist} className="flex items-center gap-1.5">
      <input type="hidden" name="id" value={booking.id} />
      <label htmlFor={`therapist-${booking.id}`} className="sr-only">
        Therapist for {booking.ref}
      </label>
      <select
        id={`therapist-${booking.id}`}
        name="therapist"
        defaultValue={booking.therapist ?? ""}
        className="rounded-full border border-mist-200 bg-white px-2.5 py-1.5 text-xs text-mist-800 focus:border-mist-500 focus:outline-none"
      >
        <option value="">Unassigned</option>
        {therapistNames.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <button
        type="submit"
        aria-label={`Save therapist for ${booking.ref}`}
        className="cursor-pointer rounded-full bg-mist-100 p-1.5 text-mist-700 transition-colors duration-200 hover:bg-mist-600 hover:text-white"
      >
        <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </form>
  );
}

/** Confirm / complete / cancel / edit controls — shared by table & cards. */
function BookingActions({
  b,
  open,
  editable,
  isEditing,
  currentPage,
  returnTo,
  align = "end",
}: {
  b: Booking;
  open: boolean;
  editable: boolean;
  isEditing: boolean;
  currentPage: number;
  returnTo: string;
  align?: "start" | "end";
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${align === "end" ? "justify-end" : "justify-start"}`}
    >
      {editable && (
        <Link
          href={isEditing ? returnTo : `/admin/bookings?page=${currentPage}&edit=${b.id}`}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-mist-300 px-3.5 py-2 text-xs font-semibold text-mist-700 transition-colors duration-200 hover:border-mist-500 hover:bg-mist-50"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          {isEditing ? "Close edit" : "Edit"}
        </Link>
      )}
      {b.status === "Pending" && (
        <form action={updateBookingStatus}>
          <input type="hidden" name="id" value={b.id} />
          <input type="hidden" name="status" value="Confirmed" />
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-mist-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
          >
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            Confirm
          </button>
        </form>
      )}
      {b.status === "Confirmed" &&
        (b.therapist ? (
          <form action={updateBookingStatus} className="flex flex-wrap items-center gap-2">
            <input type="hidden" name="id" value={b.id} />
            <input type="hidden" name="status" value="Completed" />
            <label htmlFor={`payment-${b.id}`} className="sr-only">
              Payment type for {b.ref}
            </label>
            <select
              id={`payment-${b.id}`}
              name="payment"
              defaultValue="Cash"
              className="rounded-full border border-mist-200 bg-white px-2.5 py-1.5 text-xs text-mist-800 focus:border-mist-500 focus:outline-none"
            >
              {TREATMENT_PAYMENTS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <label htmlFor={`paid-${b.id}`} className="sr-only">
              Amount paid for {b.ref}
            </label>
            <input
              id={`paid-${b.id}`}
              name="amountPaid"
              type="number"
              min="0"
              max={b.price}
              step="0.01"
              defaultValue={b.price}
              title="Amount paid now — enter less for a partial payment"
              className="w-20 rounded-full border border-mist-200 bg-white px-2.5 py-1.5 text-right text-xs text-mist-800 focus:border-mist-500 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-emerald-700"
            >
              <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Complete
            </button>
          </form>
        ) : (
          <span className="rounded-full border border-dashed border-mist-300 px-3 py-1.5 text-xs text-mist-500">
            Assign therapist to complete
          </span>
        ))}
      {open && (
        <form action={updateBookingStatus}>
          <input type="hidden" name="id" value={b.id} />
          <input type="hidden" name="status" value="Cancelled" />
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-mist-300 px-3.5 py-2 text-xs font-semibold text-mist-700 transition-colors duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default async function BookingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; edit?: string }>;
}) {
  const db = await readDb();
  const params = await searchParams;
  const now = await currentTimestamp();
  const therapistNames = db.therapists.filter((t) => t.active).map((t) => t.name);
  const serviceOptions = [
    ...bookableServices.map((s) => ({
      name: s.name,
      price: s.price,
      durationMin: s.durationMin,
      section: s.section,
    })),
    { name: "Salon — braids & styling", price: 550, durationMin: 60, section: "Salon" },
    { name: "Barber — cut & beard trim", price: 250, durationMin: 30, section: "Barber" },
  ];
  const bookings = [...db.bookings].sort((a, b) =>
    `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`)
  );
  const totalPages = Math.max(1, Math.ceil(bookings.length / BOOKINGS_PER_PAGE));
  const requestedPage = Number(params?.page ?? "1");
  const currentPage = Math.min(
    totalPages,
    Math.max(1, Number.isFinite(requestedPage) ? Math.trunc(requestedPage) : 1)
  );
  const pageStart = (currentPage - 1) * BOOKINGS_PER_PAGE;
  const visibleBookings = bookings.slice(pageStart, pageStart + BOOKINGS_PER_PAGE);
  const editId = params?.edit ?? "";
  const returnTo = `/admin/bookings?page=${currentPage}`;

  const rowState = (b: Booking) => {
    const open = b.status === "Pending" || b.status === "Confirmed";
    const editable = open && bookingStartsAt(b.date, b.time).getTime() > now;
    return { open, editable, isEditing: editable && editId === b.id };
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Bookings"
        description="Assign a therapist as each request comes in. Completing a booking logs it straight into Reports with the payment type."
      />

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-3">
        <Card className="h-fit p-6 2xl:col-span-1">
          <h2 className="font-serif text-lg font-semibold text-mist-950">Walk-in / phone booking</h2>
          <p className="mt-1 text-sm text-mist-700">
            Salon chairs, barber cuts, phone reservations — everything gets a booking so the revenue is traceable.
          </p>
          <div className="mt-5">
            <NewBookingForm
              serviceOptions={serviceOptions}
              therapists={therapistNames}
              defaultDate={todayISO()}
            />
          </div>
        </Card>

        <Card className="min-w-0 p-6 2xl:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-lg font-semibold text-mist-950">Bookings list</h2>
              <p className="mt-1 text-xs text-mist-600">
                Showing {bookings.length === 0 ? 0 : pageStart + 1}-
                {Math.min(pageStart + BOOKINGS_PER_PAGE, bookings.length)} of {bookings.length}
              </p>
            </div>
            {totalPages > 1 && (
              <p className="text-xs font-medium text-mist-600">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>

          {/* Table (tablet & desktop) */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1020px] text-left text-sm">
              <thead>
                <tr className="border-b border-mist-200 text-xs font-semibold uppercase tracking-wide text-mist-600">
                  <th className="pb-3 pr-4">Ref</th>
                  <th className="pb-3 pr-4">Guest</th>
                  <th className="pb-3 pr-4">Treatment</th>
                  <th className="pb-3 pr-4">When</th>
                  <th className="pb-3 pr-4">Price</th>
                  <th className="pb-3 pr-4">Therapist</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist-100">
                {visibleBookings.map((b) => {
                  const { open, editable, isEditing } = rowState(b);
                  return (
                    <Fragment key={b.id}>
                      <tr className="align-top">
                        <td className="py-4 pr-4 font-medium text-mist-950">{b.ref}</td>
                        <td className="py-4 pr-4">
                          <p className="font-medium text-mist-950">{b.customer}</p>
                          <p className="text-xs text-mist-600">{b.phone || b.email}</p>
                        </td>
                        <td className="py-4 pr-4 text-mist-800">
                          {b.service}
                          {b.notes && <p className="mt-1 text-xs italic text-mist-600">“{b.notes}”</p>}
                        </td>
                        <td className="py-4 pr-4 text-mist-800">
                          {formatDate(b.date)}
                          <p className="text-xs text-mist-600">
                            {b.time} · {b.durationMin} min
                          </p>
                          <p className="mt-0.5 text-xs font-medium text-mist-600">
                            {b.location ?? "Kabulonga"}
                          </p>
                        </td>
                        <td className="py-4 pr-4 font-semibold text-mist-950">{formatMoney(b.price)}</td>
                        <td className="py-4 pr-4">
                          <TherapistControl booking={b} therapistNames={therapistNames} open={open} />
                        </td>
                        <td className="py-4 pr-4">
                          <StatusBadge status={b.status} />
                        </td>
                        <td className="py-4">
                          <BookingActions
                            b={b}
                            open={open}
                            editable={editable}
                            isEditing={isEditing}
                            currentPage={currentPage}
                            returnTo={returnTo}
                          />
                        </td>
                      </tr>
                      {isEditing && (
                        <tr>
                          <td colSpan={8} className="pb-5 pr-0">
                            <EditBookingForm
                              booking={b}
                              serviceOptions={serviceOptions}
                              therapists={therapistNames}
                              returnTo={returnTo}
                            />
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cards (mobile & tablet) — no horizontal scroll */}
          <div className="space-y-3 lg:hidden">
            {visibleBookings.map((b) => {
              const { open, editable, isEditing } = rowState(b);
              return (
                <div key={b.id} className="rounded-xl border border-mist-200 bg-white p-4 shadow-soft">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-mist-950">{b.ref}</p>
                      <p className="truncate text-sm text-mist-900">{b.customer}</p>
                      <p className="truncate text-xs text-mist-600">{b.phone || b.email}</p>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                  <dl className="mt-3 space-y-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="shrink-0 text-xs font-medium uppercase tracking-wide text-mist-500">Treatment</dt>
                      <dd className="text-right text-sm text-mist-800">
                        {b.service}
                        {b.notes && (
                          <span className="mt-0.5 block text-xs italic text-mist-600">“{b.notes}”</span>
                        )}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="shrink-0 text-xs font-medium uppercase tracking-wide text-mist-500">When</dt>
                      <dd className="text-right text-sm text-mist-800">
                        {formatDate(b.date)}
                        <span className="block text-xs text-mist-600">
                          {b.time} · {b.durationMin} min · {b.location ?? "Kabulonga"}
                        </span>
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="shrink-0 text-xs font-medium uppercase tracking-wide text-mist-500">Price</dt>
                      <dd className="text-right text-sm font-semibold text-mist-950">{formatMoney(b.price)}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="shrink-0 text-xs font-medium uppercase tracking-wide text-mist-500">Therapist</dt>
                      <dd>
                        <TherapistControl booking={b} therapistNames={therapistNames} open={open} />
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-3 border-t border-mist-100 pt-3">
                    <BookingActions
                      b={b}
                      open={open}
                      editable={editable}
                      isEditing={isEditing}
                      currentPage={currentPage}
                      returnTo={returnTo}
                      align="start"
                    />
                  </div>
                  {isEditing && (
                    <div className="mt-4">
                      <EditBookingForm
                        booking={b}
                        serviceOptions={serviceOptions}
                        therapists={therapistNames}
                        returnTo={returnTo}
                      />
                    </div>
                  )}
                </div>
              );
            })}
            {visibleBookings.length === 0 && (
              <div className="rounded-xl border border-mist-200 bg-white p-8 text-center text-sm text-mist-500">
                No bookings yet.
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-5 flex items-center justify-between border-t border-mist-100 pt-4">
              <Link
                href={`/admin/bookings?page=${Math.max(1, currentPage - 1)}`}
                aria-disabled={currentPage === 1}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors duration-200 ${
                  currentPage === 1
                    ? "pointer-events-none border-mist-100 text-mist-300"
                    : "border-mist-200 text-mist-700 hover:border-mist-400 hover:bg-mist-50"
                }`}
              >
                Previous
              </Link>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Link
                    key={page}
                    href={`/admin/bookings?page=${page}`}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-xs font-semibold transition-colors duration-200 ${
                      page === currentPage
                        ? "bg-mist-600 text-white"
                        : "text-mist-600 hover:bg-mist-100 hover:text-mist-950"
                    }`}
                  >
                    {page}
                  </Link>
                ))}
              </div>
              <Link
                href={`/admin/bookings?page=${Math.min(totalPages, currentPage + 1)}`}
                aria-disabled={currentPage === totalPages}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors duration-200 ${
                  currentPage === totalPages
                    ? "pointer-events-none border-mist-100 text-mist-300"
                    : "border-mist-200 text-mist-700 hover:border-mist-400 hover:bg-mist-50"
                }`}
              >
                Next
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
