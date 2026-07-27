#!/usr/bin/env python3
"""Find pages whose body copy is a near-duplicate of another page's.

Written after finding 14: /beach-street-check-in and /dunes-check-in are
identical except for the <title>, so a guest at Beach Street is reading The
Dunes' check-in instructions. Nobody was looking for that — it surfaced because
someone happened to read a page they were editing. This makes the check routine.

Site chrome (header, footer, nav) appears on every page and would make everything
look similar, so it is removed first: any line appearing on 5+ pages is treated as
chrome and dropped, the same frequency rule tools/extract-copy.py uses.

Usage:
  python3 tools/dupe-pages.py backups/content-snapshot-2026-07-26.json.gz
  python3 tools/dupe-pages.py <snapshot> --threshold 0.85
"""
import argparse, gzip, json, sys
from collections import Counter
from itertools import combinations

CHROME_MIN_PAGES = 5


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("snapshot")
    ap.add_argument("--threshold", type=float, default=0.80,
                    help="report pairs sharing at least this fraction of body lines")
    args = ap.parse_args()

    d = json.load(gzip.open(args.snapshot, "rt"))
    pages = [p for p in d["pages"]
             if p.get("status") == 200 and not p.get("suspect_truncated")]

    freq = Counter()
    for p in pages:
        freq.update(set(p.get("text", [])))
    chrome = {line for line, n in freq.items() if n >= CHROME_MIN_PAGES}

    bodies = {}
    for p in pages:
        url = p["url"].replace("https://www.thefloridahavens.com", "") or "/"
        body = {l for l in p.get("text", []) if l not in chrome}
        if body:
            bodies[url] = body

    hits = []
    for a, b in combinations(sorted(bodies), 2):
        sa, sb = bodies[a], bodies[b]
        shared = len(sa & sb)
        # Jaccard would punish a page that merely has extra sections; this asks
        # "is one page's body wholly contained in the other's?", which is the
        # copy/paste shape we care about.
        ratio = shared / min(len(sa), len(sb))
        if ratio >= args.threshold:
            hits.append((ratio, shared, a, b, len(sa), len(sb)))

    hits.sort(reverse=True)
    if not hits:
        print(f"No page pairs share >= {args.threshold:.0%} of body lines.")
        return 0

    print(f"{len(hits)} near-duplicate pair(s), threshold {args.threshold:.0%}:\n")
    for ratio, shared, a, b, na, nb in hits:
        print(f"  {ratio:6.1%}  {shared} shared lines")
        print(f"          {a}  ({na} body lines)")
        print(f"          {b}  ({nb} body lines)")
        only_a = sorted(bodies[a] - bodies[b])[:3]
        only_b = sorted(bodies[b] - bodies[a])[:3]
        if only_a:
            print(f"            only in {a}: {only_a}")
        if only_b:
            print(f"            only in {b}: {only_b}")
        print()

    print("Near-identical guest-facing pages are an operational defect, not an "
          "SEO one: the wrong instructions reach a real guest. Check each pair "
          "before assuming it is harmless boilerplate.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
