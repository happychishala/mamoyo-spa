"use client";

import { useRef, useState, useTransition } from "react";
import { Reorder, useDragControls } from "motion/react";
import { GripVertical, Check } from "lucide-react";
import { saveCafeMenuArrangement } from "@/lib/actions";

export type ArrangerItem = { id: string; name: string };
export type ArrangerSection = { title: string; items: ArrangerItem[] };

export default function MenuArranger({ initial }: { initial: ArrangerSection[] }) {
  const [sections, setSections] = useState<ArrangerSection[]>(initial);
  const ref = useRef(sections);
  ref.current = sections;
  const [pending, start] = useTransition();
  const [savedAt, setSavedAt] = useState(0);

  function persist() {
    const groups = ref.current.map((s) => ({ section: s.title, ids: s.items.map((i) => i.id) }));
    start(async () => {
      await saveCafeMenuArrangement(groups);
      setSavedAt(Date.now());
    });
  }

  function setItems(title: string, items: ArrangerItem[]) {
    setSections((prev) => prev.map((s) => (s.title === title ? { ...s, items } : s)));
  }

  if (sections.length === 0) {
    return <p className="text-sm text-mist-600">Add menu items first, then drag to arrange them.</p>;
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-mist-700">Drag the handles to reorder sections and items.</p>
        <span className="text-xs font-medium text-emerald-700" aria-live="polite">
          {pending ? "Saving…" : savedAt ? (
            <span className="inline-flex items-center gap-1">
              <Check className="h-3.5 w-3.5" aria-hidden="true" /> Order saved
            </span>
          ) : null}
        </span>
      </div>

      <Reorder.Group axis="y" values={sections} onReorder={setSections} className="space-y-3">
        {sections.map((section) => (
          <SectionRow
            key={section.title}
            section={section}
            onItems={(items) => setItems(section.title, items)}
            onEnd={persist}
          />
        ))}
      </Reorder.Group>
    </div>
  );
}

function SectionRow({
  section,
  onItems,
  onEnd,
}: {
  section: ArrangerSection;
  onItems: (items: ArrangerItem[]) => void;
  onEnd: () => void;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={section}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onEnd}
      className="rounded-xl border border-mist-200 bg-white p-3"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Drag section ${section.title}`}
          onPointerDown={(e) => controls.start(e)}
          style={{ touchAction: "none" }}
          className="cursor-grab rounded p-1 text-mist-400 hover:bg-mist-100 hover:text-mist-700 active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" aria-hidden="true" />
        </button>
        <p className="text-xs font-semibold uppercase tracking-wide text-mist-500">{section.title}</p>
      </div>

      <Reorder.Group axis="y" values={section.items} onReorder={onItems} className="mt-2 space-y-1 pl-6">
        {section.items.map((item) => (
          <ItemRow key={item.id} item={item} onEnd={onEnd} />
        ))}
      </Reorder.Group>
    </Reorder.Item>
  );
}

function ItemRow({ item, onEnd }: { item: ArrangerItem; onEnd: () => void }) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onEnd}
      className="flex items-center gap-2 rounded-lg border border-mist-100 bg-mist-50/60 px-2 py-2"
    >
      <button
        type="button"
        aria-label={`Drag ${item.name}`}
        onPointerDown={(e) => controls.start(e)}
        style={{ touchAction: "none" }}
        className="cursor-grab rounded p-1 text-mist-400 hover:bg-mist-200 hover:text-mist-700 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" aria-hidden="true" />
      </button>
      <span className="text-sm text-mist-900">{item.name}</span>
    </Reorder.Item>
  );
}
