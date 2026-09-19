"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteInventoryItem } from "@/lib/actions";

export default function DeleteInventoryButton({ id, name }: { id: string; name: string }) {
  const [pending, start] = useTransition();
  const onClick = () => {
    if (!confirm(`Delete "${name}" from inventory? This can't be undone.`)) return;
    const fd = new FormData();
    fd.set("id", id);
    start(() => deleteInventoryItem(fd));
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-label={`Delete ${name}`}
      title="Delete this item"
      className="inline-flex cursor-pointer items-center rounded-full p-1.5 text-mist-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  );
}
