"use client";

import { MessageCircle, MapPin, Clock, Phone } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { ContactForm } from "@/components/site/contact-form";
import { WHATSAPP_NUMBER } from "@/lib/utils";

function WhatsAppIcon() {
  return (
    <svg fill="currentColor" height="18" viewBox="0 0 24 24" width="18">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export function ContactPageContent() {
  const { t } = useLocale();
  const cp = t.contactPage;

  const infoCards = [
    {
      icon: MessageCircle,
      iconBg: "var(--color-success-lightest)",
      iconColor: "var(--color-success)",
      label: cp.whatsappLabel,
      primary: `+${WHATSAPP_NUMBER}`,
      primaryHref: `https://wa.me/${WHATSAPP_NUMBER}`,
      secondary: cp.whatsappHelper,
    },
    {
      icon: MapPin,
      iconBg: "var(--color-accent-muted)",
      iconColor: "var(--color-accent)",
      label: cp.locationLabel,
      primary: cp.locationCity,
      primaryHref: null as string | null,
      secondary: cp.locationFull,
    },
    {
      icon: Clock,
      iconBg: "var(--color-harvest-light)",
      iconColor: "var(--color-harvest)",
      label: cp.hoursLabel,
      primary: cp.hoursMon,
      primaryHref: null as string | null,
      secondary: cp.hoursSun,
    },
    {
      icon: Phone,
      iconBg: "var(--color-info-lightest)",
      iconColor: "var(--color-info)",
      label: cp.phoneLabel,
      primary: `+${WHATSAPP_NUMBER}`,
      primaryHref: `tel:+${WHATSAPP_NUMBER}`,
      secondary: cp.phoneHelper,
    },
  ];

  return (
    <main className="min-h-[calc(100vh-68px)]">
      {/* ── Page hero ─────────────────────────────────────── */}
      <section className="pb-10 pt-16 sm:pb-12 sm:pt-20">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
          <p
            className="text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--color-accent)" }}
          >
            {cp.eyebrow}
          </p>
          <h1
            className="mt-3 max-w-3xl font-bold leading-tight"
            style={{
              color: "var(--color-text-primary)",
              fontSize: "clamp(32px, 5vw, 56px)",
            }}
          >
            {cp.heading}
          </h1>
          <p
            className="mt-4 max-w-2xl text-base leading-7"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {cp.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              className="inline-flex items-center gap-2.5 rounded-md px-5 py-3 text-sm font-medium transition-opacity hover:opacity-90"
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              rel="noopener noreferrer"
              style={{ background: "var(--color-success)", color: "#ffffff" }}
              suppressHydrationWarning
              target="_blank"
            >
              <WhatsAppIcon />
              {cp.whatsappCta}
            </a>
            <a
              className="inline-flex items-center gap-2 rounded-md border px-5 py-3 text-sm font-medium transition-colors hover:text-accent"
              href="#contact-form"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-surface)",
                color: "var(--color-text-primary)",
              }}
            >
              {cp.sendMessage}
            </a>
          </div>
        </div>
      </section>

      {/* ── Contact info cards ─────────────────────────────── */}
      <section>
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {infoCards.map((card) => {
              const Icon = card.icon;
              return (
                <div className="glass-card flex items-start gap-4 p-5" key={card.label}>
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{ background: card.iconBg }}
                  >
                    <Icon size={20} style={{ color: card.iconColor }} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {card.label}
                    </p>
                    {card.primaryHref ? (
                      <a
                        className="mt-1 block truncate text-sm font-medium transition-colors hover:text-accent"
                        href={card.primaryHref}
                        rel="noopener noreferrer"
                        style={{ color: "var(--color-text-primary)" }}
                        target={card.primaryHref.startsWith("http") ? "_blank" : undefined}
                      >
                        {card.primary}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                        {card.primary}
                      </p>
                    )}
                    <p className="mt-0.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {card.secondary}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Form + Map ─────────────────────────────────────── */}
      <section className="py-16 sm:py-20" id="contact-form">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Contact form card */}
            <div className="glass-card p-6 sm:p-8">
              <h2
                className="text-lg font-semibold leading-7"
                style={{ color: "var(--color-text-primary)" }}
              >
                {cp.formHeading}
              </h2>
              <p
                className="mt-1 text-sm leading-6"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {cp.formSubtitle}
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>

            {/* Right column: map + quick-contact */}
            <div className="flex flex-col gap-6">
              {/* Google Maps embed */}
              <div className="glass-card overflow-hidden p-0">
                <iframe
                  className="h-[300px] w-full lg:h-[380px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://maps.google.com/maps?q=Kalmunai,Sri+Lanka&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  style={{ border: 0 }}
                  title="Kumaran Natural Products — Kalmunai, Sri Lanka"
                />
              </div>

              {/* WhatsApp CTA + call */}
              <div className="glass-card p-6">
                <p
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {cp.instantHeading}
                </p>
                <p
                  className="mt-2 text-sm leading-6"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {cp.instantText}
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                  <a
                    className="flex flex-1 items-center justify-center gap-2.5 rounded-md px-4 py-3 text-sm font-medium transition-opacity hover:opacity-90"
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    rel="noopener noreferrer"
                    style={{ background: "var(--color-success)", color: "#ffffff" }}
                    suppressHydrationWarning
                    target="_blank"
                  >
                    <WhatsAppIcon />
                    {cp.whatsappCta}
                  </a>
                  <a
                    className="flex flex-1 items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-medium transition-colors hover:text-accent"
                    href={`tel:+${WHATSAPP_NUMBER}`}
                    style={{
                      borderColor: "var(--color-border)",
                      background: "var(--color-surface)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    <Phone size={16} />
                    {cp.callUs}
                  </a>
                </div>
              </div>

              {/* Address detail card */}
              <div className="glass-card-tint flex items-start gap-4 p-5">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ background: "var(--color-accent-light)" }}
                >
                  <MapPin size={20} style={{ color: "var(--color-accent)" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    {cp.addressTitle}
                  </p>
                  <p className="mt-1 text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>
                    {cp.addressLine1}
                    <br />
                    {cp.addressLine2}
                  </p>
                  <a
                    className="mt-2 inline-block text-xs font-medium transition-colors hover:text-accent"
                    href="https://maps.google.com/?q=Kalmunai,Sri+Lanka"
                    rel="noopener noreferrer"
                    style={{ color: "var(--color-accent)" }}
                    suppressHydrationWarning
                    target="_blank"
                  >
                    {cp.openMaps}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ strip ──────────────────────────────────────── */}
      <section
        className="py-14 sm:py-16"
        style={{ background: "var(--color-surface-muted)" }}
      >
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
          <h2
            className="text-base font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {cp.faqTitle}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cp.faq.map((item) => (
              <div className="glass-card p-5" key={item.q}>
                <p className="text-sm font-semibold leading-6" style={{ color: "var(--color-text-primary)" }}>
                  {item.q}
                </p>
                <p className="mt-2 text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
