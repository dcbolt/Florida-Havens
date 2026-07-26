#!/usr/bin/env python3
"""Regenerate docs/URL-MATRIX.md from content/url-matrix.ts.

The table and the redirects must never disagree, so the doc is generated from
the same module next.config.ts reads. Run after editing url-matrix.ts.
"""
import re
from collections import defaultdict

SRC = open('content/url-matrix.ts').read()
ROW = re.compile(
    r"\{ from: '([^']*)', to: (GUEST_PORTAL_TARGET|'(?:[^'\\]|\\.)*'), "
    r"action: '([^']*)', note: '((?:[^'\\]|\\.)*)', liveKb: (\d+), words: (\d+|null) \}"
)

rows = []
for m in ROW.finditer(SRC):
    to = m.group(2)
    to = 'GUEST_PORTAL_TARGET' if to == 'GUEST_PORTAL_TARGET' else to[1:-1].replace("\\'", "'")
    rows.append({
        'from': m.group(1), 'to': to, 'action': m.group(3),
        'note': m.group(4).replace("\\'", "'"),
        'kb': int(m.group(5)), 'words': m.group(6),
    })
assert rows, 'no rows parsed — did the row format change?'

groups = defaultdict(list)
for r in rows:
    groups[r['note']].append(r)

counts = defaultdict(int)
for r in rows:
    counts[r['action']] += 1

L = [
    '# URL keep / redirect / retire matrix', '',
    'Every URL in the live Wix sitemap (77 entries, crawled 2026-07-26), classified.',
    '',
    '**Generated** by `tools/gen-matrix-doc.py` from `content/url-matrix.ts` — the',
    'same module `next.config.ts` reads to emit the redirects, so this table and the',
    'live behaviour cannot drift apart. Do not hand-edit.', '',
    '`liveKb` / `words` are measured live values, kept as the evidence trail for why',
    'a page was called thin or retired.', '',
    'Next.js emits **308** for permanent redirects rather than 301. Google treats',
    'them equivalently for signal consolidation; 308 additionally preserves the',
    'request method.', '',
    '## `GUEST_PORTAL_TARGET`', '',
    'Guest-ops rows point at this symbol, not a literal host.',
    '`welcome.mediahaven.app` was assumed early and **does not exist** — no DNS',
    'record for it or for `mediahaven.app`. A permanent redirect to a nonexistent',
    'host is worse than leaving the page up, so while `GUEST_PORTAL.hostConfirmed`',
    'is `false` in `content/site.ts` these resolve to the on-domain',
    '`/guest-portal` notice page (which is `noindex`, so the index bloat is still',
    'cleared). Set the confirmed host and flip that flag to convert every one of',
    'them to an external 301 — no other edit needed.', '',
    '## Summary', '', '| Action | Count |', '|--------|------:|',
]
for a in ('301', 'KEEP', 'KEEP+NOINDEX', 'REVIEW'):
    if counts.get(a):
        L.append(f'| `{a}` | {counts[a]} |')
L += [f'| **Total** | **{len(rows)}** |', '']

for note, g in sorted(groups.items(), key=lambda kv: (-len(kv[1]), kv[0])):
    L += ['', f'## {note} ({len(g)})', '',
          '| Live URL | Action | Destination | Live KB | Words |',
          '|---|---|---|---:|---:|']
    for r in sorted(g, key=lambda x: x['from']):
        dest = ('`GUEST_PORTAL_TARGET`' if r['to'] == 'GUEST_PORTAL_TARGET'
                else f"`{r['to']}`")
        w = r['words'] if r['words'] != 'null' else '—'
        L.append(f"| `{r['from']}` | `{r['action']}` | {dest} | {r['kb']} | {w} |")

L += ['', '## Cutover order', '',
      '1. Ship the rebuild to a preview URL; verify all routes render.',
      '2. Re-crawl the live Wix sitemap to catch any URL added since 2026-07-26 —',
      '   `python3 tools/crawl.py`. Regenerate this doc if the count moves off 77.',
      '3. Confirm the guest-portal host and flip `GUEST_PORTAL.hostConfirmed`.',
      '4. Point DNS. The 308s are live from the first request.',
      '5. Submit the new `/sitemap.xml` in Search Console; leave the old sitemap in',
      '   place for a crawl cycle so Google discovers the redirects.',
      '6. Watch Coverage for the retired guest-ops URLs moving to "Page with',
      '   redirect". Do not remove the redirects until they have.', '']

open('docs/URL-MATRIX.md', 'w').write('\n'.join(L))
print(f'wrote docs/URL-MATRIX.md — {len(rows)} rows, {dict(counts)}')
