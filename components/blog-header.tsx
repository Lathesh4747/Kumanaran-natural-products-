import Image from "next/image";
import Link from "next/link";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function BlogHeader() {
  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-6 sm:px-10 lg:px-16">
        {/* Logo */}
        <Link
          className="flex items-center gap-2.5 rounded-md focus:outline-none focus-visible:ring-2"
          href="/"
          style={{ outline: "none" }}
        >
          <Image
            alt="Kumaran Natural Products"
            height={52}
            src="/Kumaran natural product logo.png"
            width={52}
            style={{ flexShrink: 0 }}
          />
          <span
            className="hidden text-[19px] font-bold leading-7 sm:block"
            style={{ color: "var(--color-text-darkest)" }}
          >
            Kumaran Natural Products
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-accent"
              href={item.href}
              key={item.href}
              style={{ color: "var(--color-text-dark)" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Login */}
        <Link
          className="rounded-md px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
          href="/sign-in"
          style={{
            background: "var(--color-accent)",
            color: "var(--color-accent-foreground)",
          }}
        >
          Login
        </Link>
      </div>
    </header>
  );
}
