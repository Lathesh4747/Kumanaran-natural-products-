import type { Metadata } from "next";
import Link from "next/link";
import { BlogHeader } from "@/components/blog-header";
import { BlogFooter } from "@/components/blog-footer";
import { getBlogPosts } from "@/lib/ghost";
import { JsonLd } from "@/components/seo/json-ld";
import { graph, breadcrumbNode, pageMeta, absolute } from "@/lib/seo";
import { siteConfig } from "@/lib/config";

const DESCRIPTION =
  "Nutrition guides, farm stories, and business articles from Kumaran Natural Products — a quail farm in Kalmunai, Sri Lanka. Learn about quail egg nutrition, storage, and cooking.";

export const metadata: Metadata = pageMeta({
  title: "Blog — Quail Nutrition, Farm Stories & Guides",
  description: DESCRIPTION,
  path: "/blog",
  keywords: [
    "quail egg nutrition",
    "quail egg benefits",
    "how to cook quail meat",
    "quail farming Sri Lanka blog",
  ],
});

export const revalidate = 600;

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  const blogGraph = graph([
    {
      "@type": "Blog",
      "@id": `${siteConfig.url}/blog#blog`,
      url: absolute("/blog"),
      name: `Blog | ${siteConfig.name}`,
      description: DESCRIPTION,
      inLanguage: "en-LK",
      isPartOf: { "@id": `${siteConfig.url}/#website` },
      publisher: { "@id": `${siteConfig.url}/#organization` },
      blogPost: blogPosts.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        url: absolute(`/blog/${post.slug}`),
        datePublished: post.publishedAt,
        articleSection: post.tag,
        image: post.featureImage ?? undefined,
        author: { "@id": `${siteConfig.url}/#organization` },
      })),
    },
    breadcrumbNode([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ]),
  ]);

  return (
    <>
      <JsonLd data={blogGraph} />
      <BlogHeader />
      <main className="min-h-[calc(100vh-68px)]">
        {/* Hero */}
        <section
          className="py-16"
          style={{ background: "var(--color-surface-muted)" }}
        >
          <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16">
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--color-accent)" }}
            >
              From Our Farm
            </p>
            <h1
              className="mt-3 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              Stories &amp; updates
            </h1>
            <p
              className="mt-4 max-w-xl text-base leading-7"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Nutrition guides, farm life, and behind-the-scenes articles from
              Kumaran Natural Products in Kalmunai, Eastern Province.
            </p>
          </div>
        </section>

        {/* Posts grid */}
        <section className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                className="glass-card flex flex-col gap-4 p-6"
                key={post.slug}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{
                      background: "var(--color-accent-light)",
                      color: "var(--color-accent-dark)",
                    }}
                  >
                    {post.tag}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {new Date(post.publishedAt).toLocaleDateString("en-LK", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h2
                  className="text-base font-semibold leading-6"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {post.title}
                </h2>

                <p
                  className="flex-1 text-sm leading-6"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between border-t pt-4"
                  style={{ borderColor: "var(--color-border-light)" }}
                >
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {post.readTime}
                  </span>
                  <Link
                    className="text-xs font-medium transition-colors hover:text-accent"
                    href={`/blog/${post.slug}`}
                    style={{ color: "var(--color-accent)" }}
                  >
                    Read article →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <BlogFooter />
    </>
  );
}
