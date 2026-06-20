import Link from "next/link";

export function BlogFooter() {
  return (
    <footer
      className="mt-auto border-t"
      style={{
        background: "rgba(255, 255, 255, 0.65)",
        backdropFilter: "blur(20px) saturate(120%)",
        WebkitBackdropFilter: "blur(20px) saturate(120%)",
        borderColor: "var(--color-glass-border)",
      }}
    >
      <div className="mx-auto max-w-[1440px] px-6 py-10 sm:px-10 lg:px-16">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            &copy; {new Date().getFullYear()} Kumaran Natural Products. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              className="text-xs transition-colors hover:text-accent"
              href="/"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Home
            </Link>
            <Link
              className="text-xs transition-colors hover:text-accent"
              href="/products"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Products
            </Link>
            <Link
              className="text-xs transition-colors hover:text-accent"
              href="/about"
              style={{ color: "var(--color-text-secondary)" }}
            >
              About
            </Link>
            <Link
              className="text-xs transition-colors hover:text-accent"
              href="/blog"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Blog
            </Link>
            <Link
              className="text-xs transition-colors hover:text-accent"
              href="/contact"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Contact
            </Link>
          </div>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Kalmunai, Eastern Province, Sri Lanka
          </p>
        </div>
      </div>
    </footer>
  );
}
