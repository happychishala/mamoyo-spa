"use client";

import { useState } from "react";
import { Coffee, ShoppingBag, Wine, Users } from "lucide-react";
import type { MenuSection } from "@/lib/content";
import type { OpenTab } from "@/lib/db";
import CafePOS from "./CafePOS";
import ProductPOS, { type RetailItem } from "./ProductPOS";
import TabsPOS, { type PickSection } from "./TabsPOS";

export default function PosTabs({
  products,
  bar,
  menu,
  tabs,
  pickables,
}: {
  products: RetailItem[];
  bar: RetailItem[];
  menu: MenuSection[];
  tabs: OpenTab[];
  pickables: PickSection[];
}) {
  const [tab, setTab] = useState<"cafe" | "bar" | "products" | "tabs">("cafe");

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
        <button type="button" onClick={() => setTab("tabs")} className={tabCls(tab === "tabs")}>
          <Users className="h-4 w-4" aria-hidden="true" />
          Tabs
          {tabs.length > 0 && (
            <span className="ml-0.5 rounded-full bg-white/25 px-1.5 text-[0.7rem]">{tabs.length}</span>
          )}
        </button>
      </div>

      {tab === "cafe" && <CafePOS menu={menu} />}
      {tab === "bar" && <ProductPOS items={bar} />}
      {tab === "tabs" && <TabsPOS tabs={tabs} pickables={pickables} />}
      {tab === "products" && <ProductPOS items={products} />}
    </div>
  );
}
