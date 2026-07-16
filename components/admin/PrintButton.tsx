"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-mist-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors duration-200 hover:bg-mist-700 print:hidden"
    >
      <Printer className="h-4 w-4" aria-hidden="true" />
      Print
    </button>
  );
}
