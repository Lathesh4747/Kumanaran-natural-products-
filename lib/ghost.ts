import "server-only";
import {
  blogPosts as staticPosts,
  type BlogSection,
  type BlogFaq,
} from "@/lib/blog-data";

// Single place that talks to the Ghost Content API. When Ghost is not configured
// (no GHOST_URL / key yet) it serves the curated static posts so the blog always
// renders. Blog content is never stored in Postgres.

export type BlogPostSummary = {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  publishedAt: string;
  featureImage: string | null;
};

export type BlogPostFull = BlogPostSummary & {
  // Ghost posts arrive as rendered HTML; static posts as structured sections.
  html: string | null;
  sections: BlogSection[] | null;
  // AEO / GEO extras from static posts; Ghost posts leave these null/empty.
  faqs: BlogFaq[] | null;
  keywords: string[] | null;
};

const GHOST_URL = process.env.GHOST_URL;
const GHOST_KEY = process.env.GHOST_CONTENT_API_KEY;
const GHOST_VERSION = "v5.0";

function ghostConfigured(): boolean {
  return Boolean(GHOST_URL && GHOST_KEY);
}

type GhostTag = { name?: string };
type GhostPost = {
  slug: string;
  title: string;
  custom_excerpt?: string | null;
  excerpt?: string | null;
  reading_time?: number | null;
  published_at?: string | null;
  feature_image?: string | null;
  html?: string | null;
  tags?: GhostTag[];
};

function readTime(minutes: number | null | undefined): string {
  const m = minutes && minutes > 0 ? minutes : 1;
  return `${m} min read`;
}

function toSummary(post: GhostPost): BlogPostSummary {
  return {
    slug: post.slug,
    tag: post.tags?.[0]?.name ?? "Article",
    title: post.title,
    excerpt: post.custom_excerpt ?? post.excerpt ?? "",
    readTime: readTime(post.reading_time),
    publishedAt: post.published_at ?? new Date().toISOString(),
    featureImage: post.feature_image ?? null,
  };
}

async function ghostFetch(path: string): Promise<unknown> {
  const sep = path.includes("?") ? "&" : "?";
  const url = `${GHOST_URL}/ghost/api/content/posts${path}${sep}key=${GHOST_KEY}`;
  const res = await fetch(url, {
    headers: { "Accept-Version": GHOST_VERSION },
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error(`Ghost responded ${res.status}`);
  return res.json();
}

function staticSummaries(): BlogPostSummary[] {
  return staticPosts.map((p) => ({
    slug: p.slug,
    tag: p.tag,
    title: p.title,
    excerpt: p.excerpt,
    readTime: p.readTime,
    publishedAt: p.publishedAt,
    featureImage: null,
  }));
}

export async function getBlogPosts(): Promise<BlogPostSummary[]> {
  if (!ghostConfigured()) return staticSummaries();
  try {
    const data = await ghostFetch("/?include=tags&limit=all&order=published_at%20desc");
    const posts = (data as { posts?: GhostPost[] }).posts ?? [];
    if (posts.length === 0) return staticSummaries();
    return posts.map(toSummary);
  } catch (error) {
    console.error("[lib/ghost] getBlogPosts", error);
    return staticSummaries();
  }
}

export async function getBlogPost(slug: string): Promise<BlogPostFull | null> {
  if (!ghostConfigured()) {
    const post = staticPosts.find((p) => p.slug === slug);
    if (!post) return null;
    return {
      slug: post.slug,
      tag: post.tag,
      title: post.title,
      excerpt: post.excerpt,
      readTime: post.readTime,
      publishedAt: post.publishedAt,
      featureImage: null,
      html: null,
      sections: post.sections,
      faqs: post.faqs ?? null,
      keywords: post.keywords ?? null,
    };
  }
  try {
    const data = await ghostFetch(`/slug/${encodeURIComponent(slug)}/?include=tags`);
    const post = (data as { posts?: GhostPost[] }).posts?.[0];
    if (!post) return null;
    return {
      ...toSummary(post),
      html: post.html ?? null,
      sections: null,
      faqs: null,
      keywords: null,
    };
  } catch (error) {
    console.error("[lib/ghost] getBlogPost", error);
    return null;
  }
}

export async function getRelatedPosts(slug: string, count = 2): Promise<BlogPostSummary[]> {
  const all = await getBlogPosts();
  return all.filter((p) => p.slug !== slug).slice(0, count);
}

export function getBlogSlugs(): string[] {
  // Static slugs power generateStaticParams; Ghost posts render on demand.
  return staticPosts.map((p) => p.slug);
}
