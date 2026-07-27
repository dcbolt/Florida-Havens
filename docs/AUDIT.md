# thefloridahavens.com — technical audit

**Method:** complete census of every URL in the live Wix sitemap, 2026-07-26 —
**77 of 77 captured clean**. All figures below are measured from live server
HTML, not estimated.

An earlier pass reached only 74 of 77 (Wix rate-limiting) and the figures here
were revised upward once the census completed; the differences are noted where
they matter. Evidence: `backups/content-snapshot-2026-07-26.json.gz`.

Reproduce with `python3 tools/backup-live-site.py --stamp $(date +%F)`, then
`python3 tools/fill-snapshot-gaps.py` on the result — Wix throttles hard, and a
truncated read must be filled rather than believed (see the corrections section).

> **Scope note.** This audit measures what the public HTML exposes. Wix access
> arrived later the same day, which confirmed one inference and added one fact:
> the homepage `LocalBusiness` phone comes from Settings → Business Info (root
> cause of finding 3, now **fixed live**), and the installed-app list is
> Promote SEO, Wix Blog, Wix Forms, Wix Forms & Payments, Wix Invoices.
>
> Still not readable via any API — no endpoint exists: per-page SEO settings
> including `noindex`, the URL Redirect Manager, page element markup, and site
> revisions. Those remain editor work; see `WIX-P0-CHECKLIST.md`.

---

## Severity summary

| # | Finding | Severity | Evidence |
|---|---------|----------|----------|
| 1 | Nav labels are `<h1>` sitewide | **Critical** | **0 of 77** pages have exactly one `<h1>` |
| 2 | No structured data | **Critical** | 72 of 74 sampled pages carry zero JSON-LD |
| 3 | Host's personal cell published as the business phone | **Critical** | schema `5087260695` (Craig's cell) vs public `321-209-0495` |
| 4 | ~1 MB of HTML per page | **High** | mean **1,037 KB**; **77.9 MB** sitewide; lightest page still 942 KB |
| 5 | Booking widget is client-injected | **High** | 0 `<iframe>` in server HTML on all 7 book pages |
| 6 | Guest-ops pages fully indexable | **High** | 0 pages emit a robots meta tag |
| 7 | 54% of images have empty `alt` | **High** | **357 of 667** `<img>`; 65 of 68 on the homepage |
| 8 | Meta descriptions overflow | **Medium** | **53 of 77** exceed 160 chars; longest 294 |
| 9 | 245 images lack dimensions | **Medium** | layout-shift risk |
| 10 | Broken heading hierarchy | **Medium** | **41 of 77** pages use `<h5>` with no `<h3>` |
| 11 | Typo in a live URL | **Medium** | `/beach-strret-wifi-guide` |
| 12 | No `preconnect` anywhere | **Low** | 0 across all 74 pages |
| 13 | Titles over 60 chars | **Low** | 7 pages; longest 93 |
| 14 | **`/beach-street-check-in` serves The Dunes' check-in instructions** | **Critical — guest-facing** | the two check-in pages are identical except `<title>`: **37 of 38** text lines shared |
| 15 | Homepage hero is a **background video**, not an image | **Unquantified — likely High** | Strip-level video, 35% opacity over black; never appeared in any crawl, weight unmeasured |

---

## 15. The homepage hero is a video, and no measurement in this audit saw it

Found 2026-07-26 by the browser agent while doing alt text. It is not in any
earlier finding, and it should have been.

The homepage top section is a **Strip-level background video** at 35% opacity over
black — which is why it reads as near-solid black with the logo on top. The only
real `<img>` in that section is the logo, which already has alt text. The
empty-`alt` image the baseline flagged there is the **video's auto-generated
poster frame**.

### Why this is a gap, not a footnote

Every measurement in this document looked for `<img>` and `<iframe>`:

- The crawler counted `<img>` tags → **a `<video>` is invisible to it.**
- The image-payload measurement summed `static.wixstatic.com` **image** URLs →
  **video bytes were never counted.**
- Grok's embed-ratio hunt looked for third-party `<iframe src>` and concluded
  there was no third client-injected conversion surface. That conclusion stands
  for *iframes*, but a Strip background video is a **fourth media surface**
  neither of us had enumerated.

So the homepage's **6,856 KiB** measured transfer (P0.8 baseline) includes an
unknown and probably large video payload, and the **26.2 s LCP** on that page now
has an obvious candidate cause that was never on the list.

**This is the honest state: unquantified.** Do not assign it a byte figure until
someone measures the actual video request — Content-Length on the media URL, or
the video row in a PSI/DevTools network waterfall on `/`.

### On alt text specifically: leave it alone

A decorative background video's poster frame **should not** carry alt text —
empty is correct, and a screen reader should skip it. Wix exposes no
accessibility field for it in any case. This is not a defect and forcing it would
be wrong.

Swapping the video for a static image is a **performance** question, not an
accessibility one, and it changes how the homepage looks and behaves. That needs
Devin's explicit sign-off and should be decided on measured bytes, not on the alt
attribute that led us here.

---

## 14. A guest at Beach Street is reading The Dunes' check-in page

Found 2026-07-26 by the browser agent, working on P0.9, and confirmed against the
content snapshot. **This is not an SEO defect and it is the most serious thing in
this audit.**

`/dunes-check-in` and `/beach-street-check-in` are byte-identical apart from the
`<title>`. Both carry the heading *"Check-In to The Dunes (Turtle Haven and/or
Shell Haven)"* and both are 186 words:

```
lines: dunes=38  beach-street=38  shared=37
only on /dunes-check-in         : "The Dunes Check-In | The Florida Havens"
only on /beach-street-check-in  : "Beach Street Check-In | The Florida Havens"
```

So the *entire body* — arrival steps, timings, whatever access details it
contains — is The Dunes' content published under the Beach Street title. The two
campuses are different properties about eight miles apart, in different towns
(Melbourne Beach 32951 vs Indialantic 32903), with different houses.

**A guest arriving at Beach Street who opens their check-in link is reading
instructions for a house they are not staying in.**

### What this does and does not need

- **`noindex` does not fix it.** P0.3 removes the page from search; guests reach
  it from a link in their booking correspondence, not from Google. Doing P0.3
  first would make the defect *harder* to notice while leaving it fully live.
- **The rebuild does not fix it either.** `/beach-street-check-in` 301s to the
  guest portal, which relocates the page without correcting what it says.
- **It needs the real Beach Street check-in content**, which only Craig and Devin
  have. This is content authorship, not a markup fix, and by the Split it belongs
  to **Media Haven** — but the wrong content is live on the marketing domain
  today, so it is recorded here.

**Recommended:** treat as the top-priority item outside this repo. Until it is
corrected, the Beach Street check-in link should not be sent to guests.

### It is an outlier, not the house style — which is what makes it a real miss

`tools/dupe-pages.py` now scans every page pair, dropping site chrome first
(any line on 5+ pages). Across the snapshot, **11 Beach-Street/Dunes sibling
pairs share ≥80% of their body copy** — unsurprising for one operator writing in
one voice.

But **9 of those 11 carry genuine per-campus differences**, which is the point:

| Pair | Differentiated by |
|---|---|
| emergency guide | **street addresses** — `135 & 145 Beach St, Melbourne FL 32903` vs `4225 & 4227 S Hwy A1A Melbourne Beach FL 32951` |
| pool & spa | quiet hours **9 PM** vs **10 PM**; Dunes adds spa-cycle heating notes and a service-fee warning |
| house guide | Dunes carries the full documented-allergy / Chapter 509 pet policy; Beach Street carries a one-line version |
| sea turtle guide | different opening paragraphs — Indialantic nesting density vs national reserve |
| beach rules, BBQ, A/C, amenities | per-campus equipment and item lists |

So the operator does differentiate these pages, deliberately and in detail.

**Exactly two pairs differ in nothing but the `<title>`:**

| Pair | Body difference | Harmful? |
|---|---|---|
| `/dunes-laundry-guide` ↔ `/beach-street-laundry-guide` | none | Probably not — washer/dryer instructions may legitimately be identical |
| `/dunes-check-in` ↔ `/beach-street-check-in` | none | **Yes** — the shared body names The Dunes' houses explicitly |

That is the distinction that matters. Identical laundry copy is plausible.
Identical check-in copy is not, because the text says *"Check-In to The Dunes
(Turtle Haven and/or Shell Haven)"* — it names the wrong houses, on the wrong
campus, in the wrong town.

> Worth noting how it surfaced: nobody was looking for it. It was visible only
> because the agent read the page it was editing instead of going straight to the
> element it had been sent for. The sitewide scan that generalises the check now
> exists (`tools/dupe-pages.py`), and its real value is the comparison above —
> a raw similarity number would have flagged all 11 pairs and buried the one
> that counts.

---

## 1. Nav labels are `<h1>` — critical

Wix renders the seven main nav items as `<h1>` elements on every page:

```
HOME · ABOUT · PROPERTIES · BOOK YOUR STAY · LOCAL ATTRACTIONS ·
GUEST RESOURCES · CONTACT
```

Measured `<h1>` count across all **77** pages:

| `<h1>` per page | Pages |
|---:|---:|
| 7 | 20 |
| 8 | 46 |
| 9 | 9 |
| 10 | 1 |
| 12 | 1 |

**Zero pages have exactly one `<h1>`.** The earlier partial crawl showed one page
with 0 — that was a truncated read, not a page without headings. Every page therefore declares its
primary topic as the navigation menu rather than its actual subject. This is
the single highest-leverage fix on the site and it is a styling change, not a
content change — the nav can look identical.

> ### Scope limit: this census is the desktop variant
>
> Every count above was taken with a **desktop user-agent** and no JavaScript.
> Work in the Studio editor on 2026-07-26 established that Desktop and Mobile are
> **structurally different widgets** — `Hamburger Menu Container` vs
> `Mobile Menu Box`, each with its own independent text elements, and not even the
> same item list (Mobile has six at top level; `BOOK YOUR STAY` is nested).
>
> Two facts bound the question. The desktop fetch returned exactly **7** `<h1>`,
> and after fixing only the seven Desktop labels the live homepage returns **0**.
> If the Mobile widget's labels were `<h1>` in that same server response, the
> original count would have been 13. So either Wix serves breakpoint-specific
> markup, or the Mobile labels are not `<h1>`.
>
> **This matters because Google crawls mobile-first.** If mobile markup carries
> its own nav `<h1>`s, the fix is only half done for the crawler that counts. The
> deciding measurement — a mobile-UA fetch of the published site — is Task 1d of
> [`BROWSER-AGENT-BRIEF.md`](BROWSER-AGENT-BRIEF.md) and is **not yet done**. Do
> not describe P0.1 as complete until it is.

**Status on the live site: substantially fixed, 2026-07-26.** All seven nav
labels are now `<p>` at 35 px, and the seven pages that had no heading of their
own were given one. Verified server-side as **Googlebot-smartphone**, which is
the crawler that matters:

| Page | `<h1>` | Text |
|---|---:|---|
| `/` | 1 | Welcome to The Florida Havens |
| `/turtle-haven` | 1 | WELCOME TO TURTLE HAVEN |
| `/shell-haven` | 1 | WELCOME TO SHELL HAVEN |
| `/beach-haven` | 1 | WELCOME TO BEACH HAVEN |
| `/sea-haven` | 1 | WELCOME TO SEA HAVEN |
| `/the-dunes` | 1 | WELCOME TO "THE HAVENS AT THE DUNES" |
| `/beach-street` | 1 | WELCOME TO "THE HAVENS AT BEACH STREET" |
| `/about`, `/faqs`, `/properties` | 1 | already had one; nav removal fixed them |

The **46 pages that carried 8** are corrected by the nav change alone — roughly
60% of the site — and the four pages with extra headings remain (§1c of the
brief). Mobile needed no separate fix: **Task 1d closed negative**, confirmed
both from a mobile viewport and by server fetch under a Googlebot-smartphone UA.

> **UA branching is real on this site**, which is worth knowing for any future
> measurement: the same URL returns different markup per user-agent — homepage
> 1,720 KB desktop, 1,470 KB mobile, 1,312 KB Googlebot-smartphone. Byte figures
> elsewhere in this audit are the **desktop** variant.

> **Counting caveat.** `grep -o '<h1' | wc -l` counts raw substrings, and Wix
> inlines page content as JSON, so `<h1` can occur inside a `<script>` blob. On
> `/guest-blog` that method reported 3 where parsed elements were 2. The census
> tables in this document come from **paired-element parsing**
> (`<h1…>…</h1>`) in `tools/backup-live-site.py`, not from `grep`, so they are
> unaffected — but treat any `grep`-derived count as an upper bound.

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

## 3. Host's personal cell published as the business phone — critical

| Surface | Value | What it actually is |
|---------|-------|---------------------|
| Homepage JSON-LD `telephone` | `5087260695` | **Craig's personal cell** — the direct host line |
| Visible footer / booking copy | `321-209-0495` | The Havens' business number, forwarded to Craig's cell |

Devin confirmed the distinction. That makes this more than a NAP-consistency
problem: the site was publishing a host's personal mobile number as the
business's canonical `telephone` in machine-readable structured data, where
scrapers and aggregators pick it up and it is effectively impossible to recall.
Both numbers reach Craig, so nothing was broken for guests — the exposure was
the issue.

The business number is the correct public value because it is a forwarding
number: it can be re-pointed without reprinting the web.

**FIXED on the live site, 2026-07-26** (P0.2). Wix auto-generates the homepage
`LocalBusiness` JSON-LD from Settings → Business Info, so the root cause was the
Site Properties `phone` field. Updated via the Site Properties API with the
field mask restricted to `phone`; verified live:

```
telephone -> 321-209-0495     (homepage JSON-LD)
5087260695                    -> no occurrences on /, /contact,
                                 /book-the-florida-havens, /faqs
```

In this repo every surface reads `SITE.phone` from `content/site.ts`, so the two
cannot drift again.

## 4. Page weight — high

| Metric | Uncompressed | Gzipped |
|--------|-------------:|--------:|
| Mean per page | **1,037 KB** | ~209 KB |
| Median | 970 KB | ~201 KB |
| Heaviest (`/`) | 1,688 KB | 275 KB |
| **Lightest** | **942 KB** | — |
| **Total, 77 pages** | **77.9 MB** | — |

The lightest figure is the one worth pausing on: **no page on this site is under
942 KB.** There is no light page to point at — the floor is the problem, not the
outliers. (An earlier pass reported a 349 KB minimum; that was a truncated
read, not a lean page.)

The bulk is Wix's inline hydration state: **332 KB of inline `<script>` per
page on average**, plus 12.3 external scripts. Third-party JS on every page:
`static.parastorage.com` (Wix), `googletagmanager.com`, and
`browser.sentry-cdn.com` — a Sentry browser SDK shipping on all 74 marketing
pages is pure overhead.

Images are also the wrong formats: **2,772 PNG/JPG references against 53
WebP/AVIF**. That is a count of *references in the markup*, not bytes — but the
bytes have now been measured too, and they change the priority order of this
whole audit.

### The images outweigh the HTML by 20–50× (measured 2026-07-26)

Grok fetched every `static.wixstatic.com` URL referenced in the HTML and summed
the actual response `Content-Length`, grouped by response `Content-Type`
(`docs/tfh-metrics/image-payload-2026-07-26.json` in the media-haven repo):

| Page | Refs | Fetched | Image bytes | Delivered as | HTML, uncompressed |
|---|---:|---:|---:|---|---:|
| `/` | 29 | 29/29 | **35,287,937 B** (35.3 MB) | PNG 35.28 MB (23 files) · JPEG 4 KB (5) | 1,688 KB |
| `/turtle-haven` | 86 | 80/86 | **≥70,674,136 B** (70.7 MB) | JPEG 70.57 MB (76) · PNG 0.10 MB (3) | 1,302 KB |
| `/book-turtle-haven` | 11 | 11/11 | **4,524,465 B** (4.5 MB) | PNG 4.52 MB (8) · JPEG 1.7 KB (2) | 942 KB |

So on `/turtle-haven` the referenced media is roughly **54× the weight of the
~1 MB HTML shell** that finding 4 is about. The HTML bloat is real and worth
fixing, but it is not the dominant cost on the live site — the images are.

**The format claim is now measured, not inferred.** Delivered `Content-Type` is
overwhelmingly `image/jpeg` and `image/png`: Wix is **not** transcoding these
asset URLs to WebP/AVIF. The reference count was directionally right about the
cause; it just could not size it.

> **Two caveats, and they matter.** (1) These are the asset URLs **as referenced
> in the markup**. A browser requests Wix resize/quality variants of those URLs,
> so real transfer is lower — treat these as an **upper bound**, not page weight.
> The true figure comes from the PSI "total transfer size" in P0.8. (2) Grok's
> table mixes units — its per-page total is MiB while its per-format split is
> decimal MB, which is why 33.65 and 35.28 appear for the same homepage number.
> The bytes above are authoritative; both derived figures are correct in their
> own unit. Do not "fix" one against the other.
>
> `/turtle-haven` is **80 of 86** refs, so 70.7 MB is a floor.

**Consequence for the live-site work:** P0.6 (duplicate gallery slides) and image
sizing are worth materially more than their position in
`WIX-P0-CHECKLIST.md` suggests — 86 media references on a single property page,
delivered as full-size JPEG, is the largest single lever on live mobile
performance. P0.1 is still first: it is an indexing defect, not a speed one, and
the two do not compete.

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

**This is a pattern, not a one-off.** `/turtle-haven-virtual-tour` behaves
identically: 972 KB of HTML, and a search of the raw response for every common
tour provider (Matterport, Kuula, Cupix, iGuide, YouTube, Vimeo) returns **zero
hits**. The tour is injected client-side too. So the site's two strongest
conversion assets — the booking engine and the virtual tour — are both invisible
to crawlers and both cost a full page load before they appear.

It also means neither embed URL can be recovered from the HTML. Both have to come
out of the Wix editor; see `WIX-P0-CHECKLIST.md`.

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
| Total `<img>` | **667** |
| Missing `alt` attribute | 0 |
| **Empty `alt=""`** | **357 (54%)** |
| Missing width/height | 245 (of the 74-page sample) |
| `loading="lazy"` | 409 (of the 74-page sample) |

Worth being precise here: the attribute is present everywhere, but empty on
over half. Empty `alt` is correct for decorative images — it is wrong for
hero photography and logos, which is what these are. On the homepage, **65 of
68 images have `alt=""`**, including the hero.

## 8–13. Remaining findings

- **Meta descriptions:** **53 of 77** exceed 160 characters. The homepage runs
  ~500 characters of stacked "Stay near…" phrases; Google renders roughly the
  first 155. One duplicate pair (the two Wi-Fi guides).
- **Dimensionless images:** 245 `<img>` without width/height → layout shift.
- **Heading hierarchy:** **41 of 77** pages jump from `<h2>` to `<h5>` with no `<h3>`.
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

   Worth dwelling on, because that single bad read polluted **three** separate
   figures in the first draft: it invented a page with "0 `<h1>`", it set a false
   349 KB floor for page weight, and it appeared as the site's thinnest page. One
   silent truncation, three wrong conclusions — and each looked plausible on its
   own. `tools/backup-live-site.py` now flags any response under 400 KB as
   `suspect_truncated` instead of recording it as fact, and
   `tools/fill-snapshot-gaps.py` refetches those until the census is complete.
   Any figure in this document derives only from the 78 clean captures.

3. **The census said 78 pages; there are 77.** `tools/backup-live-site.py` did
   not normalise trailing slashes, and the live sitemap lists the homepage
   *without* one — so adding `BASE + "/"` produced two entries for the same page.
   Every sitewide total in the first version of this document was inflated by one
   homepage: **79.6 MB → 77.9 MB**, **422/735 empty alts → 357/667**, h5-without-h3
   42 → 41.

   Two things worth noting. First, I had already fixed this exact normalisation
   bug in `tools/phone-audit.py` and never back-ported it — the fix existed, in the
   wrong file. Second, the empty-alt *percentage* was **54% all along**; my earlier
   "correction" from 54% to 57% moved it away from the truth by counting the
   homepage's 68 images twice. Grok's independent count of 76 pages-sitemap URLs
   (+1 blog post = 77) was right, and my insistence on 78 was the error.

4. **Finding 3 was mischaracterised** as "the wrong number". Both numbers reach
   the host: `5087260695` is his personal cell, `321-209-0495` the business
   forwarder. Nothing was broken for guests — the defect was publishing a
   personal mobile as canonical machine-readable business contact. Corrected in
   §3.

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
