import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/JsonLd'
import { GUEST_PORTAL, SITE } from '@/content/site'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Reach The Florida Havens about dates, group sizes or which beachfront home fits your trip.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl text-ocean-700 sm:text-5xl">
          Contact Us
        </h1>
        <p className="mt-4 text-base leading-relaxed text-neutral-700">
          Questions about a date range, a group size, or which house fits? We
          answer the phone.
        </p>

        <dl className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-sm border border-black/10 bg-sand-50 p-6">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
              Phone
            </dt>
            <dd className="mt-2 font-display text-xl">
              <a href={`tel:${SITE.phoneE164}`} className="text-ocean-700 hover:underline">
                {SITE.phone}
              </a>
            </dd>
          </div>
          <div className="rounded-sm border border-black/10 bg-sand-50 p-6">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
              Email
            </dt>
            <dd className="mt-2 text-base">
              <a href={`mailto:${SITE.email}`} className="text-ocean-700 hover:underline">
                {SITE.email}
              </a>
            </dd>
          </div>
          <div className="rounded-sm border border-black/10 bg-sand-50 p-6 sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
              Where we are
            </dt>
            <dd className="mt-2">
              <address className="text-base not-italic leading-relaxed text-neutral-700">
                {SITE.address.street}
                <br />
                {SITE.address.locality}, {SITE.address.region}{' '}
                {SITE.address.postalCode}
              </address>
            </dd>
          </div>
        </dl>

        <p className="mt-10 text-sm text-neutral-600">
          Already staying with us? Your house guide, Wi-Fi details and check-out
          steps live in the{' '}
          <a
            href={GUEST_PORTAL.url}
            className="text-ocean-700 hover:underline"
          >
            guest portal
          </a>
          , not here.
        </p>
      </section>
    </>
  )
}
