# Wix P0 checklist — click by click

Everything here applies to the **live Wix site** and is independent of the
rebuild in this repo. Do these now; they pay off immediately and they carry
over to the new site.

No Wix collaborator access was granted for this pass, so these are written as
instructions rather than reported as done. Grant Editor + SEO + Apps access and
they can be executed directly.

Ordered by return on effort. **P0.1 is worth more than the rest combined.**

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

> Wix caveat: if the menu is a **Wix Menu component** rather than a text
> element, the tag is controlled by the component and may not be editable. If
> so, replace the header menu with a **horizontal text-link strip**, or accept
> it and prioritise the rebuild — this bug alone justifies the migration.

---

## P0.2 — One phone number: 321-209-0495

**Why:** the homepage JSON-LD publishes `5087260695` (a Massachusetts area
code) while the visible site uses `321-209-0495`.

1. **Wix Dashboard → Settings → Business Info → Phone.** Set to
   `321-209-0495`. This is what feeds the auto-generated `LocalBusiness` schema.
2. **Editor → footer** — check the number in every footer variant, desktop and
   mobile.
3. Check the **book pages** and **contact page** for hardcoded text numbers.
4. If a **custom JSON-LD** block was added manually: **Dashboard → SEO → SEO
   Tools → Structured Data Markup**, and fix `telephone` there too.
5. Publish and verify:
   ```
   curl -s https://www.thefloridahavens.com/ | grep -o '5087260695'
   ```
   Expect **no output**.

Also update Google Business Profile if it carries the 508 number — NAP
consistency matters more than the on-site value.

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
