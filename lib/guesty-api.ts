/**
 * Guesty Open API — transport, parsing and failure handling.
 *
 * **No framework imports.** Everything here runs in plain Node, which is what
 * lets `tools/test-guesty-fallback.mjs` exercise every failure path in seconds
 * with no build and no network. The cross-invocation token cache needs
 * `next/cache`, so it lives in `lib/guesty.ts` — that is the only seam where
 * this code touches Next, and it is deliberately one function wide.
 *
 * ── THE ONE RULE ───────────────────────────────────────────────────────────
 * **Nothing in this file ever throws, and every failure returns `null`.**
 *
 * That is what makes Option B safe to run. The booking UI treats `null` as
 * "render Option A" — the deep-link form that already works and needs no API at
 * all. So a bad credential, an expired token, a rate limit, a timeout, a Guesty
 * outage, or a response shape we did not expect all degrade to the previous,
 * working behaviour instead of breaking a page or failing a build. Rollback is
 * automatic; the manual switch in content/booking.ts is for when someone *wants*
 * to go back, not for emergencies.
 *
 * If you edit this file, keep that property. A thrown error here becomes a 500
 * on a booking page.
 *
 * ── CREDENTIALS ────────────────────────────────────────────────────────────
 * Read from the environment, never from the repo:
 *   GUESTY_CLIENT_ID
 *   GUESTY_CLIENT_SECRET
 * Create these as an OAuth application in Guesty under
 * Integrations → OAuth Applications. Scope it **read-only** — this client only
 * ever issues GETs, and a token that cannot write cannot damage a live PMS.
 * Confirmed 2026-07-27 that this account has that surface, and already runs one
 * app there ("MEDIA HAVEN"), so the Open API is live on this plan.
 *
 * With either variable unset, `isConfigured()` is false and no request is ever
 * made. That is the state in CI and in any local checkout.
 *
 * ── VERIFICATION STATUS ────────────────────────────────────────────────────
 * Cross-checked 2026-07-27 against `lib/guesty.ts` in the **media-haven** repo,
 * which runs this API in production against the same Guesty account. Confirmed
 * identical there, so these are no longer guesses:
 *
 *   • token URL      `https://open-api.guesty.com/oauth2/token`
 *   • API base       `https://open-api.guesty.com/v1`
 *   • grant/scope    `client_credentials` / `open-api`
 *   • calendar path  `/availability-pricing/api/calendar/listings/{id}`
 *                    `?startDate=&endDate=`  (YYYY-MM-DD)
 *   • day shape      `data.days[]` or bare `days[]`, `status === 'available'`
 *   • env var names  `GUESTY_CLIENT_ID` / `GUESTY_CLIENT_SECRET`
 *
 * **Still unverified: `price` and `minNights` on each day.** Media Haven reads
 * only `date` and `status` from the calendar, so nothing proves a nightly rate
 * is returned on this plan. `price` is optional in the parse and the UI omits
 * the "from $X" line when it is absent — so a wrong assumption here costs a
 * sentence, not a page. This is also why pricing is not yet published in
 * JSON-LD: a wrong price in structured data is worse than no price.
 */

/**
 * Overridable so the fallback behaviour can be tested against a local fake
 * Guesty (`tools/test-guesty-fallback.mjs`) without touching the real API, and
 * so a Guesty sandbox tenant can be pointed at if one is ever provisioned.
 * Unset in every real deployment.
 */
const TOKEN_URL =
  process.env.GUESTY_TOKEN_URL ?? 'https://open-api.guesty.com/oauth2/token'
const API_BASE =
  process.env.GUESTY_API_BASE ?? 'https://open-api.guesty.com/v1'

/** Availability changes on booking, so this is deliberately short. */
export const AVAILABILITY_REVALIDATE_SECONDS = 900 // 15 minutes

/** A hung request must not hang a build or an ISR regeneration. */
const TIMEOUT_MS = 8000

export type NightAvailability = {
  /** `YYYY-MM-DD`. */
  date: string
  available: boolean
  /** Nightly rate in the listing's currency, or null if not published. */
  price: number | null
  /** Minimum nights required for a stay starting this night, if given. */
  minNights: number | null
}

export type ListingAvailability = {
  listingId: string
  currency: string
  nights: NightAvailability[]
  /** Epoch ms when this was fetched. Rendered as "as of" — never omit it. */
  fetchedAt: number
}

export function isConfigured(): boolean {
  return Boolean(process.env.GUESTY_CLIENT_ID && process.env.GUESTY_CLIENT_SECRET)
}

/**
 * See `lib/guesty.ts` for why this matters: **Guesty allows only 5 access-token
 * requests per key per 24 hours.** `mintToken` is the only thing that spends
 * that quota, and it must never be called per request.
 */
/**
 * Belt-and-braces cap on mint attempts within a single process.
 *
 * `unstable_cache` should already hold this to about one a day. This exists so
 * that a bug — a cache miss loop, a misconfiguration, a retry storm — cannot
 * quietly eat a 5-per-day quota that is unrecoverable for 24 hours once spent.
 *
 * Raised via `GUESTY_MAX_MINTS` only by the fallback test suite, which walks
 * many credential scenarios in one process. Never set it in a deployment.
 */
const MAX_MINTS_PER_PROCESS = Number(process.env.GUESTY_MAX_MINTS ?? 2)
let mintsThisProcess = 0

/**
 * Exchange credentials for a token.
 *
 * **Throws on failure, deliberately.** `unstable_cache` caches whatever a
 * function returns, including `null` — so returning null here would pin a
 * transient failure in the cache for 23 hours and strand the site in Option A
 * long after the problem was fixed. Throwing means nothing is cached and the
 * next request retries. The caller converts the throw into `null`, so the
 * module's "never throws" contract is preserved at the boundary.
 */
async function mintToken(): Promise<{ token: string; expiresIn: number }> {
  if (mintsThisProcess >= MAX_MINTS_PER_PROCESS) {
    throw new Error(
      `refusing to mint: ${mintsThisProcess} attempts already made in this ` +
        `process and Guesty allows only 5 per key per 24h`,
    )
  }
  mintsThisProcess += 1

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: 'open-api',
    client_id: process.env.GUESTY_CLIENT_ID!,
    client_secret: process.env.GUESTY_CLIENT_SECRET!,
  })
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`token request failed: ${res.status}`)
  }
  const json: unknown = await res.json()
  const token = pickString(json, 'access_token')
  if (!token) throw new Error('token response had no access_token')
  // Trust `expires_in` when given. Guesty's own docs disagree with themselves
  // here — 86400 in the strategy guide, 3600 in the sample — so the response is
  // the only trustworthy source, and the cache window above is conservative
  // enough to cope with either.
  const expiresIn = pickNumber(json, 'expires_in') ?? 3600
  return { token, expiresIn }
}

/**
 * How the caller supplies a token. Production passes a cached provider; the
 * test suite passes an uncached one so it can drive credential failures.
 * Returning `null` means "no token available" and is not an error.
 */
export type TokenProvider = () => Promise<string | null>

export { mintToken }

/**
 * Fetch a listing's availability and nightly rates for a date window.
 *
 * Returns `null` on any failure — see the rule at the top of this file.
 */
export async function getAvailability(
  getToken: TokenProvider,
  listingId: string,
  from: string,
  to: string,
): Promise<ListingAvailability | null> {
  const token = await getToken()
  if (!token) return null

  const url =
    `${API_BASE}/availability-pricing/api/calendar/listings/${listingId}` +
    `?startDate=${encodeURIComponent(from)}&endDate=${encodeURIComponent(to)}`

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: {
        revalidate: AVAILABILITY_REVALIDATE_SECONDS,
        // Lets a webhook or a manual action refresh one listing without a
        // full rebuild: revalidateTag(`guesty:listing:<id>`).
        tags: [`guesty:listing:${listingId}`, 'guesty:availability'],
      },
    })
    if (res.status === 401 || res.status === 403) {
      // The token is dead, not merely unlucky — revoked, rotated, or scoped
      // wrong. We deliberately do NOT re-mint here: with only 5 token requests
      // per key per 24h, an auth failure that retries is how the quota gets
      // burned, and a burned quota is a 24-hour outage of Option B rather than a
      // graceful degradation. Falling back to Option A is the right response.
      // Clearing the cached token needs revalidateTag('guesty:token') from a
      // route handler — see docs/BOOKING-MODES.md.
      warn(
        `calendar ${res.status} for listing ${listingId}: token rejected. ` +
          `NOT re-minting (5 tokens per key per 24h) — see docs/BOOKING-MODES.md`,
      )
      return null
    }
    if (res.status === 429) {
      warn(`rate limited on listing ${listingId}`)
      return null
    }
    if (!res.ok) {
      warn(`calendar ${res.status} for listing ${listingId}`)
      return null
    }
    const json: unknown = await res.json()
    return parseCalendar(listingId, json)
  } catch (e) {
    warn(`calendar request threw for ${listingId}: ${describe(e)}`)
    return null
  }
}

/**
 * What the UI actually calls: pick the window, fetch, and gate on freshness —
 * all in one place.
 *
 * The date arithmetic and the staleness check live here rather than in the
 * component on purpose. Beyond satisfying the purity lint (`Date.now()` in a
 * component body is flagged, correctly — it makes render non-deterministic),
 * it keeps AvailabilityPanel pure presentation: it receives data or `null` and
 * has no opinion about time.
 *
 * `maxAgeMs` guards the case the fetch layer cannot see: Next serving a cached
 * response older than we are willing to present as fact. Past that age this
 * returns `null` and the page falls back to Option A.
 */
export async function getFreshAvailability(
  getToken: TokenProvider,
  listingId: string,
  windowDays: number,
  maxAgeMs: number,
): Promise<ListingAvailability | null> {
  const startedAt = Date.now()
  const from = new Date(startedAt).toISOString().slice(0, 10)
  const to = new Date(startedAt + windowDays * 86_400_000)
    .toISOString()
    .slice(0, 10)

  const data = await getAvailability(getToken, listingId, from, to)
  if (!data) return null
  // Age is measured at check time, not from `startedAt`. Using the pre-fetch
  // clock made the age negative on a live fetch — `fetchedAt` is stamped after
  // the request returns — which silently defeated the gate. Caught by
  // tools/test-guesty-fallback.mjs.
  if (Date.now() - data.fetchedAt > maxAgeMs) {
    warn(`cached calendar for ${listingId} is older than the freshness limit`)
    return null
  }
  return data
}

/**
 * Validate and normalise the calendar payload.
 *
 * Guesty has returned the day array under both `data.days` and a bare `days` in
 * different API versions, so both are accepted. Anything else returns `null`
 * rather than a half-parsed object — a partially understood availability
 * calendar is worse than none, because it renders as fact.
 */
function parseCalendar(listingId: string, json: unknown): ListingAvailability | null {
  const days = findDays(json)
  if (!days) {
    warn(`unrecognised calendar shape for ${listingId}`)
    return null
  }

  const nights: NightAvailability[] = []
  for (const d of days) {
    if (typeof d !== 'object' || d === null) continue
    const date = pickString(d, 'date')
    if (!date) continue
    const status = pickString(d, 'status')
    const rawAvail = (d as Record<string, unknown>).available
    // Prefer the explicit status string; fall back to a boolean field.
    const available =
      status !== null ? status === 'available' : rawAvail === true
    nights.push({
      date: date.slice(0, 10),
      available,
      price: pickNumber(d, 'price'),
      minNights: pickNumber(d, 'minNights'),
    })
  }

  if (nights.length === 0) {
    warn(`calendar for ${listingId} parsed to zero nights`)
    return null
  }

  return {
    listingId,
    currency: pickString(json, 'currency') ?? 'USD',
    nights,
    fetchedAt: Date.now(),
  }
}

function findDays(json: unknown): unknown[] | null {
  if (Array.isArray(json)) return json
  if (typeof json !== 'object' || json === null) return null
  const o = json as Record<string, unknown>
  if (Array.isArray(o.days)) return o.days
  const data = o.data
  if (typeof data === 'object' && data !== null) {
    const d = (data as Record<string, unknown>).days
    if (Array.isArray(d)) return d
  }
  if (Array.isArray(data)) return data
  return null
}

function pickString(o: unknown, key: string): string | null {
  if (typeof o !== 'object' || o === null) return null
  const v = (o as Record<string, unknown>)[key]
  return typeof v === 'string' && v.length > 0 ? v : null
}

function pickNumber(o: unknown, key: string): number | null {
  if (typeof o !== 'object' || o === null) return null
  const v = (o as Record<string, unknown>)[key]
  return typeof v === 'number' && Number.isFinite(v) ? v : null
}

function describe(e: unknown): string {
  return e instanceof Error ? `${e.name}: ${e.message}` : String(e)
}

/**
 * Log, but never to the point of noise in a normal build. Every one of these
 * means "we quietly fell back to Option A", which is worth seeing in logs
 * because the page will look fine and give no other signal.
 */
function warn(message: string): void {
  console.warn(`[guesty] ${message} — falling back to deep-link booking`)
}
