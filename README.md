# MaMoyo Wellness & Beauty

Brand-teal themed website for MaMoyo Wellness & Beauty (Kabulonga, Lusaka) — spa, salon & barber, health café, private events venue and serviced apartments — with a back-office CRM. Built with Next.js 16 (App Router, Turbopack), Tailwind CSS v4, and lucide-react icons.

Logos live in `public/` (`logo-mamoyo.png` main, `cafe-mamoyo-logo.png` café). Photos in `public/photos/` are Unsplash placeholders — swap in real photography of the venue when available.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Admin access

The back office (`/admin/*`) is password-protected. Set `ADMIN_PASSWORD` in `.env.local`:

```bash
ADMIN_PASSWORD=your-strong-password
```

Sign in at `/login`. The root account is username **admin** with `ADMIN_PASSWORD`; additional users (with their own passwords, scrypt-hashed in `data/db.json`) are managed by Owners on the Team page. Three roles: **Staff** (dashboard, bookings, stays, reports, inventory), **Manager** (adds invoices, receipts, finance, team/therapists), **Owner** (adds user management). Sessions are HMAC-signed, HTTP-only cookies valid for 7 days carrying username + role; the signing key is derived from `ADMIN_PASSWORD`, so rotating the password signs everyone out. Route protection lives in `proxy.ts`, and every admin server action in `lib/actions.ts` re-checks the session via `requireAdmin()`/`requireRole()` (`lib/auth.ts`), since server actions are reachable by direct POST. The public booking forms (`createBooking`, `createStayBooking`) remain open by design.

## Pages

**Public site**
- `/` — home (hero, service pillars, treatments preview, café teaser, testimonials, CTA)
- `/treatments` — the official MaMoyo Spa menu (7 categories, ~80 bookable options from the printed price list) with animated wave section dividers, scroll-reveal cards, and a scrollspy nav that docks to the left rail; every price row deep-links into the booking form
- `/cafe` — Café MaMoyo menu, hours and house promises
- `/suites` — MaMoyo Suites: four serviced studios with real photos, nightly rates, live availability (booked ranges shown per studio) and a date-range booking form with double-booking prevention
- `/about` — story and values
- `/contact` — address, phone, email, hours
- `/booking` — treatment booking request form (server action, no payment online)

**Back office CRM** (`/admin`, linked as "Staff Portal" in the footer)
- `/admin` — dashboard: monthly income/net/outstanding KPIs, income-vs-expense chart, upcoming bookings, latest receipts
- `/admin/bookings` — confirm / complete / cancel treatment bookings; assign a therapist per booking, and completing (with a payment type) auto-logs the treatment into Reports
- `/admin/calendar` — month / week / day calendar of spa bookings and suite stays, with a location filter
- `/admin/stays` — MaMoyo Suites reservations: confirm, check in, check out, cancel
- `/admin/reports` — read-only revenue reports fed by completed bookings: daily totals by payment method, monthly revenue per therapist vs editable targets (house target K250,000), payment mix and a daily×therapist matrix; ex-employees keep their history
- `/admin/inventory` — spa products and café stock (item, brand, size/volume) with reorder alerts and stock in/out adjustments
- `/admin/team` — therapists (add, Active/Ex-employee status) and, for Owners, back-office users with roles
- Invoices and receipts have branded print views (`…/[id]/print` with a Print button)

**Revenue flow:** every treatment starts as a booking (public site or the walk-in form on `/admin/bookings`), gets a therapist assigned, and is completed with a payment type — that creates the treatment record behind Reports.
- `/admin/invoices` — send drafts, mark paid (choosing payment method)
- `/admin/receipts` — receipts ledger (auto-issued when an invoice is marked paid)
- `/admin/finance` — income & expense ledger, monthly trend chart, add-transaction form

## How data works

All data lives in `data/db.json` (human-readable JSON). On first run it is seeded from `lib/db.ts`. Mutations happen through server actions in `lib/actions.ts`:

- A public booking request creates a `Pending` booking with an auto-incremented `MS-…` ref.
- Marking an invoice **Paid** automatically issues the next `RCT-…` receipt **and** records the income in the finance ledger.

To reset the demo, delete `data/db.json` and reload.

## Design system (Mamoyo 2026 Brand Kit)

- Palette: `mist` teal scale built around the brand teal `#1CA3B1` (sampled from the Café MaMoyo logo), plus `cocoa` browns from the KABULONGA wordmark (`#603E26`) — defined in `app/globals.css` via Tailwind v4 `@theme`
- Typography: Trajan Pro (headings, brand display face) + Gotham Book (body), served locally from `fonts/` via `next/font/local`
- Logo: `public/cafe-mamoyo-logo.png` (transparent, downscaled from the brand kit original) — used on the café page
- Style: Soft UI Evolution — soft shadows, 200–300 ms transitions, WCAG AA contrast, `prefers-reduced-motion` respected
- Motion language: drifting wave dividers (`components/site/Wave.tsx`, three speeds/directions) flow between sections and into the footer on every page; photos and cards rise in on scroll via `components/site/Reveal.tsx` (IntersectionObserver)

There is no authentication on `/admin` — add it before deploying anywhere public.

## Channel manager hooks

Suite bookings can optionally sync to Airbnb, Booking.com, and Expedia through HTTP webhooks. Define the relevant env vars in `.env.local` before enabling the integration:

```bash
AIRBNB_API_URL=...
AIRBNB_API_KEY=...
BOOKING_COM_API_URL=...
BOOKING_COM_API_KEY=...
EXPEDIA_API_URL=...
EXPEDIA_API_KEY=...
```

If a provider URL is not configured, it is skipped automatically.
