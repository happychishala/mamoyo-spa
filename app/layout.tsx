import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


// Brand kit fonts (Mamoyo 2026 Brand Kit)
const gotham = localFont({
  src: "../fonts/GothamBook.otf",
  variable: "--font-gotham",
  display: "swap",
});

const trajan = localFont({
  src: "../fonts/TrajanProRegular.ttf",
  variable: "--font-trajan",
  display: "swap",
});

// Brush script closest to the MaMoyo logo lettering, for accent words.
// Self-hosted so the build never depends on Google Fonts.
const kaushan = localFont({
  src: "../fonts/KaushanScript.woff2",
  variable: "--font-kaushan",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MaMoyo | Spa, Wellness, Café and Suites in Lusaka",
    template: "%s | MaMoyo",
  },
  description:
    "Discover MaMoyo, Lusaka's premier wellness destination for spa treatments, professional skincare, café rituals, serviced suites and curated experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", gotham.variable, trajan.variable, kaushan.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
