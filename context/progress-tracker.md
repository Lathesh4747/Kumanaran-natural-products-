# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 4 complete (public website wired to real backends + SEO); Phase 5 in progress — dashboard analytics, PDF reports + supply reminder cron done; remaining: return analytics/alerts (17), AI insights (20)
**Last completed:** 19 Supply Reminder Emails (Resend + Vercel Cron)
**Next:** 17 Return analytics + alerts, 20 AI insights

---

## Progress

### Phase 1 — Foundation

- [x] 01 Site Shell + Home (trilingual, Liquid Glass)
- [x] 02 Database — Neon + Drizzle (schema pushed to Neon via drizzle-kit push)
- [x] 03 Auth (Clerk) + Security (Arcjet partial — Arcjet deferred until installed)

### Phase 2 — Master Data

- [x] 04 Product Types + Products (`/products-admin` with tabs: Product Types, Products, Cost Prices)
- [x] 05 Cost Prices (tab within products-admin)
- [x] 06 Product Prices (per supermarket type) (`/pricing` — grid + upsert modal)
- [x] 07 Supermarket Types + Supermarkets (`/supermarkets` with tabs: Chain Types, Branches)
- [x] 08 Vehicle + Feed Suppliers (`/vehicle`, `/feed-suppliers` with tabs)

### Phase 3 — Operations

- [x] 09 Production (Before Supply) (`/production` — batch list + create/edit modal with inventory tracking)
- [x] 10 Vehicle Loading + Supply + Supply Details (`/supply` — multi-line create form; snapshots selling price from `product_prices` by branch supermarket type, computes `profit_price`, decrements batch inventory, updates `last_supply_date`, stamps `userId`)
- [x] 11 Returns (`/returns` — list + create modal; supply→product cascade picker, fixed reason list, weight pre-filled from product, owner-stamped)
- [x] 12 Payments + Expenses (`/payments` with filter tabs + mark-paid; `/expenses` full CRUD)

### Phase 4 — Public Website

- [x] 13 Products Page + WhatsApp Buy (`/products` reads live DB products via `db/queries/products.ts` with fallback to curated static set; WhatsApp buy via `lib/whatsapp.ts`; Product/ItemList JSON-LD)
- [x] 14 About + Ghost Blog + Contact + SEO (`lib/ghost.ts` Content API client w/ static fallback; blog list + post pages wired; contact action inserts to `contact_submissions`; real FAQ page; sitemap.ts, robots.ts, Organization/Article/FAQ JSON-LD)

### Phase 5 — Dashboard, Reports & AI

- [x] 15 Stats Bar + Net Profit + Period Selector (`/dashboard` — packets / net profit / return rate / pending payments; week/month/year/custom selector via URL params; net-profit breakdown card)
- [x] 16 Sales Analytics — District / Top 50 / Top Products (top products by sales, top products by profit, sales by district, top-50 supermarkets; rendered as bars/tables — no recharts dep added)
- [ ] 17 Return Analytics + Alerts (low-stock alert present on dashboard; full return analytics + threshold alerts pending)
- [x] 18 PDF Reports (`/api/reports/[type]` — net-profit / sales / supply / returns over the selected period via `@react-pdf/renderer`; same `getDashboardData` aggregates as the dashboard; respects admin/own scope)
- [x] 19 Supply Reminder Emails (`/api/cron/supply-reminders` — daily Vercel Cron; emails `REMINDER_EMAIL` 11 days after a supply, once each via `reminder_sent_at`)
- [ ] 20 AI Marketing & Sales Insights

---

## Decisions Made During Build

- **Stack:** Next.js + React 19, Neon Postgres + Drizzle ORM, Clerk auth (Google / Facebook / email+password), Arcjet security, Ghost (headless) for blog + SEO at `/ghost`, OpenAI GPT-4o, Resend email, Vercel Cron. (Replaced InsForge; PostHog dropped.)
- **UI:** Liquid Glass aesthetic — translucent blurred panels over a green gradient background; green brand color with harvest-amber highlight. Fully responsive from 360px mobile to 2560px 4K.
- Public website is trilingual (Sinhala / Tamil / English), auto-detected with a cookie-remembered switcher; the app is English-only. Only static UI labels are translated — product and Ghost content are shown as authored.
- Weight (500g / 1000g) is part of the product name and stored in `products.weight_unit`.
- `product_types` are Egg and Meat; each `supermarkets` row is one branch of a chain.
- **Pricing:** selling price is set per (product, supermarket type) in `product_prices`. Cargills = Keells (same value), Private differs. Supply lines snapshot the price at supply time, so profit differs by supermarket type.
- **Net profit** = gross profit (Σ supply-line margins) − returns loss − expenses (incl. feed purchases). Returns treated as a loss of cost — *confirm if it should be full selling price*.
- **Supply reminder:** daily Vercel Cron emails `pathmanlathesh474@gmail.com` 11 days after a supply (2 weeks − 3 days), once per supply (`reminder_sent_at`).
- **WhatsApp buy** number: `94705920748` (`wa.me/94705920748`).
- Buying is WhatsApp-only — no checkout or payment gateway.
- **Feature 01 notes:** Home page built at `app/page.tsx` (no locale routing yet). Locale routing (`(site)/[lang]/`) deferred to after core structure is confirmed. Language switcher in SiteHeader is visual-only — locale detection + cookie logic comes with full locale routing. Blog section uses placeholder cards pending Ghost integration. Contact form is styled but not wired — API wired in Feature 14. `tailwind.config.ts` left in place as a no-op; all tokens live in `@theme` in globals.css.
- **Hero video + language slideshow:** HeroSection updated to use a `<video src="/hero-video.mp4">` full-bleed background with a dark gradient overlay. The three trilingual description rows replaced with a single auto-cycling slideshow (Tamil → Sinhala → English, 3.5 s interval, 400 ms fade). Users can also click the dot-nav to jump to a language. Component converted to `"use client"`.
- **Contact page (standalone):** Built ahead of Feature 14 at `app/contact/page.tsx`. Includes: page hero with CTA buttons, four info cards (WhatsApp / Location / Hours / Phone), two-column form+map layout, a three-item FAQ strip. `components/site/contact-form.tsx` is a `"use client"` component using React 19 `useActionState` + `useFormStatus` with idle / loading / success / error states. `actions/contact.ts` validates name, email, message; DB insert stubbed with comment (pending Feature 02). WhatsApp number read from `WHATSAPP_NUMBER` constant.

- **Auth (Feature 03):** Clerk v7 installed. `middleware.ts` uses `clerkMiddleware` + `createRouteMatcher` to protect all non-public routes. `ClerkProvider` wraps root layout. `(app)` route group created — its `layout.tsx` calls `currentUser()` to check email or `publicMetadata.approved`. Admin (`pathmanlathesh474@gmail.com`) is auto-elevated to `role: admin` on first sign-in. Other users land on `/pending-approval` until admin approves them via `/admin/users`. Approval updates `publicMetadata.approved` via Clerk backend API; user must re-sign-in for new JWT to reflect approval. Arcjet deferred until `@arcjet/next` is installed.

- **App Navbar:** `components/app-navbar.tsx` — client component with `usePathname` for active state, mobile hamburger with all-nav drawer, More ▾ dropdown for Production/Pricing/Expenses/Feed Suppliers/Vehicle/Products Admin. Integrated into `(app)/layout.tsx`.
- **Database:** `DATABASE_URL` set in `.env.local` (Neon pooler endpoint). Schema pushed with `drizzle-kit push`. `db/` directory: `schema.ts` (all 19 tables), `index.ts` (neon-http driver).
- **Dashboard:** Replaced admin-only view with real ops dashboard — 4 stat cards (packets, gross profit, return rate, pending payments), quick-access grid, recent supplies, low-stock alerts. Queries wrapped in try/catch with empty-state fallback.
- **Entity pages:** All master-data pages built as Server Component (data fetch) + Client Component (`client.tsx`, `"use client"`). All modals use `useActionState` + `useFormStatus`. Consistent glass-card table + add/edit/delete pattern.

- **Per-user ownership (NEW):** operational tables (`supplies`, `returns`, `payments`, `expenses`, `feed_purchases`, `before_supply`, `vehicle_loadings`) gained a nullable Clerk `user_id` column. New writes stamp the acting user via `getOwnerId()` in `lib/auth.ts`. Master data stays shared. Dashboard net profit will show a company total (admin) plus a per-user breakdown; non-admin staff see only their own. Legacy rows (null `user_id`) count toward the company total only.
- **Supply recording (Feature 10):** `actions/supply.ts` `createSupply` takes a typed object (not FormData) so the client can manage multi-line state; resolves selling price from the latest `product_prices` row for the branch's supermarket type, cost from the selected batch's `cost_price_id` (or latest `cost_prices` when no batch), computes `profit_price = selling − cost`, sums `total_amount`, decrements `before_supply.quantity_remaining`, sets `supermarkets.last_supply_date`. neon-http has no interactive transactions, so writes are sequential (acceptable at this scale). `deleteSupply` removes details then the supply.
- **Pre-existing build blockers found:** (1) all `actions/*.ts` used Zod-3 `parsed.error.errors` — fixed to `.issues` (Zod 4) across the codebase; (2) `components/app-navbar.tsx` passes `afterSignOutUrl` to Clerk `UserButton`, which Clerk v7 removed — still failing `tsc`, left untouched pending a decision (move to `ClerkProvider` or env).

- **Dashboard analytics (Features 15/16):** `db/queries/dashboard.ts` resolves the period (week = last 7 days, month = current calendar month, year = current calendar year, custom = from/to) and `getDashboardData(period, scope)` aggregates everything in JS from period-filtered rows (clearer/safer than raw SQL aggregates at this scale). Net profit = Σ(profit_price×qty) − returns loss (Σ return_qty × latest product cost) − (expenses + feed purchases). **Per-user breakdown**: gross/revenue attributed to `supplies.user_id`; returns loss to the supply owner; expenses/feed to their own `user_id`; null-owner legacy rows bucket as "Unattributed" so the rows sum to the company total. Non-admin scope filters every figure to the signed-in user. User display names resolved via Clerk `getUserList`. Charts rendered as CSS bars/tables — **recharts intentionally not installed** (not needed for the requested views).
- **PDF reports (Feature 18):** `@react-pdf/renderer` v4 added (was already in the approved dependency list). `lib/pdf.tsx` defines four A4 documents; `app/api/reports/[type]/route.ts` (nodejs runtime) renders net-profit / sales / supply / returns for the period, reusing the dashboard aggregates and the same admin/own scope. PDF styling uses literal brand hex (react-pdf has its own style system, separate from Tailwind tokens). Dashboard "Download PDF" buttons open these in a new tab. **Not yet Arcjet-guarded** (Arcjet still deferred project-wide).

- **SweetAlert2 confirmations:** `sweetalert2` added (now in the approved deps list). `lib/alerts.ts` (`"use client"`) is the only caller — exposes `confirmDelete()` (Promise<boolean>), `alertSuccess()`, `alertError()`. All 14 native `window.confirm("Delete?")` delete dialogs across the ops app (expenses, products-admin ×2, vehicle ×2, supermarkets ×2, payments, production, returns, supply, pricing, feed-suppliers ×2) replaced with themed `confirmDelete()` — each given a context-specific message. `buttonsStyling` off; the Liquid Glass theme lives in the `.knp-swal-*` rules in `globals.css` (project tokens only — glass popup, `bg-accent`/`bg-error`/`bg-surface` buttons). Typecheck clean except the pre-existing `app-navbar.tsx` `afterSignOutUrl` Clerk-v7 blocker (unrelated).

- **Phase 4 — Public Website (Features 13 + 14):** Wired the existing (placeholder-data) public site to real backends with graceful fallbacks, since DB is configured but Ghost is not.
  - **Products (13):** `db/queries/products.ts` `getPublicProducts()` reads active products joined to `product_types`; if the table is empty or unreachable it falls back to the curated trilingual marketing set in `lib/data/products.ts`. DB rows are English-only with no sale price, so `Product.mrpOriginal` is now optional and `ProductCard` hides the strikethrough/savings badge and the si·ta sub-name when absent. `products/page.tsx` is now async + emits ItemList/Product JSON-LD.
  - **Ghost blog (14):** `lib/ghost.ts` is the only Ghost caller — REST Content API via `fetch` (no `@tryghost/content-api` dep needed), `revalidate: 600`. When `GHOST_URL`/`GHOST_CONTENT_API_KEY` are unset (current state) it serves the static `lib/blog-data.ts` posts so the blog always renders. Blog list + post pages consume it; post page renders Ghost `html` (`.ghost-content` styled in globals.css) or static `sections`, and emits Article JSON-LD. `generateStaticParams` uses static slugs; Ghost posts render on demand.
  - **Contact (14):** `actions/contact.ts` now validates with zod (`.issues` for Zod 4) and inserts into `contact_submissions` (array form). Kept the React 19 `useActionState` server-action path the form already uses rather than adding a redundant `/api/contact` route; Arcjet still deferred project-wide.
  - **SEO (14):** `components/seo/json-ld.tsx` generic `<JsonLd>`; `app/sitemap.ts` (static routes + blog posts, async) and `app/robots.ts` (disallows `/dashboard`,`/admin`,`/api/`,auth routes). Organization JSON-LD on home, Article on blog posts, FAQPage on the new real `/faq` page (replaced the `RouteShell` placeholder with `<details>` accordion + WhatsApp CTA).
  - **Verify:** `tsc --noEmit` clean for all Phase 4 files. NOTE: full `next build` is still blocked only by the pre-existing `components/app-navbar.tsx` `afterSignOutUrl` Clerk-v7 error (unrelated to Phase 4, different route group, still pending a decision). Live DB/Ghost data paths not exercised at runtime (no seeded products / no Ghost server) — fallbacks are what render today.

- **Supply reminder emails (Feature 19):** `lib/email.ts` gained `sendSupplyReminderEmail()` + a glass-styled HTML reminder template (branch, district, supply date, total, contact + "Record a Return" CTA to `/returns`), reusing the existing `emailWrapper` and the same `isResendConfigured()` graceful-skip guard as the approval/rejection mails. `app/api/cron/supply-reminders/route.ts` (`runtime = "nodejs"`, GET) is guarded by `CRON_SECRET` (accepts Vercel's `Authorization: Bearer <secret>` or a `?secret=` query for manual runs) — Clerk is bypassed by adding `/api/cron(.*)` to `middleware.ts` public routes. It selects supplies where `supply_date = today − SUPPLY_REMINDER_DAYS (11)` **and** `reminder_sent_at IS NULL` (exact-date match per architecture.md — naturally avoids re-blasting legacy rows; `reminder_sent_at` guarantees once-only), joins `supermarkets` for the email content, sends per supply, and stamps `reminder_sent_at = now()` **only after** a successful send so a failed send retries next day. `vercel.json` schedules it daily at `0 6 * * *`. New env: `REMINDER_EMAIL`, `CRON_SECRET` (added to `.env.local`). **Verified** at runtime: no/wrong secret → 401; valid secret with a seeded supply dated 11 days ago → `{due:1,sent:1}` and `reminder_sent_at` set; immediate second run → `{due:0,sent:0}` (idempotent). Resend key is still the placeholder, so the actual email is skipped with a warning (flag still set) until a real key + verified domain are configured. Arcjet still deferred project-wide.
- **Known carry-over blocker (unchanged):** `components/app-navbar.tsx` still passes `afterSignOutUrl` to Clerk v7 `UserButton` (×2), failing `tsc`. Unrelated to this feature; all Feature 19 files typecheck clean.

- **Catalogue cleanup (eggs + meat only):** Per the owner, the company sells **only quail eggs and quail meat — no curd/dairy**. Removed every "Natural Curd"/"Dairy" reference project-wide: locale dictionaries (`en/si/ta` — hero, products items + `badges.dairy` (also dropped from the `Dictionary` type), location, about story/products, footer; "three"→"two products"), `lib/data/home.ts`, hero slideshow, `ProductsSection` (dropped `CurdIcon` + 3rd icon/badge arrays, grid now `sm:grid-cols-2`), `AboutPageContent` (dropped `Droplets` + 3rd arrays, products grid `sm:grid-cols-2`), and all SEO/metadata descriptions (`config.ts`, root + about + price pages) and `ui-registry.md`. The public `/products` page reads live DB rows, which had only 2 products, so the curated static prices the owner corrected weren't showing. Added the two missing products to the DB so all four render: **10 Quail Eggs pack 350, 16 Quail Eggs pack 499, 500g Quail Meat 1690, 1000g Quail Meat 3290** (also fixed the 10-pack `weight_unit` from the erroneous "500g" to "10 Eggs"). Verified live: `/products` shows all 4 with correct prices; 0 curd matches on home/products/about. `tsc` clean except the pre-existing `app-navbar.tsx` blocker.

_Add further decisions here as they are made during implementation._

---

## Notes

- `components/site/` holds all public-site section components.
- `components/site-header.tsx` and `components/site-footer.tsx` are shared layout components.
- CSS utility classes `.glass-card`, `.glass-card-tint`, `.glass-nav` defined in globals.css for reuse.
- Brand-compat aliases (`--color-brand-*`) kept in `@theme` so existing components using `brand-leaf` etc. still compile.
