"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale-context";

const placeholderPosts = [
  {
    slug: "raising-quail-in-sri-lanka",
    tag: "Farm Life",
    title: "Why we chose quail farming in Kalmunai",
    excerpt:
      "Quail are hardy, low-maintenance birds that thrive in the Eastern Province. Learn how Kumaran Natural Products started with a small flock and grew.",
    readTime: "4 min read",
  },
  {
    slug: "quail-eggs-nutrition",
    tag: "Nutrition",
    title: "5 reasons quail eggs are a superfood",
    excerpt:
      "Packed with protein, iron, and vitamins — quail eggs punch well above their weight. Here's what the science says and how to add them to your family meals.",
    readTime: "3 min read",
  },
  {
    slug: "supply-to-cargills",
    tag: "Business",
    title: "From our farm gate to Cargills Food City",
    excerpt:
      "We walk you through our daily supply run — quality checks, cold-chain handling, and the standards we hold ourselves to every single morning.",
    readTime: "5 min read",
  },
];

export function BlogPreviewSection() {
  const { t } = useLocale();

  return (
    <section
      className="py-20"
      style={{ background: "var(--color-surface-muted)" }}
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16">
        {/* Section header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--color-accent)" }}
            >
              {t.blog.eyebrow}
            </p>
            <h2
              className="mt-3 text-3xl font-bold leading-tight sm:text-4xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t.blog.heading}
            </h2>
          </div>
          <Link
            className="shrink-0 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
            href="/blog"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
          >
            {t.blog.viewAll}
          </Link>
        </div>

        {/* Blog cards — post titles/excerpts stay English (Ghost content) */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {placeholderPosts.map((post) => (
            <article className="glass-card flex flex-col gap-4 p-6" key={post.slug}>
              <span
                className="self-start rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{
                  background: "var(--color-accent-light)",
                  color: "var(--color-accent-dark)",
                }}
              >
                {post.tag}
              </span>
              <h3
                className="text-base font-semibold leading-6"
                style={{ color: "var(--color-text-primary)" }}
              >
                {post.title}
              </h3>
              <p
                className="flex-1 text-sm leading-6"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {post.readTime}
                </span>
                <Link
                  className="text-xs font-medium transition-colors hover:text-accent"
                  href={`/blog/${post.slug}`}
                  style={{ color: "var(--color-accent)" }}
                >
                  {t.blog.readMore}
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
          {t.blog.powered}
        </p>
      </div>
    </section>
  );
}
