# Crawl evidence

- `urls.txt`   — the 77 URLs from the live Wix sitemap (crawl input)
- `pages.json` — raw per-page crawl output, 2026-07-26. Every figure in
  `docs/AUDIT.md` derives from this file.
- `faqs.json`  — the 21 Q&As scraped from the live /faqs page

Regenerate: `cd data && python3 ../tools/crawl.py`

Note: Wix rate-limits aggressively (HTTP 429). `crawl.py` runs serially with a
1.2s delay and linear backoff. 3 of 77 URLs were still lost on the pass that
produced this snapshot; a partial read shows up as a small `html_bytes` with a
low `word_count`, so treat any page under ~400 KB as suspect and re-fetch it
before drawing a conclusion.
