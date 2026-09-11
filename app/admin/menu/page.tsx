import type { Metadata } from "next";
import Link from "next/link";
import { Printer, ExternalLink, Eye, EyeOff, Trash2 } from "lucide-react";
import { readDb } from "@/lib/db";
import { getSession, canAccessModule } from "@/lib/auth";
import { updateCafeMenuItem, deleteCafeMenuItem } from "@/lib/actions";
import { SITE_URL } from "@/lib/site";
import { qrSvg } from "@/lib/qr";
import { PageHeader, Card, NoAccess } from "@/components/admin/ui";
import MenuItemForm from "../chef/MenuItemForm";

export const metadata: Metadata = { title: "Café Menu (QR)" };
export const dynamic = "force-dynamic";

const MENU_PATH = "/cafe/menu";

export default async function MenuPage() {
  const session = await getSession();
  if (!session) return null;
  if (session.role !== "Owner" && !(await canAccessModule("menu", session.role))) {
    return <NoAccess area="Café Menu" />;
  }

  const db = await readDb();
  const items = [...db.cafeMenuItems].sort(
    (a, b) => a.section.localeCompare(b.section) || a.name.localeCompare(b.name)
  );
  const sections = [...new Set(items.map((i) => i.section))];
  const menuUrl = `${SITE_URL}${MENU_PATH}`;
  const qr = await qrSvg(menuUrl);
  const availableCount = items.filter((i) => i.available).length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Café Menu (QR)"
        description="Put this QR code on your tables. Guests scan it to see the live café menu — whatever you set here is what they see, instantly."
      />

      {/* QR + link */}
      <Card className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-center">
        <div
          className="mx-auto h-44 w-44 [&_svg]:h-full [&_svg]:w-full"
          aria-label="QR code for the café menu"
          dangerouslySetInnerHTML={{ __html: qr }}
        />
        <div>
          <h2 className="font-serif text-xl font-semibold text-mist-950">Your menu is live</h2>
          <p className="mt-1 text-sm text-mist-700">
            {availableCount} {availableCount === 1 ? "item" : "items"} visible to guests. The QR points to:
          </p>
          <Link
            href={MENU_PATH}
            target="_blank"
            className="mt-2 inline-flex items-center gap-1.5 break-all text-sm font-medium text-mist-700 underline decoration-mist-300 underline-offset-2 hover:text-mist-900"
          >
            {menuUrl}
            <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </Link>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/admin/menu/print"
              className="inline-flex items-center gap-2 rounded-full bg-mist-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
            >
              <Printer className="h-4 w-4" aria-hidden="true" />
              Print QR code
            </Link>
            <Link
              href={MENU_PATH}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-mist-300 px-5 py-2.5 text-sm font-semibold text-mist-800 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Preview menu
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* Add */}
        <Card className="p-6">
          <h3 className="font-serif text-lg font-semibold text-mist-950">Add a menu item</h3>
          <div className="mt-4">
            <MenuItemForm sections={sections} />
          </div>
        </Card>

        {/* Current menu */}
        <Card className="p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-serif text-lg font-semibold text-mist-950">Current menu</h3>
            <p className="text-sm text-mist-600">{items.length} items</p>
          </div>

          {items.length === 0 ? (
            <p className="mt-6 rounded-xl border border-dashed border-mist-200 bg-mist-50 p-8 text-center text-sm text-mist-600">
              No menu items yet — add one on the left. You can also import the current menu from the Chef module.
            </p>
          ) : (
            <div className="mt-4 space-y-6">
              {sections.map((section) => (
                <div key={section}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-mist-500">{section}</p>
                  <div className="mt-2 divide-y divide-mist-100">
                    {items
                      .filter((i) => i.section === section)
                      .map((item) => (
                        <div key={item.id} className={`flex flex-wrap items-center gap-x-4 gap-y-2 py-3 ${item.available ? "" : "opacity-55"}`}>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-mist-950">{item.name}</p>
                            {item.description && <p className="truncate text-xs text-mist-600">{item.description}</p>}
                          </div>
                          <form action={updateCafeMenuItem} className="flex items-center gap-1">
                            <input type="hidden" name="id" value={item.id} />
                            <span className="text-xs text-mist-500">K</span>
                            <input
                              name="price"
                              type="number"
                              min="0"
                              step="0.01"
                              defaultValue={item.price}
                              aria-label={`Price for ${item.name}`}
                              className="w-20 rounded-lg border border-mist-200 bg-white px-2.5 py-1.5 text-right text-xs text-mist-950 focus:border-mist-500 focus:outline-none"
                            />
                            <button type="submit" className="rounded-full bg-mist-100 px-2.5 py-1.5 text-xs font-semibold text-mist-700 hover:bg-mist-200">Save</button>
                          </form>
                          <form action={updateCafeMenuItem}>
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="toggle" value="available" />
                            <button
                              type="submit"
                              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                                item.available
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                  : "border-mist-200 bg-mist-50 text-mist-500 hover:bg-mist-100"
                              }`}
                            >
                              {item.available ? <Eye className="h-3.5 w-3.5" aria-hidden="true" /> : <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />}
                              {item.available ? "Available" : "Hidden"}
                            </button>
                          </form>
                          <form action={deleteCafeMenuItem}>
                            <input type="hidden" name="id" value={item.id} />
                            <button type="submit" aria-label={`Delete ${item.name}`} className="rounded-full p-1.5 text-mist-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-600">
                              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </form>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
