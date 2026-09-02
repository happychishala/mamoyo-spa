"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteBooking } from "@/lib/actions";

export default function DeleteBookingButton({ id, refLabel }: { id: string; refLabel: string }) {
  const [pending, start] = useTransition();
  const onClick = () => {
    if (!confirm(`Delete booking ${refLabel}? This also removes its treatment, invoice and receipts, and cannot be undone.`)) return;
    const fd = new FormData();
    fd.set("id", id);
    start(() => deleteBooking(fd));
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-mist-300 px-3.5 py-2 text-xs font-semibold text-mist-700 transition-colors duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
