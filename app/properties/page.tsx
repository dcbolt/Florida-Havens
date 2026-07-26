import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { HOMES, CAMPUSES } from '@/content/properties'
import { BreadcrumbJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Our Beachfront Homes',
  description:
    'Four beachfront homes and two whole-compound campuses on Florida’s Space Coast. Private pools, ocean views, sleeps 8–20.',
  alternates: { canonical: '/properties' },
}

export default function PropertiesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Properties', path: '/properties' },
        ]}
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl text-ocean-700 sm:text-5xl">
          Explore the Havens
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700">
          Four homes on two beachfront campuses. Book a single house, or take a
          whole compound when the group is bigger.
        </p>

        <h2 className="mt-16 font-display text-3xl text-ocean-700">
          Individual Homes
        </h2>
        <ul className="mt-8 grid gap-10 sm:grid-cols-2">
          {HOMES.map((p) => (
            <li key={p.slug}>
              <Link href={`/${p.slug}`} className="group block">
                <div className="relative aspect-4/3 overflow-hidden rounded-sm">
                  <Image
                    src={p.hero}
                    alt={p.heroAlt}
                    fill
                    sizes="(min-width:640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 font-display text-2xl text-ocean-700">
                  {p.name}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-neutral-500">
                  {p.locality} · {p.bedrooms} bedrooms · sleeps {p.sleeps}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  {p.intro}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="mt-20 font-display text-3xl text-ocean-700">
          Whole Compounds
        </h2>
        <ul className="mt-8 grid gap-10 md:grid-cols-2">
          {CAMPUSES.map((p) => (
            <li key={p.slug}>
              <Link href={`/${p.slug}`} className="group block">
                <div className="relative aspect-16/9 overflow-hidden rounded-sm">
                  <Image
                    src={p.hero}
                    alt={p.heroAlt}
                    fill
                    sizes="(min-width:768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 font-display text-2xl text-ocean-700">
                  {p.name}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-neutral-500">
                  {p.locality} · sleeps {p.sleeps}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  {p.intro}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
