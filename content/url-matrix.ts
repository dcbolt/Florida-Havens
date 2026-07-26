/**
 * Complete keep / redirect / retire matrix for every URL in the live Wix
 * sitemap (77 entries, crawled 2026-07-26).
 *
 *   KEEP          — URL survives 1:1, no redirect
 *   KEEP+NOINDEX  — URL survives but must not be indexed
 *   301           — permanent redirect (Next emits 308, which Google treats
 *                   as equivalent to 301 for consolidation)
 *   REVIEW        — needs a human decision before cutover
 *
 * `liveKb` / `words` are the measured live values, kept as the evidence trail
 * for why a page was classed thin or retired.
 */
export type UrlAction = 'KEEP' | 'KEEP+NOINDEX' | '301' | 'REVIEW'

export type UrlRow = {
  from: string
  to: string
  action: UrlAction
  note: string
  liveKb: number
  words: number | null
}

export const URL_MATRIX: UrlRow[] = [
  { from: '/', to: '/', action: 'KEEP', note: '1:1 URL, no redirect needed', liveKb: 1688, words: 820 },
  { from: '/about', to: '/about', action: 'KEEP', note: '1:1 URL, no redirect needed', liveKb: 1011, words: 278 },
  { from: '/accessibility-statement', to: '/accessibility-statement', action: 'KEEP', note: '1:1 URL, no redirect needed', liveKb: 978, words: 436 },
  { from: '/beach-haven', to: '/beach-haven', action: 'KEEP', note: '1:1 URL, no redirect needed', liveKb: 1298, words: 411 },
  { from: '/beach-house-near-orlando-theme-parks', to: '/guides/orlando-theme-parks', action: '301', note: 'SEO demand page → /guides/*', liveKb: 1032, words: 532 },
  { from: '/beach-house-near-sebastian-inlet', to: '/guides/sebastian-inlet', action: '301', note: 'SEO demand page → /guides/*', liveKb: 1013, words: 518 },
  { from: '/beach-street', to: '/beach-street', action: 'KEEP', note: '1:1 URL, no redirect needed', liveKb: 1318, words: 408 },
  { from: '/beach-street-ac', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 950, words: 195 },
  { from: '/beach-street-amenities', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 973, words: 370 },
  { from: '/beach-street-bbq-grill-guide', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 951, words: 192 },
  { from: '/beach-street-beach-rules', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 957, words: 344 },
  { from: '/beach-street-check-in', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 947, words: 191 },
  { from: '/beach-street-check-out', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 967, words: 402 },
  { from: '/beach-street-emergency-guide', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 968, words: 646 },
  { from: '/beach-street-guidebook', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 1073, words: 442 },
  { from: '/beach-street-house-guide', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 987, words: 295 },
  { from: '/beach-street-kitchen-guide', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 952, words: 292 },
  { from: '/beach-street-laundry-guide', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 949, words: 189 },
  { from: '/beach-street-meet-your-hosts', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 1012, words: 366 },
  { from: '/beach-street-parking', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 945, words: 145 },
  { from: '/beach-street-pool-spa', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 965, words: 292 },
  { from: '/beach-street-sea-turtle-guide', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 954, words: 353 },
  { from: '/beach-street-shuttle-launches', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 949, words: 167 },
  { from: '/beach-street-tv-entertainment-guide', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 951, words: 197 },
  { from: '/beach-street-waste-management', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 946, words: 254 },
  { from: '/beach-strret-wifi-guide', to: 'https://welcome.mediahaven.app/beach-street/wifi', action: '301', note: 'TYPO SLUG — redirect then retire', liveKb: 947, words: 133 },
  { from: '/best-restaurants-near-melbourne-beach-indialantic', to: '/guides/best-restaurants', action: '301', note: 'SEO demand page → /guides/*', liveKb: 1171, words: 939 },
  { from: '/book-beach-haven', to: '/book/beach-haven', action: '301', note: 'lean book route', liveKb: 942, words: 122 },
  { from: '/book-beach-street', to: '/book/beach-street', action: '301', note: 'lean book route', liveKb: 945, words: 130 },
  { from: '/book-sea-haven', to: '/book/sea-haven', action: '301', note: 'lean book route', liveKb: 942, words: 122 },
  { from: '/book-shell-haven', to: '/book/shell-haven', action: '301', note: 'lean book route', liveKb: 942, words: 122 },
  { from: '/book-the-dunes', to: '/book/the-dunes', action: '301', note: 'lean book route', liveKb: 960, words: 132 },
  { from: '/book-the-florida-havens', to: '/book/the-florida-havens', action: '301', note: 'lean book route', liveKb: 946, words: 125 },
  { from: '/book-turtle-haven', to: '/book/turtle-haven', action: '301', note: 'lean book route', liveKb: 942, words: 122 },
  { from: '/cape-canaveral-cruise-port-beach-stay', to: '/guides/cape-canaveral-cruise-port', action: '301', note: 'SEO demand page → /guides/*', liveKb: 1033, words: 492 },
  { from: '/connect-dunes', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 980, words: 113 },
  { from: '/connect-havens', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 980, words: 112 },
  { from: '/contact', to: '/contact', action: 'KEEP', note: '1:1 URL, no redirect needed', liveKb: 994, words: 158 },
  { from: '/dunes-air-conditioning', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 950, words: 218 },
  { from: '/dunes-amenities', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 971, words: 361 },
  { from: '/dunes-bbq-grill-guide', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 951, words: 202 },
  { from: '/dunes-beach-guide', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 959, words: 413 },
  { from: '/dunes-check-in', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 947, words: 191 },
  { from: '/dunes-check-out', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 967, words: 392 },
  { from: '/dunes-emergency-guide', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 0, words: null },
  { from: '/dunes-ev-charging', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 949, words: 228 },
  { from: '/dunes-guide-book', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 1076, words: 457 },
  { from: '/dunes-house-guide', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 988, words: 350 },
  { from: '/dunes-kitchen-guide', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 952, words: 285 },
  { from: '/dunes-laundry-guide', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 949, words: 189 },
  { from: '/dunes-meet-your-hosts', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 1012, words: 369 },
  { from: '/dunes-parking', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 967, words: 179 },
  { from: '/dunes-pool-guide', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 968, words: 352 },
  { from: '/dunes-sea-turtle-guide', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 954, words: 352 },
  { from: '/dunes-tv-entertainment-guide', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 953, words: 209 },
  { from: '/dunes-waste-management', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 0, words: null },
  { from: '/dunes-wifi-guide', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 946, words: 118 },
  { from: '/faqs', to: '/faqs', action: 'KEEP', note: '1:1 URL, no redirect needed', liveKb: 1454, words: 1053 },
  { from: '/guest-blog', to: '/guest-blog', action: 'KEEP', note: '1:1 URL, no redirect needed', liveKb: 1191, words: 183 },
  { from: '/guest-resources', to: 'https://welcome.mediahaven.app', action: '301', note: 'hub → Media Haven portal', liveKb: 1268, words: 128 },
  { from: '/guest-story-entry-form', to: '/guest-story-entry-form', action: 'KEEP+NOINDEX', note: 'thin form page, keep but noindex', liveKb: 1404, words: 245 },
  { from: '/local-attractions-melbourne-beach', to: '/guides/local-attractions', action: '301', note: 'SEO demand page → /guides/*', liveKb: 1057, words: 677 },
  { from: '/post/sea-turtle-nesting-season-in-florida', to: '/post/sea-turtle-nesting-season-in-florida', action: 'KEEP', note: '1:1 blog post', liveKb: 1384, words: 409 },
  { from: '/privacy-policy', to: '/privacy-policy', action: 'KEEP', note: '1:1 URL, no redirect needed', liveKb: 981, words: 769 },
  { from: '/properties', to: '/properties', action: 'KEEP', note: '1:1 URL, no redirect needed', liveKb: 1095, words: 339 },
  { from: '/refund-policy', to: '/refund-policy', action: 'KEEP', note: '1:1 URL, no redirect needed', liveKb: 975, words: 450 },
  { from: '/sea-haven', to: '/sea-haven', action: 'KEEP', note: '1:1 URL, no redirect needed', liveKb: 1297, words: 423 },
  { from: '/shell-haven', to: '/shell-haven', action: 'KEEP', note: '1:1 URL, no redirect needed', liveKb: 1298, words: 381 },
  { from: '/stay-near-brevard-zoo-melbourne-beach-house', to: '/guides/brevard-zoo', action: '301', note: 'SEO demand page → /guides/*', liveKb: 349, words: 0 },
  { from: '/stay-near-space-coast-rocket-launches-kennedy-space-center-beach-house', to: '/guides/space-coast-rocket-launches', action: '301', note: 'SEO demand page → /guides/*', liveKb: 0, words: null },
  { from: '/terms-and-conditions', to: '/terms-and-conditions', action: 'KEEP', note: '1:1 URL, no redirect needed', liveKb: 989, words: 1043 },
  { from: '/the-dunes', to: '/the-dunes', action: 'KEEP', note: '1:1 URL, no redirect needed', liveKb: 1318, words: 479 },
  { from: '/things-to-do-indialantic-melbourne-beach', to: '/guides/things-to-do-indialantic', action: '301', note: 'SEO demand page → /guides/*', liveKb: 1040, words: 666 },
  { from: '/travel-with-your-pets', to: '/guides/travel-with-pets', action: '301', note: 'SEO demand page → /guides/*', liveKb: 951, words: 340 },
  { from: '/turtle-haven', to: '/turtle-haven', action: 'KEEP', note: '1:1 URL, no redirect needed', liveKb: 1302, words: 452 },
  { from: '/turtle-haven-virtual-tour', to: 'https://welcome.mediahaven.app', action: '301', note: 'guest-ops → Media Haven (never on marketing domain)', liveKb: 949, words: 88 },
  { from: '/usssa-space-coast-complex-vacation-rental', to: '/guides/usssa-space-coast-complex', action: '301', note: 'SEO demand page → /guides/*', liveKb: 998, words: 516 },
]

/** Internal 308s Next.js can serve directly (external targets are excluded). */
export const INTERNAL_REDIRECTS = URL_MATRIX.filter(
  (r) => r.action === '301' && r.to.startsWith('/')
)

/** Guest-ops URLs whose content belongs to Media Haven, not this domain. */
export const EXTERNAL_REDIRECTS = URL_MATRIX.filter(
  (r) => r.action === '301' && !r.to.startsWith('/')
)

export const NOINDEX_PATHS = URL_MATRIX.filter(
  (r) => r.action === 'KEEP+NOINDEX'
).map((r) => r.from)

