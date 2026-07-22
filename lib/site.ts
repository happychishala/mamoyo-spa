/**
 * Canonical origin for metadata, sitemap and robots.
 * Set NEXT_PUBLIC_SITE_URL to the live domain before launch.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mamoyo-spa-tau.vercel.app"
).replace(/\/$/, "");

/** Pre-launch switch: set NEXT_PUBLIC_NOINDEX=true to keep the site out of search. */
export const NOINDEX = process.env.NEXT_PUBLIC_NOINDEX === "true";

/** Public routes included in the XML sitemap (admin and login are excluded). */
export const SITE_ROUTES = [
  "/",
  "/spa",
  "/spa/kabulonga",
  "/spa/twangale",
  "/spa/menu",
  "/spa/etiquette",
  "/cafe",
  "/suites",
  "/wellness",
  "/experiences",
  "/membership",
  "/corporate-wellness",
  "/gift-cards",
  "/journal",
  "/about",
  "/contact",
  "/book",
  "/booking",
  "/privacy",
  "/terms",
  "/cookies",
];
