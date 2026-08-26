import type { Metadata } from "next";
import { UtensilsCrossed, NotebookPen, Download, Trash2, Eye, EyeOff } from "lucide-react";
import { readDb } from "@/lib/db";
import { getSession, canAccessModule } from "@/lib/auth";
import {
  importCafeMenu,
  updateCafeMenuItem,
  deleteCafeMenuItem,
  deleteRecipe,
} from "@/lib/actions";
import { formatMoney } from "@/lib/format";
import { PageHeader, Card, NoAccess } from "@/components/admin/ui";
import MenuItemForm from "./MenuItemForm";
import RecipeForm from "./RecipeForm";

export const metadata: Metadata = { title: "Chef" };
export const dynamic = "force-dynamic";

export default async function ChefPage() {
  const session = await getSession();
  if (!session) return null;
  if (session.role !== "Owner" && !(await canAccessModule("chef", session.role))) {
    return <NoAccess area="Chef" />;
  }

  const db = await readDb();
  const items = [...db.cafeMenuItems].sort(
    (a, b) => a.section.localeCompare(b.section) || a.name.localeCompare(b.name)
  );
  const sections = [...new Set(items.map((i) => i.section))];
  const recipes = db.recipes;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Chef"
        description="Manage the café menu that drives the till, and keep the kitchen's recipes in one place."
      />

      {/* ---- Café menu ---- */}
      <section className="space-y-5">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5 text-mist-500" aria-hidden="true" />
          <h2 className="font-serif text-xl font-semibold text-mist-950">Café menu</h2>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1.6fr]">
          <Card className="h-fit p-6">
            <h3 className="font-serif text-lg font-semibold text-mist-950">Add a menu item</h3>
            <p className="mt-1 text-sm text-mist-700">Available items appear in POS → Café.</p>
            <div className="mt-5">
              <MenuItemForm sections={sections} />
            </div>
            {items.length === 0 && (
              <form action={importCafeMenu} className="mt-5 border-t border-mist-100 pt-5">
                <p className="text-xs text-mist-600">Start from the current built-in café menu, then edit freely.</p>
                <button
                  type="submit"
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-mist-300 px-4 py-2 text-xs font-semibold text-mist-700 transition-colors duration-200 hover:border-mist-400 hover:bg-mist-50"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  Import current menu
                </button>
              </form>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-serif text-lg font-semibold text-mist-950">Current menu</h3>
              <p className="text-sm text-mist-600">{items.length} items</p>
            </div>

            {items.length === 0 ? (
              <p className="mt-6 rounded-xl border border-dashed border-mist-200 bg-mist-50 p-8 text-center text-sm text-mist-600">
                No menu items yet — add one, or import the current menu to get started.
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
                            {/* Price edit */}
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
                            {/* Availability */}
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
                            {/* Delete */}
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
      </section>

      {/* ---- Recipes ---- */}
      <section className="space-y-5">
        <div className="flex items-center gap-2">
          <NotebookPen className="h-5 w-5 text-mist-500" aria-hidden="true" />
          <h2 className="font-serif text-xl font-semibold text-mist-950">Recipes</h2>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1.6fr]">
          <Card className="h-fit p-6">
            <h3 className="font-serif text-lg font-semibold text-mist-950">New recipe</h3>
            <div className="mt-5">
              <RecipeForm />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-serif text-lg font-semibold text-mist-950">Recipe book</h3>
              <p className="text-sm text-mist-600">{recipes.length} recipes</p>
            </div>
            {recipes.length === 0 ? (
              <p className="mt-6 rounded-xl border border-dashed border-mist-200 bg-mist-50 p-8 text-center text-sm text-mist-600">
                No recipes yet — add your first on the left.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {recipes.map((r) => (
                  <details key={r.id} className="rounded-2xl border border-mist-200 bg-white p-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                      <span>
                        <span className="font-medium text-mist-950">{r.name}</span>
                        <span className="ml-2 text-xs text-mist-600">
                          {[r.category, r.yield].filter(Boolean).join(" · ")}
                        </span>
                      </span>
                      <span className="text-xs text-mist-500">{r.ingredients.length} ingredients</span>
                    </summary>
                    <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1.4fr]">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-mist-500">Ingredients</p>
                        <ul className="mt-2 space-y-1 text-sm text-mist-800">
                          {r.ingredients.map((ing, i) => (
                            <li key={i} className="flex justify-between gap-3">
                              <span>{ing.name}</span>
                              <span className="text-mist-500">{[ing.qty, ing.unit].filter(Boolean).join(" ")}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        {r.method && (
                          <>
                            <p className="text-xs font-semibold uppercase tracking-wide text-mist-500">Method</p>
                            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-mist-800">{r.method}</p>
                          </>
                        )}
                        {r.notes && <p className="mt-3 text-xs italic text-mist-600">{r.notes}</p>}
                      </div>
                    </div>
                    <form action={deleteRecipe} className="mt-4 border-t border-mist-100 pt-3 text-right">
                      <input type="hidden" name="id" value={r.id} />
                      <button type="submit" className="inline-flex items-center gap-1 text-xs font-medium text-mist-400 transition-colors duration-200 hover:text-red-600">
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete recipe
                      </button>
                    </form>
                  </details>
                ))}
              </div>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}
