// Heuristic parser for AZURE-style recipe "technical fiche" PDFs. Works on the
// plain text produced by unpdf (one item per line): a title, an optional
// subtitle, an "Ingredient / Quantity" table, then Method / Service / Yield /
// Costing / Nutrition sections, repeated per recipe. Pure — no deps.

export interface ParsedIngredient {
  name: string;
  qty?: string;
  unit?: string;
}
export interface ParsedRecipe {
  name: string;
  category?: string;
  yield?: string;
  ingredients: ParsedIngredient[];
  method?: string;
  notes?: string;
}

const RE_INGREDIENT_HEADER = /^ingredients?\b.*\bquantity\b/i;
const RE_METHOD = /^(preparation\s*\/?\s*method|method|preparation)\s*$/i;
const RE_SECTION = /^(preparation\s*\/?\s*method|method|preparation|service|yield|costing|cost|nutrition|allergens|ingredients?)\b/i;
const RE_FOOTER = /(^azure\b.*\b(page|fiche|manual|lusaka)|\bpage\s*\d+\s*$)/i;
const RE_QTY = /^([\d½¼¾.,/–-]+)\s*(.*)$/;

/** Split an ingredient row like "Green apple 2 pcs" into name + quantity by the
 *  first token that starts a number or fraction. */
function splitIngredient(line: string): ParsedIngredient | null {
  const tokens = line.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return null;
  const qtyStart = tokens.findIndex((t) => /^(½|¼|¾|\d)/.test(t));
  if (qtyStart <= 0) {
    // No quantity found, or the line starts with a number (likely not an
    // ingredient row) — treat the whole thing as a name only when it looks like one.
    return qtyStart === 0 ? null : { name: line.trim() };
  }
  const name = tokens.slice(0, qtyStart).join(" ");
  const rest = tokens.slice(qtyStart).join(" ");
  const m = RE_QTY.exec(rest);
  if (m) return { name, qty: m[1], unit: m[2] || undefined };
  return { name, qty: rest };
}

function inferCategory(subtitle: string): string {
  const s = subtitle.toLowerCase();
  if (s.includes("smoothie")) return "Smoothie";
  if (s.includes("cocktail")) return "Cocktail";
  if (s.includes("mocktail")) return "Mocktail";
  if (s.includes("juice")) return "Juice";
  return "Drink";
}

export function parseRecipesFromText(text: string): ParsedRecipe[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !RE_FOOTER.test(l));

  // Anchor on each ingredient-table header; the title/subtitle sit just above it.
  const headerIdx: number[] = [];
  lines.forEach((l, i) => {
    if (RE_INGREDIENT_HEADER.test(l)) headerIdx.push(i);
  });

  const recipes: ParsedRecipe[] = [];
  headerIdx.forEach((h, k) => {
    const title = (lines[h - 2] ?? "").replace(/^\s*\d+[.)]\s*/, "").trim();
    const subtitle = (lines[h - 1] ?? "").trim();
    if (!title) return;

    const nextHeader = headerIdx[k + 1] ?? lines.length;

    // Ingredients: rows after the header until the Method/section marker.
    const ingredients: ParsedIngredient[] = [];
    let i = h + 1;
    for (; i < nextHeader; i++) {
      if (RE_SECTION.test(lines[i])) break;
      const ing = splitIngredient(lines[i]);
      if (ing && ing.name) ingredients.push(ing);
    }

    // Method: after the Method marker until the next section.
    let method = "";
    const methodStart = lines.findIndex((l, idx) => idx >= h && idx < nextHeader && RE_METHOD.test(l));
    if (methodStart >= 0) {
      const parts: string[] = [];
      for (let j = methodStart + 1; j < nextHeader; j++) {
        if (RE_SECTION.test(lines[j])) break;
        parts.push(lines[j]);
      }
      method = parts.join(" ").trim();
    }

    // Yield + notes (costing / nutrition), captured loosely from labelled lines.
    const grab = (labelRe: RegExp): string => {
      const idx = lines.findIndex((l, x) => x >= h && x < nextHeader && labelRe.test(l));
      if (idx < 0) return "";
      const parts: string[] = [];
      for (let j = idx + 1; j < nextHeader; j++) {
        if (RE_SECTION.test(lines[j]) || RE_METHOD.test(lines[j])) break;
        parts.push(lines[j]);
      }
      return parts.join(" ").trim();
    };
    const yieldText = grab(/^yield\b/i);
    const costing = grab(/^costing\b/i);
    const nutrition = grab(/^(nutrition|allergens)\b/i);

    const notes = [subtitle, costing, nutrition].filter(Boolean).join(" · ") || undefined;

    recipes.push({
      name: title,
      category: inferCategory(subtitle),
      yield: yieldText || undefined,
      ingredients,
      method: method || undefined,
      notes,
    });
  });

  // Only keep recipes that actually parsed into something usable.
  return recipes.filter((r) => r.name && r.ingredients.length > 0);
}
