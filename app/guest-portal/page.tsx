import type { Metadata } from 'next'
import Link from 'next/link'
import { GUEST_PORTAL, SITE } from '@/content/site'

export const metadata: Metadata = {
  title: 'Your Guest Portal Has Moved',
  description:
    'House guides, Wi-Fi details and check-in steps now live in the Media Haven guest portal.',
  /**
   * Deliberately noindex. This page exists to catch guests holding live links
   * to the retired guest-ops URLs — it is not a search destination, and keeping
   * it out of the index is the whole point of retiring those ~40 pages.
   */
  robots: { index: false, follow: false },
}

export default function GuestPortalPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <h1 className="font-display text-4xl text-ocean-700">
        Your guest guide has moved
      </h1>
      <p className="mt-5 text-base leading-relaxed text-neutral-700">
        House guides, Wi-Fi details, check-in and check-out steps, appliance
        instructions and emergency information now live in one place — the
        guest portal for your stay.
      </p>

      <div className="mt-8">
        <a
          href={GUEST_PORTAL.url}
          className="inline-block rounded-sm bg-ocean-700 px-7 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white"
        >
          Open the guest portal
        </a>
      </div>

      <p className="mt-8 text-sm text-neutral-600">
        Cannot find what you need? Call{' '}
        <a
          href={`tel:${SITE.phoneE164}`}
          className="font-medium text-ocean-700 hover:underline"
        >
          {SITE.phone}
        </a>{' '}
        — we would rather you asked than guessed.
      </p>

      <p className="mt-10 text-sm text-neutral-500">
        Looking for somewhere to stay instead?{' '}
        <Link href="/properties" className="text-ocean-700 hover:underline">
          See the homes
        </Link>
        .
      </p>
    </section>
  )
}
