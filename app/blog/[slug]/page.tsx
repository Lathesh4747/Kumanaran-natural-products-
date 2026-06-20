import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BlogHeader } from "@/components/blog-header";
import { BlogFooter } from "@/components/blog-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { getBlogPost, getBlogSlugs, getRelatedPosts } from "@/lib/ghost";
import { siteConfig } from "@/lib/config";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 600;

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${siteConfig.url}/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      images: post.featureImage ? [post.featureImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(slug);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    image: post.featureImage ?? undefined,
    articleSection: post.tag,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${post.slug}`,
    },
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <BlogHeader />
      <main className="min-h-[calc(100vh-68px)]">
        {/* Article hero */}
        <section
          className="py-14"
          style={{ background: "var(--color-surface-muted)" }}
        >
          <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16">
            <Link
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-accent"
              href="/blog"
              style={{ color: "var(--color-text-secondary)" }}
            >
              ← All articles
            </Link>

            <div className="mt-5 flex flex-wrap items-center gap-3">
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
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                · {post.readTime}
              </span>
            </div>

            <h1
              className="mt-5 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              {post.title}
            </h1>

            <p
              className="mt-4 max-w-2xl text-base leading-7"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {post.excerpt}
            </p>
          </div>
        </section>

        {/* Article body */}
        <section className="mx-auto w-full max-w-[1440px] px-6 py-14 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
            {/* Content */}
            <article className="glass-card p-8 sm:p-10">
              {post.html != null ? (
                <div
                  className="ghost-content max-w-prose"
                  dangerouslySetInnerHTML={{ __html: post.html }}
                />
              ) : (
                <div className="flex max-w-prose flex-col gap-8">
                  {(post.sections ?? []).map((section, i) => (
                    <div className="flex flex-col gap-3" key={i}>
                      {section.heading && (
                        <h2
                          className="text-lg font-semibold leading-7"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {section.heading}
                        </h2>
                      )}
                      {section.paragraphs.map((para, j) => (
                        <p
                          className="text-sm leading-7"
                          key={j}
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {para}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="flex flex-col gap-6">
              {/* About */}
              <div className="glass-card p-6">
                <h3
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Kumaran Natural Products
                </h3>
                <p
                  className="mt-2 text-xs leading-5"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Farm-fresh quail eggs and meat from Kalmunai, Eastern
                  Province — available at Cargills Food City, Keells, and
                  private supermarkets across Sri Lanka.
                </p>
                <a
                  className="mt-4 flex items-center justify-center gap-2 rounded-md px-4 py-2 text-xs font-medium transition-opacity hover:opacity-90"
                  href="https://wa.me/94705920748"
                  rel="noopener noreferrer"
                  style={{
                    background: "var(--color-success)",
                    color: "#ffffff",
                  }}
                  suppressHydrationWarning
                  target="_blank"
                >
                  Buy via WhatsApp
                </a>
              </div>

              {/* Related posts */}
              {related.length > 0 && (
                <div className="glass-card p-6">
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    More articles
                  </h3>
                  <div className="mt-4 flex flex-col gap-5">
                    {related.map((rel) => (
                      <Link
                        className="group flex flex-col gap-1.5"
                        href={`/blog/${rel.slug}`}
                        key={rel.slug}
                      >
                        <span
                          className="self-start rounded-full px-2 py-0.5 text-[10px] font-medium"
                          style={{
                            background: "var(--color-accent-light)",
                            color: "var(--color-accent-dark)",
                          }}
                        >
                          {rel.tag}
                        </span>
                        <span
                          className="text-xs font-medium leading-5 transition-colors group-hover:text-accent"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {rel.title}
                        </span>
                        <span
                          className="text-[10px]"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {rel.readTime}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Back link */}
              <Link
                className="rounded-md border px-4 py-2 text-center text-xs font-medium transition-colors hover:border-accent hover:text-accent"
                href="/blog"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-secondary)",
                }}
              >
                ← Back to all articles
              </Link>
            </aside>
          </div>
        </section>
      </main>
      <BlogFooter />
    </>
  );
}
