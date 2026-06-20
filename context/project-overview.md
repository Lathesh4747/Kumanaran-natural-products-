# Project Overview

## About the Project

KumaranNaturalProducts is a full stack business platform for Kumaran Natural Products — a quail farm in Sri Lanka that produces packed **egg** and **meat** products (sold in 500g and 1000g packets) and supplies them to supermarkets such as Cargills Food City, Keells, and private supermarkets.

The platform has two faces, built in one Next.js app with a **Liquid Glass** green UI that scales from small mobiles to 4K displays:

1. **A public marketing website** — trilingual (Sinhala / Tamil / English) — showing the company, its products (with a WhatsApp buy flow), a Ghost-powered blog, location, and contact. No login.
2. **A login-protected operations app** (English) — tracks the whole chain: production batches → cost → per-supermarket pricing → loading the vehicle → supply to branches → returns → payments → expenses → net profit. GPT-4o turns the sales data into marketing and sales suggestions.

The operation is summarised on a dashboard with sales comparisons, net profit, district / top-supermarket / top-product analytics, return breakdowns, alerts, and downloadable PDF reports.

---

## The Problem It Solves

A small farm supplying many supermarket branches tracks a lot by hand: which batch was produced, what it cost, what each chain pays, how many packets went out, how much came back, who has paid, and whether it is actually profitable. Spreadsheets get messy and the owner never sees the full picture.

KumaranNaturalProducts puts the whole supply chain in one place, computes net profit from real cost and per-supermarket selling prices, breaks down returns by product / reason / packet size, reminds the owner to follow up on supplies, and uses GPT-4o to suggest concrete ways to grow sales.

---

## Technology

Next.js (App Router) + React 19 · Neon (Postgres) + Drizzle ORM · Clerk auth (Google / Facebook / email + password) · Arcjet security · Ghost (headless) blog + SEO at `/ghost` · OpenAI GPT-4o · Resend email · Vercel Cron · recharts · @react-pdf/renderer · Tailwind v4 (Liquid Glass) · shadcn/ui.

---

## Pages

### Public website (no login) — trilingual: Sinhala / Tamil / English

Routed under `/[lang]/` (`si` / `ta` / `en`); locale auto-detected from the browser with a navbar switcher.

```
/                  → Home: Hero, Products, Blogs, Location, Contact us
/products          → All products with "Buy via WhatsApp"
/about             → About the company
/blog              → Blog list (from Ghost)
/blog/[slug]       → Single blog post (from Ghost)
/ghost             → Ghost admin (CMS)
/sign-in /sign-up  → Clerk auth (Google, Facebook, email + password)
```

### Operations app (login required, English)

```
/dashboard         → Stats, sales comparison, analytics, alerts, AI insights
/production        → Production batches (Before Supply) + inventory
/supply            → Vehicle loading + supply records + supply details
/returns           → Returns by supply / product / reason / weight
/supermarkets      → Supermarket types, supermarkets and their branches
/pricing           → Selling price per product per supermarket type
/payments          → Payments from supermarkets (paid / pending)
/expenses          → Business expenses
/feed-suppliers    → Feed suppliers + feed purchases
/vehicle           → Vehicle + loading records
/products-admin    → Product types, products, cost prices
/reports           → PDF reports (supply / returns / net profit / expenses)
/insights          → AI marketing & sales suggestions
```

---

## Navigation

**Public site navbar** — clean, full width, glass, no sidebar:

```
Home    Products    About                        [ EN · සිං · தமிழ் ]  [ Login ]
```

**App navbar** — after login, full width, glass, no sidebar:

```
Dashboard   Supply   Returns   Supermarkets   Payments   Reports   Insights   More ▾
```

`More ▾` holds Production, Pricing, Expenses, Feed Suppliers, Vehicle, Products admin. The app is English-only (no language switcher).

---

## Core User Flow

### Public visitor

- Home → Hero, featured Products, recent Blogs (Ghost), Location map, Contact form, in their language.
- Products → each shows name (with weight), type (Egg / Meat), MRP, description, and a **Buy via WhatsApp** button opening `wa.me/94705920748` pre-filled with the product name.
- About → company story. Contact → stored as a submission (Arcjet-protected).

### Login

- Owner / staff signs in via Clerk (Google, Facebook, or email + password) → redirect to `/dashboard`.

### Master data setup

- **Product Types** (Egg, Meat) and **Products** (e.g. "Quail Eggs 500g") with MRP.
- **Cost Prices** per product — packing, product, butcher → product cost price.
- **Product Prices** — selling price per (product, supermarket type). Cargills = Keells; Private differs.
- **Supermarket Types** (Cargills, Keells, Private) and **Supermarkets** (each row a branch with address, district, province, contact).
- **Vehicle** and **Feed Suppliers**.

### Production (Before Supply)

- Each batch: product, batch number, production date, best before, weight unit, quantity produced, cost price, MRP. Quantity produced feeds inventory before loading.

### Supply

- Load the **Vehicle** for the day, then create a **Supply** per branch.
- Each **Supply Detail** records product, quantity, and a **selling price snapshotted from that branch's supermarket-type price**, with per-packet profit. Total amount = sum of lines. Inventory decremented; branch `last_supply_date` updated.

### Returns

- Unsold or rejected packets come back as **Returns**, linked to the supply and product, with date, quantity, reason (fixed list), and weight unit. Returns reduce realised profit.

### Payments & Expenses

- **Payments** — money from supermarkets per supply (paid / pending, method).
- **Expenses** and **Feed Purchases** — business costs feeding net profit.

### Dashboard

- **Stats bar** — Total Packets Supplied, Net Profit, Return Rate, Pending Payments.
- **Period selector** — weekly / monthly / yearly / custom range applied across all figures.
- **Sales comparison** — across weeks, months, years.
- **Net profit** — month-wise and year-wise (gross profit − returns loss − expenses).
- **Analytics** — which **district** sells most, **top 50 supermarkets** by sales, **top products** by sales.
- **Return analytics** — rate, most-returned products, reason breakdown, 500g vs 1000g split.
- **Alerts** — high return rate, low stock, overdue payments, upcoming supply follow-ups.
- **AI Insights** — GPT-4o suggestions from the aggregated data.

### Supply Reminder Emails

- A daily job emails `pathmanlathesh474@gmail.com` **11 days after a supply** (2 weeks − 3 days) to prompt a visit/contact for that branch (possible returns or out-of-stock). Sent once per supply.

### PDF Reports

- Supply, returns, net profit, and expenses reports for a weekly / monthly / custom period, downloadable as PDF, using the same figures as the dashboard.

### AI Insights Flow

- Owner selects a period; the app aggregates sales / returns / profit; GPT-4o returns structured marketing & sales suggestions; the result is saved to `ai_insights` and not regenerated on every visit.

---

## Data Architecture

- **Master data:** `product_types`, `products`, `cost_prices`, `product_prices`, `supermarket_types`, `supermarkets`, `vehicles`, `feed_suppliers`. Changes only when the owner edits it.
- **Operational data:** `before_supply`, `vehicle_loadings`, `supplies`, `supply_details`, `returns`, `payments`, `expenses`, `feed_purchases`.
- **Derived data:** net profit, district / top-supermarket / top-product / return aggregates — computed via Drizzle queries; optionally cached as `net_profit_snapshots`. Never hand-entered.
- **Website data:** `contact_submissions` in Postgres; **blog content lives in Ghost**, not the DB.
- **AI data:** `ai_insights` — generated suggestions + the figures they were based on. Never affects financial data.
- **Identity:** handled by Clerk — no local users table.

---

## Features In Scope

- Trilingual public website (Home, Products, About, Ghost blog, Contact) with Liquid Glass green UI, responsive mobile → 4K.
- WhatsApp buy flow; contact form (Arcjet-protected) storing submissions.
- SEO / AEO / GEO — metadata, JSON-LD, sitemap, robots, Ghost content.
- Clerk auth (Google / Facebook / email + password); Arcjet security.
- Product types & products (Egg / Meat, 500g / 1000g); cost prices; **selling price per supermarket type**.
- Supermarket types & branches; vehicle & loading; feed suppliers & purchases.
- Production (Before Supply) batches with inventory.
- Supply & supply details with snapshotted per-type selling price and profit.
- Returns with fixed reason list and weight breakdown.
- Payments (paid / pending) and expenses.
- Dashboard — stats, period selector (week / month / year / custom), sales comparison, net profit, district / top-50 / top-product analytics, return analytics, alerts.
- PDF reports (supply / returns / net profit / expenses) by period.
- Supply reminder emails via daily cron.
- GPT-4o marketing & sales insights, persisted.

---

## Features Out of Scope

- Online checkout / payment gateway — buying is WhatsApp-only.
- Supermarket or feed-supplier self-service logins — company use only.
- Emailing reports/invoices to supermarkets (PDF download is in scope).
- Inventory forecasting / automatic reorder.
- Multi-vehicle routing optimisation — one vehicle, simple loading record.
- Native mobile app — responsive web only.
- Multi-company / multi-tenant support.
- Translating product or blog content (only static UI labels are translated).
- Payroll or HR.

---

## Target User

The owner (and staff) of Kumaran Natural Products who produces quail egg and meat products in batches, supplies many supermarket branches across Sri Lanka with one vehicle, needs real net profit (not guesswork), wants to understand returns, and wants practical, data-driven ideas to grow sales.

---

## Success Criteria

- Owner can record a full day's cycle — production, loading, supply to several branches, returns — quickly.
- Net profit matches real cost and per-supermarket selling prices.
- Analytics correctly show top district, top 50 supermarkets, top products, and return breakdowns by reason and weight.
- Period selector and PDF reports reconcile to the same figures.
- Supply reminder emails arrive 11 days after a supply, once each.
- GPT-4o insights are specific to the company's data and feel useful.
- Public site is fast, trilingual, renders Sinhala/Tamil correctly, and the WhatsApp buy button opens the right chat.
- UI is consistent (Liquid Glass green) and looks right from 360px phones to 4K screens.
