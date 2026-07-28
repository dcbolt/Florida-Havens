import { GUESTY_LISTINGS, bookingMode } from '@/content/booking'
import { getFreshAvailability } from '@/lib/guesty'

/**
 * Server-rendered availability and rates — booking Option B.
 *
 * The point is not prettiness, it is that this is **real HTML**. The live Wix
 * site puts availability inside a client-injected iframe, so a page that could
 * say "Turtle Haven, 14–21 March, $4,200, available" instead says nothing a
 * crawler can read. This renders the same facts into the document.
 *
 * Renders `null` when there is no data, for any reason. The BookingCta below it
 * is unchanged and still works — see the rollback table in content/booking.ts.
 *
 * ── HONESTY ABOUT STALENESS ────────────────────────────────────────────────
 * Cached availability is the one genuinely dangerous thing here: showing a week
 * as free after it has been booked costs a guest and an afternoon of Craig's
 * time. Three deliberate choices:
 *
 *   1. **Never claim a date is bookable.** The panel says which nights are
 *      *shown as open*, and that checkout confirms. Guesty re-validates at
 *      booking regardless, so the transaction is safe; the wording just stops
 *      the page overstating what it knows.
 *   2. **Always show "as of".** Data with no timestamp reads as live. A visible
 *      age lets a guest — and us — judge it.
 *   3. **Refuse to render data past a hard age.** If the cache somehow serves
 *      something very old, the panel disappears rather than misinform.
 */

/** Older than this and the panel hides itself rather than show stale facts. */
const MAX_AGE_MS = 6 * 60 * 60 * 1000 // 6 hours

/** How far ahead to show. Long enough to be useful, short enough to stay fresh. */
const WINDOW_DAYS = 60

export async function AvailabilityPanel({ slug }: { slug: string }) {
  if (bookingMode() !== 'live') return null

  const listing = GUESTY_LISTINGS[slug]
  if (!listing) return null

  // All time handling lives in the lib — this component reads no clock, so its
  // output is a pure function of the data it is handed.
  const data = await getFreshAvailability(listing.id, WINDOW_DAYS, MAX_AGE_MS)
  if (!data) return null

  const open = data.nights.filter((n) => n.available)
  if (open.length === 0) {
    return (
      <section
        aria-labelledby={`${slug}-availability`}
        className="rounded-sm border border-black/10 bg-white p-6"
      >
        <h2
          id={`${slug}-availability`}
          className="font-display text-xl text-ocean-700"
        >
          Next 60 nights
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700">
          No open nights in the next {WINDOW_DAYS} days. Dates further out are
          often available — check below or call us.
        </p>
        <AsOf at={data.fetchedAt} />
      </section>
    )
  }

  const priced = open.filter(
    (n): n is typeof n & { price: number } => typeof n.price === 'number',
  )
  const lowest = priced.length
    ? priced.reduce((a, b) => (b.price < a.price ? b : a))
    : null

  return (
    <section
      aria-labelledby={`${slug}-availability`}
      className="rounded-sm border border-black/10 bg-white p-6"
    >
      <h2
        id={`${slug}-availability`}
        className="font-display text-xl text-ocean-700"
      >
        Next 60 nights
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-neutral-700">
        <strong className="font-semibold">{open.length}</strong> of{' '}
        {data.nights.length} nights currently show as open
        {lowest ? (
          <>
            , from{' '}
            <strong className="font-semibold">
              {formatMoney(lowest.price, data.currency)}
            </strong>{' '}
            a night
          </>
        ) : null}
        . Your dates are confirmed at checkout.
      </p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {nextRuns(open, 4).map((run) => (
          <li
            key={run.from}
            className="rounded-sm border border-ocean-200 bg-ocean-50 px-3 py-1.5 text-xs text-ocean-800"
          >
            {formatRange(run.from, run.to)}
            <span className="text-ocean-600">
              {' '}
              · {run.nights} night{run.nights === 1 ? '' : 's'}
            </span>
          </li>
        ))}
      </ul>

      <AsOf at={data.fetchedAt} />
    </section>
  )
}

function AsOf({ at }: { at: number }) {
  return (
    <p className="mt-4 text-xs text-neutral-500">
      Availability as of{' '}
      <time dateTime={new Date(at).toISOString()}>
        {new Date(at).toISOString().replace('T', ' ').slice(0, 16)} UTC
      </time>
      . Live availability and the final price are confirmed on the booking page.
    </p>
  )
}

/**
 * Collapse consecutive open nights into date ranges.
 *
 * A wall of 40 individual dates is noise; "14–21 March · 7 nights" is the thing
 * a guest is actually scanning for. Runs shorter than the listing's minimum stay
 * are not filtered out here — the minimum is stated by BookingCta, and silently
 * hiding a 2-night gap would make the open-night count inconsistent with the
 * ranges shown.
 */
function nextRuns(open: { date: string }[], limit: number) {
  const runs: { from: string; to: string; nights: number }[] = []
  let from = open[0]?.date
  let prev = from
  let count = 0

  for (const n of open) {
    if (from === undefined || prev === undefined) break
    const gap =
      (Date.parse(n.date) - Date.parse(prev)) / 86_400_000
    if (count === 0 || gap === 1) {
      count += 1
      prev = n.date
      continue
    }
    runs.push({ from, to: prev, nights: count })
    from = n.date
    prev = n.date
    count = 1
  }
  if (from !== undefined && prev !== undefined && count > 0) {
    runs.push({ from, to: prev, nights: count })
  }
  return runs.sort((a, b) => b.nights - a.nights).slice(0, limit)
}

function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${Math.round(amount)} ${currency}`
  }
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

/** "14–21 Mar", or "28 Feb – 3 Mar" across a month boundary. */
function formatRange(from: string, to: string): string {
  const [, fm, fd] = from.split('-')
  const [, tm, td] = to.split('-')
  const fMon = MONTHS[Number(fm) - 1]
  const tMon = MONTHS[Number(tm) - 1]
  return fm === tm
    ? `${Number(fd)}–${Number(td)} ${fMon}`
    : `${Number(fd)} ${fMon} – ${Number(td)} ${tMon}`
}
