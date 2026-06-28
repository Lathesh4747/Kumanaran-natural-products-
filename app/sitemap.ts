import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getBlogPosts } from "@/lib/ghost";

export const revalidate = 600;

// Build-time constant for truly-static pages. Google distrusts a <lastmod> that
// changes on every fetch, so we must NOT call `new Date()` per request here.
// Bump this date only when the static page content actually changes.
const STATIC_LASTMOD = new Date("2026-06-29T00:00:00.000Z");

// A few sections change on their own cadence — give them their own real dates
// rather than sharing one blanket timestamp.
const PRODUCTS_LASTMOD = new Date("2026-06-29T00:00:00.000Z");
const BLOG_INDEX_LASTMOD = new Date("2026-06-20T00:00:00.000Z"); // newest post date

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const ogImage = `${base}/opengraph-image`;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: STATIC_LASTMOD, changeFrequency: "weekly", priority: 1, images: [ogImage] },
    { url: `${base}/products`, lastModified: PRODUCTS_LASTMOD, changeFrequency: "weekly", priority: 0.9, images: [ogImage] },
    { url: `${base}/about`, lastModified: STATIC_LASTMOD, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog`, lastModified: BLOG_INDEX_LASTMOD, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/faq`, lastModified: STATIC_LASTMOD, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: STATIC_LASTMOD, changeFrequency: "yearly", priority: 0.5 },
  ];

  // Blog posts come from the real data source (Ghost when configured, else the
  // curated static corpus). Each entry uses the post's own publish date as a
  // stable per-URL lastmod — never a fresh `new Date()`.
  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getBlogPosts();
    postRoutes = posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      images: p.featureImage ? [p.featureImage] : undefined,
    }));
  } catch (error) {
    console.error("[sitemap]", error);
  }

  // NOTE: there is no /products/[slug] detail route in this app — /products is a
  // single listing page — so we deliberately do NOT emit per-product URLs here.
  // Emitting them would point Google at 404s and harm indexing. If product
  // detail pages are added, map getPublicProducts() to entries here.

  return [...staticRoutes, ...postRoutes];
}
