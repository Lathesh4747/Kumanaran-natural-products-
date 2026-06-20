"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { homeHero } from "@/lib/data/home";
import { useLocale } from "@/lib/locale-context";

const SLIDES = [
  {
    localeName: "தமிழ்",
    text: "குமரன் நேச்சுரல் புரொடக்ட்ஸ் வழங்கும் புதிய காடை முட்டைகள் மற்றும் காடை இறைச்சி.",
  },
  {
    localeName: "සිංහල",
    text: "කුමාරන් නැචුරල් ප්‍රොඩක්ට්ස් වෙතින් නැවුම් කුවේල් බිත්තර සහ කුවේල් මස්.",
  },
  {
    localeName: "English",
    text: "Farm-fresh quail eggs and quail meat prepared for families across Sri Lanka.",
  },
];

const SLIDE_DURATION = 3500;

export function HeroSection() {
  const { t } = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % SLIDES.length);
        setVisible(true);
      }, 400);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, []);

  const slide = SLIDES[activeIndex];

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* Video background */}
      <video
        aria-hidden="true"
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        src="/hero-video.mp4"
      />

      {/* Dark green gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(13,26,15,0.82) 0%, rgba(26,51,33,0.75) 30%, rgba(42,79,52,0.70) 55%, rgba(31,61,40,0.78) 80%, rgba(15,31,19,0.88) 100%)",
        }}
      />

      {/* Radial glow accents */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full opacity-20"
          style={{ background: "var(--color-accent)", filter: "blur(120px)" }}
        />
        <div
          className="absolute -right-20 top-1/3 h-[400px] w-[400px] rounded-full opacity-15"
          style={{ background: "var(--color-harvest)", filter: "blur(100px)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-[300px] w-[500px] rounded-full opacity-10"
          style={{ background: "var(--color-success)", filter: "blur(80px)" }}
        />
      </div>

      {/* Dot-grid texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 py-28 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl text-center">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <Image
              alt="Kumaran Natural Products"
              height={160}
              src="/Kumaran natural product logo.png"
              style={{
                width: 160,
                height: 160,
                filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.4))",
              }}
              width={160}
            />
          </div>

          {/* Eyebrow */}
          <span
            className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]"
            style={{
              background: "rgba(224, 165, 38, 0.18)",
              color: "var(--color-harvest)",
              border: "1px solid rgba(224, 165, 38, 0.3)",
            }}
          >
            {t.hero.eyebrow}
          </span>

          {/* Headline — brand name stays fixed */}
          <h1
            className="mt-6 font-bold leading-tight tracking-tight text-white"
            style={{ fontSize: "clamp(36px, 5vw, 72px)", lineHeight: "1.1" }}
          >
            {homeHero.title}
          </h1>

          {/* Language slideshow */}
          <div className="mt-10 flex justify-center sm:mx-auto sm:max-w-2xl">
            <div
              className="w-full rounded-xl px-4 py-4"
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.10)",
                minHeight: "80px",
              }}
            >
              <div
                style={{
                  transition: "opacity 0.4s ease, transform 0.4s ease",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(6px)",
                }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                    style={{
                      background: "rgba(46, 125, 70, 0.35)",
                      color: "rgba(180, 230, 195, 0.9)",
                      border: "1px solid rgba(46, 125, 70, 0.4)",
                    }}
                  >
                    {slide.localeName}
                  </span>
                  <div className="ml-auto flex gap-1.5">
                    {SLIDES.map((s, i) => (
                      <button
                        aria-label={`Show ${s.localeName}`}
                        key={i}
                        onClick={() => {
                          setVisible(false);
                          setTimeout(() => {
                            setActiveIndex(i);
                            setVisible(true);
                          }, 400);
                        }}
                        style={{
                          width: i === activeIndex ? "20px" : "6px",
                          height: "6px",
                          borderRadius: "9999px",
                          background:
                            i === activeIndex
                              ? "var(--color-harvest)"
                              : "rgba(255,255,255,0.3)",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                          transition: "width 0.3s ease, background 0.3s ease",
                        }}
                        type="button"
                      />
                    ))}
                  </div>
                </div>
                <p
                  className="text-left text-sm leading-6"
                  style={{ color: "rgba(255, 255, 255, 0.82)" }}
                >
                  {slide.text}
                </p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              className="rounded-md px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90 active:opacity-80"
              href="/products"
              style={{
                background: "var(--color-accent)",
                color: "var(--color-accent-foreground)",
              }}
            >
              {t.hero.ctaPrimary}
            </Link>
            <Link
              className="rounded-md px-6 py-3 text-sm font-medium transition-colors"
              href="/about"
              style={{
                background: "rgba(255, 255, 255, 0.10)",
                color: "rgba(255, 255, 255, 0.90)",
                border: "1px solid rgba(255, 255, 255, 0.20)",
              }}
            >
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        <span className="text-[11px] uppercase tracking-[0.15em]">{t.hero.scroll}</span>
        <svg fill="none" height="16" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 16 16" width="16">
          <path d="M8 3v10M4 9l4 4 4-4" />
        </svg>
      </div>
    </section>
  );
}
