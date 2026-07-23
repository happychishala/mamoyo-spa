export function LegalPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pt-32 pb-20 sm:pt-36">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mist-600">Legal</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-cocoa-700 sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-mist-500">Last updated {updated}</p>
        {intro && <p className="mt-6 text-base leading-relaxed text-mist-700 sm:text-lg">{intro}</p>}
        <div className="mt-10 space-y-10">{children}</div>
      </div>
    </div>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-serif text-xl font-semibold text-cocoa-700">{heading}</h2>
      <div className="mt-3 space-y-3 text-[0.95rem] leading-relaxed text-mist-700 [&_a]:font-medium [&_a]:text-mist-700 [&_a]:underline [&_a:hover]:text-mist-900 [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-mist-900 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
