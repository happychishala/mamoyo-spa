import type { Metadata } from "next";
import Image from "next/image";
import { readDb } from "@/lib/db";
import { cafeMenu, type MenuSection } from "@/lib/content";
import { orderCafeMenu } from "@/lib/menu-order";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = {
  title: { absolute: "MaMoyo Café Menu | Lusaka" },
  description: "Fresh juices, coffee, breakfast and light plates at the MaMoyo Café — scan, browse and order.",
  alternates: { canonical: "/cafe/menu" },
  openGraph: {
    title: "MaMoyo Café Menu",
    description: "Fresh juices, coffee, breakfast and light plates at the MaMoyo Café.",
    url: "/cafe/menu",
  },
};

// Always read the live menu so a QR scan reflects the owner's latest edits.
export const dynamic = "force-dynamic";

export default async function CafeMenuPage() {
  const db = await readDb();
  const available = db.cafeMenuItems.filter((m) => m.available);
  // Once the café has any items of its own, that IS the menu — never fall back to
  // the built-in demo (guests must never see items the café doesn't serve). The
  // demo only shows on a truly unconfigured install with no café items at all.
  const configured = db.cafeMenuItems.length > 0;

  const sections: MenuSection[] = configured
    ? orderCafeMenu(available, db.cafeMenuOrder).map((s) => ({
        title: s.title,
        note: "",
        items: s.items.map((m) => ({ name: m.name, description: m.description ?? "", price: m.price })),
      }))
    : cafeMenu;

  return (
    <main className="mx-auto max-w-2xl px-5 py-10 sm:py-14">
      <header className="text-center">
        <Image
          src="/cafe-mamoyo-logo.png"
          alt="MaMoyo Café"
          width={2400}
          height={1697}
          className="mx-auto h-20 w-auto"
          priority
        />
        <h1 className="mt-5 font-serif text-3xl text-cocoa-700">Café Menu</h1>
        <p className="mt-2 text-sm text-mist-600">Prices in Zambian Kwacha (K)</p>
      </header>

      {sections.length === 0 && (
        <p className="mt-12 rounded-2xl border border-dashed border-mist-200 bg-white/60 p-10 text-center text-mist-600">
          Our full menu is being prepared — please ask a member of the team, or check back shortly.
        </p>
      )}

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <section key={section.title}>
            <div className="flex items-baseline justify-between gap-3 border-b border-mist-200 pb-2">
              <h2 className="font-serif text-xl font-semibold text-mist-950">{section.title}</h2>
              {section.note && <span className="text-xs italic text-mist-500">{section.note}</span>}
            </div>
            <ul className="mt-4 space-y-4">
              {section.items.map((item) => (
                <li key={item.name} className="flex items-baseline gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-mist-950">{item.name}</p>
                    {item.description && (
                      <p className="mt-0.5 text-sm leading-relaxed text-mist-600">{item.description}</p>
                    )}
                  </div>
                  <span
                    className="mt-2 shrink-0 border-b border-dotted border-mist-300"
                    aria-hidden="true"
                    style={{ flex: "0 1 1.5rem" }}
                  />
                  <span className="shrink-0 font-serif text-base text-cocoa-700">{formatMoney(item.price)}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <footer className="mt-14 border-t border-mist-200 pt-6 text-center text-xs text-mist-500">
        MaMoyo Café · spa · suites · wellness — Kabulonga &amp; Twangale, Lusaka
      </footer>
    </main>
  );
}
