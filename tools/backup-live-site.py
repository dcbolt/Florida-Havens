#!/usr/bin/env python3
"""Snapshot the live Wix site: every sitemap URL's copy + SEO metadata.

This is a CONTENT backup, not a restore image. Read backups/RESTORE.md for what
can and cannot be restored from it — Wix editor layout/design is not
reconstructable from rendered HTML, and the authoritative rollback for editor
changes is Wix Site History in the dashboard.

What it captures, per URL:
  - full visible text (the irreplaceable asset — the copy)
  - title, meta description, canonical, robots meta, OG tags
  - heading outline, image alt inventory, byte weight
  - contact links (tel:/mailto: hrefs) with their visible label

That last one was a blind spot found on 2026-07-26: this tool originally stored
visible text only, so it could not see /dunes-check-in's
`<a href="tel:15087260695">contact the host</a>` — a tap-to-call to the host's
personal cell behind an innocuous label. A number in an attribute is invisible to
any text-only scan. See tools/phone-audit.py for the dedicated sweep.

Output: backups/content-snapshot-<stamp>.json.gz  (stamp passed via --stamp)

Usage:
  python3 tools/backup-live-site.py --stamp 2026-07-26
"""
import argparse, gzip, html, json, re, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")
BASE = "https://www.thefloridahavens.com"
SITEMAPS = ["pages-sitemap.xml", "blog-posts-sitemap.xml"]


def get(url, attempts=5):
    """Wix throttles hard (429). Serial + linear backoff, and never accept a
    suspiciously small body as a real page — that is a truncated read."""
    last = None
    for i in range(attempts):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                body = r.read()
                return body.decode("utf-8", "replace"), r.status
        except Exception as e:
            last = str(e)
            time.sleep(4 * (i + 1) if ("429" in last or "503" in last) else 1.5)
    return "", 0


def urls():
    out = set()
    for sm in SITEMAPS:
        xml, _ = get(f"{BASE}/{sm}")
        out |= set(re.findall(r"<loc>\s*(https://www\.thefloridahavens\.com[^<\s]*)", xml))
    out.add(f"{BASE}/")
    return sorted(out)


def tag(h, pat):
    m = re.search(pat, h, re.I | re.S)
    return m.group(1).strip() if m else None


def snapshot(url):
    h, status = get(url)
    rec = {"url": url, "status": status, "bytes": len(h.encode())}
    if not h:
        rec["error"] = "unreachable after retries"
        return rec
    # A real page on this site is ~950 KB+. Anything much smaller is a
    # truncated read, not a thin page — flag rather than record it as truth.
    rec["suspect_truncated"] = len(h.encode()) < 400_000

    rec["title"] = tag(h, r"<title[^>]*>(.*?)</title>")
    rec["meta_description"] = tag(
        h, r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']')
    rec["canonical"] = tag(h, r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\'](.*?)["\']')
    rec["robots_meta"] = tag(h, r'<meta[^>]+name=["\']robots["\'][^>]+content=["\'](.*?)["\']')
    rec["og_title"] = tag(h, r'<meta[^>]+property=["\']og:title["\'][^>]+content=["\'](.*?)["\']')
    rec["og_image"] = tag(h, r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\'](.*?)["\']')

    rec["headings"] = []
    for n in range(1, 7):
        for m in re.finditer(rf"<h{n}\b[^>]*>(.*?)</h{n}>", h, re.I | re.S):
            t = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", m.group(1))).strip()
            if t:
                rec["headings"].append({"level": n, "text": html.unescape(t)[:200]})

    # Contact links. The href is what actually dials — the visible label can
    # say anything, so both are recorded.
    rec["contact_links"] = []
    for m in re.finditer(r'<a\b[^>]*href=["\'](tel:|mailto:)([^"\']*)["\'][^>]*>(.*?)</a>',
                         h, re.I | re.S):
        label = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", m.group(3))).strip()
        rec["contact_links"].append({
            "kind": m.group(1).rstrip(":"),
            "target": m.group(2),
            "label": html.unescape(label)[:120],
        })

    imgs = re.findall(r"<img\b[^>]*>", h, re.I)
    rec["images"] = {
        "total": len(imgs),
        "empty_alt": sum(1 for i in imgs if re.search(r'\balt=["\']\s*["\']', i, re.I)),
        "alts": [a for a in (tag(i, r'alt=["\'](.*?)["\']') for i in imgs) if a][:60],
    }

    body = re.sub(r"<(script|style|noscript)\b.*?</\1>", " ", h, flags=re.S | re.I)
    body = re.sub(r"<br\s*/?>", "\n", body, flags=re.I)
    body = re.sub(r"</(p|div|li|h[1-6])>", "\n", body, flags=re.I)
    body = re.sub(r"<[^>]+>", " ", body)
    lines = [re.sub(r"[ \t]+", " ", html.unescape(l)).strip()
             for l in body.split("\n")]
    lines = [l for l in lines if l and l != "​"]
    ded = []
    for l in lines:
        if not ded or ded[-1] != l:
            ded.append(l)
    rec["text"] = ded
    rec["word_count"] = sum(len(l.split()) for l in ded)
    return rec


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--stamp", required=True,
                    help="date stamp for the output filename, e.g. 2026-07-26")
    args = ap.parse_args()

    us = urls()
    print(f"{len(us)} URLs from sitemap", flush=True)
    recs = []
    for n, u in enumerate(us, 1):
        recs.append(snapshot(u))
        r = recs[-1]
        flag = " TRUNCATED?" if r.get("suspect_truncated") else ""
        print(f"[{n}/{len(us)}] {r['status']} {r.get('word_count','-')}w "
              f"{u.replace(BASE,'') or '/'}{flag}", flush=True)
        time.sleep(1.2)

    ok = [r for r in recs if r["status"] == 200 and not r.get("suspect_truncated")]
    out = {
        "captured": args.stamp,
        "source": BASE,
        "url_count": len(recs),
        "clean_count": len(ok),
        "total_words": sum(r.get("word_count", 0) for r in ok),
        "pages": recs,
    }
    path = f"backups/content-snapshot-{args.stamp}.json.gz"
    with gzip.open(path, "wt", encoding="utf-8") as f:
        json.dump(out, f, indent=1)
    print(f"\nwrote {path}: {len(recs)} URLs, {len(ok)} clean, "
          f"{out['total_words']} words")
    bad = [r["url"] for r in recs if r["status"] != 200 or r.get("suspect_truncated")]
    if bad:
        print(f"NOT CLEANLY CAPTURED ({len(bad)}) — re-run to fill:")
        for b in bad:
            print("  " + b)


if __name__ == "__main__":
    main()
