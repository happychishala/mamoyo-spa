"use client";

import { useState } from "react";
import { Coffee, ShoppingBag, Wine } from "lucide-react";
import type { MenuSection } from "@/lib/content";
import CafePOS from "./CafePOS";
import ProductPOS, { type RetailItem } from "./ProductPOS";

export default function PosTabs({
  products,
  bar,
  menu,
}: {
  products: RetailItem[];
  bar: RetailItem[];
  menu: MenuSection[];
}) {
  const [tab, setTab] = useState<"cafe" | "bar" | "products">("cafe");

  const tabCls = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-200 ${
      active ? "bg-mist-600 text-white shadow-soft" : "border border-mist-300 bg-white text-mist-700 hover:border-mist-400"
    }`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setTab("cafe")} className={tabCls(tab === "cafe")}>
          <Coffee className="h-4 w-4" aria-hidden="true" />
          Café
        </button>
        <button type="button" onClick={() => setTab("bar")} className={tabCls(tab === "bar")}>
          <Wine className="h-4 w-4" aria-hidden="true" />
          Bar
        </button>
        <button type="button" onClick={() => setTab("products")} className={tabCls(tab === "products")}>
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Products
        </button>
      </div>

      {tab === "cafe" && <CafePOS menu={menu} />}
      {tab === "bar" && <ProductPOS items={bar} />}
      {tab === "products" && <ProductPOS items={products} />}
    </div>
  );
}
