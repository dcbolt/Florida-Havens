'use client'

import { useState } from 'react'

/**
 * Third-party embed that loads only on an explicit click.
 *
 * The live site injects its embeds through Wix HtmlComponent, so they cost the
 * page on every visit and are not first-class indexable content. Here the
 * surrounding copy renders immediately and the frame is fetched only if the
 * visitor asks for it.
 *
 * Used for the virtual tour only. The booking flow went further and dropped the
 * iframe entirely (components/BookingCta.tsx) — a CI invariant now asserts
 * /book/* ships no iframe at all. A tour cannot do the same: unlike a booking
 * engine there is no page to hand the visitor off to, because the embed *is* the
 * experience. Click-to-load is the right compromise here, not a weaker version
 * of the booking fix.
 *
 * When `src` is undefined it renders an explicit placeholder rather than nothing,
 * so a missing integration is visible instead of silently absent.
 */
export function LazyEmbed({
  src,
  title,
  cta,
  note,
  height = 620,
}: {
  src?: string
  title: string
  cta: string
  note?: string
  height?: number
}) {
  const [open, setOpen] = useState(false)

  if (!src) {
    return (
      <div className="rounded-sm border border-dashed border-ocean-300 bg-ocean-50 p-6 text-sm text-ocean-700">
        <strong className="font-semibold">Not yet connected:</strong> {title}.
        {note ? ` ${note}` : ''}
      </div>
    )
  }

  if (!open) {
    return (
      <div className="rounded-sm border border-black/10 bg-sand-50 p-6 text-center">
        <p className="font-display text-xl text-ocean-700">{title}</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 rounded-sm bg-ocean-700 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
        >
          {cta}
        </button>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-sm border border-black/10">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        style={{ height }}
        className="w-full border-0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  )
}
