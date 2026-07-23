import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { contactInfo, locationInfo } from "@/lib/content";
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
              alt="MaMoyo"
              width={2595}
              height={795}
              className="h-16 w-auto"
            />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-mist-300">
              Lusaka&rsquo;s premier wellness destination, bringing together considered care,
              restorative treatments, nourishing food, beautiful stays and a community built
              around living well.
            </p>
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-mist-400">
              Spa · Café · Suites · Wellness · Experiences
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-mist-400">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/spa/menu" className="transition-colors duration-200 hover:text-white">Treatments</Link></li>
              <li><Link href="/cafe" className="transition-colors duration-200 hover:text-white">MaMoyo Café</Link></li>
              <li><Link href="/suites" className="transition-colors duration-200 hover:text-white">MaMoyo Suites</Link></li>
              <li><Link href="/booking" className="transition-colors duration-200 hover:text-white">Book a Visit</Link></li>
              <li><Link href="/about" className="transition-colors duration-200 hover:text-white">Our Story</Link></li>
              <li><Link href="/admin" className="transition-colors duration-200 hover:text-white">Staff Portal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-mist-400">Visit Us</h3>
            <ul className="mt-4 space-y-4 text-sm text-mist-300">
              {(["Kabulonga", "Twangale"] as const).map((key) => (
                <li key={key}>
                  <p className="font-medium text-mist-100">{locationInfo[key].name}</p>
                  <p className="mt-1 flex items-start gap-2.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-mist-400" aria-hidden="true" />
                    {locationInfo[key].address}
                  </p>
                  <p className="mt-1 flex items-center gap-2.5">
                    <Phone className="h-4 w-4 shrink-0 text-mist-400" aria-hidden="true" />
                    {locationInfo[key].phone}
                  </p>
                </li>
              ))}
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-mist-400" aria-hidden="true" />
                <a href={`mailto:${contactInfo.email}`} className="transition-colors duration-200 hover:text-white">
                  {contactInfo.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 border-t border-mist-800 pt-8 text-xs text-mist-400 sm:flex-row sm:justify-between">
          <p className="order-2 sm:order-1">
            © {new Date().getFullYear()} MaMoyo. All rights reserved.
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
