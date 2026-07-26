'use client'

import { useState } from 'react'

/**
 * Booking engine mount.
 *
 * AUDIT FIX — the live site puts the booking engine in a Wix HtmlComponent,
 * which injects a third-party iframe on load. Measured consequences:
 *   • the /book-* pages weigh 942–960 KB of HTML to deliver 122–132 words
 *   • zero <iframe> tags exist in the server HTML, so the widget is entirely
 *     client-rendered and its content is not first-class indexable
 *   • the iframe competes with the page for main-thread and network budget
 *     during the exact moment the guest is deciding to book
 *
 * The fix is not to remove the iframe (Guesty owns that surface) but to stop
 * paying for it on first paint. The widget mounts only after an explicit
 * "Check availability" click, so:
 *   • LCP is the page's own trust content, not a third-party frame
 *   • the page ships real crawlable copy above the widget
 *   • guests who never open the picker never download it
 *
 * When Guesty listing IDs land, replace `embedUrl` with the real per-property
 * booking URL — the lazy behaviour stays the same.
 */
export function BookingMount({
  propertyName,
  embedUrl,
}: {
  propertyName: string
  embedUrl?: string
}) {
  const [open, setOpen] = useState(false)

  if (!embedUrl) {
    return (
      <div className="rounded-sm border border-dashed border-ocean-300 bg-ocean-50 p-6">
        <p className="text-sm text-ocean-700">
          Booking engine not yet connected for {propertyName}. Add the Guesty
          embed URL to <code>content/properties.ts</code> to activate the live
          availability picker.
        </p>
      </div>
    )
  }

  if (!open) {
    return (
      <div className="rounded-sm border border-black/10 bg-sand-50 p-6 text-center">
        <p className="font-display text-xl text-ocean-700">
          Check dates for {propertyName}
        </p>
        <p className="mt-2 text-sm text-neutral-600">
          Book direct for our best available rate — no platform service fee.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 rounded-sm bg-ocean-700 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
        >
          Check availability
        </button>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-sm border border-black/10">
      <iframe
        src={embedUrl}
        title={`Availability and booking for ${propertyName}`}
        loading="lazy"
        className="h-[720px] w-full border-0"
        /* Least privilege: the booking engine needs forms + scripts, nothing more. */
        sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  )
}
