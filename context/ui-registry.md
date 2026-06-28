# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

---

## Components

### Layout

#### SiteHeader
`components/site-header.tsx`
- Container: `glass-nav sticky top-0 z-50`
- Inner: `mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 sm:px-10 lg:px-16`
- Logo text: `text-[19px] font-bold leading-7` · color `--color-text-darkest`
- Logo icon: 52×52px `next/image` of `/Kumaran natural product logo.png` (company peacock logo). The same PNG is the brand mark everywhere — site header/footer, hero, blog header, app navbar (40px), sign-in/sign-up + pending-approval (56px) — and the app favicon via `app/icon.png` / `app/apple-icon.png` / `app/opengraph-image.png` (file-based metadata icons). The old green gradient + Leaf tile is retired.
- Nav links: `rounded-md px-3 py-2 text-sm font-medium` · color `--color-text-dark` → hover `--color-accent`
- Language switcher: pill, `rounded-full border`, active locale `bg-accent text-accent-foreground`, inactive `text-text-dark`
- Login button: `rounded-md px-4 py-2 text-sm font-medium` · `bg-accent text-accent-foreground`

#### SiteFooter
`components/site-footer.tsx`
- Wrapper: `rgba(255,255,255,0.65)` bg + `blur(20px) saturate(120%)` backdrop
- Inner: `mx-auto max-w-[1440px] px-6 py-12 sm:px-10 lg:px-16`
- Section heading: `text-xs font-semibold uppercase tracking-widest` · `text-text-muted`
- Links: `text-sm` · `text-text-secondary` → hover `text-accent`

---

### Site Sections (public website)

#### HeroSection
`components/site/hero-section.tsx`
- Background: `<video autoPlay muted loop playsInline src="/hero-video.mp4">` full-bleed behind overlay
- Overlay: dark green gradient `135deg, rgba(13,26,15,0.82) → rgba(42,79,52,0.70) → rgba(15,31,19,0.88)` for readability
- Radial glow accents: `--color-accent`, `--color-harvest`, `--color-success` at low opacity with heavy blur
- Dot-grid texture: white 1px dots on 28px grid, `opacity-[0.04]`
- Eyebrow badge: `rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]` · harvest amber bg + border
- Headline: `font-bold text-white` · `clamp(36px, 5vw, 72px)` font size
- Language slideshow: single `rounded-xl px-4 py-4` card · `rgba(255,255,255,0.06)` bg · fades between Tamil → Sinhala → English every 3.5 s · locale label in green glass pill + dot-nav indicators · `"use client"` component
- Primary CTA: `rounded-md px-6 py-3 text-sm font-medium` · `bg-accent text-accent-foreground`
- Secondary CTA: `rounded-md px-6 py-3 text-sm font-medium` · `rgba(255,255,255,0.10)` bg + white border

#### ProductsSection
`components/site/products-section.tsx`
- Layout: `mx-auto w-full max-w-[1440px] px-6 py-20 sm:px-10 lg:px-16`
- Cards: `glass-card flex flex-col gap-5 p-6` · 3-col grid
- Product icon: 32px SVG · color from `productIconColors` (harvest / earth / accent)
- Type badge: `rounded-full px-2.5 py-0.5 text-xs font-medium` · Egg = harvest-light/foreground, Meat = earth-light/earth
- Name: `text-base font-semibold leading-6` · `text-text-primary`
- Si/Ta sub-name: `text-xs leading-5` · `text-text-muted`
- Description: `text-sm leading-6` · `text-text-secondary`

#### BlogPreviewSection
`components/site/blog-preview-section.tsx`
- Section bg: `bg-surface-muted` (`--color-surface-muted`)
- Layout: `mx-auto w-full max-w-[1440px] px-6 py-20 sm:px-10 lg:px-16`
- Cards: `glass-card flex flex-col gap-4 p-6` · 3-col grid
- Tag badge: `rounded-full px-2.5 py-0.5 text-xs font-medium` · `bg-accent-light text-accent-dark`
- Title: `text-base font-semibold leading-6` · `text-text-primary`
- Excerpt: `text-sm leading-6 flex-1` · `text-text-secondary`
- Read link: `text-xs font-medium` · `text-accent` → hover `text-accent`

#### LocationSection
`components/site/location-section.tsx`
- Layout: `mx-auto w-full max-w-[1440px] px-6 py-20 sm:px-10 lg:px-16`
- Grid: 3-col, map takes `lg:col-span-2`, info card takes 1
- Map container: `glass-card overflow-hidden p-0` · iframe `h-[380px] w-full lg:h-[420px]`
- Info card: `glass-card flex flex-col justify-between gap-8 p-6`
- Icon color: `--color-accent`
- Availability callout: `rounded-xl p-4` · `bg-accent-muted border-accent-light`

#### ContactSection
`components/site/contact-section.tsx`
- Section bg: `bg-surface-muted`
- Layout: `mx-auto w-full max-w-[1440px] px-6 py-20 sm:px-10 lg:px-16` → inner `max-w-5xl grid lg:grid-cols-2`
- WhatsApp button: `rounded-md px-5 py-3 text-sm font-medium` · `bg-success text-white`
- Form card: `glass-card p-6 sm:p-8`
- Input: `rounded-md border px-3 py-2 text-sm outline-none` · `bg-surface border-border text-text-primary`
- Submit: `rounded-md px-5 py-2.5 text-sm font-medium` · `bg-accent text-accent-foreground`

#### ProductCard
`components/site/product-card.tsx`
- Wrapper: `glass-card flex flex-col gap-5 p-6`
- Icon row: `flex items-start justify-between`
- Weight badge: `rounded-full px-2.5 py-0.5 text-xs font-medium` · `bg-accent-light text-accent-dark`
- Type badge: `rounded-full px-2.5 py-0.5 text-xs font-medium` · Egg = harvest-light/foreground, Meat = earth-light/earth
- Product name: `text-base font-semibold leading-6` · `text-text-primary`
- Si/Ta sub-name: `text-xs leading-5` · `text-text-muted`
- MRP: `text-2xl font-semibold leading-8` · `text-text-primary`; "MRP" label `text-xs text-text-muted`
- Description: `flex-1 text-sm leading-6` · `text-text-secondary`
- WhatsApp button: `mt-auto flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium` · `bg-success color:#ffffff`

#### ProductsGrid
`components/site/products-grid.tsx` — `"use client"`
- Filter pill (active): `rounded-full px-4 py-1.5 text-sm font-medium` · `bg-accent text-accent-foreground` + shadow
- Filter pill (inactive): `rounded-full px-4 py-1.5 text-sm font-medium` · glass bg + `border-border text-text-dark`
- Count badge inside pill: active = `rgba(255,255,255,0.25)` bg; inactive = `bg-accent-light text-accent-dark`
- Grid: `mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`

#### AboutPageContent
`components/site/about-page-content.tsx` — `"use client"`
- Hero: eyebrow `text-xs font-semibold uppercase tracking-[0.18em]` · accent color; heading `clamp(32px, 5vw, 56px)` font-size; CTA row with primary `bg-accent` + WhatsApp `bg-success`
- Story section: `lg:grid-cols-2` — narrative left, 2×2 stat cards right; stat cards `glass-card flex flex-col gap-3 p-5` with icon, value `text-base font-semibold`, label `text-xs text-text-muted`
- What we make: `glass-card flex flex-col gap-5 p-6` 3-col grid; icon 44×44 in product-type background; badge pill; name + desc
  - Egg: harvest-light bg / harvest color; Meat: earth-light / earth
- Where to find us: 3 cards — first `glass-card-tint`, rest `glass-card`; `Store` icon in `accent-light` bg; name + muted sub
- Values: 3 `glass-card p-6` cards; icons `Leaf`/`Sparkles`/`Globe` in accent-muted/harvest-light/info-lightest bg
- CTA strip: `glass-card-tint rounded-3xl px-8 py-12 text-center` — heading, subtitle, primary + WhatsApp buttons
- Section backgrounds alternate: default → `surface-muted` → default → `surface-muted` → default

#### ContactForm
`components/site/contact-form.tsx` — `"use client"`
- Wrapper: `form` with `flex flex-col gap-5`
- Field label: `text-sm font-medium` · `text-text-primary`; required asterisk `text-error`
- Input / textarea: `rounded-md border px-3 py-2.5 text-sm outline-none transition-shadow focus:ring-1` · `bg-surface border-border text-text-primary`; ring color via `--tw-ring-color: var(--color-accent)`
- Name + phone in `grid grid-cols-1 sm:grid-cols-2 gap-5`
- Error banner: `rounded-md px-4 py-3 text-sm` · `bg-error-light text-error`; `role="alert"`
- Submit button: `flex w-full items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-medium` · `bg-accent text-accent-foreground`; pending shows spinner + "Sending…"
- Success state: centered card with `bg-success-lightest` circle icon + `text-text-primary` heading + `text-text-secondary` body
- Uses `useActionState` (React 19) + `useFormStatus` (react-dom)

---

### Operations App

#### SupplyClient (multi-line supply form)
`app/(app)/supply/client.tsx` — `"use client"`
- Header: `text-base font-semibold` title + muted count/total; "Record Supply" primary button `bg-accent text-accent-foreground` (disabled until master data exists)
- Modal: `fixed inset-0 z-50` overlay `bg-overlay/40 backdrop-blur-sm` + `glass-card p-6 max-w-2xl max-h-[92vh] overflow-y-auto` (matches project modal pattern)
- Header fields grid: `grid-cols-1 sm:grid-cols-2 gap-4` — branch / vehicle / date / status
- Line item: `glass-card-tint rounded-xl p-3`; inner `grid sm:grid-cols-12` (product 5 / batch 4 / qty 2 / delete 1); live per-line readout row — Sell / Cost / Profit-per-pkt (`text-success`/`text-error`) / Line total
- Missing-price warning: `text-xs text-error` linking to `/pricing`
- Total row: `border-t border-border pt-3` with `text-base font-semibold`
- Submit calls the `createSupply` server action directly via `useTransition` + `router.refresh()` (not `useActionState`, because line items are structured state, not FormData)
- Input/label classes shared with master-data forms: `inputCls` (`rounded-md border border-border bg-surface … focus:ring-1 focus:ring-accent`), `labelCls`

#### PeriodSelector
`components/dashboard/period-selector.tsx` — `"use client"`
- Pills: active `rounded-full px-4 py-1.5 text-sm font-medium bg-accent text-accent-foreground`; inactive same shape with `bg-surface border border-border text-text-dark hover:bg-surface-secondary`
- Writes `?period=&from=&to=` to the URL via `useRouter().push`; custom shows two date inputs + Apply
- Options: Week (last 7 days) / Month (current calendar month) / Year (current year) / Custom

#### DashboardPage (analytics)
`app/(app)/dashboard/page.tsx` — Server Component, reads `searchParams` (Promise)
- Stat cards: `glass-card p-5` with `w-10 h-10 rounded-xl` icon tile; stat number `text-[30px] font-semibold`; Net Profit stat tinted `text-success`/`text-error` by sign
- Net Profit Breakdown card: `glass-card p-6`; KV rows; total on `border-t`
- Net Profit by User table (admin only): standard glass table; net column `text-success`/`text-error`; "Unattributed" bucket for null-owner rows
- Analytics cards: Top Products by Sales (label + value + `Bar`), Top Products by Profit (ranked list), Sales by District (bars), Top Supermarkets (scrollable `max-h-[360px]`, rank + bar + value)
- `Bar` helper: `h-1.5 rounded-full bg-border-light` track + `bg-accent` fill (width % of max)
- Download PDF row: `<a target="_blank">` buttons (`border border-border bg-surface`) → `/api/reports/[type]?period=&from=&to=`

---

#### ReturnAnalytics (Feature 17)
`components/dashboard/return-analytics.tsx` — Server Component (presentational, takes `data: DashboardData["returnAnalytics"]` + `rateAlert: boolean`)
- 3-card grid `grid-cols-1 lg:grid-cols-3 gap-6`
- Summary card: `glass-card p-6`; return rate `text-2xl font-semibold` (turns `text-error` when `rateAlert`); packets returned + returns loss (`text-error`) KV rows; "By reason" breakdown using reason-tone pill badges (Expired/Damaged = `bg-error-light text-error`, Quality Issue/Near Expiry = `bg-warning-light text-warning`, Unsold = `bg-surface-secondary text-text-secondary`)
- Most-returned card: ranked product list with `Bar` (track `bg-border-light`, fill `bg-error`)
- Weight-split card: per-`weight_unit` rows with % of total + `Bar` (fill `bg-harvest` for 500g else `bg-accent`)
- Empty state per card: `text-text-muted` when `totalReturns === 0`

#### AlertsCard (Feature 17)
`components/dashboard/alerts-card.tsx` — Server Component (takes `alerts: Alert[]` from `getAlerts`)
- `glass-card p-0 overflow-hidden`; header with pulsing `bg-warning` dot + count pill when non-empty
- Each alert: `w-9 h-9 rounded-xl` tone icon tile + title/detail; tone map error/warning/info → `bg-*-light` + `text-*` (icons: AlertTriangle / PackageX / Clock / CalendarClock)
- Empty state: centered `CheckCircle2 text-success` + "All clear" message

#### UserManagement (admin)
`components/admin/user-management.tsx` — Server Component (Clerk `getUserList`); used on `/admin/users` and embedded below the dashboard (admin-only)
- Header row: `Users` icon + title + pending-count pill (`bg-warning-light text-warning`) + `<RegisterUser />`
- Table: `glass-card p-0`; columns User / Joined (hidden on mobile) / Status / Action; status pill Approved (`bg-success-lightest text-success-foreground`) / Pending (`bg-warning-light text-warning`)
- Empty state: `Users` icon + "No staff users yet"
- `components/admin/user-actions.tsx` — `"use client"`: Approve (`bg-success-lightest`) / Revoke (`bg-warning-light text-warning`) via `/api/admin/approve`, **Remove** (`bg-error-light text-error`) via `DELETE /api/admin/users`, gated by `confirmDelete()`, errors via `alertError()`; spinner per busy action
- `components/admin/register-user.tsx` — `"use client"`: collapsed "Register user" primary button → inline `glass-card-tint` form (first/last/email/temp-password) → `POST /api/admin/users`; success via `alertSuccess()`, shared `inputCls`/`labelCls` master-data field styles

#### Alert / Confirm dialogs (SweetAlert2)
`lib/alerts.ts` — `"use client"` · the only `sweetalert2` caller
- `confirmDelete(text?, confirmLabel?)` → `Promise<boolean>`; warning icon, red destructive confirm + glass cancel, `reverseButtons`, `focusCancel`. Replaces native `window.confirm` for all delete buttons across the ops app.
- `alertSuccess(text, title?)` — auto-dismiss (1.8s) success toast-style dialog
- `alertError(text, title?)` — error dialog with accent OK button
- `buttonsStyling` off; visuals come from the `.knp-swal-*` rules in globals.css (project tokens only — glass popup, `bg-accent` confirm, `bg-error` destructive confirm, `bg-surface` cancel)
- Usage: `onClick={async () => { if (await confirmDelete("…")) deleteX(id); }}`

#### JsonLd (SEO structured data)
`components/seo/json-ld.tsx` — Server Component
- Renders `<script type="application/ld+json">` from a `JsonLdData` object. No visual output. `breadcrumbList()` (standalone, with `@context`) is kept for any direct use, but pages now emit one connected `@graph` per page via the central `lib/seo.ts` helpers.

#### SEO layer (`lib/seo.ts`) — no visual output
Single source of truth for all SEO / SEM / AEO / GEO. Server-only schema builders + the `pageMeta()` metadata helper, consumed by every public page so titles, canonicals, Open Graph (with `si_LK`/`ta_LK` alternate locales), Twitter cards, robots directives, and JSON-LD never drift.
- **`pageMeta({ title, description, path, keywords?, type?, images?, noindex?, publishedTime?, modifiedTime? })`** → full `Metadata` (canonical + OG + Twitter + googleBot max-preview directives). Used on `/`, `/about`, `/contact`, `/products`, `/blog`, `/blog/[slug]`, `/faq`, `/price` (noindex).
- **Node builders:** `organizationNode()`, `websiteNode()` (with SearchAction sitelinks box), `localBusinessNode()` (geo/areaServed), `webPageNode()`, `breadcrumbNode()`. **`graph(nodes[])`** wraps them in one `@graph` with shared `@id` refs.
- The global Organization + WebSite graph is emitted once in `app/layout.tsx` (`<body>`); per-page graphs reference those `@id`s.
- Constants exported: `BUSINESS` (Kalmunai geo/telephone/WhatsApp), `BRAND_KEYWORDS`, `OG_LOCALE`/`OG_LOCALE_ALTERNATES`, `LOGO_URL`, `OG_IMAGE_URL`, `absolute()`.
- Companions: `app/manifest.ts` (PWA web manifest at `/manifest.webmanifest`), `app/robots.ts` (explicit GPTBot/ClaudeBot/PerplexityBot/Google-Extended rules), `app/sitemap.ts` (lastModified + image entries).

#### FaqPage
`app/faq/page.tsx` — Server Component (replaced the `RouteShell` placeholder)
- Hero: eyebrow `text-xs font-semibold uppercase tracking-[0.18em]` accent; heading `clamp(28px,4vw,48px)`
- FAQ items: native `<details>` `glass-card group p-6`; `<summary>` `text-base font-semibold` + `+` toggle icon rotating 45° on `group-open`
- CTA: `glass-card-tint` WhatsApp block (`bg-success` button)
- Emits FAQPage JSON-LD

#### Blog post body (Ghost or static)
`app/blog/[slug]/page.tsx`
- Renders Ghost `post.html` inside `<div className="ghost-content max-w-prose">` (dangerouslySetInnerHTML) when present, else maps static `post.sections`
- Emits Article JSON-LD; `generateMetadata` adds Open Graph article tags (per-post `keywords` from `lib/blog-data.ts` when set)
- **Post FAQ block (AEO/GEO):** when a static post defines `faqs[]`, renders a "Frequently asked questions" section below the body — `<details className="glass-card-tint group p-5">` accordion (same `+` → rotate-45 toggle pattern as `app/faq/page.tsx`) — and adds a `FAQPage` node (`#faq`) to the article `@graph`. `BlogPost.faqs` / `BlogPost.keywords` are optional fields flowed through `lib/ghost.ts` `BlogPostFull`; Ghost posts leave them null.

## CSS Utility Classes (globals.css)

| Class | Usage |
|---|---|
| `.glass-card` | Standard glass content card (white/0.55 bg, blur 18px, 20px radius, shadow + inset highlight) |
| `.glass-card-tint` | Green-tinted glass variant for accent cards |
| `.glass-nav` | Navbar glass (white/0.82 bg, blur 20px, bottom border) |
| `.knp-swal-popup` / `.knp-swal-title` / `.knp-swal-text` / `.knp-swal-confirm` / `.knp-swal-confirm-danger` / `.knp-swal-cancel` / `.knp-swal-actions` | SweetAlert2 glass theme — translucent popup over blur, tokenized buttons (accent / error / surface) |
| `.ghost-content` | Typographic defaults for Ghost blog HTML (h2/h3, p, a, ul/ol, img, blockquote) using project tokens |
