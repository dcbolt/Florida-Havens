#!/usr/bin/env python3
"""Re-fetch any URL a content snapshot lost to Wix throttling, and merge it in.

backup-live-site.py flags throttled reads as `suspect_truncated` rather than
recording them as thin pages. This fills those gaps with longer spacing, so the
snapshot ends at zero gaps instead of silently carrying holes.

Usage:  python3 tools/fill-snapshot-gaps.py backups/content-snapshot-2026-07-26.json.gz
"""
import gzip, importlib.util, json, sys, time

if len(sys.argv) != 2:
    sys.exit(__doc__)
path = sys.argv[1]

spec = importlib.util.spec_from_file_location("blz", "tools/backup-live-site.py")
blz = importlib.util.module_from_spec(spec)
spec.loader.exec_module(blz)

d = json.load(gzip.open(path, "rt"))
gaps = [p["url"] for p in d["pages"]
        if p.get("suspect_truncated") or p["status"] != 200]
if not gaps:
    print("no gaps — nothing to do")
    sys.exit(0)

print(f"filling {len(gaps)} gaps\n")
fixed = {}
for u in gaps:
    for attempt in range(3):
        rec = blz.snapshot(u)
        if rec["status"] == 200 and not rec.get("suspect_truncated"):
            fixed[u] = rec
            print(f"  OK   {rec['word_count']:5}w  {u.replace(blz.BASE, '')}")
            break
        print(f"  retry({attempt + 1}) {u.replace(blz.BASE, '')} status={rec['status']}")
        time.sleep(20)          # throttled: back off hard, not politely
    else:
        print(f"  STILL FAILING  {u}")
    time.sleep(8)

for i, p in enumerate(d["pages"]):
    if p["url"] in fixed:
        d["pages"][i] = fixed[p["url"]]

clean = [p for p in d["pages"]
         if p["status"] == 200 and not p.get("suspect_truncated")]
d["clean_count"] = len(clean)
d["total_words"] = sum(p.get("word_count", 0) for p in clean)
with gzip.open(path, "wt", encoding="utf-8") as f:
    json.dump(d, f, indent=1)

still = [p["url"] for p in d["pages"]
         if p["status"] != 200 or p.get("suspect_truncated")]
print(f"\n{d['url_count']} urls, {d['clean_count']} clean, {d['total_words']:,} words")
print(f"remaining gaps: {len(still)}")
for s in still:
    print("  " + s)
