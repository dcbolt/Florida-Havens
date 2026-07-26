# URL keep / redirect / retire matrix

Every URL in the live Wix sitemap (77 entries, crawled 2026-07-26), classified.
This is the source for `content/url-matrix.ts`, which generates the actual 308s
in `next.config.ts` — the table and the code cannot drift apart.

`liveKb` / `words` are measured live values, kept as the evidence trail for why
a page was called thin or retired.

Next.js emits **308** for permanent redirects rather than 301. Google treats
them equivalently for signal consolidation; 308 additionally preserves the
request method.

## Summary

| Action | Count |
|--------|------:|
| `301` (redirect) | 59 |
| `KEEP` (1:1, no redirect) | 17 |
| `KEEP+NOINDEX` | 1 |
| **Total** | **77** |


## Keep 1:1 — core marketing pages (16)

| Live URL | Action | Destination | Live KB | Words |
|---|---|---|---:|---:|
| `/` | `KEEP` | `/` | 1688 | 820 |
| `/about` | `KEEP` | `/about` | 1011 | 278 |
| `/accessibility-statement` | `KEEP` | `/accessibility-statement` | 978 | 436 |
| `/beach-haven` | `KEEP` | `/beach-haven` | 1298 | 411 |
| `/beach-street` | `KEEP` | `/beach-street` | 1318 | 408 |
| `/contact` | `KEEP` | `/contact` | 994 | 158 |
| `/faqs` | `KEEP` | `/faqs` | 1454 | 1053 |
| `/guest-blog` | `KEEP` | `/guest-blog` | 1191 | 183 |
| `/privacy-policy` | `KEEP` | `/privacy-policy` | 981 | 769 |
| `/properties` | `KEEP` | `/properties` | 1095 | 339 |
| `/refund-policy` | `KEEP` | `/refund-policy` | 975 | 450 |
| `/sea-haven` | `KEEP` | `/sea-haven` | 1297 | 423 |
| `/shell-haven` | `KEEP` | `/shell-haven` | 1298 | 381 |
| `/terms-and-conditions` | `KEEP` | `/terms-and-conditions` | 989 | 1043 |
| `/the-dunes` | `KEEP` | `/the-dunes` | 1318 | 479 |
| `/turtle-haven` | `KEEP` | `/turtle-haven` | 1302 | 452 |

## Book pages → `/book/[slug]` (7)

| Live URL | Action | Destination | Live KB | Words |
|---|---|---|---:|---:|
| `/book-beach-haven` | `301` | `/book/beach-haven` | 942 | 122 |
| `/book-beach-street` | `301` | `/book/beach-street` | 945 | 130 |
| `/book-sea-haven` | `301` | `/book/sea-haven` | 942 | 122 |
| `/book-shell-haven` | `301` | `/book/shell-haven` | 942 | 122 |
| `/book-the-dunes` | `301` | `/book/the-dunes` | 960 | 132 |
| `/book-the-florida-havens` | `301` | `/book/the-florida-havens` | 946 | 125 |
| `/book-turtle-haven` | `301` | `/book/turtle-haven` | 942 | 122 |

## SEO demand pages → `/guides/*` (10)

| Live URL | Action | Destination | Live KB | Words |
|---|---|---|---:|---:|
| `/beach-house-near-orlando-theme-parks` | `301` | `/guides/orlando-theme-parks` | 1032 | 532 |
| `/beach-house-near-sebastian-inlet` | `301` | `/guides/sebastian-inlet` | 1013 | 518 |
| `/best-restaurants-near-melbourne-beach-indialantic` | `301` | `/guides/best-restaurants` | 1171 | 939 |
| `/cape-canaveral-cruise-port-beach-stay` | `301` | `/guides/cape-canaveral-cruise-port` | 1033 | 492 |
| `/local-attractions-melbourne-beach` | `301` | `/guides/local-attractions` | 1057 | 677 |
| `/stay-near-brevard-zoo-melbourne-beach-house` | `301` | `/guides/brevard-zoo` | 349 | 0 |
| `/stay-near-space-coast-rocket-launches-kennedy-space-center-beach-house` | `301` | `/guides/space-coast-rocket-launches` | 0 | — |
| `/things-to-do-indialantic-melbourne-beach` | `301` | `/guides/things-to-do-indialantic` | 1040 | 666 |
| `/travel-with-your-pets` | `301` | `/guides/travel-with-pets` | 951 | 340 |
| `/usssa-space-coast-complex-vacation-rental` | `301` | `/guides/usssa-space-coast-complex` | 998 | 516 |

## Typo slug (1)

| Live URL | Action | Destination | Live KB | Words |
|---|---|---|---:|---:|
| `/beach-strret-wifi-guide` | `301` | `https://welcome.mediahaven.app/beach-street/wifi` | 947 | 133 |

## Guest-resources hub (1)

| Live URL | Action | Destination | Live KB | Words |
|---|---|---|---:|---:|
| `/guest-resources` | `301` | `https://welcome.mediahaven.app` | 1268 | 128 |

## Blog (1)

| Live URL | Action | Destination | Live KB | Words |
|---|---|---|---:|---:|
| `/post/sea-turtle-nesting-season-in-florida` | `KEEP` | `/post/sea-turtle-nesting-season-in-florida` | 1384 | 409 |

## Form page (1)

| Live URL | Action | Destination | Live KB | Words |
|---|---|---|---:|---:|
| `/guest-story-entry-form` | `KEEP+NOINDEX` | `/guest-story-entry-form` | 1404 | 245 |

## Guest-ops → Media Haven guest portal (40)

| Live URL | Action | Destination | Live KB | Words |
|---|---|---|---:|---:|
| `/beach-street-ac` | `301` | `https://welcome.mediahaven.app` | 950 | 195 |
| `/beach-street-amenities` | `301` | `https://welcome.mediahaven.app` | 973 | 370 |
| `/beach-street-bbq-grill-guide` | `301` | `https://welcome.mediahaven.app` | 951 | 192 |
| `/beach-street-beach-rules` | `301` | `https://welcome.mediahaven.app` | 957 | 344 |
| `/beach-street-check-in` | `301` | `https://welcome.mediahaven.app` | 947 | 191 |
| `/beach-street-check-out` | `301` | `https://welcome.mediahaven.app` | 967 | 402 |
| `/beach-street-emergency-guide` | `301` | `https://welcome.mediahaven.app` | 968 | 646 |
| `/beach-street-guidebook` | `301` | `https://welcome.mediahaven.app` | 1073 | 442 |
| `/beach-street-house-guide` | `301` | `https://welcome.mediahaven.app` | 987 | 295 |
| `/beach-street-kitchen-guide` | `301` | `https://welcome.mediahaven.app` | 952 | 292 |
| `/beach-street-laundry-guide` | `301` | `https://welcome.mediahaven.app` | 949 | 189 |
| `/beach-street-meet-your-hosts` | `301` | `https://welcome.mediahaven.app` | 1012 | 366 |
| `/beach-street-parking` | `301` | `https://welcome.mediahaven.app` | 945 | 145 |
| `/beach-street-pool-spa` | `301` | `https://welcome.mediahaven.app` | 965 | 292 |
| `/beach-street-sea-turtle-guide` | `301` | `https://welcome.mediahaven.app` | 954 | 353 |
| `/beach-street-shuttle-launches` | `301` | `/guides/space-coast-rocket-launches` | 949 | 167 |
| `/beach-street-tv-entertainment-guide` | `301` | `https://welcome.mediahaven.app` | 951 | 197 |
| `/beach-street-waste-management` | `301` | `https://welcome.mediahaven.app` | 946 | 254 |
| `/connect-dunes` | `301` | `https://welcome.mediahaven.app` | 980 | 113 |
| `/connect-havens` | `301` | `https://welcome.mediahaven.app` | 980 | 112 |
| `/dunes-air-conditioning` | `301` | `https://welcome.mediahaven.app` | 950 | 218 |
| `/dunes-amenities` | `301` | `https://welcome.mediahaven.app` | 971 | 361 |
| `/dunes-bbq-grill-guide` | `301` | `https://welcome.mediahaven.app` | 951 | 202 |
| `/dunes-beach-guide` | `301` | `https://welcome.mediahaven.app` | 959 | 413 |
| `/dunes-check-in` | `301` | `https://welcome.mediahaven.app` | 947 | 191 |
| `/dunes-check-out` | `301` | `https://welcome.mediahaven.app` | 967 | 392 |
| `/dunes-emergency-guide` | `301` | `https://welcome.mediahaven.app` | 0 | — |
| `/dunes-ev-charging` | `301` | `https://welcome.mediahaven.app` | 949 | 228 |
| `/dunes-guide-book` | `301` | `https://welcome.mediahaven.app` | 1076 | 457 |
| `/dunes-house-guide` | `301` | `https://welcome.mediahaven.app` | 988 | 350 |
| `/dunes-kitchen-guide` | `301` | `https://welcome.mediahaven.app` | 952 | 285 |
| `/dunes-laundry-guide` | `301` | `https://welcome.mediahaven.app` | 949 | 189 |
| `/dunes-meet-your-hosts` | `301` | `https://welcome.mediahaven.app` | 1012 | 369 |
| `/dunes-parking` | `301` | `https://welcome.mediahaven.app` | 967 | 179 |
| `/dunes-pool-guide` | `301` | `https://welcome.mediahaven.app` | 968 | 352 |
| `/dunes-sea-turtle-guide` | `301` | `https://welcome.mediahaven.app` | 954 | 352 |
| `/dunes-tv-entertainment-guide` | `301` | `https://welcome.mediahaven.app` | 953 | 209 |
| `/dunes-waste-management` | `301` | `https://welcome.mediahaven.app` | 0 | — |
| `/dunes-wifi-guide` | `301` | `https://welcome.mediahaven.app` | 946 | 118 |
| `/turtle-haven-virtual-tour` | `301` | `https://welcome.mediahaven.app` | 949 | 88 |

## Cutover order

1. Ship the rebuild to a preview URL; verify all routes render.
2. Re-crawl the live Wix sitemap to catch any URL added since 2026-07-26 —
   `python3 tools/crawl.py`. Regenerate this matrix if the count moved off 77.
3. Point DNS. The 308s in `next.config.ts` are live from the first request.
4. Submit the new `/sitemap.xml` (33 URLs) in Search Console; leave the old one
   in place for a crawl cycle so Google discovers the redirects.
5. Watch Coverage for the retired guest-ops URLs moving to
   "Page with redirect". Do not remove the redirects until they have.

