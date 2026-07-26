import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How The Florida Havens collects, uses and protects your information.',
  alternates: { canonical: '/privacy-policy' },
}

export default function Page() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl text-ocean-700 sm:text-5xl">
        Privacy Policy
      </h1>
      <div className="mt-8 rounded-sm border border-dashed border-ocean-300 bg-ocean-50 p-5 text-sm text-ocean-700">
        <strong className="font-semibold">Content to migrate:</strong> port the
        existing copy from the live Wix page{' '}
        <code className="rounded bg-white/70 px-1">/privacy-policy</code> verbatim. This
        URL is a 1:1 keep — no redirect needed, and the legal text should not be
        reworded without review.
      </div>
    </section>
  )
}
