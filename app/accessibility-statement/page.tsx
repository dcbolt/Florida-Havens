import type { Metadata } from 'next'
import { RichBody } from '@/components/RichBody'
import { PAGE_BODY } from '@/content/page-body'

export const metadata: Metadata = {
  title: 'Accessibility Statement',
  alternates: { canonical: '/accessibility-statement' },
  /** Legal pages carry no search intent — indexable but not promoted. */
  robots: { index: true, follow: true },
}

export default function Page() {
  /**
   * Copy is migrated verbatim from the live Wix page. Legal text is
   * deliberately not reworded — only the heading outline is corrected.
   */
  const body = PAGE_BODY['accessibility-statement'] ?? []

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl text-ocean-700 sm:text-5xl">
        Accessibility Statement
      </h1>
      <RichBody blocks={body} />
    </section>
  )
}
