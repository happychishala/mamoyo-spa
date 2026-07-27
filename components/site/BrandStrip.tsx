import Image from "next/image";
import { SectionHeading } from "./Section";

/**
 * The professional product lines MaMoyo works with, shown as a logo wall.
 *
 * Each logo sits on its own white card so brands with different backgrounds and
 * colours read consistently. Data-driven: add a brand by dropping its logo in
 * /public/brands and adding a row here.
 */
export interface Brand {
  name: string;
  src: string;
}

export const brands: Brand[] = [
  { name: "Dermalogica", src: "/brands/dermalogica.jpg" },
  { name: "Esse Skincare", src: "/brands/esse.png" },
  { name: "Elim", src: "/brands/elim.png" },
  { name: "SknLogic", src: "/brands/sknlogic.png" },
  // Gelish and OPI drop in here once their logo files are supplied.
];

export default function BrandStrip({
  overline = "Professional Partners",
  title = "The product lines we trust",
  description = "Our treatments are delivered with professional, internationally recognised skincare and nail systems, chosen for results rather than trend.",
}: {
  overline?: string;
  title?: string;
  description?: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeading overline={overline} title={title} description={description} />
      <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
        {brands.map((b) => (
          <li
            key={b.name}
            className="flex items-center justify-center rounded-2xl border border-mist-200 bg-white p-6 shadow-soft"
          >
            <div className="relative h-14 w-full">
              <Image
                src={b.src}
                alt={b.name}
                fill
                sizes="(min-width: 640px) 220px, 40vw"
                className="object-contain"
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
