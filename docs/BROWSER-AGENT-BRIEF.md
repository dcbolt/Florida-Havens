# Brief for the in-browser agent (Wix Studio)

**Paste everything below the line into the Claude sidebar in the Wix dashboard.**

This is written for an agent that can see and click the Wix Studio UI, which this
repo's session cannot. Everything here has already been measured against the live
site — the numbers are facts, not estimates. The agent's job is execution and
verification, not re-diagnosis.

Companion docs, for a human reading this repo: [`WIX-DO-FIRST.md`](WIX-DO-FIRST.md)
(the 15-minute version), [`WIX-P0-CHECKLIST.md`](WIX-P0-CHECKLIST.md) (full
reference), [`AUDIT.md`](AUDIT.md) (evidence).

> **Two things changed from the earlier docs.** The dashboard is **Wix Studio**,
> not the classic Editor those docs assumed, so click paths differ — and Studio
> separates a text element's *HTML tag* from its *visual style*, which makes the
> main fix far safer than described there. Also, **Google Search Console data is
> visible in this dashboard**, which unblocks a baseline previously recorded as
> unavailable.

---

## SITE
The Florida Havens — <https://www.thefloridahavens.com>
Wix Studio site `6622db1b-c256-485d-9468-5b9d3ac43561`

## WHAT YOU ARE DOING
Executing six already-diagnosed SEO/privacy fixes in the Wix Studio editor and
dashboard. Every finding below was measured on 2026-07-26 against the live HTML
of all 77 pages. You do not need to re-audit anything. Do the work, verify it,
report what you actually observed.

## THE FIVE RULES

1. **Create the Site History restore point before you touch anything.** Task 0.
   Wix has no backup API; this is the only rollback that covers editor changes.
2. **Do not change the look of the site.** Every task here is structural or a
   link target. If a change makes something visibly different — different font,
   size, colour, spacing, position — you have done it wrong. Stop and report.
3. **Report what you saw, not what you expected.** If a panel, toggle or menu
   item is not where this brief says it is, say so and describe what is actually
   there. Do not force a path that looks close. Do not guess at a value.
4. **Never edit anything under Settings → Business Info.** The phone field there
   is already correct and was fixed via API. Changing it re-publishes a private
   mobile number.
5. **Publish per task, not all at once**, and only after that task's in-editor
   check passes. Publishing 6 tasks blind makes a regression impossible to
   attribute.

## FACTS YOU WILL NEED (do not substitute your own)

| Fact | Value |
|---|---|
| Public business phone | **321-209-0495** — use this everywhere |
| Number that must NOT appear anywhere public | **508-726-0695** (the host's personal cell) |
| Nav font (to restore if needed) | Cormorant Garamond SemiBold · **35 px** · letter-spacing **0.05em** · weight **Bold** · theme colour **`color_38`** |
| Pages on the site | 77 |
| Pages with exactly one `<h1>` today | **0** |

---

# TASK 0 — Restore point and baselines (do this first, ~5 min)

### 0a. Site History restore point
1. **Edit Site** (top right of the dashboard) to open the Studio editor.
2. Open the main menu (the Wix logo / hamburger, top-left) → look for
   **Site History** or **Revisions**.
3. **Star / label the most recent existing save.** Site History does *not* let
   you force a new save-point independent of autosave — clicking **Save** does
   nothing when there are no unsaved edits, so labelling the current entry is the
   correct mechanism, not a workaround.
4. **Report the exact timestamp and label of that revision.** A rollback target
   nobody wrote down is not a rollback target.
5. **If that revision predates 2026-07-26, say so.** The P0.2 phone fix was made
   on that date through the Site Properties API — a different subsystem from
   editor revisions. Restoring an older revision may re-publish the host's
   personal cell, so the rollback procedure needs a phone re-check bolted onto
   it.

### 0b. Search Console baseline — capture BEFORE any change
The dashboard home shows **"Search Performance on Google"**. This is the only
honest source of ranking/impression data for this site and it has never been
recorded. Before publishing anything:

1. Open the Search Performance card and expand it to the fullest view available.
2. Transcribe, for the **longest date range offered**: total impressions, total
   clicks, and every query row with its impression count.
3. Note the date range you captured.

Known visible rows to confirm or correct: `the florida havens` (13 impressions),
`5 sheridan street beach haven`, `801 sea haven`.

### 0c. PageSpeed baseline — capture BEFORE any change
Once Task 1 publishes, the "before" is gone permanently. In a new tab, run
**mobile** PageSpeed Insights at <https://pagespeed.web.dev/> on each of:

- `https://www.thefloridahavens.com/`
- `https://www.thefloridahavens.com/turtle-haven`
- `https://www.thefloridahavens.com/book-turtle-haven`
- `https://www.thefloridahavens.com/faqs`

Record **Performance score, LCP, INP (or TBT), CLS, and total transfer size** for
each. Four numbers on four URLs. Do not skip this because it is boring — it is
the only proof the rest of the work helped.

**Do not proceed to Task 1 until 0a, 0b and 0c are captured.**

---

# TASK 1 — The nav `<h1>` fix (the single highest-value change on the site)

## The problem, measured
Wix renders **all seven navigation labels as `<h1>` on every single page**. So
every page on the site tells Google its subject is:

> *HOME ABOUT PROPERTIES BOOK YOUR STAY LOCAL ATTRACTIONS GUEST RESOURCES CONTACT*

Measured across 77 pages: **20 pages have 7 `<h1>`s, 46 have 8, nine have 9, one
has 10, one has 12. Zero have exactly one.** Fixing this is worth more than
everything else in this brief combined.

Confirmed from the live HTML: these are Wix **Text** elements, not a locked menu
component — each renders as
`<h1 class="font_0 wixui-rich-text__text" style="font-size:35px;">`. `font_0` is
the theme's Heading 1 style. **They are editable.**

## 1a. Change the nav labels' tag — try the safe path first

Wix Studio separates a text element's **HTML tag** from its **visual style**.
This is the important difference from the classic editor.

1. In the editor, click the header, then click into the **HOME** nav label until
   the individual text element is selected.
2. Open the text settings panel and look for a **tag / HTML tag / SEO tag**
   selector — a dropdown that reads **H1** and offers `H1…H6` and `P` /
   `Paragraph`. In Studio this usually sits in the text panel near the style
   preset, sometimes behind an **SEO** or **Advanced** subsection or a small
   `</>` icon.
3. **If that tag selector exists: set it to `P` (Paragraph) and leave the visual
   style untouched.** This is the whole fix, with zero visual change and nothing
   to restore. Confirm the label still looks identical, then do the same for the
   other six.

**Only if there is no separate tag selector**, fall back to changing the style
preset from **Heading 1** to **Paragraph 2** — and then the text *will* resize, so
immediately restore, via **Design → Customize** (or the text panel's custom
settings):

| Property | Value |
|---|---|
| Font | Cormorant Garamond SemiBold |
| Size | **35 px** |
| Letter spacing | **0.05em** |
| Weight | Bold |
| Colour | theme `color_38` (whatever it already had — do not pick a new one) |

These are measured from the live site, so matching them is pixel-identical.

All seven labels: **HOME · ABOUT · PROPERTIES · BOOK YOUR STAY · LOCAL
ATTRACTIONS · GUEST RESOURCES · CONTACT**

**Breakpoints:** Studio uses responsive breakpoints (Desktop / Tablet / Mobile)
rather than a separate mobile editor. The HTML tag is a property of the element
and should carry across breakpoints, but **text styling can be overridden per
breakpoint**. So: switch to Tablet and Mobile, confirm each label still renders
at the right size and, if you had to use the fallback style path, re-apply the
values there too. **Report whether the tag change carried across breakpoints or
had to be repeated** — that is genuinely useful to know.

There is also `StylableHorizontalMenu` markup on the page (64 references),
probably the mobile menu or a secondary strip. It is **not** the source of the
seven `<h1>`s. If it turns out to be a locked component with a fixed tag, leave
it and say so.

## 1b. Give each page exactly one real `<h1>`

After 1a there will be pages with **zero** `<h1>`. Promote the existing main
headline on each — do not write new copy, do not move anything. Just change the
tag/style of the headline that is already there.

**Seven pages need an `<h1>` promoted** (they currently have none of their own):

| Page | Promote this existing heading to `<h1>` |
|---|---|
| `/` | `Welcome to The Florida Havens` |
| `/turtle-haven` | `WELCOME TO TURTLE HAVEN` |
| `/shell-haven` | `WELCOME TO SHELL HAVEN` |
| `/beach-haven` | `WELCOME TO BEACH HAVEN` |
| `/sea-haven` | `WELCOME TO SEA HAVEN` |
| `/the-dunes` | `WELCOME TO "THE HAVENS AT THE DUNES"` |
| `/beach-street` | `WELCOME TO "THE HAVENS AT BEACH STREET"` |

Again: if a tag selector exists, change only the tag and the page looks
identical. If not, keep the heading's current visual size — it should not grow.

**Four pages already have a correct `<h1>` and need nothing** once the nav is
fixed: `/about` ("About The Florida Havens"), `/contact` ("Contact Us"), `/faqs`
("Frequently Asked Questions"), `/properties` ("TWO SETTINGS. FOUR HOMES. ONE
UNFORGETTABLE EXPERIENCE.").

**Four pages have a *second* extra `<h1>` to demote to `<h2>`** (pick the one
that is not the page's real subject):

| Page | Two `<h1>`s | Keep as `<h1>` |
|---|---|---|
| `/guest-blog` | `"Memories From The Havens"` · `Enjoy stories from other guests…` | the first; demote the second to `<h2>` |
| `/post/sea-turtle-nesting-season-in-florida` | `"Memories From The Havens"` · `Sea Turtle Nesting Season in Florida` | **the post title**; demote the blog-header one |
| `/local-attractions-melbourne-beach` | `Things to Do Near Melbourne Beach & Indialantic` + two empty `<h1>`s | the real one; the empty ones are stray zero-width-space text elements — demote or delete |
| `/stay-near-brevard-zoo-melbourne-beach-house` | five extras incl. `🦒 Stay Near The Brevard Zoo…`, `🐾 Why Visit Brevard Zoo?`, `📍 Convenient Location…` and two empty | keep `🦒 Stay Near The Brevard Zoo…`; the rest become `<h2>` |

## 1c. Publish, then verify on the LIVE site

Publish. Then open a **normal browser tab** (not the editor preview),
hard-reload, and in DevTools console run:

```js
[...document.querySelectorAll('h1')].map(h => h.innerText.trim())
```

**Expect exactly one entry**, and it should be that page's real headline — not
`HOME`. Check at minimum: `/`, `/turtle-haven`, `/the-dunes`, `/faqs`,
`/properties`.

Wix edge-caches; if you still see seven, wait a minute and hard-reload before
concluding anything. **Report the actual array you got for each page.**

---

# TASK 2 — Two `tel:` links dial the host's personal cell

## The problem
Two pages contain a tap-to-call link labelled **"contact the host"** whose href
is `tel:15087260695` — Craig's **personal mobile**. Nothing looks wrong on
screen, which is exactly why proof-reading never found it.

| Page | Current href | Visible label | Change href to |
|---|---|---|---|
| `/dunes-check-in` | `tel:15087260695` | "contact the host" | **321-209-0495** |
| `/beach-street-check-in` | `tel:15087260695` | "contact the host" | **321-209-0495** |

## Steps
1. Open each page in the editor, click the **"contact the host"** text, open the
   **link** panel, and change the phone number to **321-209-0495**. Wix writes
   the `tel:` prefix itself.
2. **Leave the visible label as "contact the host."** 321-209-0495 is the
   Havens' business line and it *forwards to the same phone*, so the guest
   experience is unchanged. Only the dial target moves. Do not relabel it with a
   visible phone number.
3. `/beach-street-check-in` also has a **correct** `tel:3212090495` in the
   footer. Do not touch that one; only the in-content link is wrong.
4. Publish and verify in DevTools on the live pages:

```js
[...document.querySelectorAll('a[href^="tel:"]')].map(a => a.href + ' | ' + a.innerText.trim())
```

**Expect no `508` in the output on either page.** Report the actual output.

Both pages are also on Task 3's `noindex` list. Fix the link anyway — `noindex`
removes a page from search, not from guests who already hold the link.

---

# TASK 3 — `noindex` 39 guest-operations pages

## The problem
~39 thin, internal-facing guest-instruction pages (Wi-Fi codes, laundry
instructions, check-in steps) are fully indexable. **No page on this site emits a
robots meta tag at all.** These pages compete with, and dilute, the marketing
pages that are supposed to rank. They are also the wrong content to have on a
public marketing domain.

## Where
Fastest route: **Dashboard → Marketing/SEO → SEO → Site Pages** (or **SEO
Settings**) lists every page with an indexing toggle in one table. Per-page
alternative: editor **Pages panel → the page → SEO** (or **SEO Basics**).

For each URL below, set **"Show this page in search results" → OFF** and confirm
the panel reports `noindex`.

## The 39 URLs

```
/beach-street-ac
/beach-street-amenities
/beach-street-bbq-grill-guide
/beach-street-beach-rules
/beach-street-check-in
/beach-street-check-out
/beach-street-emergency-guide
/beach-street-guidebook
/beach-street-house-guide
/beach-street-kitchen-guide
/beach-street-laundry-guide
/beach-street-parking
/beach-street-pool-spa
/beach-street-sea-turtle-guide
/beach-street-tv-entertainment-guide
/beach-street-waste-management
/beach-strret-wifi-guide          ← note the typo; also see Task 4
/connect-dunes
/connect-havens
/dunes-air-conditioning
/dunes-amenities
/dunes-bbq-grill-guide
/dunes-beach-guide
/dunes-check-in
/dunes-check-out
/dunes-emergency-guide
/dunes-ev-charging
/dunes-guide-book
/dunes-house-guide
/dunes-kitchen-guide
/dunes-laundry-guide
/dunes-parking
/dunes-pool-guide
/dunes-sea-turtle-guide
/dunes-tv-entertainment-guide
/dunes-waste-management
/dunes-wifi-guide
/guest-resources
/guest-story-entry-form
```

## Three hard constraints

- **Do NOT delete or unpublish these pages.** Guests are holding live links to
  them right now. `noindex` only.
- **Do NOT add `Disallow` rules to `robots.txt`** as a shortcut. These URLs are
  already indexed, and `Disallow` blocks crawling — Google cannot act on a
  `noindex` it is not allowed to fetch, so the pages would sit in the index
  indefinitely as bare titles. Keep them crawlable and serve `noindex` until
  Google drops them. Doing this the fast way makes the problem permanent.
- `/beach-street-meet-your-hosts` and `/dunes-meet-your-hosts` are **not** on
  this list even though they look like guest-ops pages. They carry the Wambolt
  family origin story, which is brand content. Leave them indexed.

## Verify
On any two of them, live, in DevTools console:

```js
document.querySelector('meta[name="robots"]')?.content
```

Expect a string containing `noindex`. Report the count you actually toggled — if
some pages don't appear in the SEO table, name them.

---

# TASK 4 — Fix the typo slug

`/beach-strret-wifi-guide` — "strret" — is live and indexed.

1. Editor **Pages → that page → SEO → URL slug** → correct to
   `beach-street-wifi-guide`.
2. Wix will normally offer to create a redirect automatically — **accept it.**
   If it does not: **Dashboard → SEO → URL Redirect Manager → + New Redirect**,
   old `/beach-strret-wifi-guide`, new `/beach-street-wifi-guide`, type **301**.
3. Confirm the redirect exists in the URL Redirect Manager. A renamed slug with
   no redirect turns an indexed page into a 404 — worse than the typo.
4. Apply Task 3's `noindex` to the corrected page.

---

# TASK 5 — Alt text on the images that carry meaning

## The problem
**357 of 667 images (54%) have `alt=""`** — the attribute is present, the field
is blank. On the homepage it is 65 of 68, *including the hero*.

## Do NOT do all 357. Do roughly 30, in this order
1. Homepage hero
2. Each of the six property heroes: Turtle Haven, Shell Haven, Beach Haven, Sea
   Haven, The Havens at The Dunes, The Havens at Beach Street
3. The site logo
4. Gallery cover images on the property pages

## In Wix
Click the image → **Settings** (gear) → the field labelled roughly *"What's in
the image? Tell Google."*

Write what is actually visible, including the place name where it is natural:

- Good: `Turtle Haven pool deck at sunset overlooking the Atlantic`
- Bad, meaningless: `IMG_2841`
- Bad, keyword stuffing: `luxury vacation rental Melbourne Beach Florida`

**Leave `alt` empty on genuinely decorative images** — dividers, background
textures, spacer graphics. Empty is the correct value there; a screen reader
should skip them. Do not fill every field just to clear the count.

Locations, for accuracy: The Havens at Beach Street is **Indialantic, FL 32903**.
The Havens at The Dunes is **Melbourne Beach, FL 32951**.

---

# WHAT NOT TO DO — read this before you start

- **Do not touch Settings → Business Info.** The phone there reads
  `321-209-0495` and is correct. It was fixed via API and is the source of the
  homepage `LocalBusiness` structured data.
- **Do not add `Disallow` to `robots.txt`.** See Task 3.
- **Do not delete, unpublish, rename or reorder any page** except the single slug
  rename in Task 4.
- **Do not redesign anything.** Not colours, not fonts, not layout, not spacing,
  not image crops. The brand and story are the strongest part of this site. Every
  task here is structural.
- **Do not install or remove apps.**
- **Do not rewrite body copy.** Task 1b promotes headings that already exist; it
  does not author new ones.
- **Do not publish before Task 0's restore point exists.**
- **Do not report a task as done that you could not verify.** "I toggled it but
  the SEO panel didn't confirm" is a useful sentence. "Done ✅" when you are not
  sure is not.
- **Do not make any claim about rankings or traffic** beyond exactly what the
  Search Console card in the dashboard shows.

---

# REPORT BACK IN THIS SHAPE

```
RESTORE POINT: <timestamp / label>

SEARCH CONSOLE BASELINE (<date range>):
  impressions: _  clicks: _
  queries: <query> = <impressions>  (all rows)

PSI MOBILE BASELINE:
  /                  perf _  LCP _  INP/TBT _  CLS _  bytes _
  /turtle-haven      ...
  /book-turtle-haven ...
  /faqs              ...

TASK 1 nav <h1>:
  tag selector present in Studio? YES/NO  (← say which path you used)
  labels changed: _/7
  carried across breakpoints? YES/NO
  h1 promoted on: _/7 pages
  extra h1 demoted on: _/4 pages
  published: YES/NO
  live check — h1 array per page:
    /              -> [...]
    /turtle-haven  -> [...]
    /the-dunes     -> [...]
    /faqs          -> [...]
    /properties    -> [...]

TASK 2 tel: links:
  /dunes-check-in        -> <actual tel: output>
  /beach-street-check-in -> <actual tel: output>

TASK 3 noindex:  _/39 toggled.  Pages not found in the SEO table: <list>
  spot check: <url> robots meta = <value>

TASK 4 typo slug:  renamed YES/NO.  301 confirmed in Redirect Manager YES/NO

TASK 5 alt text:  _ images described.  Which ones: <list>

ANYTHING THAT DID NOT MATCH THIS BRIEF:
  <describe what you actually saw — panel names, missing toggles, surprises>

ANYTHING YOU CHANGED THAT IS NOT IN THIS BRIEF:
  <should be "nothing" — if not, say exactly what>
```

That last pair of sections matters as much as the checkmarks. The click paths in
this brief were inferred from the classic Wix Editor and the Studio dashboard
screenshot, not from Studio's editor itself — so corrections to them are the most
valuable thing you can send back.
