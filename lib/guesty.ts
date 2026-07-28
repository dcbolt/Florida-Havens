import { unstable_cache } from 'next/cache'

import {
  getAvailability as apiGetAvailability,
  getFreshAvailability as apiGetFreshAvailability,
  isConfigured,
  mintToken,
  type ListingAvailability,
} from './guesty-api'

/**
 * Guesty client — the Next-aware layer.
 *
 * All transport, parsing and failure handling lives in `./guesty-api`, which has
 * no framework imports and is unit-tested in plain Node. This file adds exactly
 * one thing: a token cache that survives across invocations. That is a small
 * amount of code carrying a large amount of consequence.
 *
 * ── THE TOKEN BUDGET IS THE HARD CONSTRAINT ────────────────────────────────
 *
 * **Guesty allows only 5 access-token requests per key per 24 hours.** Tokens
 * last ~24h. That is not a rate limit to back off from, it is a daily quota:
 * spend it and the key is unusable until the window rolls.
 *
 * This is the single most important operational fact about booking Option B, and
 * it is easy to violate without noticing. A process-local token cache looks
 * correct and passes every test — then on serverless it mints a fresh token on
 * **every cold start**. With a 15-minute ISR window across six listings, that is
 * dozens of token requests a day and the quota is gone before lunch.
 *
 * Credit where it is due: the constraint is documented in **media-haven**'s
 * `lib/guesty.ts`, which solves it by persisting the token in a Supabase table
 * shared across invocations (~1 request/day). This client had the naive
 * process-local cache until that note was read.
 *
 * Two consequences, both load-bearing:
 *
 * 1. **The token is cached across invocations**, via `unstable_cache` — the same
 *    incremental cache the framework uses for data, shared across invocations
 *    and regions. No new infrastructure, and crucially **no dependency on Media
 *    Haven's database**: the marketing site must not couple to Stay OS
 *    infrastructure.
 *
 * 2. **Do not reuse Media Haven's OAuth key here.** The quota is per key, so two
 *    applications sharing one key share one budget — a bad deploy on the
 *    marketing site would take out the guest portal's Guesty access. Issue a
 *    separate, **read-only** OAuth application for this site.
 *    See `docs/BOOKING-MODES.md`.
 */

/** Just under Guesty's ~24h token life. Yields roughly one mint per day. */
const TOKEN_CACHE_SECONDS = 82_800 // 23 hours

/**
 * The cache key includes the client id, so rotating the credential takes effect
 * on the next request instead of being shadowed by a cached token for a day.
 *
 * Tagged `guesty:token` so a route handler could force a refresh with
 * `revalidateTag('guesty:token')` — needed after rotating a credential or
 * recovering from a revoked one, since we deliberately do not re-mint on a 401.
 * Not built yet; noted in `docs/BOOKING-MODES.md`.
 *
 * `mintToken` throws rather than returning null on failure, which is what keeps
 * a transient outage out of this cache — `unstable_cache` would happily store a
 * `null` for 23 hours and strand the site in Option A long after the problem was
 * fixed.
 */
function cachedMint(clientId: string) {
  return unstable_cache(mintToken, ['guesty-oauth-token', clientId], {
    revalidate: TOKEN_CACHE_SECONDS,
    tags: ['guesty:token'],
  })
}

/** Never throws. `null` means "no token", which callers render as Option A. */
async function getToken(): Promise<string | null> {
  if (!isConfigured()) return null
  try {
    const { token } = await cachedMint(process.env.GUESTY_CLIENT_ID!)()
    return token
  } catch (e) {
    console.warn(
      `[guesty] token unavailable: ${
        e instanceof Error ? e.message : String(e)
      } — falling back to deep-link booking`,
    )
    return null
  }
}

export function getAvailability(listingId: string, from: string, to: string) {
  return apiGetAvailability(getToken, listingId, from, to)
}

export function getFreshAvailability(
  listingId: string,
  windowDays: number,
  maxAgeMs: number,
) {
  return apiGetFreshAvailability(getToken, listingId, windowDays, maxAgeMs)
}

export { isConfigured }
export type { ListingAvailability }
export { AVAILABILITY_REVALIDATE_SECONDS } from './guesty-api'
