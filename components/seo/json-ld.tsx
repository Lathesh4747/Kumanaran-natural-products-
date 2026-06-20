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

// Builds a schema.org BreadcrumbList so search/answer engines understand the
// page's position in the site. Pass ordered { name, url } crumbs.
export function breadcrumbList(
  items: readonly { name: string; url: string }[]
): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
