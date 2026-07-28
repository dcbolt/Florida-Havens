/**
 * Guesty booking-engine configuration — Option A: deep-link out.
 *
 * WHY NOT AN EMBED
 * The live Wix site puts the booking engine in an HtmlComponent that injects a
 * third-party iframe on load. Measured 2026-07-26: `/book-turtle-haven`
 * transfers **12,906 KiB** with a **27.4 s** mobile LCP to deliver ~125 words,
 * and zero `<iframe>` exists in the server HTML, so nothing in the widget was
 * ever indexable. The page paid full freight for a surface Google cannot read,
 * at the exact moment a guest is deciding whether to book.
 *
 * Option A separates the two jobs the embed conflated:
 *   • DISCOVERY   — our page: fast, crawlable, photos, trust copy, stay rules
 *   • TRANSACTION — Guesty's hosted engine, reached by link with dates prefilled
 *
 * It needs **no JavaScript**. The date picker is a plain `<form method="get">`
 * whose action is the listing URL, so the browser builds the query string.
 *
 * ── EVERYTHING BELOW IS VERIFIED, 2026-07-27 ───────────────────────────────
 * Read out of the live engine by driving its own date picker and copying the
 * address bar, rather than taken from documentation. Two of the three original
 * guesses were wrong:
 *   • the path carries a locale segment — `/en/properties/{id}`, not
 *     `/properties/{id}`
 *   • the guest parameter is `adults`, not `guests`
 * `checkIn` / `checkOut` were right, and take `YYYY-MM-DD`.
 *
 * Observed engine URL, verbatim:
 *   …/en/properties/6930907735d2c6003907dca7
 *     ?minOccupancy=4&checkIn=2026-08-16&checkOut=2026-08-20&adults=4
 *
 * `minOccupancy` is deliberately NOT emitted. It duplicated `adults` in every
 * observed URL and is a *search* filter — "show me listings that sleep ≥ N" —
 * which is meaningless on a single-listing page we are linking straight into.
 * Sending it would also require mirroring the guest input into a second field,
 * which a no-JavaScript form cannot do. If the engine ever misbehaves without
 * it, that is the first thing to add back.
 */

/**
 * There are **three** booking engines on this account, not one:
 *
 * | Host | Mode | Covers |
 * |---|---|---|
 * | `thefloridahavens` | Instant book | all 6 listings |
 * | `thehavensatthedunes` | Instant book | Turtle, Shell, The Dunes |
 * | `thehavensatbeachstreet` | **Inquiry only** | Beach, Sea, Beach Street |
 *
 * We default every property to the all-properties brand engine: it matches the
 * marketing domain, it covers everything, and it takes instant bookings.
 *
 * ⚠ UNRESOLVED, NEEDS DEVIN — the Beach Street engine is configured
 * **inquiry-only** while the brand engine will instant-book those same three
 * listings. That is contradictory config, and which one is intended is a
 * business decision, not a technical one. If Beach Haven, Sea Haven and Beach
 * Street are meant to stay inquiry-only, set `engine` on those three entries
 * below to `BEACH_STREET_ENGINE` and they will route there instead. Until Devin
 * says otherwise they instant-book, because the brand engine is explicitly
 * assigned "All properties (6)".
 */
const BRAND_ENGINE = 'https://thefloridahavens.guestybookings.com'
const DUNES_ENGINE = 'https://thehavensatthedunes.guestybookings.com'
const BEACH_STREET_ENGINE = 'https://thehavensatbeachstreet.guestybookings.com'

/** Referenced so the alternates stay discoverable rather than dead constants. */
export const ENGINES = {
  brand: BRAND_ENGINE,
  dunes: DUNES_ENGINE,
  beachStreet: BEACH_STREET_ENGINE,
} as const

export const GUESTY = {
  defaultEngine: BRAND_ENGINE,
  /** Verified. Note the `/en` locale segment. */
  listingPath: '/en/properties/{listingId}',
  /** Verified against the engine's own output. */
  params: {
    checkIn: 'checkIn',
    checkOut: 'checkOut',
    adults: 'adults',
  },
} as const

export type GuestyListing = {
  /** 24-char Guesty listing ID. */
  id: string
  /** Minimum nights, from Calendar → Availability settings. */
  minNights: number
  /** Override the booking engine for this property. See the note above. */
  engine?: string
}

/**
 * All six listings exist in Guesty and map one-to-one onto our slugs — including
 * **real combined listings for both campuses**, which was the open question.
 * That matters: it means the campus pages can take a genuine whole-compound
 * booking instead of falling back to enquiry, and nobody can accidentally book
 * half a compound believing they booked all of it.
 *
 * Occupancy on all six matched `content/property-facts.ts` exactly.
 */
export const GUESTY_LISTINGS: Record<string, GuestyListing> = {
  'turtle-haven': { id: '6930908d1221b20010f4b7d7', minNights: 3 },
  'shell-haven': { id: '6930907ff87e65003c635117', minNights: 3 },
  'beach-haven': { id: '693090778bd512003af719be', minNights: 3 },
  'sea-haven': { id: '6930907735d2c6003907dca7', minNights: 3 },
  'the-dunes': { id: '69309090f87e65003c635474', minNights: 5 },
  'beach-street': { id: '693090811221b20010f4b2f2', minNights: 5 },
}

export type BookingDeepLink = {
  /** Listing URL with no dates — the form's `action`. */
  action: string
  params: typeof GUESTY.params
  minNights: number
}

/**
 * Build the deep-link target for a property, or `null` if we cannot.
 *
 * `null` rather than a best-effort URL is deliberate: a booking link that 404s
 * costs more than no booking link, because the guest concludes the business is
 * broken rather than that they should call.
 *
 * The brand-level `/book/the-florida-havens` route has no Guesty listing —
 * confirmed, there is no "all four houses" listing in the account — so it
 * correctly returns `null` and routes to enquiry.
 */
export function bookingDeepLink(slug: string): BookingDeepLink | null {
  const listing = GUESTY_LISTINGS[slug]
  if (!listing) return null
  const engine = listing.engine ?? GUESTY.defaultEngine
  return {
    action: engine + GUESTY.listingPath.replace('{listingId}', listing.id),
    params: GUESTY.params,
    minNights: listing.minNights,
  }
}
