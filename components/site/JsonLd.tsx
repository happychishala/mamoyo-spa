/**
 * Renders a JSON-LD structured-data block. Server component — the payload is
 * serialised at render time, never from user input.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
