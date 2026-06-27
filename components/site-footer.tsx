"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/lib/locale-context";
import { siteConfig } from "@/lib/config";
import { navigationItems } from "@/lib/data/navigation";

export function SiteFooter() {
  const { locale, t } = useLocale();

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
      <div className="mx-auto max-w-[1440px] px-6 py-12 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <Image
                alt="Kumaran Natural Products logo"
                height={52}
                src="/Kumaran natural product logo.png"
                style={{ width: 52, height: 52, flexShrink: 0 }}
                width={52}
              />
              <span
                className="text-[19px] font-bold leading-7"
                style={{ color: "var(--color-text-darkest)" }}
              >
                {siteConfig.name}
              </span>
            </div>
            <p
              className="mt-3 max-w-xs text-sm leading-6"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {t.footer.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-text-muted)" }}
            >
              {t.footer.company}
            </h3>
            <ul className="mt-4 space-y-3">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link
                    className="text-sm transition-colors hover:text-accent"
                    href={item.href}
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {item.label[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-text-muted)" }}
            >
              {t.footer.products}
            </h3>
            <ul className="mt-4 space-y-3">
              {t.products.items.map((p) => (
                <li key={p.name}>
                  <Link
                    className="text-sm transition-colors hover:text-accent"
                    href="/products"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-text-muted)" }}
            >
              {t.footer.getInTouch}
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  className="text-sm transition-colors hover:text-accent"
                  href="https://wa.me/94705920748"
                  rel="noopener noreferrer"
                  style={{ color: "var(--color-text-secondary)" }}
                  suppressHydrationWarning
                  target="_blank"
                >
                  {t.footer.whatsappUs}
                </a>
              </li>
              <li>
                <Link
                  className="text-sm transition-colors hover:text-accent"
                  href="/contact"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {t.footer.contactForm}
                </Link>
              </li>
              <li>
                <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  {t.footer.location}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            &copy; {new Date().getFullYear()} {siteConfig.legalName}. {t.footer.rights}
          </p>
          <div className="flex flex-col items-center gap-1 sm:items-end">
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Built by{" "}
              <a
                className="font-medium transition-colors hover:text-accent"
                href="https://www.alienx-engineering.com/"
                rel="noopener noreferrer"
                style={{ color: "var(--color-text-secondary)" }}
                target="_blank"
              >
                AlienX Engineering
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
