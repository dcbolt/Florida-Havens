# Wix: the two changes worth doing first

**Time needed: about 15 minutes.** Everything else in
[`WIX-P0-CHECKLIST.md`](WIX-P0-CHECKLIST.md) can wait; these two cannot be done by
any API and nothing else moves until they land.

Do them in this order. Verification commands are copy-pasteable — run them after
publishing and check the expected output.

---

## Before you start: one restore point (30 seconds)

1. Wix Dashboard → the site → **Edit Site**
2. In the editor: **Site** menu → **Site History**
3. Click **Save** to create a fresh revision

Wix has no backup API, so this is the only rollback that covers editor changes.
Do not skip it.

---

## 1. The `<h1>` fix — worth more than everything else combined

**The problem:** Wix renders all seven nav labels as `<h1>` on every page. Every
page on the site tells Google its subject is *"HOME ABOUT PROPERTIES BOOK YOUR
STAY LOCAL ATTRACTIONS GUEST RESOURCES CONTACT"*. Measured: **0 of 77 pages have
exactly one `<h1>`**.

**This is a text-style change. The nav will look identical when you're done.**

### Steps

1. **Editor** → click the header → **Edit Menu** (or click a nav item directly).
2. Click the **HOME** text → open the text panel (the **A** icon).
3. The style dropdown reads **Heading 1**. Change it to **Paragraph 2**.
4. The text will shrink. That's expected — click **Design → Customize** and set:

   | Property | Value |
   |---|---|
   | Font | **Cormorant Garamond SemiBold** |
   | Size | **35 px** |
   | Letter spacing | **0.05em** |
   | Weight | **Bold** |
   | Colour | the same one it already had (theme `color_38`) |

   These are measured from your live site, so matching them makes it
   pixel-identical.
5. Repeat for the other six: ABOUT, PROPERTIES, BOOK YOUR STAY, LOCAL
   ATTRACTIONS, GUEST RESOURCES, CONTACT.
6. **Switch to the mobile editor view and repeat** — Wix stores mobile text styles
   separately.
7. **Publish.**

### Then give each page its real `<h1>`

On each page, click the main headline — e.g. *"WELCOME TO TURTLE HAVEN"* — and set
it to **Heading 1**. One per page, no more.

Start with the pages that matter: `/`, the six property pages, `/properties`,
`/faqs`, `/about`.

### Verify

```
curl -s https://www.thefloridahavens.com/ | grep -o '<h1' | wc -l
```

**Expect `1`.** It is currently `7`.

> If the nav turns out to be a locked Wix Menu component rather than text
> elements, stop and say so — but it is not: the live HTML shows
> `<h1 class="font_0 wixui-rich-text__text">`, which is a Wix **Text** element.
> The style is editable.

---

## 2. Two `tel:` links pointing at Craig's personal cell

**The problem:** two pages have a tap-to-call link labelled *"contact the host"*
that dials **`5087260695`** — Craig's personal mobile. Nothing looks wrong on
screen, so proof-reading the page will never find it.

| Page | Fix |
|---|---|
| `/dunes-check-in` | link → **321-209-0495** |
| `/beach-street-check-in` | link → **321-209-0495** |

### Steps

1. **Editor** → open the page → click the **"contact the host"** text.
2. Click the **link** icon → change the phone number to **321-209-0495**.
3. **Leave the label as "contact the host"** — the business number forwards to the
   same phone, so the guest experience is unchanged. Only the dial target moves.
4. **Publish.**

### Verify

```
curl -s https://www.thefloridahavens.com/dunes-check-in | grep -o 'tel:[0-9+]*'
curl -s https://www.thefloridahavens.com/beach-street-check-in | grep -o 'tel:[0-9+]*'
```

**Expect no `508` in either output.**

> Both pages are also on the `noindex` list (P0.3). Fix the link anyway —
> `noindex` removes a page from search, not from guests who already have the link.

---

## Then, if you have another 20 minutes

In value order, from [`WIX-P0-CHECKLIST.md`](WIX-P0-CHECKLIST.md):

- **P0.8 — capture a mobile PSI baseline FIRST if you have not already.** Once
  P0.1 is published the "before" is gone and the improvement becomes unprovable.
  <https://pagespeed.web.dev/> on `/`, `/turtle-haven`, `/book-turtle-haven`,
  `/faqs`.
- **P0.3** — `noindex` the ~40 guest-ops pages. Dashboard → SEO → Site Pages has
  every page with a toggle in one table.
- **P0.4** — fix the `/beach-strret-wifi-guide` typo slug, accept Wix's offered
  redirect.
- **P0.5** — alt text on the ~30 images that carry meaning (homepage hero, each
  property hero, the logo). Leave decorative images empty.

---

## What has already been done for you

**P0.2 is complete and live.** The homepage `LocalBusiness` schema published
Craig's cell as the business phone; it now reads `321-209-0495`. Fixed via the
Site Properties API and verified in the live HTML.

Also checked and already correct, so ignore them: SEO route-matching returns
proper 404s, URL hierarchy is flat, canonicals are present and self-referencing on
all 77 pages, and titles are unique sitewide. Your `robots.txt` is fine as-is —
adding `Disallow` for the guest-ops pages would *prevent* Google from seeing the
`noindex` in P0.3 and keep them in the index longer.

Everything reachable by API is done. The rest is in the editor, which needs you.
