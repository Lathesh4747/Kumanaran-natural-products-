"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/lib/locale-context";
import { navigationItems } from "@/lib/data/navigation";
import { siteConfig } from "@/lib/config";
import type { Locale } from "@/types/locale";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  si: "සිං",
  ta: "தமிழ்",
};

export function SiteHeader() {
  const { locale, setLocale, t } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-10 lg:px-16">
        {/* Logo */}
        <Link
          className="flex min-w-0 items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          href="/"
          onClick={() => setMobileOpen(false)}
        >
          <Image
            alt="Kumaran Natural Products logo"
            className="h-9 w-9 flex-shrink-0 sm:h-[52px] sm:w-[52px]"
            height={52}
            src="/Kumaran natural product logo.png"
            width={52}
          />
          <span
            className="line-clamp-2 text-[13px] font-bold leading-tight sm:text-[19px] sm:leading-7"
            style={{ color: "var(--color-text-darkest)" }}
          >
            {siteConfig.name}
          </span>
        </Link>

        {/* Nav links — hidden on small screens */}
        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {navigationItems.map((item) => (
            <Link
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-accent"
              href={item.href}
              key={item.href}
              style={{ color: "var(--color-text-dark)" }}
            >
              {item.label[locale]}
            </Link>
          ))}
        </nav>

        {/* Right side: language switcher + Login */}
        <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
          {/* Language switcher */}
          <div
            aria-label="Language switcher"
            className="hidden items-center rounded-full border px-1 text-xs font-medium sm:flex"
            role="group"
            style={{
              borderColor: "var(--color-border)",
              background: "var(--color-surface)",
            }}
          >
            {(["en", "si", "ta"] as const).map((code) => (
              <button
                aria-pressed={locale === code}
                key={code}
                onClick={() => setLocale(code)}
                className="cursor-pointer rounded-full px-2 py-1 transition-colors"
                style={
                  locale === code
                    ? {
                        background: "var(--color-accent)",
                        color: "var(--color-accent-foreground)",
                      }
                    : { color: "var(--color-text-dark)" }
                }
                type="button"
              >
                {LOCALE_LABELS[code]}
              </button>
            ))}
          </div>

          {/* Login — hidden on the smallest screens, lives in the drawer there */}
          <Link
            className="hidden rounded-md px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 active:opacity-80 sm:inline-flex"
            href="/sign-in"
            style={{
              background: "var(--color-accent)",
              color: "var(--color-accent-foreground)",
            }}
          >
            {t.nav.login}
          </Link>

          {/* Mobile menu button */}
          <button
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            style={{ color: "var(--color-text-dark)" }}
            type="button"
          >
            {mobileOpen ? (
              <svg fill="none" height="20" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" width="20">
                <line x1="6" x2="18" y1="6" y2="18" />
                <line x1="6" x2="18" y1="18" y2="6" />
              </svg>
            ) : (
              <svg fill="none" height="20" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" width="20">
                <line x1="3" x2="21" y1="6" y2="6" />
                <line x1="3" x2="21" y1="12" y2="12" />
                <line x1="3" x2="21" y1="18" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-border md:hidden" id="mobile-menu">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-1 px-4 py-3">
            {navigationItems.map((item) => (
              <Link
                className="rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent-muted hover:text-accent"
                href={item.href}
                key={item.href}
                onClick={() => setMobileOpen(false)}
                style={{ color: "var(--color-text-dark)" }}
              >
                {item.label[locale]}
              </Link>
            ))}

            {/* Language switcher */}
            <div
              aria-label="Language switcher"
              className="mt-2 flex items-center gap-1 self-start rounded-full border px-1 text-xs font-medium"
              role="group"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-surface)",
              }}
            >
              {(["en", "si", "ta"] as const).map((code) => (
                <button
                  aria-pressed={locale === code}
                  key={code}
                  onClick={() => setLocale(code)}
                  className="cursor-pointer rounded-full px-3 py-1.5 transition-colors"
                  style={
                    locale === code
                      ? {
                          background: "var(--color-accent)",
                          color: "var(--color-accent-foreground)",
                        }
                      : { color: "var(--color-text-dark)" }
                  }
                  type="button"
                >
                  {LOCALE_LABELS[code]}
                </button>
              ))}
            </div>

            {/* Login */}
            <Link
              className="mt-2 rounded-md px-4 py-2.5 text-center text-sm font-medium transition-opacity hover:opacity-90 active:opacity-80"
              href="/sign-in"
              onClick={() => setMobileOpen(false)}
              style={{
                background: "var(--color-accent)",
                color: "var(--color-accent-foreground)",
              }}
            >
              {t.nav.login}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
