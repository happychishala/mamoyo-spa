import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSession, canAccessModule } from "@/lib/auth";
import { SITE_URL } from "@/lib/site";
import { qrSvg } from "@/lib/qr";
import { NoAccess } from "@/components/admin/ui";
import PrintButton from "@/components/admin/PrintButton";

export const metadata: Metadata = { title: "Print café menu QR" };
export const dynamic = "force-dynamic";

export default async function MenuQrPrintPage() {
  const session = await getSession();
  if (!session) return null;
  if (session.role !== "Owner" && !(await canAccessModule("menu", session.role))) {
    return <NoAccess area="Café Menu" />;
  }

  const menuUrl = `${SITE_URL}/cafe/menu`;
  const qr = await qrSvg(menuUrl, { margin: 2 });

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/admin/menu"
          className="inline-flex items-center gap-2 text-sm font-medium text-mist-700 transition-colors duration-200 hover:text-mist-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Café Menu
        </Link>
        <PrintButton />
      </div>

      {/* Table card — prints on its own */}
      <div className="rounded-3xl border border-mist-200 bg-white px-8 py-10 text-center shadow-soft print:rounded-none print:border-0 print:shadow-none">
        <Image
          src="/cafe-mamoyo-logo.png"
          alt="MaMoyo Café"
          width={2400}
          height={1697}
          className="mx-auto h-24 w-auto"
          priority
        />
        <h1 className="mt-6 font-serif text-2xl font-semibold text-cocoa-700">Our Menu</h1>
        <p className="mt-1 text-sm text-mist-700">Scan to view the full café menu on your phone</p>

        <div
          className="mx-auto mt-6 h-64 w-64 [&_svg]:h-full [&_svg]:w-full"
          aria-label="QR code linking to the café menu"
          dangerouslySetInnerHTML={{ __html: qr }}
        />

        <p className="mt-6 break-all text-xs text-mist-500">{menuUrl}</p>
        <p className="mt-4 text-sm font-medium text-mist-800">MaMoyo Café · spa · suites · wellness</p>
      </div>
    </div>
  );
}
