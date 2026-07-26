# The Florida Havens — marketing site

Public marketing and **book-direct** site for [The Florida Havens][live].
Next.js App Router, deployed on Vercel.

This repo replaces the Wix site. It is the **demand + booking** surface only.
In-stay guest content (TV, portal, Wi-Fi, laundry, check-in, house manuals) is
[Media Haven][mh] and must never be re-homed here.

| Surface | Product |
|---------|---------|
| Marketing, SEO, book direct | **this repo** |
| TV, guest portal, house guides, fleet ops | Media Haven |

[live]: https://www.thefloridahavens.com
[mh]: https://github.com/dcbolt/media-haven

---

## Start here

| Document | What it is |
|----------|------------|
| [`docs/AUDIT.md`](docs/AUDIT.md) | Measured audit of the live Wix site — 13 findings, severity-ranked, with evidence |
| [`docs/WIX-P0-CHECKLIST.md`](docs/WIX-P0-CHECKLIST.md) | Click-by-click fixes for the **live Wix site**, independent of this rebuild |
| [`docs/URL-MATRIX.md`](docs/URL-MATRIX.md) | All 77 live URLs classified keep / redirect / retire |

Cross-agent coordination lives in `docs/TFH-WEBSITE.md` in the
[media-haven][mh] repo, not here.

---

## Why this rebuild exists

Measured on the live Wix site, 2026-07-26 (74 of 77 sitemap URLs crawled):

| Finding | Measured |
|---------|----------|
| Pages with exactly one `<h1>` | **0 of 74** — nav labels are `<h1>` sitewide |
| Pages with zero structured data | **72 of 74** |
| Mean HTML per page | **1,030 KB** uncompressed (74.4 MB sitewide) |
| Inline script per page | **332 KB** average |
| `<iframe>` in server HTML | **0** — the booking widget is client-injected |
| Images with empty `alt` | **351 of 646 (54%)** |
| Phone numbers published | **2** — the host's personal cell in schema vs the business number in visible copy (**fixed live**) |

Result of the rebuild, measured on built output:

| Page | Live gzip | This repo | Reduction |
|------|----------:|----------:|----------:|
| `/` | 275 KB | 8.8 KB | **31×** |
| `/turtle-haven` | 243 KB | 7.5 KB | **33×** |
| `/book/turtle-haven` | 199 KB | 6.4 KB | **31×** |
| `/faqs` | 275 KB | 9.8 KB | **28×** |

Look and feel are deliberately preserved — brand tokens (Cormorant Garamond,
Raleway, ocean `#2b5672`, brass `#c0a91e`) were extracted from the live site,
and page copy is carried over. The changes are structural.

---

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # all routes prerender; 37 static pages
npm run lint
```

## Layout

```
app/
  layout.tsx            root shell, fonts, brand JSON-LD, GA4
  page.tsx              home
  [slug]/               property pages — /turtle-haven, /the-dunes, …
  book/[slug]/          lean booking routes
  guides/[slug]/        SEO demand pages
  robots.ts sitemap.ts  generated from the content model
components/
  SiteHeader.tsx        nav as <nav>, NOT <h1>  ← the critical fix
  BookingMount.tsx      booking widget, mounted on click
  JsonLd.tsx            LodgingBusiness / VacationRental / FAQPage / Breadcrumb
content/
  site.ts               brand facts — single source for the phone number
  properties.ts         6 properties — editorial copy only, no countable facts
  property-facts.ts     occupancy/bedrooms/baths/locality + WELCOME copy (generated)
  faqs.ts               21 Q&As lifted from the live /faqs
  guides.ts             10 SEO demand pages
  page-body.ts          ~7,100 words of body copy migrated from Wix (generated)
  url-matrix.ts         all 77 live URLs → generates the redirects
tools/
  check-contrast.py     WCAG AA gate for every colour pair in use
  crawl.py              the crawler behind docs/AUDIT.md
  extract-copy.py       regenerates content/page-body.ts from the live pages
  gen-property-facts.py regenerates content/property-facts.ts from a snapshot
  phone-audit.py        sitewide tel:/text/JSON-LD phone exposure sweep
  backup-live-site.py   content snapshot of every sitemap URL
  fill-snapshot-gaps.py re-fetches URLs a snapshot lost to throttling
  weigh.py              per-page subresource weight measurement
data/
  pages.json            raw crawl output (evidence)
```

## How the fixes are wired

| Live problem | Fix | Where |
|--------------|-----|-------|
| 7–10 `<h1>` per page | nav is `<nav>`/`<ul>`; one `<h1>` per page | `components/SiteHeader.tsx` |
| No structured data | LodgingBusiness, VacationRental, FAQPage, BreadcrumbList | `components/JsonLd.tsx` |
| Host's cell as the public phone | one constant, read everywhere | `content/site.ts` |
| ~1 MB HTML | static prerender, no hydration dump | framework default |
| Client-injected booking iframe | trust content first, widget on click | `components/BookingMount.tsx` |
| PNG/JPG heroes | AVIF/WebP + explicit dimensions | `next/image` + `next.config.ts` |
| Guest-ops pages indexed | 301 to the guest portal | `content/url-matrix.ts` |
| Empty `alt` on heroes | `heroAlt` required per property | `content/properties.ts` |
| 500-char meta descriptions | ≤155 chars, typed | `content/*.ts` |
| No preconnect | image origin preconnected | `app/layout.tsx` |
| Invented occupancy/bedroom counts | generated from the live site | `content/property-facts.ts` |
| Brand gold at 2.35:1 on text | tiered tokens, AA-gated in CI | `app/globals.css` + `tools/check-contrast.py` |

## Content migration

Body copy for the 10 guides, the 4 legal pages and `/about` is migrated
**verbatim** from the live Wix pages — ~7,100 words in `content/page-body.ts`,
regenerated by `tools/extract-copy.py`. Legal text is deliberately not
reworded.

Only the structure is corrected: the live pages jump from `<h1>` to `<h5>` with
no `<h3>` (40 of 74 pages do this), so `components/RichBody.tsx` renders
section headings as `<h2>`/`<h3>` for a valid outline. Font sizes match the
live look, so the pages read the same.

Boilerplate stripping is frequency-based, not hardcoded: any text block
appearing on 5+ of the fetched pages is treated as site chrome and dropped.

## Still needed

- **Guesty listing IDs / widget URLs** → wire `BookingMount`'s `embedUrl`.
  Until then it renders an explicit placeholder, not a broken frame.
- **Guest testimonials** — the six property pages carry `GUEST FEEDBACK` quotes
  with real guest first names and cities. Deliberately **not** migrated:
  republishing attributed personal content on a new domain needs sign-off first.
  Everything else from those pages is migrated.
- **Search Console + GA4 access** — no ranking or conversion claim is made
  anywhere in this repo without it.
- **PSI mobile baseline** on the live site before the Wix P0 fixes land.
