import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbJsonLd } from '@/components/JsonLd'
import { RichBody } from '@/components/RichBody'
import { PAGE_BODY } from '@/content/page-body'
import { SITE } from '@/content/site'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'The family behind The Florida Havens — how four beachfront homes on a sea turtle reserve came to be, and why we host direct.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        trail={[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]}
      />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl text-ocean-700 sm:text-5xl">
          About The Florida Havens
        </h1>
        {/* Copy migrated verbatim from the live Wix /about page. */}
        <RichBody blocks={PAGE_BODY['about'] ?? []} />
        <div className="mt-10 rounded-sm border border-black/10 bg-sand-50 p-6">
          <h2 className="font-display text-xl text-ocean-700">Talk to us</h2>
          <p className="mt-2 text-sm text-neutral-700">
            Call{' '}
            <a href={`tel:${SITE.phoneE164}`} className="text-ocean-700 hover:underline">
              {SITE.phone}
            </a>{' '}
            or{' '}
            <Link href="/contact" className="text-ocean-700 hover:underline">
              send us a note
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  )
}
