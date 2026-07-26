#!/usr/bin/env python3
"""Sitewide audit of every phone number the live site exposes.

Why this exists separately from backup-live-site.py: that tool records *visible
text* only, so it is blind to a number that lives in an attribute. On
/dunes-check-in the visible label reads "contact the host" while the href is
`tel:15087260695` — a tap-to-call straight to the host's personal cell that no
text-based scan can see.

This classifies every occurrence so each one is actionable:

  tel_href      a tap-to-call link          → user-facing, fix in the editor
  visible_text  the digits shown on screen  → user-facing, fix in the editor
  jsonld        structured data             → fix via Site Properties API
  internal      Wix warmup/hydration JSON   → usually a cached echo of business
                info; NOT user-facing, do not chase it

Wix serves heavily cached HTML from multiple edge nodes, so a single pass can
disagree with itself. `--passes N` re-checks and reports any URL whose result is
not stable across passes.

RATE LIMIT WARNING — read before running. Wix throttles hard, and the budget is
per-source-IP and cumulative across a session. After a full-site backup pass this
script degraded to roughly one page per minute, and the sitemap fetch itself came
back near-empty — which silently collapses the URL list to 1-2 entries and yields
a clean-looking result that audited almost nothing. The guard in main() now
refuses to run below 20 URLs. If you are throttled, wait, or hand the sweep to an
agent on a different network.

Usage:
  python3 tools/phone-audit.py --out data/phone-audit.json
  python3 tools/phone-audit.py --passes 2 --out data/phone-audit.json
"""
import argparse, json, re, time, urllib.request
from collections import defaultdict

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")
BASE = "https://www.thefloridahavens.com"

# The host's personal cell, and the brand's forwarding business number.
CELL = r"1?\s*\(?508\)?[\s.\-]*726[\s.\-]*0695"
BRAND = r"1?\s*\(?321\)?[\s.\-]*209[\s.\-]*0495"


def get(url, attempts=5):
    for i in range(attempts):
        try:
            # Deliberately NOT sending Cache-Control: no-cache. Visitors are
            # served CDN-cached HTML, so that is what should be audited — and
            # forcing origin fetches triggered ~4 minutes per page of 429
            # backoff, which made a 78-page sweep impossible.
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read().decode("utf-8", "replace"), r.status
        except Exception as e:
            time.sleep(4 * (i + 1) if ("429" in str(e) or "503" in str(e)) else 1.5)
    return "", 0


def urls():
    out = set()
    for sm in ("pages-sitemap.xml", "blog-posts-sitemap.xml"):
        xml, _ = get(f"{BASE}/{sm}")
        out |= set(re.findall(rf"<loc>\s*({re.escape(BASE)}[^<\s]*)", xml))
    # The sitemap lists the homepage both with and without a trailing slash;
    # normalise so it is fetched once rather than twice.
    out = {u.rstrip("/") for u in out}
    out.discard(BASE)
    out.add(BASE + "/")
    return sorted(out)


def classify(h, pattern):
    """Return {category: [context snippets]} for one number pattern."""
    found = defaultdict(list)

    # 1. tel: hrefs — the user-facing tap-to-call target.
    for m in re.finditer(rf'href=["\']tel:([^"\']*)["\']([^>]*)>(.*?)</a>',
                         h, re.I | re.S):
        if re.search(pattern, m.group(1)):
            label = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", m.group(3))).strip()
            found["tel_href"].append({"href": m.group(1), "link_text": label[:120]})

    # 2. JSON-LD structured data.
    for m in re.finditer(
            r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>', h, re.S | re.I):
        if re.search(pattern, m.group(1)):
            found["jsonld"].append({"snippet": re.sub(r"\s+", " ", m.group(1))[:200]})

    # 3. Visible text — strip scripts/styles first so hydration JSON is excluded.
    body = re.sub(r"<(script|style|noscript)\b.*?</\1>", " ", h, flags=re.S | re.I)
    body = re.sub(r"<[^>]+>", " ", body)
    for m in re.finditer(pattern, body):
        ctx = re.sub(r"\s+", " ", body[max(0, m.start() - 90):m.end() + 60])
        found["visible_text"].append({"context": ctx.strip()[:200]})

    # 4. Everything else in the document = Wix internal JSON. Count only.
    total = len(re.findall(pattern, h))
    accounted = (len(found["tel_href"]) + len(found["jsonld"])
                 + len(found["visible_text"]))
    if total > accounted:
        found["internal"].append({"count": total - accounted})
    return dict(found)


def audit(url):
    h, status = get(url)
    rec = {"url": url, "status": status}
    if not h:
        rec["error"] = "unreachable"
        return rec
    rec["bytes"] = len(h.encode())
    rec["suspect_truncated"] = rec["bytes"] < 400_000
    rec["cell"] = classify(h, CELL)
    rec["brand"] = classify(h, BRAND)
    return rec


def user_facing(rec):
    """Only tel_href / visible_text / jsonld are user-facing exposures."""
    c = rec.get("cell") or {}
    return bool(c.get("tel_href") or c.get("visible_text") or c.get("jsonld"))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="data/phone-audit.json")
    ap.add_argument("--passes", type=int, default=1)
    args = ap.parse_args()

    us = urls()
    print(f"{len(us)} URLs\n")
    if len(us) < 20:
        raise SystemExit(
            f"Only {len(us)} URLs discovered — the sitemap fetch was almost "
            "certainly throttled. Refusing to run: a collapsed URL list would "
            "produce a clean-looking result that audited almost nothing.")
    per_pass = []
    for p in range(args.passes):
        if args.passes > 1:
            print(f"--- pass {p + 1}/{args.passes} ---")
        recs = []
        for n, u in enumerate(us, 1):
            r = audit(u)
            recs.append(r)
            slug = u.replace(BASE, "") or "/"
            marks = []
            c = r.get("cell") or {}
            if c.get("tel_href"):
                marks.append(f"TEL×{len(c['tel_href'])}")
            if c.get("visible_text"):
                marks.append(f"TEXT×{len(c['visible_text'])}")
            if c.get("jsonld"):
                marks.append("JSONLD")
            if c.get("internal"):
                marks.append(f"internal×{c['internal'][0]['count']}")
            if r.get("suspect_truncated"):
                marks.append("TRUNCATED?")
            print(f"[{n}/{len(us)}] {r['status']} {slug:52} "
                  f"{' '.join(marks) or '-'}", flush=True)
            time.sleep(1.3)
        per_pass.append(recs)

    final = per_pass[-1]
    # Flag URLs whose user-facing verdict flipped between passes — that is cache
    # variance, not a real change, and it is why single-pass results disagree.
    unstable = []
    if args.passes > 1:
        for i, u in enumerate(us):
            verdicts = {user_facing(pp[i]) for pp in per_pass}
            if len(verdicts) > 1:
                unstable.append(u)

    exposed = [r for r in final if user_facing(r)]
    out = {
        "captured": time.strftime("%Y-%m-%d"),
        "passes": args.passes,
        "url_count": len(final),
        "user_facing_cell_exposures": len(exposed),
        "unstable_across_passes": unstable,
        "pages": final,
    }
    with open(args.out, "w") as f:
        json.dump(out, f, indent=1)

    print(f"\n=== USER-FACING exposures of the host's cell: {len(exposed)} ===")
    for r in exposed:
        slug = r["url"].replace(BASE, "") or "/"
        print(f"\n  {slug}")
        for t in (r["cell"].get("tel_href") or []):
            print(f"    tel: {t['href']}   link text: {t['link_text']!r}")
        for t in (r["cell"].get("visible_text") or []):
            print(f"    visible: {t['context']}")
        for t in (r["cell"].get("jsonld") or []):
            print(f"    JSON-LD: {t['snippet'][:120]}")
    internal_only = [r for r in final
                     if not user_facing(r) and (r.get("cell") or {}).get("internal")]
    print(f"\ninternal-JSON-only (not user-facing, ignore): {len(internal_only)}")
    if unstable:
        print(f"\nUNSTABLE across passes — Wix cache variance ({len(unstable)}):")
        for u in unstable:
            print("  " + u)
    bad = [r["url"] for r in final
           if r["status"] != 200 or r.get("suspect_truncated")]
    if bad:
        print(f"\nnot cleanly captured ({len(bad)}):")
        for b in bad:
            print("  " + b)
    print(f"\nwrote {args.out}")


if __name__ == "__main__":
    main()
