import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getBlogPosts } from "@/lib/ghost";

export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();
  const ogImage = `${base}/opengraph-image`;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1, images: [ogImage] },
    { url: `${base}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9, images: [ogImage] },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

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

  return [...staticRoutes, ...postRoutes];
}
