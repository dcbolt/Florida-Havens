# Backup and restore — live Wix site

Site: **The Florida Havens** · `6622db1b-c256-485d-9468-5b9d3ac43561`
<https://www.thefloridahavens.com/>

## Read this first: what these backups can and cannot restore

Be clear-eyed about the limits, because a false sense of safety is worse than
none.

| Artifact | Restores | Does **not** restore |
|---|---|---|
| `wix-site-properties-*.json` | Business info fields (phone, email, address, locale, currency) — **directly, via API** | Anything in the editor |
| `content-snapshot-*.json.gz` | Reference copy of every page's **text, headings, alt text and SEO metadata** | Layout, design, element structure, galleries, embeds |

**Snapshot `2026-07-26`: 78 / 78 URLs captured clean, 28,646 words, zero gaps.**
Five URLs were lost to Wix 429s on the first pass and filled on a second — see
`tools/fill-snapshot-gaps.py`. Always confirm `clean_count == url_count` before
treating a snapshot as complete.
| **Wix Site History** (dashboard) | **Everything** — the real rollback | — |

**Rendered HTML cannot be pushed back into the Wix editor.** A Wix page is
editor state, not markup; the snapshot proves *what the copy said* and lets you
retype it, but it is not an image you can restore. For any editor or design
change, **Wix Site History is the only true rollback.**

### Before any editor session, create a Site History restore point

1. Wix Dashboard → the site → **Edit Site**
2. In the editor: **Site** menu → **Site History** (or **Revisions**)
3. Confirm a recent entry exists, and **Save** to create a fresh one before
   editing. Wix also auto-saves a revision on each Save/Publish.
4. Note the timestamp here in the Log so a rollback target is unambiguous.

Wix exposes **no REST API** for site revisions/backups — the only `Backups`
resource in the API spec is CMS-collection scoped
(`business-solutions/cms/operations/backups`), not site content or design. So
this step is manual and cannot be automated.

---

## Change log against the live site

Everything done via API so far, in order. Nothing else has been modified.

| # | Date | Change | Method | Reversible |
|---|---|---|---|---|
| 1 | 2026-07-26 | `properties.phone` `5087260695` → `321-209-0495` (P0.2) | Site Properties API, `fields.paths=["phone"]` | Yes — one call, below |

**Context for change #1:** `5087260695` is Craig's personal cell (the direct
host line); `321-209-0495` is the Havens' business number, which forwards to
that cell. Both reach Craig. The change took a personal mobile out of the
site's public `LocalBusiness` structured data and replaced it with the
forwarding business number. **Reverting would re-publish Craig's personal
cell** — only do it if that is genuinely intended.

No editor changes have been made. No pages were added, removed, renamed,
unpublished or reordered. No apps installed or removed.

---

## Revert change #1 (phone)

Restores the previous value exactly. The field mask limits the write to `phone`,
so nothing else is affected.

```
POST https://www.wixapis.com/site-properties/v4/properties/business-contact
Content-Type: application/json

{
  "businessContact": { "phone": "5087260695" },
  "fields": { "paths": ["phone"] }
}
```

Then verify:

```
GET https://www.wixapis.com/site-properties/v4/properties
```

> Note: `GetSiteContext` caches. It reported the stale `5087260695` for several
> minutes after the write succeeded. Always verify against the `GET
> /site-properties/v4/properties` endpoint, not the context tool.

Dashboard equivalent: **Settings → Business Info → Phone**.

---

## Re-running the content snapshot

```bash
cd /path/to/this/repo
python3 tools/backup-live-site.py --stamp $(date +%F)
```

Fetches every URL in the live sitemap and records copy + SEO metadata to
`backups/content-snapshot-<stamp>.json.gz`.

**Wix rate-limits aggressively.** The script runs serially with a 1.2 s delay
and linear backoff. It also flags any response under 400 KB as
`suspect_truncated` rather than recording it as a thin page — a real page on
this site is ~950 KB+. This matters: an earlier crawl recorded
`/stay-near-brevard-zoo-melbourne-beach-house` as "0 words", which looked like a
broken page but was a truncated read. Re-run to fill anything the script lists
as not cleanly captured; never treat a flagged row as fact.

To fill gaps without re-crawling all 78:

```bash
python3 tools/fill-snapshot-gaps.py backups/content-snapshot-<stamp>.json.gz
```

It re-fetches only the flagged URLs with longer backoff and merges them in,
then reports remaining gaps. Aim for **0**.

## Inspecting a snapshot

```bash
python3 - <<'EOF'
import gzip, json
d = json.load(gzip.open('backups/content-snapshot-2026-07-26.json.gz', 'rt'))
print(d['url_count'], 'urls;', d['clean_count'], 'clean;', d['total_words'], 'words')
p = next(x for x in d['pages'] if x['url'].endswith('/faqs'))
print(p['title'])
print('\n'.join(p['text'][:20]))
EOF
```

---

## Restoring a page's copy

1. Open the snapshot and pull the page's `text` array and `headings` outline.
2. In the Wix editor, retype/paste the copy into the matching text elements.
3. Re-apply `alt` text from `images.alts`.
4. Re-apply `title` / `meta_description` in **SEO Basics** for that page.

Tedious but reliable. If the change you are undoing was made in the editor, try
**Site History** first — it is faster and complete.
