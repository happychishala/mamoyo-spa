"use client";

import { Paperclip, ExternalLink } from "lucide-react";
import { attachExpensePop } from "@/lib/actions";
import PopUploadField from "@/components/admin/PopUploadField";

export default function ExpensePopCell({ id, popId }: { id: string; popId?: string }) {
  if (popId) {
    return (
      <a
        href={`/admin/expenses/pop/${popId}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-xs font-semibold text-mist-700 underline-offset-2 hover:underline"
      >
        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        View POP
      </a>
    );
  }

  return (
    <details className="group">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-xs font-semibold text-mist-500 transition-colors duration-200 hover:text-mist-800">
        <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
        Attach
      </summary>
      <form action={attachExpensePop} className="mt-2 w-60 space-y-2 rounded-xl border border-mist-200 bg-white p-3 shadow-soft">
        <input type="hidden" name="id" value={id} />
        <PopUploadField label="Proof of payment" />
        <button
          type="submit"
          className="w-full rounded-full bg-mist-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-mist-700"
        >
          Save proof
        </button>
      </form>
    </details>
  );
}
