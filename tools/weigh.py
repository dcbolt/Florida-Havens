#!/usr/bin/env python3
"""Measure real transfer weight of a page's static subresources.
Parses HTML for scripts/css/images/fonts/iframes, fetches each (gzip-aware),
and reports totals by type and by host. Emits weight-<slug>.json."""
import json, re, sys, time, gzip, urllib.request
from concurrent.futures import ThreadPoolExecutor

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"

def get(url, referer=None, cap=None):
    hdr = {"User-Agent": UA, "Accept-Encoding": "gzip, deflate, br"}
    if referer: hdr["Referer"] = referer
    for i in range(4):
        try:
            req = urllib.request.Request(url, headers=hdr)
            with urllib.request.urlopen(req, timeout=45) as r:
                raw = r.read(cap) if cap else r.read()
                return {"status": r.status, "wire": len(raw), "raw": raw,
                        "ctype": r.headers.get("Content-Type", ""),
                        "cenc": r.headers.get("Content-Encoding", ""),
                        "cc": r.headers.get("Cache-Control", "")}
        except Exception as e:
            msg = str(e)
            if "429" in msg or "503" in msg: time.sleep(4 * (i + 1))
            else: return {"status": 0, "wire": 0, "raw": b"", "error": msg}
    return {"status": 0, "wire": 0, "raw": b"", "error": "throttled"}

def absolutize(u, base="https://www.thefloridahavens.com"):
    if u.startswith("//"): return "https:" + u
    if u.startswith("/"): return base + u
    if u.startswith("http"): return u
    return None

def classify(url, ctype):
    c = ctype.lower()
    if "javascript" in c or url.endswith(".js"): return "js"
    if "css" in c or ".css" in url: return "css"
    if "font" in c or re.search(r"\.woff2?$|\.ttf$", url): return "font"
    if "image" in c or re.search(r"\.(webp|avif|png|jpe?g|gif|svg|ico)", url): return "image"
    if "html" in c: return "html"
    if "json" in c: return "json"
    return "other"

def host(u):
    m = re.match(r"https?://([^/]+)", u); return m.group(1) if m else "?"

def analyze(page_url, slug):
    top = get(page_url)
    html = gzip.decompress(top["raw"]).decode("utf-8", "replace") if top.get("cenc") == "gzip" else top["raw"].decode("utf-8", "replace")
    doc_wire = top["wire"]

    urls, seen = [], set()
    def add(u, kind, blocking=False):
        a = absolutize(u)
        if a and a not in seen and not a.startswith("data:"):
            seen.add(a); urls.append({"url": a, "declared": kind, "blocking": blocking})

    # scripts: blocking = no async/defer
    for m in re.finditer(r"<script\b([^>]*)>", html, re.I):
        at = m.group(1)
        s = re.search(r'src=["\']([^"\']+)["\']', at)
        if s:
            blk = not re.search(r"\b(async|defer|type=[\"']module)", at, re.I)
            add(s.group(1), "script", blk)
    # stylesheets
    for m in re.finditer(r"<link\b([^>]*)>", html, re.I):
        at = m.group(1)
        rel = (re.search(r'rel=["\']([^"\']+)["\']', at) or [None, ""])[1]
        h = re.search(r'href=["\']([^"\']+)["\']', at)
        if not h: continue
        if "stylesheet" in rel.lower(): add(h.group(1), "css", True)
        elif "preload" in rel.lower(): add(h.group(1), "preload")
    # images (src + srcset first candidate)
    for m in re.finditer(r"<img\b([^>]*)>", html, re.I):
        at = m.group(1)
        s = re.search(r'\bsrc=["\']([^"\']+)["\']', at)
        if s: add(s.group(1), "img")
    # css background images referencing wixstatic
    for u in set(re.findall(r'https://static\.wixstatic\.com/media/[^\s"\'<>)\\]+', html))    :
        add(u, "img-bg")

    def fetch_one(item):
        r = get(item["url"], referer=page_url)
        return {**item, "status": r["status"], "wire": r["wire"],
                "type": classify(item["url"], r.get("ctype", "")),
                "cache": r.get("cc", ""), "error": r.get("error")}

    with ThreadPoolExecutor(max_workers=8) as ex:
        res = list(ex.map(fetch_one, urls))

    by_type, by_host = {}, {}
    for r in res:
        t = r["type"]; by_type.setdefault(t, {"count": 0, "bytes": 0})
        by_type[t]["count"] += 1; by_type[t]["bytes"] += r["wire"]
        h = host(r["url"]); by_host.setdefault(h, {"count": 0, "bytes": 0})
        by_host[h]["count"] += 1; by_host[h]["bytes"] += r["wire"]

    blocking = [r for r in res if r.get("blocking")]
    out = {
        "url": page_url, "doc_wire_bytes": doc_wire, "doc_html_bytes": len(html.encode()),
        "subresource_count": len(res),
        "subresource_wire_bytes": sum(r["wire"] for r in res),
        "total_wire_bytes": doc_wire + sum(r["wire"] for r in res),
        "by_type": dict(sorted(by_type.items(), key=lambda kv: -kv[1]["bytes"])),
        "by_host": dict(sorted(by_host.items(), key=lambda kv: -kv[1]["bytes"])),
        "blocking_count": len(blocking),
        "blocking_bytes": sum(r["wire"] for r in blocking),
        "blocking_urls": [r["url"] for r in blocking][:20],
        "biggest": sorted([{"url": r["url"][:150], "kb": round(r["wire"]/1024, 1), "type": r["type"]} for r in res],
                          key=lambda x: -x["kb"])[:20],
        "failed": [{"url": r["url"][:120], "err": r.get("error")} for r in res if r["status"] != 200][:15],
    }
    json.dump(out, open(f"weight-{slug}.json", "w"), indent=1)
    mb = out["total_wire_bytes"] / 1048576
    print(f"\n### {page_url}")
    print(f"  document (gzipped on wire): {doc_wire/1024:.0f} KB  | uncompressed HTML {len(html.encode())/1024:.0f} KB")
    print(f"  subresources: {out['subresource_count']} requests, {out['subresource_wire_bytes']/1048576:.2f} MB")
    print(f"  TOTAL: {mb:.2f} MB over {out['subresource_count']+1} requests")
    print(f"  render-blocking: {out['blocking_count']} files, {out['blocking_bytes']/1024:.0f} KB")
    for t, v in out["by_type"].items():
        print(f"    {t:9} {v['count']:4} req  {v['bytes']/1024:9.0f} KB")
    return out

if __name__ == "__main__":
    for spec in sys.argv[1:]:
        slug, url = spec.split("=", 1)
        analyze(url, slug)
