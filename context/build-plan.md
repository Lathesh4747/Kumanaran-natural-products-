# Build Plan

The exact order features are built. Build one feature fully, verify it, update progress-tracker.md, then move to the next. Never skip ahead or build out of scope. Each feature lists its goal, what to build, and how to verify it works.

---

## Phase 1 — Foundation

### 01 Site Shell + Home (trilingual, Liquid Glass)

**Goal:** Public website skeleton with the home page, in Sinhala / Tamil / English, in the Liquid Glass green style.
**Build:** Root layout loading Inter + Noto Sans Sinhala + Noto Sans Tamil and applying the `--gradient-page` background; `(site)/[lang]` layout with SiteNavbar (language switcher) + Footer as glass surfaces; `locales/{en,si,ta}.ts`; Home with Hero, Products preview, Blogs preview, Location, Contact sections (placeholder strings from the dictionary). Establish the glass card, button, and responsive container styles.
**Verify:** `/` redirects to the detected locale; switcher changes language and sticks; Sinhala/Tamil render as real glyphs; glass cards refract over the gradient; layout works at 360px, 1280px, and 2560px; no console errors.

### 02 Database — Neon + Drizzle

**Goal:** All tables defined and migrated.
**Build:** `db/schema.ts` with every table in architecture.md (money as `numeric`, FKs, `reminder_sent_at` on supplies, `product_prices`). `db/index.ts` Neon client. Generate + run migrations with drizzle-kit. Seed product types Egg and Meat and supermarket types Cargills / Keells / Private.
**Verify:** Migrations apply cleanly; insert/select works for each table; FKs enforced; seed rows present.

### 03 Auth (Clerk) + Security (Arcjet)

**Goal:** Login, route protection, and baseline security.
**Build:** ClerkProvider in root layout; Google + Facebook + email/password enabled; `/sign-in` + `/sign-up`; `middleware.ts` composing Arcjet → Clerk → locale; `(app)` layout guard redirecting to sign-in; redirect to `/dashboard` after login; `lib/arcjet.ts` rules.
**Verify:** Logged-out user hitting `/dashboard` is redirected; each provider signs in and lands on `/dashboard`; Arcjet blocks an obvious flood on a test route; `(site)` stays public.

---

## Phase 2 — Master Data

### 04 Product Types + Products

**Build:** `products-admin`, ProductForm + `actions/products.ts`. Name includes weight; `weight_unit` from `WEIGHT_UNITS`; type from product types.
**Verify:** Create / edit / deactivate a product; weight unit saved; listed.

### 05 Cost Prices

**Build:** Cost price form + `actions/costPrices.ts` — packing, product, butcher, product cost price, effective date.
**Verify:** A cost price saved per product; total available to profit calc.

### 06 Product Prices (per supermarket type)

**Build:** `pricing` page + `actions/productPrices.ts` — selling price per (product, supermarket type). Cargills = Keells (set same), Private different.
**Verify:** Prices saved per type; the correct price is later snapshotted onto a supply line.

### 07 Supermarket Types + Supermarkets

**Build:** `supermarkets` page, type management, branch form + `actions/supermarkets.ts` (chain, branch, contact, address, district, province, status).
**Verify:** Create a type and a branch; list groups branches by chain; district captured.

### 08 Vehicle + Feed Suppliers

**Build:** `vehicle` page; `feed-suppliers` page + feed purchase form; `actions/vehicle.ts`, `actions/feed.ts`.
**Verify:** Vehicle saved; a feed supplier and feed purchase saved; feed cost feeds expenses/profit.

---

## Phase 3 — Operations

### 09 Production (Before Supply)

**Build:** `production` page, ProductionForm + `actions/production.ts` — product, batch, dates, weight unit, quantity produced (sets `quantity_remaining`), cost price, MRP.
**Verify:** Batch saved; `quantity_remaining` = `quantity_produced`.

### 10 Vehicle Loading + Supply + Supply Details

**Build:** Vehicle loading record; `supply` page; SupplyForm with line items; `actions/supply.ts`. Snapshot `selling_price` from `product_prices` for the branch's supermarket type; set `profit_price = selling_price − product_cost_price`; decrement inventory; compute `total_amount`; update `last_supply_date`.
**Verify:** Multi-line supply saved; price matches the supermarket type; profit per line correct; total correct; inventory decremented.

### 11 Returns

**Build:** `returns` page, ReturnForm + `actions/returns.ts` — links supply + product, date, quantity, reason (fixed list), weight unit, status.
**Verify:** Return saved; reason from dropdown; weight captured; profit calc reflects the return.

### 12 Payments + Expenses

**Build:** `payments` page (per supply, paid/pending, method) + `actions/payments.ts`; `expenses` page + `actions/expenses.ts`.
**Verify:** Paid vs pending shown distinctly; an expense saved.

---

## Phase 4 — Public Website

### 13 Products Page + WhatsApp Buy

**Build:** `/products` reading active products; ProductCard with type badge, MRP, description, WhatsApp buy button via `lib/whatsapp.ts` (pre-filled product name to `wa.me/94705920748`).
**Verify:** Products render; buy button opens WhatsApp with correct text and number.

### 14 About + Ghost Blog + Contact + SEO

**Build:** `/about`; `lib/ghost.ts` Content API client; `/blog` list + `/blog/[slug]` from Ghost; ContactForm → `/api/contact` (Arcjet-protected) storing a `contact_submission`. Add `generateMetadata`, JSON-LD (Organization, Product, Article, FAQ), `sitemap.xml`, `robots.ts` for SEO/AEO/GEO.
**Verify:** Ghost posts list and render; contact submits and stores a row; metadata + JSON-LD present in page source; sitemap reachable.

---

## Phase 5 — Dashboard, Reports & AI

### 15 Stats Bar + Sales / Net Profit Charts + Period Selector

**Build:** `dashboard`, StatsBar (Total Packets Supplied, Net Profit, Return Rate, Pending Payments); period selector weekly / monthly / yearly / custom; SalesChart and NetProfitChart from Drizzle aggregates via recharts.
**Verify:** Stats match raw data; period selector (incl. custom range) updates all figures; net profit = gross profit − returns loss − expenses.

### 16 Sales Analytics — District / Top 50 / Top Products

**Build:** DistrictSalesCard (sales by district), TopSupermarketsCard (top 50 branches by sales), TopProductsCard (best-selling products). All from `db/queries/`.
**Verify:** Rankings reconcile with raw data; respect the selected period; top-50 limit applied.

### 17 Return Analytics + Alerts

**Build:** ReturnRateCard, most-returned products, reason breakdown, 500g vs 1000g split; AlertsCard surfacing high return rate (`HIGH_RETURN_RATE_THRESHOLD`), low stock (`LOW_STOCK_THRESHOLD`), overdue payments, and upcoming supply follow-ups.
**Verify:** Return numbers reconcile; weight split correct; alerts appear when thresholds are crossed.

### 18 PDF Reports

**Build:** `reports` page + `/api/reports/[type]` for supply / returns / net profit / expenses over weekly / monthly / custom periods, using `@react-pdf/renderer` and the same `db/queries/` aggregates as the dashboard.
**Verify:** Each report downloads as a PDF; totals match the dashboard for the same period.

### 19 Supply Reminder Emails

**Build:** `lib/email.ts` (Resend) + reminder template; `/api/cron/supply-reminders` (CRON_SECRET + Arcjet) finding supplies at `supply_date + SUPPLY_REMINDER_DAYS` with `reminder_sent_at IS NULL`, emailing `REMINDER_EMAIL`, then setting `reminder_sent_at`; daily schedule in `vercel.json`.
**Verify:** Manually invoking the route with the secret emails the right supplies once and sets the flag; a second run sends nothing.

### 20 AI Marketing & Sales Insights

**Build:** `ai/insights.ts`, `/api/insights/generate` (Arcjet), InsightsCard + `/insights`. Aggregate period figures, call GPT-4o, parse structured JSON, save to `ai_insights`, display.
**Verify:** Generating stores a row and shows suggestions; reopening shows the saved insight without regenerating; failure shows a friendly message.

---

## Definition of Done (every feature)

- Matches scope in project-overview.md — nothing extra
- Follows code-standards.md (types, Drizzle, Clerk, Arcjet, error handling, success wrapper, constants)
- UI matches ui-rules.md and ui-tokens.md (Liquid Glass, responsive 360px→2560px); new components added to ui-registry.md
- Verified by the steps above
- progress-tracker.md updated
