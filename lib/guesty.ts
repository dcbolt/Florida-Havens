/**
 * Guesty Open API client — the data layer for booking Option B.
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
 * ── UNVERIFIED ─────────────────────────────────────────────────────────────
 * The endpoint paths and response shapes below are Guesty's documented Open API
 * conventions but have **not been exercised against this account**. The same
 * discipline as the deep-link work applies: two of three guesses were wrong
 * there, so assume something here is wrong too. They are isolated in this file
 * and validated at runtime, so a mismatch degrades to Option A rather than
 * rendering nonsense. Verify with one real call before trusting the output.
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
 * Token cache, process-local.
 *
 * Guesty's client-credentials tokens are long-lived (24h) and the token endpoint
 * is rate-limited far more aggressively than the data endpoints, so re-authing
 * per request is a good way to get locked out. Refreshed a minute early to avoid
 * racing expiry.
 *
 * **Keyed by client id.** Rotating the credential must not leave the old token
 * in play — without the key, changing `GUESTY_CLIENT_ID` would be silently
 * ignored until the cached token expired. Found by
 * `tools/test-guesty-fallback.mjs`, which could not exercise a bad-credential
 * path at all while a good token was cached.
 */
let cachedToken: { key: string; value: string; expiresAt: number } | null = null

/**
 * Drop the cached token so the next call re-authenticates.
 *
 * Called when the data endpoint rejects our token. Without this, a token that
 * has been revoked or invalidated server-side keeps being replayed until its
 * nominal expiry — up to 24 hours of the site sitting in Option A *after* the
 * credentials were fixed, with nothing in the logs to explain why.
 */
function invalidateToken(): void {
  cachedToken = null
}

async function getToken(): Promise<string | null> {
  if (!isConfigured()) return null
  const key = process.env.GUESTY_CLIENT_ID!
  if (
    cachedToken &&
    cachedToken.key === key &&
    Date.now() < cachedToken.expiresAt - 60_000
  ) {
    return cachedToken.value
  }
  try {
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
      // Never cached by the framework: this is a credential exchange, and the
      // expiry bookkeeping above is what controls reuse.
      cache: 'no-store',
    })
    if (!res.ok) {
      warn(`token request failed: ${res.status}`)
      return null
    }
    const json: unknown = await res.json()
    const token = pickString(json, 'access_token')
    const expiresIn = pickNumber(json, 'expires_in') ?? 3600
    if (!token) {
      warn('token response had no access_token')
      return null
    }
    cachedToken = {
      key,
      value: token,
      expiresAt: Date.now() + expiresIn * 1000,
    }
    return token
  } catch (e) {
    warn(`token request threw: ${describe(e)}`)
    return null
  }
}

/**
 * Fetch a listing's availability and nightly rates for a date window.
 *
 * Returns `null` on any failure — see the rule at the top of this file.
 */
export async function getAvailability(
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
      // The token is dead, not merely unlucky. Drop it so the next call
      // re-authenticates instead of replaying a rejected credential for hours.
      invalidateToken()
      warn(`calendar ${res.status} for listing ${listingId}; token discarded`)
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
  listingId: string,
  windowDays: number,
  maxAgeMs: number,
): Promise<ListingAvailability | null> {
  const startedAt = Date.now()
  const from = new Date(startedAt).toISOString().slice(0, 10)
  const to = new Date(startedAt + windowDays * 86_400_000)
    .toISOString()
    .slice(0, 10)

  const data = await getAvailability(listingId, from, to)
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
