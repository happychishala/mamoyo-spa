import Image from "next/image";
import Reveal from "./Reveal";

export interface StripPhoto {
  src: string;
  alt: string;
}

/**
 * A three-up band of photographs used to break up long text sections.
 * The middle frame sits slightly lower on wider screens so the row reads as
 * composed rather than as a plain grid.
 */
export default function PhotoStrip({
  photos,
  className = "",
}: {
  photos: StripPhoto[];
  className?: string;
}) {
  return (
    <section className={`mx-auto max-w-6xl px-6 ${className}`}>
      <div className="grid gap-4 sm:grid-cols-3">
        {photos.map((p, i) => (
          <Reveal key={p.src} delay={(i % 3) * 90} className={i === 1 ? "sm:mt-8" : ""}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-soft">
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(min-width: 640px) 30vw, 90vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
