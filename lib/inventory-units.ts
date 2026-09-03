/** Units of measure for stock — a fixed list so the field can't hold a number. */
export const INVENTORY_UNITS = [
  "bottle", "jar", "tub", "tube", "sachet", "pcs", "set", "pack",
  "box", "bag", "carton", "roll", "pair", "kg", "g", "L", "ml",
] as const;
