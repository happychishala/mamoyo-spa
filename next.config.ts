import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * Everything the site loads is same-origin: fonts are self-hosted via
 * next/font/local, images live in /public, and there are no third-party
 * scripts or stylesheets. The one exception is Vercel Analytics, which is
 * proxied at /_vercel/insights on Vercel and falls back to va.vercel-scripts.com.
 *
 * `'unsafe-inline'` is present for scripts because Next.js emits inline
 * bootstrap scripts. The stricter alternative — per-request nonces — requires
 * dynamic rendering on every page, which would give up static generation on all
 * 16 marketing pages. Since the site renders no user-supplied HTML, restricting
 * *origins* is the protection that matters here: an injected
 * `<script src="https://…">` is blocked even though inline script is not.
 */
// React calls eval() in development for debugging features (reconstructing
// server stacks in the browser). It never does in production, so the allowance
// is scoped to dev only.
const isDev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://va.vercel-scripts.com",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Clickjacking guard for browsers that predate frame-ancestors.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site asks for none of these; deny them so an injected script cannot.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Don't advertise the framework and version to scanners.
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // The back office should never be cached by a proxy or shared browser cache.
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, must-revalidate" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/login",
        headers: [
          { key: "Cache-Control", value: "no-store, must-revalidate" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // The treatment menu now lives under the Spa section.
      { source: "/treatments", destination: "/spa/menu", permanent: true },
      { source: "/treatments/:path*", destination: "/spa/menu", permanent: true },
      // Historic salon / barber URLs point at the spa.
      { source: "/salon", destination: "/spa", permanent: true },
      { source: "/salon/:path*", destination: "/spa", permanent: true },
      { source: "/barber", destination: "/spa", permanent: true },
      { source: "/barber/:path*", destination: "/spa", permanent: true },
    ];
  },
};

export default nextConfig;
