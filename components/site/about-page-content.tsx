"use client";

import Link from "next/link";
import { Egg, Beef, MapPin, Package, ShoppingBag, Leaf, Sparkles, Globe, Store } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { WHATSAPP_NUMBER } from "@/lib/utils";

function WhatsAppIcon() {
  return (
    <svg fill="currentColor" height="18" viewBox="0 0 24 24" width="18">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

const PRODUCT_ICONS = [Egg, Beef] as const;
const PRODUCT_ICON_COLORS = [
  "var(--color-harvest)",
  "var(--color-earth)",
] as const;
const PRODUCT_ICON_BG = [
  "var(--color-harvest-light)",
  "var(--color-earth-light)",
] as const;
const PRODUCT_BADGE_STYLE = [
  { bg: "var(--color-harvest-light)", color: "var(--color-harvest-foreground)" },
  { bg: "var(--color-earth-light)", color: "var(--color-earth)" },
] as const;

const STAT_ICONS = [MapPin, Package, Egg, ShoppingBag] as const;

const VALUE_ICONS = [Leaf, Sparkles, Globe] as const;
const VALUE_ICON_BG = [
  "var(--color-accent-muted)",
  "var(--color-harvest-light)",
  "var(--color-info-lightest)",
] as const;
const VALUE_ICON_COLORS = [
  "var(--color-accent)",
  "var(--color-harvest)",
  "var(--color-info)",
] as const;

export function AboutPageContent() {
  const { t } = useLocale();
  const ap = t.aboutPage;

  const stats = [
    { value: ap.stat1Value, label: ap.stat1Label, Icon: STAT_ICONS[0] },
    { value: ap.stat2Value, label: ap.stat2Label, Icon: STAT_ICONS[1] },
    { value: ap.stat3Value, label: ap.stat3Label, Icon: STAT_ICONS[2] },
    { value: ap.stat4Value, label: ap.stat4Label, Icon: STAT_ICONS[3] },
  ];

  return (
    <main className="min-h-[calc(100vh-68px)]">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="pb-10 pt-16 sm:pb-12 sm:pt-20">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
          <p
            className="text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--color-accent)" }}
          >
            {ap.eyebrow}
          </p>
          <h1
            className="mt-3 max-w-3xl font-bold leading-tight"
            style={{
              color: "var(--color-text-primary)",
              fontSize: "clamp(32px, 5vw, 56px)",
            }}
          >
            {ap.heading}
          </h1>
          <p
            className="mt-4 max-w-2xl text-base leading-7"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {ap.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium transition-opacity hover:opacity-90"
              href="/products"
              style={{ background: "var(--color-accent)", color: "var(--color-accent-foreground)" }}
            >
              {ap.ctaPrimary}
            </Link>
            <a
              className="inline-flex items-center gap-2.5 rounded-md px-5 py-3 text-sm font-medium transition-opacity hover:opacity-90"
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              rel="noopener noreferrer"
              style={{ background: "var(--color-success)", color: "#ffffff" }}
              suppressHydrationWarning
              target="_blank"
            >
              <WhatsAppIcon />
              {ap.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      {/* ── Story + Stats ────────────────────────────────── */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left — narrative */}
            <div className="flex flex-col justify-center">
              <h2
                className="text-xl font-semibold leading-8 sm:text-2xl"
                style={{ color: "var(--color-text-primary)" }}
              >
                {ap.storyHeading}
              </h2>
              <p
                className="mt-5 text-sm leading-7 sm:text-base"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {ap.storyP1}
              </p>
              <p
                className="mt-4 text-sm leading-7 sm:text-base"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {ap.storyP2}
              </p>
            </div>

            {/* Right — 2×2 stat cards */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map(({ value, label, Icon }) => (
                <div
                  className="glass-card flex flex-col gap-3 p-5"
                  key={label}
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{ background: "var(--color-accent-muted)" }}
                  >
                    <Icon size={18} style={{ color: "var(--color-accent)" }} />
                  </div>
                  <div>
                    <p
                      className="text-base font-semibold leading-6"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {value}
                    </p>
                    <p
                      className="mt-0.5 text-xs"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What we make ─────────────────────────────────── */}
      <section
        className="py-14 sm:py-16"
        style={{ background: "var(--color-surface-muted)" }}
      >
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
          <div className="mb-10">
            <h2
              className="text-xl font-semibold leading-8 sm:text-2xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              {ap.makeHeading}
            </h2>
            <p
              className="mt-2 max-w-xl text-sm leading-6"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {ap.makeSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {ap.products.map((product, i) => {
              const Icon = PRODUCT_ICONS[i];
              return (
                <div
                  className="glass-card flex flex-col gap-5 p-6"
                  key={product.name}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{ background: PRODUCT_ICON_BG[i] }}
                    >
                      <Icon size={22} style={{ color: PRODUCT_ICON_COLORS[i] }} />
                    </div>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        background: PRODUCT_BADGE_STYLE[i].bg,
                        color: PRODUCT_BADGE_STYLE[i].color,
                      }}
                    >
                      {product.badge}
                    </span>
                  </div>
                  <div>
                    <p
                      className="text-base font-semibold leading-6"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {product.name}
                    </p>
                    <p
                      className="mt-2 text-sm leading-6"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {product.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Where to find us ─────────────────────────────── */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
          <div className="mb-10">
            <h2
              className="text-xl font-semibold leading-8 sm:text-2xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              {ap.whereHeading}
            </h2>
            <p
              className="mt-2 max-w-xl text-sm leading-6"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {ap.whereSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {ap.chains.map((chain, i) => (
              <div
                className={`flex items-start gap-4 p-5 ${i === 0 ? "glass-card-tint" : "glass-card"}`}
                key={chain.name}
              >
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ background: "var(--color-accent-light)" }}
                >
                  <Store size={20} style={{ color: "var(--color-accent)" }} />
                </div>
                <div>
                  <p
                    className="text-sm font-semibold leading-6"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {chain.name}
                  </p>
                  <p
                    className="mt-0.5 text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {chain.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our promise ──────────────────────────────────── */}
      <section
        className="py-14 sm:py-16"
        style={{ background: "var(--color-surface-muted)" }}
      >
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
          <h2
            className="mb-8 text-xl font-semibold leading-8 sm:text-2xl"
            style={{ color: "var(--color-text-primary)" }}
          >
            {ap.valuesHeading}
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {ap.values.map((val, i) => {
              const Icon = VALUE_ICONS[i];
              return (
                <div className="glass-card p-6" key={val.title}>
                  <div
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: VALUE_ICON_BG[i] }}
                  >
                    <Icon size={20} style={{ color: VALUE_ICON_COLORS[i] }} />
                  </div>
                  <p
                    className="text-base font-semibold leading-6"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {val.title}
                  </p>
                  <p
                    className="mt-2 text-sm leading-6"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {val.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA strip ────────────────────────────────────── */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
          <div className="glass-card-tint rounded-3xl px-8 py-12 text-center sm:px-12">
            <h2
              className="text-xl font-semibold leading-8 sm:text-2xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              {ap.ctaHeading}
            </h2>
            <p
              className="mx-auto mt-3 max-w-xl text-sm leading-6"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {ap.ctaBody}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
                href="/products"
                style={{ background: "var(--color-accent)", color: "var(--color-accent-foreground)" }}
              >
                {ap.viewProducts}
              </Link>
              <a
                className="inline-flex items-center gap-2.5 rounded-md border px-6 py-3 text-sm font-medium transition-colors hover:text-accent"
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                rel="noopener noreferrer"
                style={{
                  borderColor: "var(--color-border)",
                  background: "var(--color-surface)",
                  color: "var(--color-text-primary)",
                }}
                suppressHydrationWarning
                target="_blank"
              >
                <WhatsAppIcon />
                {ap.contactUs}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
