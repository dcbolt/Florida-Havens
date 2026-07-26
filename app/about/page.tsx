import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbJsonLd } from '@/components/JsonLd'
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
        <div className="mt-8 space-y-5 text-base leading-relaxed text-neutral-700">
          <p>
            We are a family that kept coming back to the same few miles of
            Melbourne Beach until it stopped making sense to leave. What began
            as one house is now four homes across two beachfront campuses, all
            of them on an active sea turtle nesting reserve.
          </p>
          <p>
            We host directly because it is better on both sides. You get the
            people who actually own and maintain the house, and we get to keep
            the marketplace fee out of your rate.
          </p>
          <p>
            The beach in front of the Havens is a protected nesting ground. That
            shapes how we run things — no pets, shaded outdoor lighting in
            season, and a request that you keep the dune line intact. It is a
            small trade for having turtles come ashore outside your window.
          </p>
        </div>
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
