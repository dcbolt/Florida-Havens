import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Booking terms, house rules and rental conditions for The Florida Havens.',
  alternates: { canonical: '/terms-and-conditions' },
}

export default function Page() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl text-ocean-700 sm:text-5xl">
        Terms & Conditions
      </h1>
      <div className="mt-8 rounded-sm border border-dashed border-ocean-300 bg-ocean-50 p-5 text-sm text-ocean-700">
        <strong className="font-semibold">Content to migrate:</strong> port the
        existing copy from the live Wix page{' '}
        <code className="rounded bg-white/70 px-1">/terms-and-conditions</code> verbatim. This
        URL is a 1:1 keep — no redirect needed, and the legal text should not be
        reworded without review.
      </div>
    </section>
  )
}
