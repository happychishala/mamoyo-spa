const speeds = ["animate-wave-slow", "animate-wave-reverse", "animate-wave"];

/**
 * A gently drifting wave band. `className` sets the wave colour (the section
 * it flows into); whatever sits behind shows through above the crests.
 */
export default function Wave({
  className = "text-white",
  speed = 0,
  height = "h-10 sm:h-14",
}: {
  className?: string;
  speed?: number;
  height?: string;
}) {
  return (
    <div aria-hidden="true" className="overflow-hidden leading-none">
      <div className={`flex w-[200%] ${speeds[speed % speeds.length]}`}>
        {[0, 1].map((i) => (
          <svg
            key={i}
            viewBox="0 0 1440 70"
            preserveAspectRatio="none"
            fill="currentColor"
            className={`w-1/2 shrink-0 ${height} ${className}`}
          >
            <path d="M0,40 C240,75 480,5 720,40 C960,75 1200,5 1440,40 L1440,70 L0,70 Z" />
          </svg>
        ))}
      </div>
    </div>
  );
}
