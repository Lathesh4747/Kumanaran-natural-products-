// Renders a JSON-LD <script> for structured data (SEO / AEO / GEO).
// Pass a schema.org object; it is serialised into the page so answer and
// generative engines can extract Organization / Product / Article / FAQ data.
export type JsonLdData = Record<string, unknown>;

export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is static, server-rendered, and not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
