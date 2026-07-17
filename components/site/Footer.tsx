import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { contactInfo } from "@/lib/content";
import Wave from "@/components/site/Wave";

export default function Footer() {
  return (
    <footer className="mt-24">
      <Wave className="text-mist-950" speed={1} />
      <div className="bg-mist-950 text-mist-100">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Image
              src="/logo-mamoyo-white.png"
              alt="MaMoyo Wellness & Beauty — Kabulonga"
              width={2595}
              height={795}
              className="h-16 w-auto"
            />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-mist-300">
              A sanctuary of stillness in Kabulonga, Lusaka — spa, salon &amp; barber,
              health café, private events venue and serviced apartments.
            </p>
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-mist-400">
              Spa · Salon &amp; Barber · Health Café · Events · Apartments
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-mist-400">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/treatments" className="transition-colors duration-200 hover:text-white">Treatments</Link></li>
              <li><Link href="/cafe" className="transition-colors duration-200 hover:text-white">Café MaMoyo</Link></li>
              <li><Link href="/suites" className="transition-colors duration-200 hover:text-white">MaMoyo Suites</Link></li>
              <li><Link href="/booking" className="transition-colors duration-200 hover:text-white">Book a Visit</Link></li>
              <li><Link href="/about" className="transition-colors duration-200 hover:text-white">Our Story</Link></li>
              <li><Link href="/admin" className="transition-colors duration-200 hover:text-white">Staff Portal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-mist-400">Visit Us</h3>
            <ul className="mt-4 space-y-3 text-sm text-mist-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-mist-400" aria-hidden="true" />
                {contactInfo.address}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-mist-400" aria-hidden="true" />
                {contactInfo.phone}
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-mist-400" aria-hidden="true" />
                {contactInfo.email}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 border-t border-mist-800 pt-8 text-xs text-mist-400 sm:flex-row sm:justify-between">
          <p className="order-2 sm:order-1">
            © {new Date().getFullYear()} MaMoyo Wellness &amp; Beauty. All rights reserved.
          </p>
          <nav aria-label="Legal" className="order-1 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:order-2">
            <Link href="/privacy" className="transition-colors duration-200 hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors duration-200 hover:text-white">Terms &amp; Conditions</Link>
            <Link href="/cookies" className="transition-colors duration-200 hover:text-white">Cookie Policy</Link>
          </nav>
        </div>
      </div>
      </div>
    </footer>
  );
}
