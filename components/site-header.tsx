"use client";

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

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-6 sm:px-10 lg:px-16">
        {/* Logo */}
        <Link
          className="flex items-center gap-2.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          href="/"
        >
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
        <div className="flex items-center gap-3">
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

          {/* Login */}
          <Link
            className="rounded-md px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 active:opacity-80"
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
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-md md:hidden"
            style={{ color: "var(--color-text-dark)" }}
            type="button"
          >
            <svg fill="none" height="20" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" width="20">
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
