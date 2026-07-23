import { promises as fs } from "node:fs";
import path from "node:path";
import { Redis } from "@upstash/redis";
import { getDefaultRoleDefinitions } from "./permissions";

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export type Location = "Kabulonga" | "Twangale";

export const LOCATIONS: Location[] = ["Kabulonga", "Twangale"];
export type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Overdue";
export type PaymentMethod = "Card" | "Cash" | "Mobile Money" | "Bank Transfer";
export type TransactionType = "Income" | "Expense";

export interface Booking {
  id: string;
  ref: string;
  customer: string;
  email: string;
  phone: string;
  service: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMin: number;
  price: number;
  status: BookingStatus;
  location?: Location; // defaults to Kabulonga for records created before Twangale
  therapist?: string;
  notes?: string;
  createdAt: string;
}

export interface InvoiceItem {
  description: string;
  qty: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  number: string;
  customer: string;
  bookingRef?: string;
  items: InvoiceItem[];
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  location?: Location; // branch the work was booked at; defaults to Kabulonga
  amountPaid?: number; // running total of payments; missing on pre-partial-payment records
}

export interface Receipt {
  id: string;
  number: string;
  invoiceNumber: string;
  customer: string;
  amount: number;
  method: string; // PaymentMethod or a treatment payment type like Voucher
  date: string;
  location?: Location; // copied from the invoice for the printed address
  items?: InvoiceItem[]; // copied from the invoice so the receipt is self-contained
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
}

export type StayStatus = "Pending" | "Confirmed" | "CheckedIn" | "CheckedOut" | "Cancelled";

export interface StayBooking {
  id: string;
  ref: string;
  suiteId: string;
  guest: string;
  email: string;
  phone: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guests: number;
  nights: number;
  total: number;
  status: StayStatus;
  notes?: string;
  createdAt: string;
}

export type TreatmentPayment = "Cash" | "Card" | "Credit" | "Voucher" | "Comp" | "Mobile Money";

export const TREATMENT_PAYMENTS: TreatmentPayment[] = [
  "Cash",
  "Card",
  "Credit",
  "Voucher",
  "Comp",
  "Mobile Money",
];

export interface Treatment {
  id: string;
  date: string; // YYYY-MM-DD
  therapist: string;
  service: string;
  amount: number;
  payment: TreatmentPayment;
  location?: Location;
  bookingRef?: string; // set when the treatment was logged by completing a booking
  notes?: string;
}

export interface Therapist {
  id: string;
  name: string;
  monthlyTarget: number;
  active: boolean;
}

export type InventoryCategory = "Spa products" | "Café";

export interface InventoryItem {
  id: string;
  name: string;
  brand?: string;
  volume?: string; // pack size per unit, e.g. "1kg", "500g", "100ml"
  category: InventoryCategory;
  unit: string;
  quantity: number;
  reorderLevel: number;
  updatedAt: string;
}

export type UserRole = "Owner" | "Manager" | "Staff" | (string & {});

export const USER_ROLES: UserRole[] = ["Owner", "Manager", "Staff"];

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  passwordHash: string; // "{saltHex}:{scryptHex}"
  active: boolean;
  createdAt: string;
}

export interface RoleDefinitionRecord {
  id: string;
  name: string;
  description?: string;
  modules: string[];
  rank: number;
  isSystemRole: boolean;
}

export type ChannelProviderName = "airbnb" | "booking.com" | "expedia";

export interface ChannelIntegrationSetting {
  provider: ChannelProviderName;
  enabled: boolean;
  endpoint: string;
  apiKey: string;
  lastStatus: "idle" | "disabled" | "sent" | "failed";
  lastMessage: string;
  lastSyncedAt?: string;
}

export type EnquiryType =
  | "Membership"
  | "Corporate"
  | "Gift Card"
  | "Experience"
  | "Suite"
  | "Café"
  | "General";

export const ENQUIRY_TYPES: EnquiryType[] = [
  "Membership",
  "Corporate",
  "Gift Card",
  "Experience",
  "Suite",
  "Café",
  "General",
];

export type EnquiryStatus = "New" | "In progress" | "Closed";

/** A submission from a public site form (membership, corporate, gift, contact…). */
export interface Enquiry {
  id: string;
  ref: string; // ENQ-…
  type: EnquiryType;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  message: string;
  /** Extra structured fields captured by a specific form (tier, organisation, budget…). */
  details?: { label: string; value: string }[];
  status: EnquiryStatus;
  createdAt: string;
}

export type ReviewSource = "Google" | "Facebook" | "TripAdvisor" | "Direct";

export const REVIEW_SOURCES: ReviewSource[] = ["Google", "Facebook", "TripAdvisor", "Direct"];

/**
 * A guest review copied from a verified platform listing.
 * Reviews are never generated — each record is transcribed by staff from a real
 * published review, and only shows on the website once `published` is true.
 */
export interface Review {
  id: string;
  author: string;
  rating: number; // 1–5
  quote: string;
  source: ReviewSource;
  /** Link to the original published review or the listing it came from. */
  sourceUrl?: string;
  location?: Location;
  /** Date the guest published the review (YYYY-MM-DD). */
  reviewedOn: string;
  published: boolean;
  createdAt: string;
}

export interface DB {
  bookings: Booking[];
  invoices: Invoice[];
  receipts: Receipt[];
  transactions: Transaction[];
  stays: StayBooking[];
  treatments: Treatment[];
  therapists: Therapist[];
  inventory: InventoryItem[];
  users: User[];
  roles: RoleDefinitionRecord[];
  channelIntegrations: ChannelIntegrationSetting[];
  enquiries: Enquiry[];
  reviews: Review[];
}

export function staysOverlap(
  aIn: string,
  aOut: string,
  bIn: string,
  bOut: string
): boolean {
  return aIn < bOut && aOut > bIn;
}

export function invoiceTotal(invoice: Invoice): number {
  return invoice.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
}

/** Amount settled so far. Older records have no amountPaid: Paid means in full. */
export function invoicePaid(invoice: Invoice): number {
  return invoice.amountPaid ?? (invoice.status === "Paid" ? invoiceTotal(invoice) : 0);
}

export function invoiceBalance(invoice: Invoice): number {
  return Math.max(0, invoiceTotal(invoice) - invoicePaid(invoice));
}

const DB_PATH = path.join(process.cwd(), "data", "db.json");
const DB_KEY = "mamoyo:db";

// Persistent backend selector: on Vercel (serverless, read-only filesystem) the
// JSON file can't be written, so the whole DB lives in Upstash Redis (Vercel's
// KV) as one JSON value. Locally, with no Redis env, it falls back to the file
// so `npm run dev` needs no setup. Both Vercel/KV and Upstash var names are
// accepted so it works however the integration is connected.
let redisClient: Redis | null = null;
function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  redisClient ??= new Redis({ url, token });
  return redisClient;
}

const seed: DB = {
  bookings: [
    { id: "b1", ref: "MS-1042", customer: "Chanda Mwila", email: "chanda.mwila@gmail.com", phone: "+260 97 445 2210", service: "Hot Stone Massage", date: "2026-07-09", time: "10:00", durationMin: 90, price: 850, status: "Confirmed", therapist: "Fadzi", createdAt: "2026-07-02" },
    { id: "b2", ref: "MS-1043", customer: "Natasha Zulu", email: "natasha.z@outlook.com", phone: "+260 96 778 0034", service: "Aromatherapy Facial", date: "2026-07-09", time: "13:30", durationMin: 60, price: 700, status: "Confirmed", therapist: "Brenda", createdAt: "2026-07-03" },
    { id: "b3", ref: "MS-1044", customer: "David Banda", email: "dbanda@zamnet.zm", phone: "+260 95 512 8899", service: "Deep Tissue Massage", date: "2026-07-10", time: "09:00", durationMin: 60, price: 650, status: "Pending", location: "Twangale", notes: "Prefers male therapist", createdAt: "2026-07-06" },
    { id: "b4", ref: "MS-1045", customer: "Grace & Peter Phiri", email: "gracephiri@gmail.com", phone: "+260 97 220 4477", service: "Couples Retreat Package", date: "2026-07-11", time: "14:00", durationMin: 180, price: 2400, status: "Confirmed", notes: "Anniversary — add café lunch for two", createdAt: "2026-07-01" },
    { id: "b5", ref: "MS-1046", customer: "Mutinta Hachipuka", email: "mutinta.h@yahoo.com", phone: "+260 96 331 9902", service: "Body Scrub & Wrap", date: "2026-07-12", time: "11:00", durationMin: 90, price: 900, status: "Pending", createdAt: "2026-07-07" },
    { id: "b6", ref: "MS-1041", customer: "Lombe Kasonde", email: "lombek@icloud.com", phone: "+260 95 909 1123", service: "Swedish Massage", date: "2026-07-07", time: "15:00", durationMin: 60, price: 600, status: "Completed", createdAt: "2026-06-30" },
    { id: "b7", ref: "MS-1040", customer: "Amina Patel", email: "amina.patel@gmail.com", phone: "+260 97 665 3040", service: "Manicure & Pedicure", date: "2026-07-06", time: "10:30", durationMin: 75, price: 450, status: "Completed", createdAt: "2026-06-28" },
    { id: "b8", ref: "MS-1039", customer: "Joseph Tembo", email: "jtembo@proton.me", phone: "+260 96 118 7755", service: "Sauna & Steam Session", date: "2026-07-05", time: "16:00", durationMin: 45, price: 350, status: "Cancelled", notes: "Client travelling — asked to rebook late July", createdAt: "2026-06-27" },
    { id: "b9", ref: "MS-1038", customer: "Bwalya Chileshe", email: "bwalya.c@gmail.com", phone: "+260 95 774 6612", service: "Aromatherapy Facial", date: "2026-07-04", time: "12:00", durationMin: 60, price: 700, status: "Completed", createdAt: "2026-06-25" },
  ],
  invoices: [
    { id: "i1", number: "INV-2026-0114", customer: "Lombe Kasonde", bookingRef: "MS-1041", items: [{ description: "Swedish Massage (60 min)", qty: 1, unitPrice: 600 }, { description: "Café — herbal tea & wrap", qty: 1, unitPrice: 130 }], issueDate: "2026-07-07", dueDate: "2026-07-14", status: "Paid" },
    { id: "i2", number: "INV-2026-0113", customer: "Amina Patel", bookingRef: "MS-1040", items: [{ description: "Manicure & Pedicure", qty: 1, unitPrice: 450 }], issueDate: "2026-07-06", dueDate: "2026-07-13", status: "Paid" },
    { id: "i3", number: "INV-2026-0112", customer: "Bwalya Chileshe", bookingRef: "MS-1038", items: [{ description: "Aromatherapy Facial", qty: 1, unitPrice: 700 }, { description: "Home care serum", qty: 1, unitPrice: 240 }], issueDate: "2026-07-04", dueDate: "2026-07-11", status: "Sent" },
    { id: "i4", number: "INV-2026-0111", customer: "Zambezi Holdings Ltd", items: [{ description: "Corporate wellness day (8 staff)", qty: 8, unitPrice: 550 }, { description: "Café catering — lunch", qty: 8, unitPrice: 150 }], issueDate: "2026-06-24", dueDate: "2026-07-01", status: "Overdue" },
    { id: "i5", number: "INV-2026-0110", customer: "Grace & Peter Phiri", bookingRef: "MS-1045", items: [{ description: "Couples Retreat Package (deposit)", qty: 1, unitPrice: 1200 }], issueDate: "2026-07-01", dueDate: "2026-07-10", status: "Paid" },
    { id: "i6", number: "INV-2026-0109", customer: "Kariba Lodge (partnership)", items: [{ description: "Guest voucher redemptions — June", qty: 14, unitPrice: 380 }], issueDate: "2026-06-30", dueDate: "2026-07-15", status: "Sent" },
    { id: "i7", number: "INV-2026-0115", customer: "Mutinta Hachipuka", bookingRef: "MS-1046", items: [{ description: "Body Scrub & Wrap (90 min)", qty: 1, unitPrice: 900 }], issueDate: "2026-07-08", dueDate: "2026-07-15", status: "Draft" },
  ],
  receipts: [
    { id: "r1", number: "RCT-2026-0231", invoiceNumber: "INV-2026-0114", customer: "Lombe Kasonde", amount: 730, method: "Mobile Money", date: "2026-07-07" },
    { id: "r2", number: "RCT-2026-0230", invoiceNumber: "INV-2026-0113", customer: "Amina Patel", amount: 450, method: "Card", date: "2026-07-06" },
    { id: "r3", number: "RCT-2026-0229", invoiceNumber: "INV-2026-0110", customer: "Grace & Peter Phiri", amount: 1200, method: "Bank Transfer", date: "2026-07-02" },
    { id: "r4", number: "RCT-2026-0228", invoiceNumber: "INV-2026-0105", customer: "Walk-in — café", amount: 320, method: "Cash", date: "2026-06-29" },
    { id: "r5", number: "RCT-2026-0227", invoiceNumber: "INV-2026-0104", customer: "Thandiwe Mumba", amount: 850, method: "Mobile Money", date: "2026-06-27" },
  ],
  transactions: [
    { id: "t0a", date: "2026-07-06", type: "Income", category: "Spa services", description: "Treatments — first week of July", amount: 16400 },
    { id: "t0b", date: "2026-07-06", type: "Income", category: "Café", description: "Café sales — first week of July", amount: 5200 },
    { id: "t1", date: "2026-07-07", type: "Income", category: "Spa services", description: "Swedish massage + café (Lombe Kasonde)", amount: 730 },
    { id: "t2", date: "2026-07-06", type: "Income", category: "Spa services", description: "Manicure & pedicure (Amina Patel)", amount: 450 },
    { id: "t3", date: "2026-07-05", type: "Income", category: "Café", description: "Weekend café sales", amount: 2140 },
    { id: "t4", date: "2026-07-04", type: "Expense", category: "Supplies", description: "Massage oils & aromatherapy stock", amount: 1850 },
    { id: "t5", date: "2026-07-02", type: "Income", category: "Packages", description: "Couples retreat deposit (Phiri)", amount: 1200 },
    { id: "t6", date: "2026-07-01", type: "Expense", category: "Rent", description: "Premises rent — July", amount: 18000 },
    { id: "t7", date: "2026-06-30", type: "Expense", category: "Salaries", description: "Staff salaries — June", amount: 42500 },
    { id: "t8", date: "2026-06-30", type: "Income", category: "Spa services", description: "June walk-in treatments", amount: 38400 },
    { id: "t9", date: "2026-06-30", type: "Income", category: "Café", description: "June café sales", amount: 21700 },
    { id: "t10", date: "2026-06-28", type: "Expense", category: "Utilities", description: "Electricity & water — June", amount: 4300 },
    { id: "t11", date: "2026-06-25", type: "Income", category: "Packages", description: "Corporate wellness day (Zambezi Holdings)", amount: 5600 },
    { id: "t12", date: "2026-06-20", type: "Expense", category: "Café stock", description: "Coffee beans, teas & fresh produce", amount: 3600 },
    { id: "t13", date: "2026-06-15", type: "Expense", category: "Marketing", description: "Social media campaign — winter promo", amount: 2500 },
    { id: "t14", date: "2026-05-31", type: "Income", category: "Spa services", description: "May treatments", amount: 41200 },
    { id: "t15", date: "2026-05-31", type: "Income", category: "Café", description: "May café sales", amount: 19800 },
    { id: "t16", date: "2026-05-31", type: "Expense", category: "Salaries", description: "Staff salaries — May", amount: 42500 },
    { id: "t17", date: "2026-05-31", type: "Expense", category: "Operations", description: "Rent, utilities & supplies — May", amount: 26900 },
    { id: "t18", date: "2026-04-30", type: "Income", category: "Spa services", description: "April treatments", amount: 36500 },
    { id: "t19", date: "2026-04-30", type: "Income", category: "Café", description: "April café sales", amount: 17200 },
    { id: "t20", date: "2026-04-30", type: "Expense", category: "Operations", description: "All operating costs — April", amount: 64100 },
    { id: "t21", date: "2026-03-31", type: "Income", category: "Spa services", description: "March treatments + packages", amount: 44800 },
    { id: "t22", date: "2026-03-31", type: "Income", category: "Café", description: "March café sales", amount: 18900 },
    { id: "t23", date: "2026-03-31", type: "Expense", category: "Operations", description: "All operating costs — March", amount: 61300 },
    { id: "t24", date: "2026-02-28", type: "Income", category: "Spa services", description: "February treatments (Valentine's promo)", amount: 52600 },
    { id: "t25", date: "2026-02-28", type: "Income", category: "Café", description: "February café sales", amount: 23400 },
    { id: "t26", date: "2026-02-28", type: "Expense", category: "Operations", description: "All operating costs — February", amount: 66800 },
  ],
  stays: [
    { id: "s1", ref: "ST-3007", suiteId: "studio-1", guest: "Amara Okafor", email: "amara.okafor@gmail.com", phone: "+234 803 555 1212", checkIn: "2026-07-08", checkOut: "2026-07-12", guests: 1, nights: 4, total: 5800, status: "CheckedIn", notes: "In Lusaka for a conference — late checkout requested", createdAt: "2026-06-30" },
    { id: "s2", ref: "ST-3008", suiteId: "studio-2", guest: "Jonas Weber", email: "j.weber@web.de", phone: "+49 171 555 8890", checkIn: "2026-07-10", checkOut: "2026-07-14", guests: 2, nights: 4, total: 5400, status: "Confirmed", createdAt: "2026-07-01" },
    { id: "s3", ref: "ST-3009", suiteId: "studio-3", guest: "Chipo & Daniel Moyo", email: "chipomoyo@icloud.com", phone: "+260 96 555 3321", checkIn: "2026-07-15", checkOut: "2026-07-18", guests: 2, nights: 3, total: 4500, status: "Pending", notes: "Honeymoon — flowers in room if possible", createdAt: "2026-07-07" },
    { id: "s4", ref: "ST-3006", suiteId: "studio-4", guest: "Lengwe Mutale", email: "lengwe.m@zamnet.zm", phone: "+260 97 555 7643", checkIn: "2026-06-28", checkOut: "2026-07-02", guests: 1, nights: 4, total: 5200, status: "CheckedOut", createdAt: "2026-06-20" },
  ],
  therapists: [
    { id: "fanely", name: "Fanely", monthlyTarget: 40000, active: true },
    { id: "fadzi", name: "Fadzi", monthlyTarget: 65000, active: true },
    { id: "brenda", name: "Brenda", monthlyTarget: 45000, active: true },
    { id: "emeldah", name: "Emeldah", monthlyTarget: 30000, active: true },
    { id: "lisa", name: "Lisa", monthlyTarget: 10000, active: true },
    { id: "grace", name: "Grace", monthlyTarget: 25000, active: true },
  ],
  treatments: [
    { id: "tr1", date: "2026-07-09", therapist: "Fadzi", service: "Hot Stone Massage", amount: 850, payment: "Card" },
    { id: "tr2", date: "2026-07-09", therapist: "Brenda", service: "Aromatherapy Facial", amount: 700, payment: "Mobile Money" },
    { id: "tr3", date: "2026-07-09", therapist: "Grace", service: "Manicure & Pedicure", amount: 450, payment: "Cash" },
    { id: "tr4", date: "2026-07-08", therapist: "Fadzi", service: "Deep Tissue Massage", amount: 650, payment: "Cash" },
    { id: "tr5", date: "2026-07-08", therapist: "Emeldah", service: "Swedish Massage", amount: 600, payment: "Mobile Money" },
    { id: "tr6", date: "2026-07-08", therapist: "Fanely", service: "Body Scrub & Wrap", amount: 900, payment: "Card" },
    { id: "tr7", date: "2026-07-08", therapist: "Lisa", service: "Sauna & Steam Session", amount: 350, payment: "Voucher" },
    { id: "tr8", date: "2026-07-07", therapist: "Fadzi", service: "Couples Retreat Package", amount: 2400, payment: "Card" },
    { id: "tr9", date: "2026-07-07", therapist: "Brenda", service: "Swedish Massage", amount: 600, payment: "Cash" },
    { id: "tr10", date: "2026-07-07", therapist: "Grace", service: "Salon — braids & styling", amount: 550, payment: "Mobile Money" },
    { id: "tr11", date: "2026-07-06", therapist: "Fanely", service: "Hot Stone Massage", amount: 850, payment: "Credit", notes: "Kariba Lodge voucher guest — invoice at month end" },
    { id: "tr12", date: "2026-07-06", therapist: "Emeldah", service: "Aromatherapy Facial", amount: 700, payment: "Card" },
    { id: "tr13", date: "2026-07-06", therapist: "Lisa", service: "Manicure & Pedicure", amount: 450, payment: "Cash" },
    { id: "tr14", date: "2026-07-05", therapist: "Brenda", service: "Deep Tissue Massage", amount: 650, payment: "Mobile Money" },
    { id: "tr15", date: "2026-07-05", therapist: "Fadzi", service: "Body Scrub & Wrap", amount: 900, payment: "Card" },
    { id: "tr16", date: "2026-07-04", therapist: "Grace", service: "Barber — cut & beard trim", amount: 250, payment: "Cash" },
    { id: "tr17", date: "2026-07-03", therapist: "Fanely", service: "Swedish Massage", amount: 600, payment: "Comp", notes: "Owner's guest" },
    { id: "tr18", date: "2026-07-02", therapist: "Emeldah", service: "Hot Stone Massage", amount: 850, payment: "Card" },
  ],
  inventory: [
    { id: "inv1", name: "Massage oil", brand: "Sensations", volume: "5L", category: "Spa products", unit: "bottle", quantity: 7, reorderLevel: 3, updatedAt: "2026-07-04" },
    { id: "inv2", name: "Aromatherapy essential oils", brand: "SOiL Organics", volume: "50ml", category: "Spa products", unit: "bottle", quantity: 12, reorderLevel: 6, updatedAt: "2026-07-01" },
    { id: "inv3", name: "Facial mask sachets", brand: "Dermalogica", volume: "30ml", category: "Spa products", unit: "pcs", quantity: 24, reorderLevel: 15, updatedAt: "2026-07-06" },
    { id: "inv4", name: "Body scrub salts", brand: "Marula Naturals", volume: "2kg", category: "Spa products", unit: "tub", quantity: 2, reorderLevel: 3, updatedAt: "2026-07-07" },
    { id: "inv5", name: "Treatment towels", brand: "Glodina", volume: "70×140cm", category: "Spa products", unit: "pcs", quantity: 48, reorderLevel: 30, updatedAt: "2026-06-28" },
    { id: "inv6", name: "Nail polish sets", brand: "OPI", volume: "15ml", category: "Spa products", unit: "set", quantity: 9, reorderLevel: 4, updatedAt: "2026-06-30" },
    { id: "inv7", name: "Coffee beans", brand: "Munali Coffee", volume: "1kg", category: "Café", unit: "bag", quantity: 4, reorderLevel: 6, updatedAt: "2026-07-08" },
    { id: "inv8", name: "Rooibos & herbal teas", brand: "Freshpak", volume: "80 bags", category: "Café", unit: "box", quantity: 11, reorderLevel: 5, updatedAt: "2026-07-02" },
    { id: "inv9", name: "Oat milk", brand: "Alpro", volume: "1L", category: "Café", unit: "carton", quantity: 18, reorderLevel: 10, updatedAt: "2026-07-08" },
    { id: "inv10", name: "Raw honey", brand: "Forest Fruits Zambia", volume: "500ml", category: "Café", unit: "jar", quantity: 6, reorderLevel: 4, updatedAt: "2026-07-05" },
    { id: "inv11", name: "Sourdough flour", brand: "Antonio", volume: "12.5kg", category: "Café", unit: "bag", quantity: 3, reorderLevel: 2, updatedAt: "2026-07-03" },
    { id: "inv12", name: "Fresh juice fruit crate", brand: "Soweto Market", volume: "±15kg", category: "Café", unit: "crate", quantity: 1, reorderLevel: 2, updatedAt: "2026-07-09" },
  ],
  users: [],
  roles: getDefaultRoleDefinitions(),
  channelIntegrations: [
    { provider: "airbnb", enabled: false, endpoint: "", apiKey: "", lastStatus: "idle", lastMessage: "Not configured yet." },
    { provider: "booking.com", enabled: false, endpoint: "", apiKey: "", lastStatus: "idle", lastMessage: "Not configured yet." },
    { provider: "expedia", enabled: false, endpoint: "", apiKey: "", lastStatus: "idle", lastMessage: "Not configured yet." },
  ],
  enquiries: [],
  // Seeded empty on purpose: reviews must be real, transcribed from a verified
  // platform listing by staff in the back office. Never seed sample reviews.
  reviews: [],
};

/** Backfill arrays added after a stored DB was first written. Mutates in place. */
function migrate(db: DB): boolean {
  let migrated = false;
  if (!Array.isArray(db.stays)) {
    db.stays = seed.stays;
    migrated = true;
  }
  if (!Array.isArray(db.treatments)) {
    db.treatments = seed.treatments;
    migrated = true;
  }
  if (!Array.isArray(db.therapists)) {
    db.therapists = seed.therapists;
    migrated = true;
  }
  if (!Array.isArray(db.inventory)) {
    db.inventory = seed.inventory;
    migrated = true;
  }
  if (!Array.isArray(db.users)) {
    db.users = seed.users;
    migrated = true;
  }
  if (!Array.isArray(db.roles) || db.roles.length === 0) {
    db.roles = getDefaultRoleDefinitions();
    migrated = true;
  }
  if (!Array.isArray(db.channelIntegrations)) {
    db.channelIntegrations = seed.channelIntegrations;
    migrated = true;
  }
  if (!Array.isArray(db.enquiries)) {
    db.enquiries = [];
    migrated = true;
  }
  if (!Array.isArray(db.reviews)) {
    db.reviews = [];
    migrated = true;
  }
  // Backfill newly added modules into existing system roles so they appear
  // for Owners/Managers/Staff without re-seeding.
  if (Array.isArray(db.roles)) {
    for (const role of db.roles) {
      if (!role.isSystemRole || !Array.isArray(role.modules)) continue;
      // Reviews are published to the public site, so Manager and Owner only.
      const mods = role.rank >= 1 ? (["enquiries", "reviews"] as const) : (["enquiries"] as const);
      for (const mod of mods) {
        if (!role.modules.includes(mod)) {
          role.modules.push(mod);
          migrated = true;
        }
      }
    }
  }
  return migrated;
}

async function ensureFileDb(): Promise<void> {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(seed, null, 2), "utf-8");
  }
}

export async function readDb(): Promise<DB> {
  const redis = getRedis();
  let db: DB;
  if (redis) {
    const stored = await redis.get<DB>(DB_KEY);
    if (stored) {
      db = stored;
    } else {
      // First boot on a fresh store: seed it.
      db = JSON.parse(JSON.stringify(seed)) as DB;
      await redis.set(DB_KEY, db);
    }
  } else {
    await ensureFileDb();
    db = JSON.parse(await fs.readFile(DB_PATH, "utf-8")) as DB;
  }
  if (migrate(db)) await writeDb(db);
  return db;
}

export async function writeDb(db: DB): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.set(DB_KEY, db);
    return;
  }
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}
