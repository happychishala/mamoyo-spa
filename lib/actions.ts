"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  readDb,
  writeDb,
  invoiceTotal,
  invoicePaid,
  staysOverlap,
  type DB,
  type Invoice,
  type InvoiceItem,
  type Receipt,
  TREATMENT_PAYMENTS,
  type Enquiry,
  type EnquiryType,
  type EnquiryStatus,
  ENQUIRY_TYPES,
  type ReviewSource,
  REVIEW_SOURCES,
  type Booking,
  type BookingStatus,
  type InventoryCategory,
  type InvoiceStatus,
  type PaymentMethod,
  type StayBooking,
  type StayStatus,
  USER_ROLES,
  LOCATIONS,
  type Location,
  type Transaction,
  type TreatmentPayment,
  type UserRole,
  type RoleDefinitionRecord,
  type ChannelProviderName,
} from "./db";
import { suites, bookablePriceMap } from "./content";
import { allow, LIMITS } from "./rate-limit";
import { formatDate, todayISO, addDaysISO } from "./format";
import { requireAdmin, requireRole } from "./auth";
import { hashPassword } from "./auth-token";
import { syncStayToChannels } from "./channel-manager";
import { normalizeRoleName } from "./permissions";

export interface ActionResult {
  ok: boolean;
  message: string;
}

// Applies a payment to an invoice inside an already-read db: bumps amountPaid,
// flips status to Paid when settled, and issues the receipt + income entry.
function applyInvoicePayment(db: DB, invoice: Invoice, amount: number, method: string): void {
  const total = invoiceTotal(invoice);
  const paid = Math.min(total, invoicePaid(invoice) + amount);
  invoice.amountPaid = paid;
  invoice.status = paid >= total ? "Paid" : "Sent";

  const maxRct = db.receipts.reduce((max, r) => {
    const n = Number(r.number.split("-").pop());
    return Number.isFinite(n) && n > max ? n : max;
  }, 200);
  db.receipts.unshift({
    id: crypto.randomUUID(),
    number: `RCT-${new Date().getFullYear()}-${String(maxRct + 1).padStart(4, "0")}`,
    invoiceNumber: invoice.number,
    customer: invoice.customer,
    amount,
    method,
    date: todayISO(),
    location: invoice.location ?? "Kabulonga",
    items: invoice.items,
  });
  db.transactions.unshift({
    id: crypto.randomUUID(),
    date: todayISO(),
    type: "Income",
    category: "Spa services",
    description: `Payment received — ${invoice.number} (${invoice.customer})`,
    amount,
  });
}

function nextInvoiceNumber(db: DB): string {
  const year = new Date().getFullYear();
  const max = db.invoices.reduce((m, i) => {
    const n = Number(i.number.split("-").pop());
    return Number.isFinite(n) && n > m ? n : m;
  }, 100);
  return `INV-${year}-${String(max + 1).padStart(4, "0")}`;
}

function nextSaleRef(db: DB): string {
  const year = new Date().getFullYear();
  const max = db.receipts.reduce((m, r) => {
    const match = /^POS-\d{4}-(\d{4})$/.exec(r.invoiceNumber);
    const n = match ? Number(match[1]) : NaN;
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `POS-${year}-${String(max + 1).padStart(4, "0")}`;
}

function createCafeReceipt(
  db: DB,
  items: Invoice["items"],
  customer: string,
  method: PaymentMethod,
  location: Location = "Kabulonga"
): Receipt {
  const total = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  const maxRct = db.receipts.reduce((max, r) => {
    const n = Number(r.number.split("-").pop());
    return Number.isFinite(n) && n > max ? n : max;
  }, 200);
  const receipt: Receipt = {
    id: crypto.randomUUID(),
    number: `RCT-${new Date().getFullYear()}-${String(maxRct + 1).padStart(4, "0")}`,
    invoiceNumber: nextSaleRef(db),
    customer: customer.trim() || "Walk-in customer",
    amount: total,
    method,
    date: todayISO(),
    location,
    items,
  };
  db.receipts.unshift(receipt);
  db.transactions.unshift({
    id: crypto.randomUUID(),
    date: todayISO(),
    type: "Income",
    category: "Café",
    description: `Café sale — ${receipt.invoiceNumber} (${receipt.customer})`,
    amount: total,
  });
  return receipt;
}

function bookingStartsAt(booking: Pick<Booking, "date" | "time">): Date {
  return new Date(`${booking.date}T${booking.time || "00:00"}:00`);
}

function canEditBooking(booking: Booking): boolean {
  return (
    (booking.status === "Pending" || booking.status === "Confirmed") &&
    bookingStartsAt(booking).getTime() > Date.now()
  );
}

// Intentionally public: this backs the customer-facing booking form.
export async function createBooking(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  if (!(await allow("booking", LIMITS.publicForm.limit, LIMITS.publicForm.windowSeconds))) {
    return { ok: false, message: "You have made several booking requests already. Please wait a few minutes, or WhatsApp us if it is urgent." };
  }

  const customer = String(formData.get("customer") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const service = String(formData.get("service") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const time = String(formData.get("time") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const rawLocation = String(formData.get("location") ?? "Kabulonga") as Location;
  const location = LOCATIONS.includes(rawLocation) ? rawLocation : "Kabulonga";

  if (!customer || !email || !service || !date || !time) {
    return { ok: false, message: "Please fill in your name, email, treatment, date and time." };
  }

  const db = await readDb();
  const maxRef = db.bookings.reduce((max, b) => {
    const n = Number(b.ref.replace("MS-", ""));
    return Number.isFinite(n) && n > max ? n : max;
  }, 1000);

  const known = bookablePriceMap[service] ?? { price: 0, durationMin: 60 };

  const booking: Booking = {
    id: crypto.randomUUID(),
    ref: `MS-${maxRef + 1}`,
    customer,
    email,
    phone,
    service,
    date,
    time,
    durationMin: known.durationMin,
    price: known.price,
    status: "Pending",
    location,
    notes: notes || undefined,
    createdAt: todayISO(),
  };

  db.bookings.unshift(booking);
  await writeDb(db);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");

  return {
    ok: true,
    message: `Thank you, ${customer.split(" ")[0]}! Your request (${booking.ref}) at MaMoyo ${location} is in — we'll confirm by email within a few hours.`,
  };
}

export async function updateBookingStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as BookingStatus;
  if (!id || !["Pending", "Confirmed", "Completed", "Cancelled"].includes(status)) return;

  const db = await readDb();
  const booking = db.bookings.find((b) => b.id === id);
  if (!booking || booking.status === status) return;

  // Completing a booking logs the treatment into Reports and raises the
  // paperwork: an invoice for the service, plus a receipt + income entry for
  // whatever was paid on the spot (full or partial).
  if (status === "Completed") {
    if (!booking.therapist) return;
    const payment = String(formData.get("payment") ?? "Cash") as TreatmentPayment;
    if (!TREATMENT_PAYMENTS.includes(payment)) return;
    const rawPaid = Number(formData.get("amountPaid"));
    const amountPaid = Math.min(
      booking.price,
      Math.max(0, Number.isFinite(rawPaid) ? rawPaid : booking.price)
    );

    if (!db.treatments.some((t) => t.bookingRef === booking.ref)) {
      db.treatments.unshift({
        id: crypto.randomUUID(),
        date: booking.date,
        therapist: booking.therapist,
        service: booking.service,
        amount: booking.price,
        payment,
        location: booking.location ?? "Kabulonga",
        bookingRef: booking.ref,
        notes: booking.customer,
      });
    }

    // Comps are on the house — no invoice. Everything else gets one.
    if (payment !== "Comp" && booking.price > 0 && !db.invoices.some((i) => i.bookingRef === booking.ref)) {
      const invoice: Invoice = {
        id: crypto.randomUUID(),
        number: nextInvoiceNumber(db),
        customer: booking.customer,
        bookingRef: booking.ref,
        items: [
          {
            // Menu names already carry their duration (e.g. "— 90 min"); only
            // append it for services that don't, like salon/barber walk-ins.
            description: /\bmin\b/i.test(booking.service)
              ? booking.service
              : `${booking.service} (${booking.durationMin} min)`,
            qty: 1,
            unitPrice: booking.price,
          },
        ],
        issueDate: todayISO(),
        dueDate: addDaysISO(todayISO(), 7),
        status: "Sent",
        location: booking.location ?? "Kabulonga",
        amountPaid: 0,
      };
      db.invoices.unshift(invoice);
      if (amountPaid > 0) applyInvoicePayment(db, invoice, amountPaid, payment);
    }
  }

  booking.status = status;
  await writeDb(db);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/reports");
  revalidatePath("/admin/invoices");
  revalidatePath("/admin/receipts");
  revalidatePath("/admin/finance");
  revalidatePath("/admin");
}

export async function assignBookingTherapist(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const therapist = String(formData.get("therapist") ?? "").trim();
  if (!id) return;

  const db = await readDb();
  const booking = db.bookings.find((b) => b.id === id);
  if (!booking) return;
  if (therapist && !db.therapists.some((t) => t.active && t.name === therapist)) return;
  booking.therapist = therapist || undefined;
  await writeDb(db);
  revalidatePath("/admin/bookings");
}

export async function updateInvoiceStatus(formData: FormData): Promise<void> {
  await requireRole("Owner", "Manager");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as InvoiceStatus;
  // Payments go through recordInvoicePayment; this only moves drafts along.
  if (!id || !["Draft", "Sent", "Overdue"].includes(status)) return;

  const db = await readDb();
  const invoice = db.invoices.find((i) => i.id === id);
  if (!invoice || invoice.status === status || invoice.status === "Paid") return;

  invoice.status = status;
  await writeDb(db);
  revalidatePath("/admin/invoices");
}

export async function recordInvoicePayment(formData: FormData): Promise<void> {
  await requireRole("Owner", "Manager");
  const id = String(formData.get("id") ?? "");
  const amount = Number(formData.get("amount") ?? 0);
  const method = (String(formData.get("method") ?? "Cash") || "Cash") as PaymentMethod;
  if (!id || !(amount > 0)) return;

  const db = await readDb();
  const invoice = db.invoices.find((i) => i.id === id);
  if (!invoice || invoice.status === "Paid") return;

  applyInvoicePayment(db, invoice, Math.min(amount, invoiceTotal(invoice) - invoicePaid(invoice)), method);

  await writeDb(db);
  revalidatePath("/admin/invoices");
  revalidatePath("/admin/receipts");
  revalidatePath("/admin/finance");
  revalidatePath("/admin");
}

export async function updateChannelIntegrationSetting(formData: FormData): Promise<void> {
  await requireAdmin();
  const provider = String(formData.get("provider") ?? "") as ChannelProviderName;
  const enabled = String(formData.get("enabled") ?? "false") === "true";
  const endpoint = String(formData.get("endpoint") ?? "").trim();
  const apiKey = String(formData.get("apiKey") ?? "").trim();

  if (!["airbnb", "booking.com", "expedia"].includes(provider)) return;

  const db = await readDb();
  const setting = db.channelIntegrations?.find((item) => item.provider === provider);
  if (!setting) return;

  setting.enabled = enabled;
  setting.endpoint = endpoint;
  setting.apiKey = apiKey;
  setting.lastStatus = enabled && !endpoint ? "failed" : setting.lastStatus;
  setting.lastMessage = enabled && !endpoint ? "Endpoint is required when enabled." : setting.lastMessage;

  await writeDb(db);
  revalidatePath("/admin/integrations");
  redirect("/admin/integrations");
}

export async function createCafeSale(formData: FormData): Promise<void> {
  await requireAdmin();

  const customer = String(formData.get("customer") ?? "").trim() || "Walk-in customer";
  const method = (String(formData.get("method") ?? "Cash") || "Cash") as PaymentMethod;
  const location = (String(formData.get("location") ?? "Kabulonga") as Location);
  const descriptions = formData.getAll("description").map(String).filter(Boolean);
  const qtys = formData.getAll("qty").map((value) => Number(value));
  const prices = formData.getAll("unitPrice").map((value) => Number(value));

  const items: InvoiceItem[] = descriptions
    .map((description, idx) => ({
      description,
      qty: Number.isFinite(qtys[idx]) && qtys[idx] > 0 ? qtys[idx] : 1,
      unitPrice: Number.isFinite(prices[idx]) && prices[idx] >= 0 ? prices[idx] : 0,
    }))
    .filter((item) => item.description && item.qty > 0 && item.unitPrice >= 0);

  if (items.length === 0) return;

  const db = await readDb();
  const receipt = createCafeReceipt(db, items, customer, method, location);
  await writeDb(db);
  revalidatePath("/admin/receipts");
  revalidatePath("/admin/finance");
  revalidatePath("/admin");
  redirect(`/admin/receipts/${receipt.id}/print`);
}

// Intentionally public: this backs the customer-facing stay request form.
export async function createStayBooking(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  if (!(await allow("stay", LIMITS.publicForm.limit, LIMITS.publicForm.windowSeconds))) {
    return { ok: false, message: "You have sent several stay requests already. Please wait a few minutes, or WhatsApp us if it is urgent." };
  }

  const suiteId = String(formData.get("suiteId") ?? "");
  const guest = String(formData.get("guest") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const checkIn = String(formData.get("checkIn") ?? "");
  const checkOut = String(formData.get("checkOut") ?? "");
  const guests = Number(formData.get("guests") ?? 1);
  const notes = String(formData.get("notes") ?? "").trim();

  const suite = suites.find((s) => s.id === suiteId);
  if (!suite) {
    return { ok: false, message: "Please choose one of our four studios." };
  }
  if (!guest || !email || !checkIn || !checkOut) {
    return { ok: false, message: "Please fill in your name, email and your check-in and check-out dates." };
  }
  if (checkIn < todayISO()) {
    return { ok: false, message: "Check-in can't be in the past — pick today or later." };
  }
  if (checkOut <= checkIn) {
    return { ok: false, message: "Check-out must be after check-in." };
  }
  if (!(guests >= 1 && guests <= suite.sleeps)) {
    return { ok: false, message: `${suite.name} sleeps up to ${suite.sleeps} guests.` };
  }

  const db = await readDb();
  const conflict = db.stays.find(
    (s) =>
      s.suiteId === suiteId &&
      s.status !== "Cancelled" &&
      staysOverlap(checkIn, checkOut, s.checkIn, s.checkOut)
  );
  if (conflict) {
    return {
      ok: false,
      message: `${suite.name} is already booked ${formatDate(conflict.checkIn)} – ${formatDate(conflict.checkOut)}. Try different dates or another studio.`,
    };
  }

  const nights = Math.round(
    (Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`)) / 86400000
  );
  const maxRef = db.stays.reduce((max, s) => {
    const n = Number(s.ref.replace("ST-", ""));
    return Number.isFinite(n) && n > max ? n : max;
  }, 3000);

  const stay: StayBooking = {
    id: crypto.randomUUID(),
    ref: `ST-${maxRef + 1}`,
    suiteId,
    guest,
    email,
    phone,
    checkIn,
    checkOut,
    guests,
    nights,
    total: nights * suite.ratePerNight,
    status: "Pending",
    notes: notes || undefined,
    createdAt: todayISO(),
  };

  db.stays.unshift(stay);
  await writeDb(db);
  revalidatePath("/suites");
  revalidatePath("/admin/stays");

  const channelResults = await syncStayToChannels(stay, suite.name, suite.id);
  const channelSummary = channelResults
    .filter((result) => result.status !== "disabled")
    .map((result) => `${result.provider}: ${result.status}`)
    .join(", ");

  return {
    ok: true,
    message: `Thank you, ${guest.split(" ")[0]}! ${suite.name} is held for ${formatDate(checkIn)} – ${formatDate(checkOut)} (${nights} ${nights === 1 ? "night" : "nights"}, ${stay.total.toLocaleString()} kwacha). Request ${stay.ref} — we'll confirm by email shortly.${channelSummary ? ` Channel sync: ${channelSummary}.` : ""}`,
  };
}

// Admin walk-in / phone stay — mirrors createStayBooking but confirms on the
// spot and doesn't require an email.
export async function createAdminStay(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();
  const suiteId = String(formData.get("suiteId") ?? "");
  const guest = String(formData.get("guest") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const checkIn = String(formData.get("checkIn") ?? "");
  const checkOut = String(formData.get("checkOut") ?? "");
  const guests = Number(formData.get("guests") ?? 1);
  const notes = String(formData.get("notes") ?? "").trim();

  const suite = suites.find((s) => s.id === suiteId);
  if (!suite) return { ok: false, message: "Please choose one of the four studios." };
  if (!guest || !checkIn || !checkOut) {
    return { ok: false, message: "Please fill in the guest name and the check-in and check-out dates." };
  }
  if (checkOut <= checkIn) {
    return { ok: false, message: "Check-out must be after check-in." };
  }
  if (!(guests >= 1 && guests <= suite.sleeps)) {
    return { ok: false, message: `${suite.name} sleeps up to ${suite.sleeps} guests.` };
  }

  const db = await readDb();
  const conflict = db.stays.find(
    (s) =>
      s.suiteId === suiteId &&
      s.status !== "Cancelled" &&
      staysOverlap(checkIn, checkOut, s.checkIn, s.checkOut)
  );
  if (conflict) {
    return {
      ok: false,
      message: `${suite.name} is already booked ${formatDate(conflict.checkIn)} – ${formatDate(conflict.checkOut)}. Try different dates or another studio.`,
    };
  }

  const nights = Math.round(
    (Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`)) / 86400000
  );
  const maxRef = db.stays.reduce((max, s) => {
    const n = Number(s.ref.replace("ST-", ""));
    return Number.isFinite(n) && n > max ? n : max;
  }, 3000);

  db.stays.unshift({
    id: crypto.randomUUID(),
    ref: `ST-${maxRef + 1}`,
    suiteId,
    guest,
    email,
    phone,
    checkIn,
    checkOut,
    guests,
    nights,
    total: nights * suite.ratePerNight,
    status: "Confirmed",
    notes: notes ? `Walk-in — ${notes}` : "Walk-in",
    createdAt: todayISO(),
  });
  await writeDb(db);
  revalidatePath("/admin/stays");
  revalidatePath("/admin/calendar");

  return {
    ok: true,
    message: `${suite.name} confirmed for ${guest} — ${formatDate(checkIn)} to ${formatDate(checkOut)} (${nights} ${nights === 1 ? "night" : "nights"}, ${(nights * suite.ratePerNight).toLocaleString()} kwacha).`,
  };
}

export async function updateStayStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as StayStatus;
  if (!id || !["Pending", "Confirmed", "CheckedIn", "CheckedOut", "Cancelled"].includes(status)) return;

  const db = await readDb();
  const stay = db.stays.find((s) => s.id === id);
  if (!stay) return;
  stay.status = status;
  await writeDb(db);
  revalidatePath("/admin/stays");
  revalidatePath("/suites");
}

// Treatments are only created by completing bookings (walk-ins get an admin
// booking first), so revenue always traces back to a booking and a therapist.

export async function createAdminBooking(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();
  const customer = String(formData.get("customer") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const service = String(formData.get("service") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const time = String(formData.get("time") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const discount = Number(formData.get("discount") ?? 0);
  const durationMin = Number(formData.get("durationMin") ?? 60);
  const therapist = String(formData.get("therapist") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const rawLocation = String(formData.get("location") ?? "Kabulonga") as Location;
  const location = LOCATIONS.includes(rawLocation) ? rawLocation : "Kabulonga";

  if (!customer || !service || !date || !time) {
    return { ok: false, message: "Please fill in guest name, service, date and time." };
  }
  if (!(price >= 0)) {
    return { ok: false, message: "Price must be zero or more." };
  }
  if (!(discount >= 0)) {
    return { ok: false, message: "Discount must be zero or more." };
  }

  const db = await readDb();
  if (therapist && !db.therapists.some((t) => t.active && t.name === therapist)) {
    return { ok: false, message: "That therapist isn't active — pick another." };
  }
  const maxRef = db.bookings.reduce((max, b) => {
    const n = Number(b.ref.replace("MS-", ""));
    return Number.isFinite(n) && n > max ? n : max;
  }, 1000);

  const discountNote = discount > 0 ? `Discount K${discount.toLocaleString("en-ZM")}` : "";
  const bookingNotes = ["Walk-in", discountNote, notes].filter(Boolean).join(" — ");

  const booking: Booking = {
    id: crypto.randomUUID(),
    ref: `MS-${maxRef + 1}`,
    customer,
    email,
    phone,
    service,
    date,
    time,
    durationMin: Number.isFinite(durationMin) && durationMin > 0 ? Math.round(durationMin) : 60,
    price,
    status: "Confirmed",
    location,
    therapist: therapist || undefined,
    notes: bookingNotes,
    createdAt: todayISO(),
  };

  db.bookings.unshift(booking);
  await writeDb(db);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
  return { ok: true, message: `Booking ${booking.ref} created for ${customer} — complete it after the treatment to log the revenue.` };
}

export async function updateAdminBooking(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const returnTo = String(formData.get("returnTo") ?? "/admin/bookings");
  const customer = String(formData.get("customer") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const service = String(formData.get("service") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const time = String(formData.get("time") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const discount = Number(formData.get("discount") ?? 0);
  const durationMin = Number(formData.get("durationMin") ?? 60);
  const therapist = String(formData.get("therapist") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const rawLocation = String(formData.get("location") ?? "Kabulonga") as Location;
  const location = LOCATIONS.includes(rawLocation) ? rawLocation : "Kabulonga";

  if (!id || !customer || !service || !date || !time || !(price >= 0) || !(discount >= 0)) {
    return;
  }

  const db = await readDb();
  const booking = db.bookings.find((b) => b.id === id);
  if (!booking || !canEditBooking(booking)) return;
  if (bookingStartsAt({ date, time }).getTime() <= Date.now()) return;
  if (therapist && !db.therapists.some((t) => t.active && t.name === therapist)) return;

  const discountNote = discount > 0 ? `Discount K${discount.toLocaleString("en-ZM")}` : "";
  const cleanedNotes = notes
    .replace(/(^| — )Discount K[\d,]+/g, "")
    .replace(/^Walk-in( — )?/, "")
    .trim();
  const bookingNotes = ["Walk-in", discountNote, cleanedNotes].filter(Boolean).join(" — ");

  booking.customer = customer;
  booking.phone = phone;
  booking.service = service;
  booking.date = date;
  booking.time = time;
  booking.durationMin = Number.isFinite(durationMin) && durationMin > 0 ? Math.round(durationMin) : 60;
  booking.price = price;
  booking.location = location;
  booking.therapist = therapist || undefined;
  booking.notes = bookingNotes;

  await writeDb(db);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
  redirect(returnTo.startsWith("/admin/bookings") ? returnTo : "/admin/bookings");
}

export async function createRole(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("Owner");

  const name = normalizeRoleName(String(formData.get("name") ?? ""));
  const description = String(formData.get("description") ?? "").trim();
  const modules = Array.from(formData.getAll("module")).map(String).filter(Boolean) as RoleDefinitionRecord["modules"];

  if (!name) {
    return { ok: false, message: "Please give the role a name." };
  }
  if (name === "Owner" || name === "Manager" || name === "Staff") {
    return { ok: false, message: "Use the built-in roles for those access levels." };
  }

  const db = await readDb();
  if (db.roles.some((role) => role.name.toLowerCase() === name.toLowerCase())) {
    return { ok: false, message: `"${name}" already exists.` };
  }

  db.roles.push({
    id: crypto.randomUUID(),
    name,
    description: description || undefined,
    modules,
    rank: Math.max(...db.roles.map((role) => role.rank), 0) + 1,
    isSystemRole: false,
  });

  await writeDb(db);
  revalidatePath("/admin/team");
  return { ok: true, message: `Role "${name}" created.` };
}

export async function updateRole(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("Owner");

  const roleId = String(formData.get("roleId") ?? "");
  const modules = Array.from(formData.getAll("module")).map(String).filter(Boolean) as RoleDefinitionRecord["modules"];

  if (!roleId) {
    return { ok: false, message: "No role was selected to update." };
  }

  const db = await readDb();
  const role = db.roles.find((entry) => entry.id === roleId);
  if (!role) {
    return { ok: false, message: "That role could not be found." };
  }

  role.modules = modules;
  await writeDb(db);
  revalidatePath("/admin/team");
  return { ok: true, message: `Access for "${role.name}" updated.` };
}

export async function addTherapist(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("Owner", "Manager");
  const name = String(formData.get("name") ?? "").trim();
  const monthlyTarget = Number(formData.get("monthlyTarget") ?? 0);

  if (!name) return { ok: false, message: "Please give the therapist a name." };
  if (!(monthlyTarget >= 0)) return { ok: false, message: "Target must be zero or more." };

  const db = await readDb();
  if (db.therapists.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
    return { ok: false, message: `${name} is already on the team — reactivate them instead.` };
  }
  db.therapists.push({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    monthlyTarget: Math.round(monthlyTarget),
    active: true,
  });
  await writeDb(db);
  revalidatePath("/admin/team");
  revalidatePath("/admin/reports");
  revalidatePath("/admin/bookings");
  return { ok: true, message: `${name} added to the team.` };
}

export async function setTherapistStatus(formData: FormData): Promise<void> {
  await requireRole("Owner", "Manager");
  const id = String(formData.get("id") ?? "");
  const active = String(formData.get("active") ?? "") === "true";

  const db = await readDb();
  const therapist = db.therapists.find((t) => t.id === id);
  if (!therapist) return;
  therapist.active = active;
  await writeDb(db);
  revalidatePath("/admin/team");
  revalidatePath("/admin/reports");
  revalidatePath("/admin/bookings");
}

export async function addUser(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("Owner");
  const name = String(formData.get("name") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "") as UserRole;

  if (!name || !username || !password) {
    return { ok: false, message: "Please fill in name, username and password." };
  }
  if (!/^[a-z0-9._-]{3,}$/.test(username) || username === "admin") {
    return { ok: false, message: "Username must be 3+ characters (letters, numbers, . _ -) and not 'admin'." };
  }
  if (password.length < 8) {
    return { ok: false, message: "Password must be at least 8 characters." };
  }
  const db = await readDb();
  const validRoles = [...USER_ROLES, ...db.roles.map((entry) => entry.name)];
  if (!validRoles.includes(role)) {
    return { ok: false, message: "Pick a role." };
  }

  if (db.users.some((u) => u.username === username)) {
    return { ok: false, message: `Username "${username}" is taken.` };
  }
  db.users.push({
    id: crypto.randomUUID(),
    name,
    username,
    role,
    passwordHash: hashPassword(password),
    active: true,
    createdAt: todayISO(),
  });
  await writeDb(db);
  revalidatePath("/admin/team");
  return { ok: true, message: `${name} can now sign in as "${username}" (${role}).` };
}

export async function setUserActive(formData: FormData): Promise<void> {
  await requireRole("Owner");
  const id = String(formData.get("id") ?? "");
  const active = String(formData.get("active") ?? "") === "true";

  const db = await readDb();
  const user = db.users.find((u) => u.id === id);
  if (!user) return;
  user.active = active;
  await writeDb(db);
  revalidatePath("/admin/team");
}

export async function updateTherapistTarget(formData: FormData): Promise<void> {
  await requireRole("Owner", "Manager");
  const id = String(formData.get("id") ?? "");
  const target = Number(formData.get("target") ?? NaN);
  if (!id || !Number.isFinite(target) || target < 0) return;

  const db = await readDb();
  const therapist = db.therapists.find((t) => t.id === id);
  if (!therapist) return;
  therapist.monthlyTarget = Math.round(target);
  await writeDb(db);
  revalidatePath("/admin/reports");
}

export async function addInventoryItem(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim();
  const volume = String(formData.get("volume") ?? "").trim();
  const category = String(formData.get("category") ?? "") as InventoryCategory;
  const unit = String(formData.get("unit") ?? "").trim() || "pcs";
  const quantity = Number(formData.get("quantity") ?? 0);
  const reorderLevel = Number(formData.get("reorderLevel") ?? 0);

  if (!name || !["Spa products", "Café"].includes(category)) {
    return { ok: false, message: "Please provide a name and pick a category." };
  }
  if (!(quantity >= 0) || !(reorderLevel >= 0)) {
    return { ok: false, message: "Quantity and reorder level must be zero or more." };
  }

  const db = await readDb();
  if (db.inventory.some((i) => i.name.toLowerCase() === name.toLowerCase() && i.category === category)) {
    return { ok: false, message: `"${name}" already exists in ${category} — adjust its stock instead.` };
  }
  db.inventory.push({
    id: crypto.randomUUID(),
    name,
    brand: brand || undefined,
    volume: volume || undefined,
    category,
    unit,
    quantity: Math.round(quantity),
    reorderLevel: Math.round(reorderLevel),
    updatedAt: todayISO(),
  });
  await writeDb(db);
  revalidatePath("/admin/inventory");
  return { ok: true, message: `${name} added to ${category}.` };
}

export async function adjustInventory(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const amount = Number(formData.get("amount") ?? 0);
  const direction = String(formData.get("direction") ?? "");
  if (!id || !(amount > 0) || !["in", "out"].includes(direction)) return;

  const db = await readDb();
  const item = db.inventory.find((i) => i.id === id);
  if (!item) return;
  const delta = direction === "in" ? Math.round(amount) : -Math.round(amount);
  item.quantity = Math.max(0, item.quantity + delta);
  item.updatedAt = todayISO();
  await writeDb(db);
  revalidatePath("/admin/inventory");
}

export async function addTransaction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("Owner", "Manager");
  const type = String(formData.get("type") ?? "") as Transaction["type"];
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const amount = Number(formData.get("amount") ?? 0);
  const date = String(formData.get("date") ?? todayISO());

  if (!["Income", "Expense"].includes(type) || !category || !description || !(amount > 0)) {
    return { ok: false, message: "Please provide a type, category, description and a positive amount." };
  }

  const db = await readDb();
  db.transactions.unshift({
    id: crypto.randomUUID(),
    date,
    type,
    category,
    description,
    amount,
  });
  await writeDb(db);
  revalidatePath("/admin/finance");
  revalidatePath("/admin");
  return { ok: true, message: `${type} of ${amount.toLocaleString()} recorded.` };
}

// ---------- Enquiries (public site → back office) ----------

/** Public: capture a site enquiry (membership, corporate, gift, café, general…). */
export async function createEnquiry(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  if (!(await allow("enquiry", LIMITS.publicForm.limit, LIMITS.publicForm.windowSeconds))) {
    return { ok: false, message: "You have sent several messages already. Please wait a few minutes, or WhatsApp us if it is urgent." };
  }

  const rawType = String(formData.get("type") ?? "General") as EnquiryType;
  const type: EnquiryType = ENQUIRY_TYPES.includes(rawType) ? rawType : "General";
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { ok: false, message: "Please add your name, email and a short message so we can help." };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, message: "That email address doesn't look right — please check it." };
  }

  // Any field named detail_<Label> becomes a structured detail line for the back office.
  const details: { label: string; value: string }[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("detail_")) {
      const v = String(value).trim();
      if (v) details.push({ label: key.slice(7).replace(/_/g, " "), value: v });
    }
  }

  const db = await readDb();
  const enquiry: Enquiry = {
    id: `enq-${Date.now()}`,
    ref: `ENQ-${1000 + db.enquiries.length + 1}`,
    type,
    name,
    email,
    phone: phone || undefined,
    location: location || undefined,
    message,
    details: details.length ? details : undefined,
    status: "New",
    createdAt: todayISO(),
  };
  db.enquiries.unshift(enquiry);
  await writeDb(db);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");

  return {
    ok: true,
    message:
      "Thank you — your enquiry has reached MaMoyo. We'll respond through your preferred contact method. Time-sensitive requests are best sent by WhatsApp.",
  };
}

/** Admin: move an enquiry through New → In progress → Closed. */
export async function updateEnquiryStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as EnquiryStatus;
  if (!["New", "In progress", "Closed"].includes(status)) return;
  const db = await readDb();
  const enquiry = db.enquiries.find((e) => e.id === id);
  if (!enquiry) return;
  enquiry.status = status;
  await writeDb(db);
  revalidatePath("/admin/enquiries");
}

// ---------------------------------------------------------------- Reviews
// Reviews are transcribed by staff from a verified platform listing (Google,
// Facebook, TripAdvisor) or a written guest note. Nothing here generates a
// review — every field comes from what the reviewer actually published.

export async function createReview(formData: FormData): Promise<void> {
  await requireAdmin();
  const author = String(formData.get("author") ?? "").trim();
  const quote = String(formData.get("quote") ?? "").trim();
  const source = String(formData.get("source") ?? "Google") as ReviewSource;
  const sourceUrl = String(formData.get("sourceUrl") ?? "").trim();
  const locationRaw = String(formData.get("location") ?? "").trim();
  const reviewedOn = String(formData.get("reviewedOn") ?? "").trim();
  const rating = Number(formData.get("rating") ?? 5);

  if (!author || !quote) return;
  if (!REVIEW_SOURCES.includes(source)) return;
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) return;

  const db = await readDb();
  db.reviews.push({
    id: `rev${Date.now().toString(36)}`,
    author,
    rating: Math.round(rating),
    quote,
    source,
    sourceUrl: sourceUrl || undefined,
    location: LOCATIONS.includes(locationRaw as Location) ? (locationRaw as Location) : undefined,
    reviewedOn: /^\d{4}-\d{2}-\d{2}$/.test(reviewedOn) ? reviewedOn : new Date().toISOString().slice(0, 10),
    published: false,
    createdAt: new Date().toISOString(),
  });
  await writeDb(db);
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}

export async function setReviewPublished(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const published = String(formData.get("published") ?? "") === "true";
  const db = await readDb();
  const review = db.reviews.find((r) => r.id === id);
  if (!review) return;
  review.published = published;
  await writeDb(db);
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}

export async function deleteReview(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const db = await readDb();
  const index = db.reviews.findIndex((r) => r.id === id);
  if (index === -1) return;
  db.reviews.splice(index, 1);
  await writeDb(db);
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}
