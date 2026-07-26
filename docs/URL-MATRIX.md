# URL keep / redirect / retire matrix

Every URL in the live Wix sitemap (77 entries, crawled 2026-07-26), classified.

**Generated** by `tools/gen-matrix-doc.py` from `content/url-matrix.ts` — the
same module `next.config.ts` reads to emit the redirects, so this table and the
live behaviour cannot drift apart. Do not hand-edit.

`liveKb` / `words` are measured live values, kept as the evidence trail for why
a page was called thin or retired.

Next.js emits **308** for permanent redirects rather than 301. Google treats
them equivalently for signal consolidation; 308 additionally preserves the
request method.

## `GUEST_PORTAL_TARGET`

Guest-ops rows point at this symbol, not a literal host.
`welcome.mediahaven.app` was assumed early and **does not exist** — no DNS
record for it or for `mediahaven.app`. A permanent redirect to a nonexistent
host is worse than leaving the page up, so while `GUEST_PORTAL.hostConfirmed`
is `false` in `content/site.ts` these resolve to the on-domain
`/guest-portal` notice page (which is `noindex`, so the index bloat is still
cleared). Set the confirmed host and flip that flag to convert every one of
them to an external 301 — no other edit needed.

## Summary

| Action | Count |
|--------|------:|
| `301` | 59 |
| `KEEP` | 17 |
| `KEEP+NOINDEX` | 1 |
| **Total** | **77** |


## guest-ops → Media Haven (never on marketing domain) (39)

| Live URL | Action | Destination | Live KB | Words |
|---|---|---|---:|---:|
| `/beach-street-ac` | `301` | `GUEST_PORTAL_TARGET` | 950 | 195 |
| `/beach-street-amenities` | `301` | `GUEST_PORTAL_TARGET` | 973 | 370 |
| `/beach-street-bbq-grill-guide` | `301` | `GUEST_PORTAL_TARGET` | 951 | 192 |
| `/beach-street-beach-rules` | `301` | `GUEST_PORTAL_TARGET` | 957 | 344 |
| `/beach-street-check-in` | `301` | `GUEST_PORTAL_TARGET` | 947 | 191 |
| `/beach-street-check-out` | `301` | `GUEST_PORTAL_TARGET` | 967 | 402 |
| `/beach-street-emergency-guide` | `301` | `GUEST_PORTAL_TARGET` | 968 | 646 |
| `/beach-street-guidebook` | `301` | `GUEST_PORTAL_TARGET` | 1073 | 442 |
| `/beach-street-house-guide` | `301` | `GUEST_PORTAL_TARGET` | 987 | 295 |
| `/beach-street-kitchen-guide` | `301` | `GUEST_PORTAL_TARGET` | 952 | 292 |
| `/beach-street-laundry-guide` | `301` | `GUEST_PORTAL_TARGET` | 949 | 189 |
| `/beach-street-meet-your-hosts` | `301` | `GUEST_PORTAL_TARGET` | 1012 | 366 |
| `/beach-street-parking` | `301` | `GUEST_PORTAL_TARGET` | 945 | 145 |
| `/beach-street-pool-spa` | `301` | `GUEST_PORTAL_TARGET` | 965 | 292 |
| `/beach-street-sea-turtle-guide` | `301` | `GUEST_PORTAL_TARGET` | 954 | 353 |
| `/beach-street-tv-entertainment-guide` | `301` | `GUEST_PORTAL_TARGET` | 951 | 197 |
| `/beach-street-waste-management` | `301` | `GUEST_PORTAL_TARGET` | 946 | 254 |
| `/connect-dunes` | `301` | `GUEST_PORTAL_TARGET` | 980 | 113 |
| `/connect-havens` | `301` | `GUEST_PORTAL_TARGET` | 980 | 112 |
| `/dunes-air-conditioning` | `301` | `GUEST_PORTAL_TARGET` | 950 | 218 |
| `/dunes-amenities` | `301` | `GUEST_PORTAL_TARGET` | 971 | 361 |
| `/dunes-bbq-grill-guide` | `301` | `GUEST_PORTAL_TARGET` | 951 | 202 |
| `/dunes-beach-guide` | `301` | `GUEST_PORTAL_TARGET` | 959 | 413 |
| `/dunes-check-in` | `301` | `GUEST_PORTAL_TARGET` | 947 | 191 |
| `/dunes-check-out` | `301` | `GUEST_PORTAL_TARGET` | 967 | 392 |
| `/dunes-emergency-guide` | `301` | `GUEST_PORTAL_TARGET` | 0 | — |
| `/dunes-ev-charging` | `301` | `GUEST_PORTAL_TARGET` | 949 | 228 |
| `/dunes-guide-book` | `301` | `GUEST_PORTAL_TARGET` | 1076 | 457 |
| `/dunes-house-guide` | `301` | `GUEST_PORTAL_TARGET` | 988 | 350 |
| `/dunes-kitchen-guide` | `301` | `GUEST_PORTAL_TARGET` | 952 | 285 |
| `/dunes-laundry-guide` | `301` | `GUEST_PORTAL_TARGET` | 949 | 189 |
| `/dunes-meet-your-hosts` | `301` | `GUEST_PORTAL_TARGET` | 1012 | 369 |
| `/dunes-parking` | `301` | `GUEST_PORTAL_TARGET` | 967 | 179 |
| `/dunes-pool-guide` | `301` | `GUEST_PORTAL_TARGET` | 968 | 352 |
| `/dunes-sea-turtle-guide` | `301` | `GUEST_PORTAL_TARGET` | 954 | 352 |
| `/dunes-tv-entertainment-guide` | `301` | `GUEST_PORTAL_TARGET` | 953 | 209 |
| `/dunes-waste-management` | `301` | `GUEST_PORTAL_TARGET` | 0 | — |
| `/dunes-wifi-guide` | `301` | `GUEST_PORTAL_TARGET` | 946 | 118 |
| `/turtle-haven-virtual-tour` | `301` | `GUEST_PORTAL_TARGET` | 949 | 88 |

## 1:1 URL, no redirect needed (16)

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

## SEO demand page → /guides/* (10)

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

## lean book route (7)

| Live URL | Action | Destination | Live KB | Words |
|---|---|---|---:|---:|
| `/book-beach-haven` | `301` | `/book/beach-haven` | 942 | 122 |
| `/book-beach-street` | `301` | `/book/beach-street` | 945 | 130 |
| `/book-sea-haven` | `301` | `/book/sea-haven` | 942 | 122 |
| `/book-shell-haven` | `301` | `/book/shell-haven` | 942 | 122 |
| `/book-the-dunes` | `301` | `/book/the-dunes` | 960 | 132 |
| `/book-the-florida-havens` | `301` | `/book/the-florida-havens` | 946 | 125 |
| `/book-turtle-haven` | `301` | `/book/turtle-haven` | 942 | 122 |

## 1:1 blog post (1)

| Live URL | Action | Destination | Live KB | Words |
|---|---|---|---:|---:|
| `/post/sea-turtle-nesting-season-in-florida` | `KEEP` | `/post/sea-turtle-nesting-season-in-florida` | 1384 | 409 |

## TYPO SLUG — redirect then retire (1)

| Live URL | Action | Destination | Live KB | Words |
|---|---|---|---:|---:|
| `/beach-strret-wifi-guide` | `301` | `GUEST_PORTAL_TARGET` | 947 | 133 |

## demand content, not guest-ops — live title is "Space Coast Rocket Launch Schedule"; folded into the rocket guide (1)

| Live URL | Action | Destination | Live KB | Words |
|---|---|---|---:|---:|
| `/beach-street-shuttle-launches` | `301` | `/guides/space-coast-rocket-launches` | 949 | 167 |

## hub → Media Haven portal (1)

| Live URL | Action | Destination | Live KB | Words |
|---|---|---|---:|---:|
| `/guest-resources` | `301` | `GUEST_PORTAL_TARGET` | 1268 | 128 |

## thin form page, keep but noindex (1)

| Live URL | Action | Destination | Live KB | Words |
|---|---|---|---:|---:|
| `/guest-story-entry-form` | `KEEP+NOINDEX` | `/guest-story-entry-form` | 1404 | 245 |

## Cutover order

1. Ship the rebuild to a preview URL; verify all routes render.
2. Re-crawl the live Wix sitemap to catch any URL added since 2026-07-26 —
   `python3 tools/crawl.py`. Regenerate this doc if the count moves off 77.
3. Confirm the guest-portal host and flip `GUEST_PORTAL.hostConfirmed`.
4. Point DNS. The 308s are live from the first request.
5. Submit the new `/sitemap.xml` in Search Console; leave the old sitemap in
   place for a crawl cycle so Google discovers the redirects.
6. Watch Coverage for the retired guest-ops URLs moving to "Page with
   redirect". Do not remove the redirects until they have.
