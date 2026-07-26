#!/usr/bin/env python3
"""Deep technical crawl of thefloridahavens.com (Wix). Emits pages.json."""
import json, re, sys, urllib.request, gzip, io, time
from concurrent.futures import ThreadPoolExecutor

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"

URLS = [l.strip() for l in open("urls.txt") if l.strip()]

def fetch(url, attempts=5):
    last = None
    for i in range(attempts):
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Encoding": "gzip"})
        t0 = time.time()
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                raw = r.read()
                enc = r.headers.get("Content-Encoding", "")
                wire = len(raw)
                if enc == "gzip":
                    raw = gzip.decompress(raw)
                return {"status": r.status, "html": raw.decode("utf-8", "replace"),
                        "wire_bytes": wire, "html_bytes": len(raw),
                        "ttfb_ms": int((time.time() - t0) * 1000),
                        "headers": dict(r.headers)}
        except Exception as e:
            last = str(e)
            if "429" in last or "503" in last:
                time.sleep(4 * (i + 1))   # linear backoff on throttle
            else:
                time.sleep(1.5)
    return {"status": 0, "error": last, "html": "", "wire_bytes": 0, "html_bytes": 0}

def tag(html, pattern, flags=re.I | re.S):
    m = re.search(pattern, html, flags)
    return m.group(1).strip() if m else None

def analyze(url, r):
    h = r.get("html", "")
    if not h:
        return {"url": url, "status": r.get("status"), "error": r.get("error")}
    d = {"url": url, "status": r["status"], "html_bytes": r["html_bytes"],
         "wire_bytes": r["wire_bytes"], "ttfb_ms": r.get("ttfb_ms")}

    d["title"] = tag(h, r"<title[^>]*>(.*?)</title>")
    d["title_len"] = len(d["title"]) if d["title"] else 0
    d["meta_desc"] = tag(h, r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']') \
        or tag(h, r'<meta[^>]+content=["\'](.*?)["\'][^>]+name=["\']description["\']')
    d["meta_desc_len"] = len(d["meta_desc"]) if d["meta_desc"] else 0
    d["canonical"] = tag(h, r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\'](.*?)["\']')
    d["robots_meta"] = tag(h, r'<meta[^>]+name=["\']robots["\'][^>]+content=["\'](.*?)["\']')
    d["og_title"] = tag(h, r'<meta[^>]+property=["\']og:title["\'][^>]+content=["\'](.*?)["\']')
    d["og_image"] = tag(h, r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\'](.*?)["\']')
    d["og_desc"] = tag(h, r'<meta[^>]+property=["\']og:description["\'][^>]+content=["\'](.*?)["\']')
    d["twitter_card"] = tag(h, r'<meta[^>]+name=["\']twitter:card["\'][^>]+content=["\'](.*?)["\']')
    d["viewport"] = tag(h, r'<meta[^>]+name=["\']viewport["\'][^>]+content=["\'](.*?)["\']')
    d["lang"] = tag(h, r'<html[^>]+lang=["\']([^"\']+)["\']')

    # headings (strip tags inside)
    def headings(n):
        out = []
        for m in re.finditer(rf"<h{n}\b[^>]*>(.*?)</h{n}>", h, re.I | re.S):
            txt = re.sub(r"<[^>]+>", " ", m.group(1))
            txt = re.sub(r"\s+", " ", txt).strip()
            if txt:
                out.append(txt[:160])
        return out
    d["h1"] = headings(1); d["h2"] = headings(2); d["h3"] = headings(3)

    # structured data
    sd_types, sd_raw = [], []
    for m in re.finditer(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', h, re.I | re.S):
        body = m.group(1).strip()
        sd_raw.append(body[:400])
        try:
            data = json.loads(body)
            for obj in (data if isinstance(data, list) else [data]):
                if isinstance(obj, dict):
                    t = obj.get("@type")
                    if t: sd_types.append(t if isinstance(t, str) else ",".join(t))
                    for g in obj.get("@graph", []) or []:
                        if isinstance(g, dict) and g.get("@type"):
                            sd_types.append(str(g["@type"]))
        except Exception:
            sd_types.append("INVALID_JSON")
    d["schema_types"] = sd_types
    d["schema_count"] = len(sd_raw)

    # iframes
    frames = []
    for m in re.finditer(r"<iframe\b([^>]*)>", h, re.I):
        at = m.group(1)
        frames.append({
            "src": (tag(at, r'src=["\']([^"\']+)["\']') or tag(at, r'data-src=["\']([^"\']+)["\']') or ""),
            "title": tag(at, r'title=["\']([^"\']*)["\']'),
            "loading": tag(at, r'loading=["\']([^"\']+)["\']'),
            "height": tag(at, r'height=["\']([^"\']+)["\']'),
        })
    d["iframes"] = frames

    # images
    imgs = re.findall(r"<img\b[^>]*>", h, re.I)
    d["img_count"] = len(imgs)
    d["img_no_alt"] = sum(1 for i in imgs if not re.search(r'\balt=', i, re.I))
    d["img_empty_alt"] = sum(1 for i in imgs if re.search(r'\balt=["\']\s*["\']', i, re.I))
    d["img_no_dims"] = sum(1 for i in imgs if not (re.search(r'\bwidth=', i, re.I) and re.search(r'\bheight=', i, re.I)))
    d["img_lazy"] = sum(1 for i in imgs if re.search(r'loading=["\']lazy', i, re.I))
    # wix image urls -> check format/quality params
    d["img_formats"] = {}
    for u in re.findall(r'https://static\.wixstatic\.com/media/[^\s"\'<>)]+', h):
        fmt = "webp" if ".webp" in u else ("avif" if ".avif" in u else ("png" if ".png" in u else ("jpg" if re.search(r"\.jpe?g", u) else "other")))
        d["img_formats"][fmt] = d["img_formats"].get(fmt, 0) + 1

    # scripts
    d["script_tags"] = len(re.findall(r"<script\b", h, re.I))
    ext = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', h, re.I)
    d["ext_scripts"] = len(ext)
    hosts = {}
    for s in ext:
        m = re.match(r"https?://([^/]+)", s)
        hh = m.group(1) if m else "relative"
        hosts[hh] = hosts.get(hh, 0) + 1
    d["script_hosts"] = hosts
    d["inline_script_bytes"] = sum(len(m.group(1)) for m in re.finditer(r"<script(?![^>]+src=)[^>]*>(.*?)</script>", h, re.I | re.S))

    # links
    hrefs = re.findall(r'<a\b[^>]+href=["\']([^"\']+)["\']', h, re.I)
    internal, external, mailto, tel = set(), set(), 0, 0
    for a in hrefs:
        if a.startswith("mailto:"): mailto += 1
        elif a.startswith("tel:"): tel += 1
        elif a.startswith("/"): internal.add(a.split("#")[0].split("?")[0])
        elif "thefloridahavens.com" in a: internal.add(re.sub(r"^https?://(www\.)?thefloridahavens\.com", "", a).split("#")[0].split("?")[0])
        elif a.startswith("http"):
            m = re.match(r"https?://([^/]+)", a)
            if m: external.add(m.group(1))
    d["links_total"] = len(hrefs)
    d["internal_links"] = sorted(x for x in internal if x)
    d["external_hosts"] = sorted(external)
    d["mailto_links"] = mailto; d["tel_links"] = tel

    # text content (rough) — strip script/style then tags
    body = re.sub(r"<(script|style)\b.*?</\1>", " ", h, flags=re.I | re.S)
    body = re.sub(r"<[^>]+>", " ", body)
    body = re.sub(r"&nbsp;|&amp;|&#\d+;", " ", body)
    words = re.findall(r"[A-Za-z']{2,}", body)
    d["word_count"] = len(words)

    # wix specifics
    d["wix_apps"] = sorted(set(re.findall(r'"appDefinitionName":"([^"]+)"', h)))
    d["has_wix_seo_patch"] = "wix-seo" in h.lower()
    d["preloads"] = len(re.findall(r'rel=["\']preload["\']', h, re.I))
    d["preconnects"] = len(re.findall(r'rel=["\']preconnect["\']', h, re.I))
    d["hreflang"] = re.findall(r'hreflang=["\']([^"\']+)["\']', h, re.I)
    d["fonts"] = sorted(set(re.findall(r'https://static\.parastorage\.com/[^\s"\']*\.woff2?', h)))[:5]
    return d

def one(url):
    return analyze(url, fetch(url))

if __name__ == "__main__":
    results = []
    for n, u in enumerate(URLS, 1):
        results.append(one(u))
        print(f"[{n}/{len(URLS)}] {results[-1].get('status')} {u}", flush=True)
        time.sleep(1.2)   # be polite; Wix throttles aggressively
    json.dump(results, open("pages.json", "w"), indent=1)
    ok = [r for r in results if r.get("status") == 200]
    print(f"crawled {len(results)}, ok {len(ok)}, failed {len(results)-len(ok)}")
    for r in results:
        if r.get("status") != 200:
            print("  FAIL", r["url"], r.get("status"), r.get("error"))
