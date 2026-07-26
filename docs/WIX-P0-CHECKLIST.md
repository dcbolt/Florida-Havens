# Wix P0 checklist — click by click

Everything here applies to the **live Wix site** and is independent of the
rebuild in this repo. Do these now; they pay off immediately and they carry
over to the new site.

**Status as of 2026-07-26:** Wix access is now live (Partner account, site
`6622db1b-c256-485d-9468-5b9d3ac43561`).

**P0.2 is DONE and verified live.** The rest cannot be automated — see
"What the Wix REST API can and cannot reach" below. They are real editor work.

| Item | Status |
|---|---|
| P0.1 nav H1 | **Manual** — no API for page element markup |
| P0.2 phone | **✅ DONE 2026-07-26**, verified live |
| P0.3 noindex guest-ops | **Manual** — no per-page SEO API |
| P0.4 301 typo slug | **Manual** — no URL-redirect API |
| P0.5 alt text | **Manual** — editor content |
| P0.6 gallery dupes | **Manual** — editor content |
| P0.7 book page order | **Manual** — editor content |
| P0.8 PSI baseline | **Devin/Grok** — blocked in this sandbox |

Ordered by return on effort. **P0.1 is worth more than the rest combined.**

---

## What the Wix REST API can and cannot reach

Checked against the live API spec, not assumed. This determines what can be
automated on future passes, so it is worth recording precisely.

**Reachable:**
- Site Properties (business info: phone, email, address, locale, currency) —
  this is what made P0.2 automatable
- `robots.txt`, `ads.txt`, `llms.txt` contents
- SEO User Config — site-level only: URL-hierarchy flattening, and whether
  non-existent pages return a real 404 or a soft 200
- CMS collections, Blog posts, Forms, Media Manager

**Not reachable — no endpoint exists:**
- **Per-page SEO settings**, including the `noindex` toggle (blocks P0.3)
- **URL Redirect Manager / 301s** (blocks P0.4). The only "Redirects" resource
  in the spec is Wix Headless *redirect sessions* — checkout/auth handoffs, an
  unrelated feature.
- **Page element markup**, so no way to change a heading tag (blocks P0.1) or
  set image `alt` on page elements (blocks P0.5)
- **Gallery contents** on a page (blocks P0.6), page layout (blocks P0.7)
- **Site revisions / backup / restore.** The only `Backups` resource is
  CMS-collection scoped. Site History is dashboard-only.

### A note on P0.3 and robots.txt

The Robots.txt API *is* writable, so `Disallow:` rules for the ~40 guest-ops
paths could be pushed automatically. **That was deliberately not done, because
it would make the problem worse.**

These URLs are already indexed. `Disallow` blocks crawling, and Google cannot
act on a `noindex` it is not allowed to fetch — so already-indexed URLs can sit
in the index indefinitely, often as a bare title with "no information
available". To *remove* a URL you want the opposite: keep it crawlable and serve
`noindex` until Google drops it.

So P0.3 stays a manual dashboard job. Blanket-disallowing would look like
progress while entrenching the bloat.

---

## P0.1 — Stop rendering nav labels as `<h1>`

**Why:** 0 of 74 pages have a single `<h1>`. Every page tells Google its topic
is "HOME ABOUT PROPERTIES…". See `AUDIT.md` §1.

**This is a text-style change. The nav will look exactly the same.**

1. Open the **Wix Editor** → click the header → **Edit Menu**.
2. For each of the seven items, select the text and open the text panel
   (**A** icon).
3. In the **Theme / Text style** dropdown it will currently read **Heading 1**.
   Change it to **Paragraph 2** (or any Paragraph style).
4. The text will resize. Do **not** accept that — click **Design → Customize**
   and set the font back to the original: **Cormorant Garamond, 35 px**, letter
   spacing `0.05em`, same colour. Visually identical, semantically correct.
5. Repeat on the **mobile** editor view (Wix keeps separate mobile styles).
6. **Publish**, then verify:
   ```
   curl -s https://www.thefloridahavens.com/ | grep -o '<h1' | wc -l
   ```
   Expect **1**, not 7.

Then give each page one real `<h1>`: on every page, select the main headline
(e.g. "WELCOME TO TURTLE HAVEN") and set it to **Heading 1**.

### RESOLVED 2026-07-26: the Menu-component risk does not apply

This was the open question that decided whether P0.1 was even attemptable.
**Answered from the live HTML — no editor needed. They are Text elements, so
P0.1 is editable.**

Each nav label renders as:

```html
<h1 class="font_0 wixui-rich-text__text" style="font-size:35px;">
  <a href="https://www.thefloridahavens.com/about" target="_self" …>
    <span …>ABOUT</span>
```

`wixui-rich-text__text` is the Wix **Text** component, and `font_0` is the
theme's Heading 1 style. So each item is an individual Text element whose style
you can change — not a menu component with a locked tag.

The page does also contain `StylableHorizontalMenu` markup (64 references),
almost certainly the **mobile** menu or a secondary strip. That one may well be
a real component with a locked tag — but it is *not* where the seven `<h1>`s
come from. Check the desktop header first; it is the whole problem and it is
editable.

### Exact styling to restore (measured, not guessed)

After switching the style away from Heading 1, the text will resize. Restore
these values via **Design → Customize** and the nav will be pixel-identical:

| Property | Value |
|---|---|
| Theme style (current) | `font_0` — Heading 1 |
| Font family | `cormorantgaramond-semibold`, fallback `cormorant garamond, serif` |
| Font size | **35 px** |
| Letter spacing | **0.05em** |
| Weight | **bold** |
| Colour | theme `color_38` |

Verify afterwards with the `grep -o '<h1' | wc -l` check above, and confirm the
computed font-size is still 35 px in devtools.

---

## P0.2 — One phone number: 321-209-0495 — ✅ DONE 2026-07-26

**What this actually was:** `5087260695` is **Craig's personal cell** (the
direct host line). `321-209-0495` is the Havens' business number, which forwards
to that cell. Both reach Craig — so nothing was broken for guests. The problem
was that a personal mobile was published as the business's canonical
`telephone` in machine-readable structured data, where aggregators and scrapers
pick it up and it cannot practically be recalled.

The business number is the right public value on both counts: it keeps the
personal cell private, and being a forwarding number it can be re-pointed later
without reprinting the web.

**Root cause:** Wix auto-generates the homepage `LocalBusiness` JSON-LD from
Settings → Business Info. The `phone` field there held the cell — so this was
one field, not a schema edit.

**Executed** via the Site Properties API with the field mask restricted to
`phone`, so email, address, locale and currency could not be touched:

```
POST https://www.wixapis.com/site-properties/v4/properties/business-contact
{ "businessContact": { "phone": "321-209-0495" },
  "fields": { "paths": ["phone"] } }
```

**Verified live** (properties version 25):

```
telephone -> 321-209-0495     homepage JSON-LD
5087260695                    0 occurrences on /, /contact,
                              /book-the-florida-havens, /faqs
```

> Gotcha for next time: `GetSiteContext` served the stale `5087260695` for
> minutes after the write succeeded. Verify against
> `GET /site-properties/v4/properties`, not the context tool.

**Still worth doing manually:** check **Google Business Profile** and any
directory listings for the 508 number. Off-site NAP matters more than the
on-site value, and it is outside what the site API can reach.

Revert procedure: `backups/RESTORE.md`. Note that reverting re-publishes
Craig's personal cell.

---

## P0.3 — `noindex` the guest-ops pages

**Why:** ~40 thin internal-facing pages are fully indexable and diluting the
index. No page on the site currently emits a robots meta tag.

For each URL in the **GUEST-OPS** section of `URL-MATRIX.md`:

1. **Editor → Pages panel** → click the page → **SEO Basics** (or
   **Dashboard → SEO → Site Pages**).
2. Toggle **"Show this page in search results"** → **OFF**.
3. Confirm the panel shows `noindex`.

Faster route if you have many: **Dashboard → SEO → Site Pages** lists every
page with an indexing toggle in one table — do them in one pass.

Verify after publish:
```
curl -s https://www.thefloridahavens.com/dunes-wifi-guide | grep -i 'noindex'
```

> Do **not** delete these pages yet. Guests may hold live links. `noindex`
> first; retire only once the Media Haven portal is serving that content.

---

## P0.4 — Fix the typo URL

`/beach-strret-wifi-guide` ("strret") is live and indexed.

1. **Editor → Pages → that page → SEO Basics → URL slug** → correct to
   `beach-street-wifi-guide`.
2. Wix normally offers to auto-create a redirect — **accept it**. If not:
   **Dashboard → SEO → URL Redirect Manager → + New Redirect**
   - Old: `/beach-strret-wifi-guide`
   - New: `/beach-street-wifi-guide`
   - Type: **301**
3. Then apply P0.3 (`noindex`) to the corrected page.

---

## P0.5 — Alt text on heroes and logos

**Why:** 351 of 646 images have `alt=""`. On the homepage, 65 of 68 — including
the hero.

The attribute exists; the field is blank. In Wix:

1. Click an image → **Settings** (gear) → **"What's in the image? Tell Google"**.
2. Write what is actually shown, including place where natural. Not
   `"IMG_2841"`, not `"luxury vacation rental Melbourne Beach Florida"`.
   Good: `"Turtle Haven pool deck at sunset overlooking the Atlantic"`.
3. Prioritise, in order: homepage hero, each property hero, the logo, gallery
   covers. You do not need all 351 — the ~30 that carry meaning.
4. **Leave `alt` empty on genuinely decorative images** (dividers, background
   textures). Empty is correct there; a screen reader should skip them.

---

## P0.6 — Trim duplicate gallery slides

Several Pro Gallery instances repeat the same 3 images multiple times, inflating
page weight with no editorial gain.

1. Click the gallery → **Manage Media**.
2. Remove exact duplicates.
3. While there: **Settings → Loading behaviour → Lazy load / progressive**.

---

## P0.7 — Book pages: trust content above the embed, widget lazy

**Why:** the seven `/book-*` pages ship ~0.94 MB of HTML to deliver ~125 words,
and the Guesty frame is injected client-side so there is nothing to read while
it loads.

1. **Editor → each `/book-*` page.** Above the HtmlComponent, add a short strip:
   one photo of that house, its name as the page's `<h1>`, and three trust
   lines — *"Best rate, direct — no platform fee"*, *"You're talking to the
   owners"*, *"Genuinely beachfront"*.
2. Add a real paragraph of copy naming the house and location. 125 words is too
   thin to rank for `book <house name>`; aim for 250–350.
3. **Lazy-load the widget.** Wix cannot defer an HtmlComponent natively, so
   either:
   - move the embed **below the fold** so the browser deprioritises it, or
   - replace it with a **"Check availability" button** that links to the Guesty
     booking URL directly (fewest moving parts, fastest page), or
   - keep the embed but strip everything decorative around it.
4. Set a proper title/description per book page — they currently inherit
   generic copy.

This is the pattern already implemented in `components/BookingMount.tsx` if you
want to see the target behaviour.

---

## P0.8 — PSI baseline (do this first, actually)

Capture the "before" so the wins are provable. This session could not: the
sandbox proxy blocks headless Chrome outright and the keyless PageSpeed
Insights quota was exhausted.

Run **mobile** PSI on <https://pagespeed.web.dev/> and save the scores for:

- `https://www.thefloridahavens.com/`
- `https://www.thefloridahavens.com/turtle-haven`
- `https://www.thefloridahavens.com/book-turtle-haven`
- `https://www.thefloridahavens.com/faqs`

Record LCP, INP, CLS, TBT and total byte weight. Do it **before** P0.1–P0.7.

---

## Access still needed

| Access | Unlocks |
|--------|---------|
| **Wix collaborator** (Editor + SEO + Apps) | Everything above, executed and verified |
| **Google Search Console** | Index bloat confirmation, real queries, field CWV — and the only honest source for any ranking claim |
| **GA4** (viewer) | Whether the book pages actually convert |
| **Guesty** listing IDs / widget URLs | Wire `BookingMount` to live availability |

---

## Deliberately not doing

- **Rebuilding guest house manuals here.** Wi-Fi, laundry, check-in and house
  guides belong to Media Haven. They are 301'd out, not re-homed.
- **A visual redesign.** The brand and story are the strongest part of the
  site. Every fix above is structural — the site should look the same when
  they land.
- **Claiming ranking impact.** No Search Console access, no ranking claims.
