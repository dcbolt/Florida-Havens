# Brief for the in-browser agent (Wix Studio)

> ## STATUS 2026-07-27: executed. Tasks 0, 1, 2, 3 and 5 are DONE and verified.
>
> | Task | State |
> |---|---|
> | 0 — restore point + baselines | ✅ [`BASELINE-2026-07-26.md`](BASELINE-2026-07-26.md) |
> | 1 — nav `<h1>` + one real `<h1>` per page | ✅ verified as Googlebot-smartphone |
> | 2 — two `tel:` links | ✅ `5087260695` absent from served HTML, both UAs |
> | 3 — noindex 39 guest-ops pages | ✅ 39/39; corroborated by pages-sitemap **76 → 37** |
> | 4 — typo slug | ⏭ **skipped** — `noindex` removed the ranking cost; now cosmetic |
> | 5 — alt text | ✅ homepage empty-alt **65/68 → 5/68**; the 5 are decorative nav thumbs |
>
> Open, and **held for Devin rather than an agent**: P0.6 (deleting gallery
> slides is permanent content removal), P0.7 (booking-path change, blocked on
> Guesty URLs), plus findings 14, 15 and the outstanding inputs — see
> [`WIX-P0-CHECKLIST.md`](WIX-P0-CHECKLIST.md).
>
> **The corrections below are the durable value of this document.** Six of its
> original instructions were wrong about Studio, and each is marked inline with
> what turned out to be true. Read those before trusting any click path here.

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

## 1a. Change the nav labels' tag

> **SETTLED 2026-07-26, in Studio — but item 1 was corrected later the same day.**
>
> 1. ~~There is no separate tag selector.~~ **WRONG. It exists:**
>    **Text Settings → SEO & accessibility → "Choose HTML tag."** It is fully
>    independent of the visual Style preset, and it is *further down the panel
>    than the Style dropdown* — which is why the first pass missed it.
>
>    **Use this control for all tag work.** Changing the tag through it leaves
>    font, size, weight and colour completely untouched — verified on the seven
>    Task 1b headlines, computed values identical before and after (homepage:
>    50 px, leaf-span colour `rgb(243,243,243)`, unchanged). No style-restore
>    dance, no colour trap, no per-breakpoint repetition.
>
>    The Style dropdown *also* changes the tag as a side effect, and that is the
>    path the seven nav labels were done on before the real control was found —
>    which is why they needed the font/size/weight/colour restoration described
>    below. **Do not repeat that.** Scroll to *SEO & accessibility* first.
>
>    **The two paths do not compose, so the nav labels cannot be cleaned up
>    retroactively.** Tested read-only and reverted: switching Style away from
>    Paragraph 2 **discards** the local size/colour/weight overrides rather than
>    layering under them, resetting to Heading 1's raw defaults (82 px, black).
>    There is no "original look, tag only" path back. The nav stays as it is —
>    correct and published, held by manual overrides. The residual risk is that a
>    future edit to the Paragraph 2 theme style could shift it; that is smaller
>    than the risk of redoing seven live labels, so it is accepted and recorded
>    rather than fixed.
> 2. **The nav is not in the header.** The Layers panel's **Header** bucket is
>    empty. The desktop nav is a **collapsed hamburger icon** (top-left) — a
>    widget floating over the hero section — at *every* breakpoint, not just
>    mobile. This is very likely what the 64 `StylableHorizontalMenu` references
>    in the live HTML actually are.
>
> The one prediction that held: the labels are genuine **Text** elements, and the
> Style dropdown does operate on them. The current value reads `Heading 1*` — the
> asterisk means overridden, consistent with the measured 35 px against the
> theme's 82 px default.

### The real click path to a single label

1. **Double-click the hamburger icon** → an **Edit Menu** button appears → click
   it. This enters **Hamburger Menu Mode** (banner top-centre: *Hamburger Menu
   Mode / Exit Mode*), which renders the menu open and editable in-canvas.
2. Clicking a label once selects its **parent Container Box**, not the text. To
   get the text itself: **right-click the label → "Overlapping Items" → pick the
   `HOME` (Text) entry** from the stack list.
3. **Double-click** the selected Text to enter inline edit. The **Text Settings**
   panel opens, carrying the **Style** dropdown.

### Before changing seven labels, check for a reusable preset

Restoring font, weight, size, letter-spacing and colour by hand on 7 labels ×
however many breakpoints carry overrides is the expensive path. Check whether
Studio lets you **define a text style once and apply it**, which turns the job
into one definition plus seven dropdown picks, with no per-label restoration and
no per-breakpoint work — presets carry their own responsive definition.

Look for a **Site Styles / Text Themes** editor (often near the Style dropdown as
*Edit styles*, or under the main menu → **Site Styles**), then either:

- **Add a new custom text style** — cleanest if Studio offers it. Name it
  something like `Nav Link`, set it to render as a paragraph, give it the values
  in the table below, then apply it to all seven labels.
- **Or repurpose an unused preset.** `Paragraph 3` (14 px) is the likely
  candidate. **Only if nothing else on the site uses it** — check for a usage
  count or "used by N elements" indicator before touching it. Redefining a preset
  that is in use elsewhere silently restyles those elements, which is a much
  worse outcome than seven manual restorations. If you cannot determine usage,
  do **not** repurpose it; fall back to per-label overrides.

**If neither exists, do it per-label** with the values below.

### The values to restore

| Property | Value |
|---|---|
| Font | Cormorant Garamond SemiBold |
| Size | **35 px** |
| Letter spacing | **0.05em** |
| Weight | Bold |
| Colour | theme `color_38` (whatever it already had — do not pick a new one) |

These are measured from the live site, so matching them is pixel-identical.
Letter-spacing and the colour swatch were **not** visible in the Text Settings
panel on first look — they are probably behind the **Effects** expandable section
or a separate Design/paintbrush panel. Find them, but see the next note before
treating them as blocking.

All seven labels: **HOME · ABOUT · PROPERTIES · BOOK YOUR STAY · LOCAL
ATTRACTIONS · GUEST RESOURCES · CONTACT**

> ### Get the tag right; do not block on pixel-perfect spacing
>
> These labels live inside a **collapsed hamburger menu**. A visitor only sees
> them after tapping the icon — they are not a persistent header bar. So the
> "don't change the look" rule, which is otherwise absolute in this brief, is
> much cheaper to satisfy here than anywhere else on the site: font, weight and
> **35 px** are what carry the look, and those three are all in the Text Settings
> panel you already have open.
>
> If letter-spacing or the exact swatch prove hard to locate, **set the three you
> can, ship it, and report the two you could not** rather than stalling Task 1 on
> a hunt. A 0.05em difference inside a menu nobody has open is a far smaller
> problem than 77 pages continuing to tell Google their subject is "HOME ABOUT
> PROPERTIES". Do not, however, *guess* at a colour — leaving it as-inherited is
> correct; picking a new one is not.

### Two traps found on the Style-dropdown path — avoidable via "Choose HTML tag"

Both of these are consequences of changing the tag *through the Style preset*.
The `SEO & accessibility → Choose HTML tag` control avoids both entirely. They
are kept here because the seven nav labels were done the hard way and their
current state depends on it.

**1. The editor panel goes stale and lies to you.** After a style-preset change,
the Font field can keep showing a wrong value (observed: `Futura`) and refuse to
update no matter how many times you reselect — while the *saved* data is already
correct. Closing the panel does not clear it; a **full reload of the editor page**
does, after which the panel shows true state. Cost real time before the reload was
found.

The rule that follows: **never trust the editor panel as evidence.** Verify in the
published DOM, every time. That is what 1c is for.

**2. Swapping the preset changes the colour, not just the tag.** Heading 1's
default text colour on this site is **white**; Paragraph 2's is **black**. Nobody
sets black — the label inherits it from the new preset the moment you switch. On a
dark menu that means black-on-black and an **invisible label**, which is a real
visible regression, not a cosmetic one.

Fix it the way it was fixed here: open the colour picker, confirm on an *untouched
sibling* label that no theme swatch is actively selected (so its white is
inherited rather than chosen), then set white explicitly on the ones you changed
to match. That is matching an observed sibling value, which is allowed. Inventing
a colour is still not.

> **This reverses in Task 1b — and is why the tag control matters.** Promoting a
> heading *to* Heading 1 via the Style preset would pull Heading 1's defaults in
> (white, 82 px), so a promoted headline could jump size or vanish against a
> light background. Using `SEO & accessibility → Choose HTML tag` instead, none
> of that happens: Task 1b's seven headlines went `h2 → h1` with computed styles
> byte-identical. Record size and colour before changing anyway, as a check.

### Breakpoints: Mobile is a different widget, not a rescale

This editor exposes **two** breakpoints, Desktop and Mobile. There is no Tablet
toggle.

The Desktop fix does **not** carry to Mobile, because Mobile is not the same
component reflowed — it is a structurally separate widget (**Mobile Menu Box** vs
Desktop's **Hamburger Menu Container**) with its own independent text elements,
still on Heading 1 / black.

It is not even the same seven items. Mobile shows **HOME, ABOUT, PROPERTIES
(expandable), LOCAL ATTRACTIONS (expandable), GUEST RESOURCES, CONTACT** — six at
top level, with **BOOK YOUR STAY absent**, so it is nested inside one of the
expandable items rather than mirrored 1:1.

**Before editing Mobile, measure whether it matters — see Task 1d.** Do not
assume it is "the same seven again"; it is an unknown-shape menu, and it may not
even reach the crawler.

The 64 `StylableHorizontalMenu` references in the live HTML are most likely the
hamburger widget itself, not a separate mobile menu as earlier docs guessed.

## 1d. Does the Mobile menu even reach Google? Measure before editing it

**Do this before touching the Mobile Menu Box.** It is a two-minute test and it
decides whether that widget is on the critical path or a footnote.

### Why it is genuinely open

The original census counted **exactly 7** `<h1>` per page from a plain server
fetch with a desktop user-agent and no JavaScript. After fixing only the seven
**Desktop** labels, the homepage reports **0**. If the Mobile menu's six labels
were also in that same server HTML as `<h1>`, the original count would have been
13, not 7.

So one of two things is true, and they have opposite consequences:

- **Wix serves breakpoint-specific markup.** The desktop fetch got desktop markup
  only; a mobile fetch would get the Mobile Menu Box and its own `<h1>`s. Since
  **Google crawls mobile-first**, the Mobile widget would then be the version that
  actually matters and P0.1 is only half done.
- **The Mobile widget's labels are not `<h1>`s**, or are not server-rendered at
  all. Then it is cosmetic-only and can wait.

### The test

In DevTools on the **published** site: open **Network conditions** → set
**User agent** to a phone (e.g. Chrome on Android), *and* switch device emulation
to a mobile viewport. **Hard-reload.** Then:

```js
[...document.querySelectorAll('h1')].map(h => h.innerText.trim())
```

Also worth capturing, since it distinguishes "not rendered" from "rendered but
not h1":

```js
[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
  .filter(e => /^(HOME|ABOUT|PROPERTIES|LOCAL ATTRACTIONS|GUEST RESOURCES|CONTACT)$/
                 .test(e.innerText.trim()))
  .map(e => e.tagName + ' ' + e.innerText.trim())
```

### How to read it

| Mobile-UA result | Meaning | Action |
|---|---|---|
| Nav labels appear as `H1` | Mobile markup is what Google sees; P0.1 is half done | **Fix the Mobile widget now** — it outranks the rest of this brief |
| Nav labels appear as `H2`–`H6` | Wrong outline but not competing for page subject | Fix after Tasks 2–5 |
| Nav labels absent entirely | Not server-rendered; crawler never sees them | **Cosmetic only** — schedule it, do not prioritise it |

Report the raw output either way. **This also corrects a scope limit in the
audit:** the 77-page census was taken with a desktop user-agent, so every `<h1>`
count in `AUDIT.md` describes the **desktop** variant. Whether mobile markup
differs was never measured. Your result settles it.

## 1b. Give each page exactly one real `<h1>`

After 1a there will be pages with **zero** `<h1>`. Promote the existing main
headline on each — do not write new copy, do not move anything. Just change the
tag/style of the headline that is already there.

> **Read the Task 1a colour trap first.** Promoting *to* Heading 1 pulls in
> Heading 1's white / 82 px defaults, so a promoted headline can jump size or turn
> white and disappear. Record each headline's size and colour before changing it.

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

## 1c. Demote the extra `<h1>`s on four pages

Re-measured live as Googlebot-smartphone **after** Tasks 1a/1b, by parsing real
`<h1>…</h1>` element pairs rather than grepping substrings. These counts are
current, not derived from the pre-fix desktop snapshot:

| Page | `<h1>` now | Keep as `<h1>` | Demote to `<h2>` |
|---|---:|---|---|
| `/guest-blog` | **2** | `"Memories From The Havens"` | `Enjoy stories from other guests who have stayed at The Florida Havens.` |
| `/post/sea-turtle-nesting-season-in-florida` | **2** | **`Sea Turtle Nesting Season in Florida`** — the post title | `"Memories From The Havens"` (blog-section header) |
| `/local-attractions-melbourne-beach` | not re-measured (throttled) | `Things to Do Near Melbourne Beach & Indialantic` | the rest, incl. **empty / zero-width-space** `<h1>`s — demote or delete outright |
| `/stay-near-brevard-zoo-melbourne-beach-house` | not re-measured (throttled) | `🦒 Stay Near The Brevard Zoo in Melbourne, Florida` | `🐾 Why Visit Brevard Zoo?`, `📍 Convenient Location Near Our Properties`, plus empty ones |

Note `/guest-blog` came back as **2**, not the 3 an earlier `grep`-based count
suggested — see the counting caveat above. **Open each page and report the count
you actually see**; do not force it to match this table.

Use `SEO & accessibility → Choose HTML tag` for every one of these.

### Status 2026-07-26: 3 of 4 done, and the fourth is deliberately stopped

`/guest-blog`, `/post/sea-turtle-nesting-season-in-florida` and
`/stay-near-brevard-zoo-melbourne-beach-house` are each at **exactly one `<h1>`**,
verified live under a Googlebot-smartphone fetch.

> ### ⚠ Selection hazard in the rich-text tag control
>
> Selecting a single heading line with **Home + Shift + End** silently
> over-extended into the *following* bullet list and paragraph — twice, on the
> Brevard Zoo page — retagging them as `<h2>` with no visible cue in the editor.
> Caught only on live verification, then reverted to `<p>` and re-published.
>
> **Re-verify live after every rich-text tag change.** The editor gives no
> feedback that the selection ran past the line you meant. Prefer clicking into
> the specific text element over keyboard range selection.

**Empty zero-width-space `<h1>`s: leave them.** Two pages still carry stray
empty headings (`/local-attractions-melbourne-beach` has 2; the Brevard Zoo page
has 4, now as `<h2>`). Attempting to delete them made surrounding text vanish
from the canvas — undone immediately, nothing published — so the risk is real and
demonstrated.

They are not worth that risk:

- **They carry no text**, so they cannot compete for the page's subject. The
  "one `<h1>`" rule is about competing subjects; an empty heading competes with
  nothing. SEO cost ≈ zero.
- The only real cost is accessibility — an empty entry in a screen reader's
  heading list. Genuine, minor.
- **Both pages are 301'd in the rebuild** (`/local-attractions-melbourne-beach` →
  `/guides/local-attractions`, `/stay-near-brevard-zoo-melbourne-beach-house` →
  `/guides/brevard-zoo`), and the replacements have a single clean `<h1>` and a
  proper `<h2>`/`<h3>` outline. Perfecting markup on pages scheduled for redirect
  is the wrong place to spend risk.

Same reasoning covers the Brevard Zoo side-effect: its two real section headers
ended up as plain `<p>` rather than `<h2>`. Slightly less semantic, no duplicate
`<h1>`, and the replacement guide carries the correct outline. **Do not go back
in for it.**

## 1c. Publish, then verify on the LIVE site

**Do HOME alone first, publish, and verify it before touching the other six.**
One label is a cheap, fully reversible test of the whole approach.

Publish. Then open a **normal browser tab** (not the editor preview),
hard-reload, and in DevTools console run:

```js
[...document.querySelectorAll('h1,h2,h3,p')]
  .filter(e => e.innerText.trim() === 'HOME')
  .map(e => e.tagName + ' ' + getComputedStyle(e).fontSize
            + ' ' + getComputedStyle(e).letterSpacing)
```

**You do not need to open the menu to check this.** The seven labels are in the
server-rendered HTML whether the hamburger is open or closed — that is how they
were counted in the first place, from a plain `curl` with no JavaScript. A
collapsed menu is hidden by CSS, not absent from the DOM.

> ### Verification hygiene — three ways a check lies to you
>
> 1. **Wait for hydration.** A DOM query run immediately after navigation can
>    return `[]` on a page that is actually correct — observed on `/sea-haven`,
>    where a re-check seconds later showed the `H1` fine. **An empty result right
>    after navigating is not a failure.** Re-run before believing it.
> 2. **Count in the DOM, not with `grep`.** `curl … | grep -o '<h1' | wc -l`
>    counts raw substrings, and Wix inlines page content as JSON, so `<h1` can
>    appear inside a `<script>` blob and inflate the count. On `/guest-blog` that
>    method reported **3** where real parsed elements were **2**.
>    `document.querySelectorAll('h1').length` is DOM truth — prefer it, and
>    treat any `grep`-derived count as an upper bound.
> 3. **Never trust the editor panel** — see the stale-panel trap above.

Expect `P 35px ...` — tag changed, size preserved. If it reports `H1`, the style
change did not take; if it reports `P 16px`, the restore did not take.

Once HOME is confirmed clean, do the remaining six, publish, and check whole
pages:

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

### Status 2026-07-26: DONE and verified in served HTML

```
/dunes-check-in         <a href="tel:13212090495">contact the host   ✓
                        <a href="tel:3212090495">   (footer)         ✓
/beach-street-check-in  <a href="tel:13212090495">contact the host   ✓
                        <a href="tel:3212090495">   (footer)         ✓
5087260695 — 0 occurrences on either page                            ✓
```

> ### Check `tel:` in served HTML, not in the DOM
>
> A `document.querySelectorAll('a[href^="tel:"]')` check on these pages returns
> **empty**, which led to the conclusion that the site "doesn't use `tel:`
> anchors at all." It does — **two per page**, visible in the server response
> above, and the footer number is a real link rather than the plain text it
> appears to be post-hydration. Wix evidently rewrites these anchors during
> hydration.
>
> The server response is also the *right* authority here, not merely a
> tiebreaker: the exposure being fixed is a personal number readable by
> scrapers, aggregators and crawlers, all of which read served HTML. Verify this
> class of fix with `curl`, not DevTools.
>
> The editor's link dialog happened to agree, but it is not evidence — see the
> stale-panel trap.

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

# TASK 3 — STATUS: DONE 2026-07-26, all 39 verified

Independently swept server-side as Googlebot-smartphone: **39 of 39 carry
`<meta name="robots" content="noindex">`, zero misses.** Controls
(`/dunes-meet-your-hosts`, `/beach-street-meet-your-hosts`, `/turtle-haven`,
`/faqs`) all return no robots meta, so nothing was over-toggled.

Two things found in the page tree worth recording: the Dunes utility pages appear
**twice** in Studio's tree — once flat, once inside a "The Dunes Guidebook"
folder — but they are the same physical pages, confirmed by slug, so there was no
double-counting and no second toggle needed. `robots.txt` was correctly left
alone.

---

# TASK 4 — Fix the typo slug · **value dropped once Task 3 landed**

`/beach-strret-wifi-guide` — "strret" — is live.

> **Re-ranked 2026-07-26.** This mattered because an indexed URL carried a visible
> misspelling. It is now `noindex`, so that cost is already gone. What remains is
> cosmetic: guests who look at the URL bar. The page is also 301'd to the guest
> portal in the rebuild, so it is destined for retirement either way.
>
> **Recommendation: do Task 5 first.** Alt text touches the homepage hero and six
> property heroes — indexed, revenue-bearing pages. This touches a noindexed
> guest-ops page scheduled for removal. If you want the URL clean anyway it is a
> five-minute job; just do it knowing the ranking argument for it has expired.
>
> **If you do rename it, say so** — `content/url-matrix.ts` in the rebuild keys
> the redirect off `/beach-strret-wifi-guide`, and the live sitemap will start
> serving a slug that is not in the 77-URL matrix. That needs a matrix update on
> the repo side, and Grok's sitemap-drift watch will flag it.

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
