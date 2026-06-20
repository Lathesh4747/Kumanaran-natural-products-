"use client";

import { useLocale } from "@/lib/locale-context";
import { homeLocation } from "@/lib/data/home";

function PinIcon() {
  return (
    <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="20">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="20">
      <rect height="18" rx="2" width="16" x="4" y="4" />
      <path d="M9 9h1M14 9h1M9 14h1M14 14h1M9 19v3M15 19v3" />
    </svg>
  );
}

export function LocationSection() {
  const { t } = useLocale();

  return (
    <section className="mx-auto w-full max-w-[1440px] px-6 py-20 sm:px-10 lg:px-16">
      {/* Section header */}
      <div className="text-center">
        <p
          className="text-xs font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--color-accent)" }}
        >
          {t.location.eyebrow}
        </p>
        <h2
          className="mt-3 text-3xl font-bold leading-tight sm:text-4xl"
          style={{ color: "var(--color-text-primary)" }}
        >
          {t.location.heading}
        </h2>
        <p
          className="mx-auto mt-4 max-w-2xl text-sm leading-7"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {t.location.description}
        </p>
      </div>

      {/* Map + info grid */}
      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Map — 2/3 width on desktop */}
        <div className="glass-card overflow-hidden p-0 lg:col-span-2">
          <iframe
            allowFullScreen
            className="h-[380px] w-full lg:h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={homeLocation.mapSrc}
            title={homeLocation.mapTitle}
          />
        </div>

        {/* Info card — 1/3 width */}
        <div className="glass-card flex flex-col justify-between gap-8 p-6">
          <div>
            <h3
              className="text-base font-semibold leading-6"
              style={{ color: "var(--color-text-primary)" }}
            >
              Kumaran Natural Products
            </h3>
            <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
              {t.location.farmOffice}
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0" style={{ color: "var(--color-accent)" }}>
                  <PinIcon />
                </span>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                    {t.location.officeLabel}
                  </p>
                  <p className="mt-0.5 text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>
                    {t.location.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0" style={{ color: "var(--color-accent)" }}>
                  <BuildingIcon />
                </span>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                    {t.location.province}
                  </p>
                  <p className="mt-0.5 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    {t.location.country}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Supermarket supply note */}
          <div
            className="rounded-xl p-4"
            style={{
              background: "var(--color-accent-muted)",
              border: "1px solid var(--color-accent-light)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--color-accent)" }}
            >
              {t.location.availableHeading}
            </p>
            <p
              className="mt-1.5 text-sm leading-6"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {t.location.availableText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
