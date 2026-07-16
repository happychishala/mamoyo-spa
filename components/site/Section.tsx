interface SectionHeadingProps {
  overline: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}

export function SectionHeading({ overline, title, description, align = "center" }: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "text-left";
  return (
    <div className={`max-w-2xl ${alignment}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mist-600">{overline}</p>
      <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-mist-950 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-mist-800">{description}</p>
      )}
    </div>
  );
}

export function ServiceIcon({ icon, className = "h-6 w-6" }: { icon: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    waves: (
      <path d="M2 8c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0 3.5-2 5 0M2 13c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0 3.5-2 5 0M2 18c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0 3.5-2 5 0" />
    ),
    hand: (
      <path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12m0-6.5v-2a1.5 1.5 0 0 1 3 0V12m0-6a1.5 1.5 0 0 1 3 0v8.5a6.5 6.5 0 0 1-6.5 6.5h-1a6.5 6.5 0 0 1-5.2-2.6l-2.6-3.5a1.6 1.6 0 0 1 2.4-2.1L8 15" />
    ),
    stone: (
      <>
        <ellipse cx="12" cy="16.5" rx="8" ry="4" />
        <ellipse cx="12" cy="10.5" rx="5.5" ry="3" />
        <ellipse cx="12" cy="5.5" rx="3.5" ry="2" />
      </>
    ),
    flower: (
      <>
        <circle cx="12" cy="12" r="2.5" />
        <path d="M12 9.5c0-3 2-5.5 0-7.5-2 2 0 4.5 0 7.5Zm0 5c0 3-2 5.5 0 7.5 2-2 0-4.5 0-7.5Zm2.5-2.5c3 0 5.5 2 7.5 0-2-2-4.5 0-7.5 0Zm-5 0c-3 0-5.5-2-7.5 0 2 2 4.5 0 7.5 0Z" />
      </>
    ),
    leaf: (
      <path d="M4 20c0-9 5-16 16-16 0 11-7 16-16 16Zm0 0c4-4 7-7 11-11" />
    ),
    sparkles: (
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3ZM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15ZM5 16l.7 1.8L7.5 18.5l-1.8.7L5 21l-.7-1.8L2.5 18.5l1.8-.7L5 16Z" />
    ),
    steam: (
      <path d="M7 3c-1.5 2 1.5 3.5 0 5.5M12 3c-1.5 2 1.5 3.5 0 5.5M17 3c-1.5 2 1.5 3.5 0 5.5M4 12h16v2a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7v-2Z" />
    ),
    hearts: (
      <path d="M8.5 5A4 4 0 0 0 4.5 9c0 3.5 4 6 6 7.5 2-1.5 6-4 6-7.5a4 4 0 0 0-7-2.6A4 4 0 0 0 8.5 5ZM17 13.5c1.3.9 3 2.2 3 4a2.5 2.5 0 0 1-4.4 1.6A2.5 2.5 0 0 1 11.2 17.5c0-1.8 1.7-3.1 3-4" />
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[icon] ?? paths.waves}
    </svg>
  );
}
