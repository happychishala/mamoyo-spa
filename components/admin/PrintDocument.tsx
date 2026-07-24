import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { contactInfo, locationInfo } from "@/lib/content";
import type { Location } from "@/lib/db";
import PrintButton from "./PrintButton";

export default function PrintDocument({
  backHref,
  backLabel,
  location = "Kabulonga",
  children,
  logoSrc = "/logo-mamoyo.png",
  logoAlt = "MaMoyo Wellness & Beauty — Kabulonga",
}: {
  backHref: string;
  backLabel: string;
  location?: Location;
  children: React.ReactNode;
  logoSrc?: string;
  logoAlt?: string;
}) {
  const branch = locationInfo[location];
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-mist-700 transition-colors duration-200 hover:text-mist-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {backLabel}
        </Link>
        <PrintButton />
      </div>

      <div className="rounded-2xl border border-mist-200 bg-white p-10 shadow-soft print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <div className="flex items-start justify-between gap-6 border-b border-mist-200 pb-6">
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={2595}
            height={795}
            className="h-32 w-auto"
          />
          <div className="text-right text-xs leading-relaxed text-mist-700">
            <p className="font-semibold text-mist-950">{branch.name}</p>
            <p>{branch.address}</p>
            <p>{contactInfo.phone}</p>
            <p>{contactInfo.email}</p>
          </div>
        </div>

        {children}

        <p className="mt-10 border-t border-mist-200 pt-4 text-center text-xs text-mist-600">
          Thank you for choosing MaMoyo — spa · café · suites · wellness experiences
        </p>
      </div>
    </div>
  );
}
