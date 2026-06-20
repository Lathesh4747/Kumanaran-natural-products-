"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale-context";

function EggIcon() {
  return (
    <svg fill="none" height="32" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="32">
      <path d="M12 22c5.523 0 8-3.86 8-8.5C20 8.358 16.418 2 12 2S4 8.358 4 13.5C4 18.14 6.477 22 12 22z" />
    </svg>
  );
}

function MeatIcon() {
  return (
    <svg fill="none" height="32" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="32">
      <path d="M19 3H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
      <path d="M3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9" />
      <line x1="12" x2="12" y1="13" y2="19" />
    </svg>
  );
}

const productIcons = [EggIcon, MeatIcon];

const productIconColors = [
  "var(--color-harvest)",
  "var(--color-earth)",
];

const badgeStyles = [
  { bg: "var(--color-harvest-light)", color: "var(--color-harvest-foreground)" },
  { bg: "var(--color-earth-light)", color: "var(--color-earth)" },
];

export function ProductsSection() {
  const { t } = useLocale();

  const badgeLabels = [t.products.badges.egg, t.products.badges.meat];

  return (
    <section className="mx-auto w-full max-w-[1440px] px-6 py-20 sm:px-10 lg:px-16">
      {/* Section header */}
      <div className="mx-auto max-w-2xl text-center">
        <p
          className="text-xs font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--color-accent)" }}
        >
          {t.products.eyebrow}
        </p>
        <h2
          className="mt-3 text-3xl font-bold leading-tight sm:text-4xl"
          style={{ color: "var(--color-text-primary)" }}
        >
          {t.products.heading}
        </h2>
        <p
          className="mt-4 text-sm leading-7"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {t.products.subtext}
        </p>
      </div>

      {/* Product cards */}
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {t.products.items.map((product, i) => {
          const Icon = productIcons[i];
          const badge = badgeStyles[i];
          return (
            <div
              className="glass-card flex flex-col gap-5 p-6"
              key={product.name}
            >
              {/* Icon + badge row */}
              <div className="flex items-start justify-between">
                <span style={{ color: productIconColors[i] }}>
                  <Icon />
                </span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ background: badge.bg, color: badge.color }}
                >
                  {badgeLabels[i]}
                </span>
              </div>

              {/* Name */}
              <h3
                className="text-base font-semibold leading-6"
                style={{ color: "var(--color-text-primary)" }}
              >
                {product.name}
              </h3>

              {/* Description */}
              <p
                className="text-sm leading-6"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {product.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-10 text-center">
        <Link
          className="inline-block rounded-md px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
          href="/products"
          style={{
            background: "var(--color-accent)",
            color: "var(--color-accent-foreground)",
          }}
        >
          {t.products.cta}
        </Link>
      </div>
    </section>
  );
}
