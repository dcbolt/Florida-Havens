/**
 * Guesty booking-engine configuration — Option A: deep-link out.
 *
 * WHY NOT AN EMBED
 * The live Wix site puts the booking engine in an HtmlComponent that injects a
 * third-party iframe on load. Measured on 2026-07-26: `/book-turtle-haven`
 * transfers **12,906 KiB** with a **27.4 s** mobile LCP to deliver ~125 words,
 * and zero `<iframe>` exists in the server HTML, so nothing in the widget is
 * indexable anyway. The page pays full freight for a surface Google cannot read,
 * at the exact moment a guest is deciding whether to book.
 *
 * Option A separates the two jobs the embed was conflating:
 *   • DISCOVERY  — our own fast, crawlable page: photos, trust copy, price context
 *   • TRANSACTION — Guesty's hosted engine, reached by link with dates prefilled
 *
 * The result needs **no JavaScript at all**. The date form is a plain
 * `<form method="get">` whose action is the Guesty listing URL, so the browser
 * builds the query string natively. Nothing to hydrate, nothing to maintain.
 *
 * Option B (server-rendered availability and rates via the Guesty Open API,
 * hosted checkout retained) is the intended successor. It needs API credentials
 * and a Guesty tier that exposes them. This file is shaped so B slots in
 * alongside it: the deep link stays as the checkout hand-off either way.
 *
 * ── WHAT MUST BE VERIFIED BEFORE THIS GOES LIVE ────────────────────────────
 * `baseUrl`, `listingPath` and every name in `params` are the plausible Guesty
 * booking-engine shape, NOT confirmed against this account's engine. Open one
 * real booking URL, read the query string the engine itself produces, and
 * correct them here. They are isolated in this file for exactly that reason.
 *
 * Getting a param name wrong degrades gracefully — the engine ignores the
 * unknown key and shows the listing without prefilled dates. Getting `baseUrl`
 * or a listing ID wrong sends a guest to a 404, so those two are guarded: with
 * either missing, the UI renders a phone-and-email fallback rather than a dead
 * link.
 */

/** Set once Devin confirms the engine's own URL. No trailing slash. */
const BASE_URL: string | undefined = undefined

export const GUESTY = {
  baseUrl: BASE_URL,

  /** `{listingId}` is substituted. Verify against a real engine URL. */
  listingPath: '/properties/{listingId}',

  /**
   * Query-parameter names. UNVERIFIED — see the header note.
   * Names chosen to match Guesty's documented booking-engine conventions.
   */
  params: {
    checkIn: 'checkIn',
    checkOut: 'checkOut',
    guests: 'guests',
  },
} as const

/**
 * Guesty listing IDs, keyed by our property slug.
 *
 * Empty until Devin supplies them. A slug missing here is not an error — the
 * booking CTA falls back to phone and email, which is the correct behaviour for
 * a house we cannot yet take an online booking for.
 *
 * The two campus slugs (`the-dunes`, `beach-street`) and the brand-level
 * `the-florida-havens` may have no single Guesty listing at all, since they are
 * multi-home bookings. If so, leave them unset deliberately and let them route
 * to enquiry — do not point them at one of the constituent houses, which would
 * silently book half the compound.
 */
export const GUESTY_LISTING_IDS: Partial<Record<string, string>> = {
  // 'turtle-haven': '',
  // 'shell-haven': '',
  // 'beach-haven': '',
  // 'sea-haven': '',
}

export type BookingDeepLink = {
  /** Listing URL with no dates — the form's `action`. */
  action: string
  /** Param names for the form's date and guest inputs. */
  params: typeof GUESTY.params
}

/**
 * Build the deep-link target for a property, or `null` if we cannot yet.
 *
 * Returning `null` rather than a best-effort URL is deliberate: a booking link
 * that 404s costs more than no booking link, because the guest concludes the
 * business is broken rather than that they should call.
 */
export function bookingDeepLink(slug: string): BookingDeepLink | null {
  const listingId = GUESTY_LISTING_IDS[slug]
  if (!GUESTY.baseUrl || !listingId) return null
  return {
    action:
      GUESTY.baseUrl + GUESTY.listingPath.replace('{listingId}', listingId),
    params: GUESTY.params,
  }
}

/** True when at least one property can be booked online. */
export function anyBookingConfigured(): boolean {
  return Boolean(
    GUESTY.baseUrl && Object.values(GUESTY_LISTING_IDS).some(Boolean),
  )
}
