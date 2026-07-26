import type { Metadata } from 'next'
import Link from 'next/link'
import { GUIDES } from '@/content/guides'
import { BreadcrumbJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Local Guides & Attractions',
  description:
    'Space Coast trip planning — rocket launches, Orlando parks, Sebastian Inlet, Brevard Zoo, cruise port stays and where to eat.',
  alternates: { canonical: '/guides' },
}

export default function GuidesIndex() {
  return (
    <>
      <BreadcrumbJsonLd
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
        ]}
      />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl text-ocean-700 sm:text-5xl">
          Local Guides &amp; Attractions
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700">
          Everything worth doing within reach of the Havens, written by people
          who live here.
        </p>
        <ul className="mt-10 divide-y divide-black/10">
          {GUIDES.map((g) => (
            <li key={g.slug} className="py-6">
              <Link href={`/guides/${g.slug}`} className="group block">
                <h2 className="font-display text-2xl text-ocean-700 group-hover:underline">
                  {g.h1}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {g.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
