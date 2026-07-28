import { bookingDeepLink } from '@/content/booking'
import { SITE } from '@/content/site'

/**
 * Booking call-to-action — Option A, deep-link out. Replaces BookingMount.
 *
 * This is a **server component with no JavaScript**. The date picker is a plain
 * `<form method="get">` pointed at the Guesty listing URL, so the browser builds
 * `?checkIn=…&checkOut=…&guests=…` itself on submit. No hydration, no client
 * bundle, no third-party frame — and the whole CTA is in the server HTML, so a
 * crawler sees a real booking affordance instead of an empty div.
 *
 * The predecessor mounted Guesty's iframe on click, which was already a large
 * improvement on the live site's load-time injection. Deep-linking is better
 * still: the iframe cost ~12.9 MB and 27.4 s of LCP on the live equivalent, and
 * even lazily mounted it can never be indexed, styled, or measured by us.
 *
 * `native <input type="date">` is deliberate over a JS picker. It is keyboard
 * and screen-reader accessible for free, localises itself, costs zero bytes, and
 * degrades to a text field on anything that does not support it.
 *
 * No `min` is set on the dates. A build-time "today" goes stale the day after
 * deploy, and a wrong `min` blocks valid dates — worse than allowing a past date
 * that Guesty will reject anyway with a clearer message than we could give.
 */
export function BookingCta({
  propertyName,
  slug,
}: {
  propertyName: string
  slug: string
}) {
  const link = bookingDeepLink(slug)

  // No Guesty listing for this property yet — or it is a multi-home campus that
  // cannot be booked as a single listing. Enquiry is the honest path; a dead
  // booking button would read as a broken business.
  if (!link) {
    return (
      <div className="rounded-sm border border-black/10 bg-sand-50 p-6">
        <p className="font-display text-xl text-ocean-700">
          Check dates for {propertyName}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          {propertyName} is booked directly with the owners. Call or email and
          you will get a same-day answer on availability and the best direct
          rate.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={`tel:${SITE.phoneE164}`}
            className="rounded-sm bg-ocean-700 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
          >
            Call {SITE.phone}
          </a>
          <a
            href={`mailto:${SITE.email}?subject=${encodeURIComponent(
              `Availability enquiry — ${propertyName}`,
            )}`}
            className="rounded-sm border border-ocean-700 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-ocean-700 transition-colors hover:bg-ocean-50"
          >
            Email us
          </a>
        </div>
      </div>
    )
  }

  const { action, params } = link

  return (
    <div className="rounded-sm border border-black/10 bg-sand-50 p-6">
      <h2 className="font-display text-xl text-ocean-700">
        Check dates for {propertyName}
      </h2>
      <p className="mt-2 text-sm text-neutral-600">
        Book direct for our best available rate — no platform service fee.
      </p>

      <form
        method="get"
        action={action}
        target="_blank"
        rel="noopener"
        className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end"
      >
        <div>
          <label
            htmlFor={`${slug}-checkin`}
            className="block text-xs font-semibold uppercase tracking-[0.08em] text-neutral-600"
          >
            Check in
          </label>
          <input
            id={`${slug}-checkin`}
            type="date"
            name={params.checkIn}
            className="mt-1 w-full rounded-sm border border-black/15 bg-white px-3 py-2 text-sm text-neutral-800"
          />
        </div>

        <div>
          <label
            htmlFor={`${slug}-checkout`}
            className="block text-xs font-semibold uppercase tracking-[0.08em] text-neutral-600"
          >
            Check out
          </label>
          <input
            id={`${slug}-checkout`}
            type="date"
            name={params.checkOut}
            className="mt-1 w-full rounded-sm border border-black/15 bg-white px-3 py-2 text-sm text-neutral-800"
          />
        </div>

        <div>
          <label
            htmlFor={`${slug}-guests`}
            className="block text-xs font-semibold uppercase tracking-[0.08em] text-neutral-600"
          >
            Guests
          </label>
          <input
            id={`${slug}-guests`}
            type="number"
            name={params.guests}
            min={1}
            defaultValue={2}
            className="mt-1 w-20 rounded-sm border border-black/15 bg-white px-3 py-2 text-sm text-neutral-800"
          />
        </div>

        <button
          type="submit"
          className="rounded-sm bg-ocean-700 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
        >
          Check availability
        </button>
      </form>

      <p className="mt-4 text-xs text-neutral-500">
        Availability and payment are handled by our booking system. Prefer to
        talk it through?{' '}
        <a
          href={`tel:${SITE.phoneE164}`}
          className="font-medium text-ocean-700 hover:underline"
        >
          Call {SITE.phone}
        </a>
        .
      </p>
    </div>
  )
}
