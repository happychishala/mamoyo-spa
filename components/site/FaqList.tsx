import JsonLd from "./JsonLd";
import { faqPageSchema } from "@/lib/schema";

export default function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-mist-100">
      <JsonLd data={faqPageSchema(items)} />
      {items.map((f) => (
        <div key={f.q} className="py-5">
          <h3 className="font-semibold text-mist-950">{f.q}</h3>
          <p className="mt-2 text-sm leading-relaxed text-mist-700">{f.a}</p>
        </div>
      ))}
    </div>
  );
}
