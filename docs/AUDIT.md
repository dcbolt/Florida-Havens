# thefloridahavens.com — technical audit

**Method:** full crawl of every URL in the live Wix sitemap, 2026-07-26.
74 of 77 URLs captured (3 lost to Wix rate-limiting; re-run `tools/crawl.py` to
fill them). All figures below are measured from live server HTML, not estimated.

Reproduce with `python3 tools/crawl.py` (needs `data/urls.txt`).

> **Scope note.** This audit covers what the public HTML exposes. It is *not* a
> Wix dashboard audit — no collaborator access was granted for this pass, so
> redirect tables, SEO panel settings, the installed-app list and media library
> were inferred from rendered output rather than read directly. See
> `WIX-P0-CHECKLIST.md` for the items that need someone inside the editor.

---

## Severity summary

| # | Finding | Severity | Evidence |
|---|---------|----------|----------|
| 1 | Nav labels are `<h1>` sitewide | **Critical** | 0 of 74 pages have exactly one `<h1>` |
| 2 | No structured data | **Critical** | 72 of 74 pages carry zero JSON-LD |
| 3 | Two different phone numbers | **Critical** | schema `5087260695` vs public `321-209-0495` |
| 4 | ~1 MB of HTML per page | **High** | mean 1,030 KB uncompressed; 74.4 MB sitewide |
| 5 | Booking widget is client-injected | **High** | 0 `<iframe>` in server HTML on all 7 book pages |
| 6 | Guest-ops pages fully indexable | **High** | 0 pages emit a robots meta tag |
| 7 | 54% of images have empty `alt` | **High** | 351 of 646 `<img>`; 65 of 68 on the homepage |
| 8 | Meta descriptions overflow | **Medium** | 51 of 74 exceed 160 chars; longest 294 |
| 9 | 245 images lack dimensions | **Medium** | layout-shift risk |
| 10 | Broken heading hierarchy | **Medium** | 40 pages use `<h5>` with no `<h3>` |
| 11 | Typo in a live URL | **Medium** | `/beach-strret-wifi-guide` |
| 12 | No `preconnect` anywhere | **Low** | 0 across all 74 pages |
| 13 | Titles over 60 chars | **Low** | 7 pages; longest 93 |

---

## 1. Nav labels are `<h1>` — critical

Wix renders the seven main nav items as `<h1>` elements on every page:

```
HOME · ABOUT · PROPERTIES · BOOK YOUR STAY · LOCAL ATTRACTIONS ·
GUEST RESOURCES · CONTACT
```

Measured `<h1>` count across the 74 crawled pages:

| `<h1>` per page | Pages |
|---:|---:|
| 0 | 1 |
| 7 | 20 |
| 8 | 43 |
| 9 | 9 |
| 10 | 1 |

**Zero pages have exactly one `<h1>`.** Every page therefore declares its
primary topic as the navigation menu rather than its actual subject. This is
the single highest-leverage fix on the site and it is a styling change, not a
content change — the nav can look identical.

Fixed in this repo: `components/SiteHeader.tsx` uses a plain `<nav>` + `<ul>`,
leaving exactly one `<h1>` owned by each page. Verified in the built output:
`h1=1` on `/`, `/turtle-haven`, `/book/turtle-haven` and `/faqs`.

## 2. No structured data — critical

72 of 74 pages emit **no JSON-LD at all**. The only structured data sitewide:

- homepage: `LocalBusiness` + `WebSite`
- the one blog post: `BlogPosting`

For a vacation-rental brand this forfeits every relevant rich result. Missing
entirely: per-home lodging markup, `FAQPage` (21 Q&As exist and none are
marked up), `BreadcrumbList`, `AggregateRating`, `Review`.

The live `LocalBusiness` block also models a multi-property brand as a single
address, which is inaccurate — the homes span Melbourne Beach and Indialantic.

Fixed in this repo: `components/JsonLd.tsx` emits `LodgingBusiness` (brand),
`WebSite`, `VacationRental` per home with occupancy and amenities,
`BreadcrumbList` on every nested route, and `FAQPage` on `/faqs`.

## 3. Two phone numbers — critical

| Surface | Value |
|---------|-------|
| Homepage JSON-LD `telephone` | `5087260695` |
| Visible footer / booking copy | `321-209-0495` |

`5087260695` is a Massachusetts area code on a Florida lodging business. Beyond
the NAP-consistency signal, a guest who copies the schema number reaches the
wrong line.

Confirmed correct number: **321-209-0495**. Fixed in this repo — every surface
reads `SITE.phone` from `content/site.ts`, so the two cannot drift again.

## 4. Page weight — high

| Metric | Uncompressed | Gzipped |
|--------|-------------:|--------:|
| Mean per page | 1,030 KB | 209 KB |
| Median | 968 KB | 201 KB |
| Heaviest (`/`) | 1,688 KB | 275 KB |
| Lightest | 349 KB | — |
| **Total, 74 pages** | **74.4 MB** | — |

The bulk is Wix's inline hydration state: **332 KB of inline `<script>` per
page on average**, plus 12.3 external scripts. Third-party JS on every page:
`static.parastorage.com` (Wix), `googletagmanager.com`, and
`browser.sentry-cdn.com` — a Sentry browser SDK shipping on all 74 marketing
pages is pure overhead.

Images are also the wrong formats: **2,772 PNG/JPG references against 53
WebP/AVIF**.

Measured result of the rebuild:

| Page | Live gzip | Rebuild gzip | Reduction |
|------|----------:|-------------:|----------:|
| `/` | 275 KB | 8.8 KB | **31×** |
| `/turtle-haven` | 243 KB | 7.5 KB | **33×** |
| `/book-turtle-haven` → `/book/turtle-haven` | 199 KB | 6.4 KB | **31×** |
| `/faqs` | 275 KB | 9.8 KB | **28×** |

## 5. Booking is client-injected — high

**There is not a single `<iframe>` in the server HTML of any of the 74 pages**,
including all seven `/book-*` pages. The Guesty widget arrives via a Wix
HtmlComponent that injects the frame after hydration.

Consequences, measured:

| Book page | HTML | Real words | JSON-LD |
|-----------|-----:|-----------:|--------:|
| `/book-beach-haven` | 942 KB | 122 | 0 |
| `/book-beach-street` | 945 KB | 130 | 0 |
| `/book-sea-haven` | 942 KB | 122 | 0 |
| `/book-shell-haven` | 942 KB | 122 | 0 |
| `/book-the-dunes` | 960 KB | 132 | 0 |
| `/book-the-florida-havens` | 946 KB | 125 | 0 |
| `/book-turtle-haven` | 942 KB | 122 | 0 |

Roughly **0.94 MB of HTML to deliver ~125 words** and a frame that has not
loaded yet. The guest sees near-empty page furniture at the exact moment they
have decided to book.

The fix is not to remove the iframe — Guesty owns that surface — but to stop
paying for it on first paint. `components/BookingMount.tsx` renders real trust
content immediately and mounts the widget on an explicit "Check availability"
click, sandboxed and lazy.

## 6. Guest-ops pages are indexable — high

**No page on the site emits a robots meta tag**, so all ~40 guest-operations
URLs (Wi-Fi, laundry, check-in/out, waste, emergency, parking, A/C, kitchen,
BBQ, TV, pool guides, house manuals) are fully crawlable on the marketing
domain.

This is index dilution — dozens of thin, near-duplicate internal-facing pages
competing with the pages meant to convert. Two are literal duplicates: the
Wi-Fi guides for both campuses share an identical meta description.

Per the ownership split, this content belongs to Media Haven. All 40 are 301'd
to the guest portal in `next.config.ts`.

## 7. Image alt text — high

| Measure | Count |
|---------|------:|
| Total `<img>` | 646 |
| Missing `alt` attribute | 0 |
| **Empty `alt=""`** | **351 (54%)** |
| Missing width/height | 245 |
| `loading="lazy"` | 409 |

Worth being precise here: the attribute is present everywhere, but empty on
over half. Empty `alt` is correct for decorative images — it is wrong for
hero photography and logos, which is what these are. On the homepage, **65 of
68 images have `alt=""`**, including the hero.

## 8–13. Remaining findings

- **Meta descriptions:** 51 of 74 exceed 160 characters. The homepage runs
  ~500 characters of stacked "Stay near…" phrases; Google renders roughly the
  first 155. One duplicate pair (the two Wi-Fi guides).
- **Dimensionless images:** 245 `<img>` without width/height → layout shift.
- **Heading hierarchy:** 40 pages jump from `<h2>` to `<h5>` with no `<h3>`.
- **Typo URL:** `/beach-strret-wifi-guide` is live and indexable.
- **No preconnect:** zero `rel=preconnect` across the whole site; only 1.1
  preloads per page on average.
- **Long titles:** 7 pages exceed 60 characters (longest 93). No duplicates —
  titles are otherwise the healthiest part of the site's SEO.

---

## What was already right

Worth keeping, not changing:

- **Per-property book URLs** (`/book-shell-haven`, …) — the correct pattern.
  Preserved as `/book/[slug]`.
- **Campus pages** (`/the-dunes`, `/beach-street`) — a genuinely good way to
  sell whole-compound stays.
- **Unique titles** on every page, no duplicates.
- **Canonical, robots.txt and sitemap all present** and broadly correct.
- **Apex → www over HTTPS**, HSTS set (`max-age=31556952`).
- **GA4** live (`G-3669F4QWXJ`) — reused in the rebuild so history continues.
- **Strong brand story and testimonials.** The content is the asset here; the
  markup around it is the problem.

---

## Corrections to the earlier external audit

Two figures from the 2026-07-26 pass should be restated:

1. **"Home images missing alt (~65/68)"** — the attribute is not missing. All
   646 images sitewide have an `alt` attribute; 351 are **empty**. The 65/68
   homepage count is right, the mechanism is empty-not-absent. It matters
   because the Wix fix is different (fill the field, not add it).
2. **`/stay-near-brevard-zoo-melbourne-beach-house` reading 349 KB / 0 words**
   was a throttled partial read by this crawler, not a broken page. Re-fetched
   directly: 1,034 KB with full copy, title and canonical intact. Not a bug.

One figure to reconcile: the guest-ops URL count. This crawl classifies **40**
strictly guest-ops URLs (plus 1 needing a manual call —
`/beach-street-shuttle-launches`, which reads as marketing content under an ops
naming convention). The earlier "~54" likely swept in amenities, meet-your-hosts
and guidebook pages. Full per-URL classification is in `URL-MATRIX.md`.

---

## Not verifiable from outside

State these as unknown rather than guessing:

- **Rankings, impressions, click-through** — needs Search Console. No ranking
  claim in this document.
- **Field Core Web Vitals** — needs CrUX/Search Console. The weight figures
  above are lab-measurable facts; LCP/INP/CLS in the wild are not.
- **Conversion rate on the book pages** — needs GA4 funnel access.
- **Existing Wix 301s** — the dashboard may already hold redirects this audit
  cannot see.
- **Lighthouse scores** — this environment's proxy blocks headless Chrome
  entirely (every host resets), and the keyless PageSpeed Insights quota was
  exhausted. Run PSI manually for the mobile baseline.
