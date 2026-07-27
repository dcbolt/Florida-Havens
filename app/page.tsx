import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PROPERTIES, HOMES, CAMPUSES } from '@/content/properties'
import { SITE } from '@/content/site'

export const metadata: Metadata = {
  title: 'Luxury Beachfront Rentals on Florida’s Space Coast',
  /**
   * AUDIT FIX: the live homepage description is 500 characters — roughly three
   * times what Google renders. It read as a keyword dump ("Stay near… Stay
   * near… Stay near…"). This is 148 characters and says one thing.
   */
  description:
    'Luxury beachfront vacation homes on Florida’s Space Coast. Private pools, ocean views, an hour from Orlando. Book direct for our best rate.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  const hero = PROPERTIES.find((p) => p.slug === 'the-dunes')!

  return (
    <>
      <section className="relative isolate">
        <div className="relative h-[68vh] min-h-[420px] w-full">
          {/* alt comes from the-dunes' heroAlt because this is the same file.
              A separate hand-written string here read "at sunrise", which is not
              in the photograph — see AUDIT.md finding 16. */}
          <Image
            src={hero.hero}
            alt={hero.heroAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/55" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            {/* The one and only <h1> on this page. */}
            <h1 className="max-w-4xl font-display text-4xl font-semibold text-white drop-shadow-md sm:text-5xl lg:text-6xl">
              Luxury Beachfront Homes on Florida’s Space Coast
            </h1>
            <p className="mt-5 max-w-2xl text-base text-white/90 sm:text-lg">
              Private pools, ocean views, and a protected sea turtle beach —
              about an hour from Orlando.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/book/the-florida-havens"
                className="rounded-sm bg-white px-7 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ocean-700"
              >
                Check availability
              </Link>
              <Link
                href="/properties"
                className="rounded-sm border border-white/70 px-7 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white"
              >
                See the homes
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h2 className="font-display text-3xl text-ocean-700 sm:text-4xl">
          Family-owned, beachfront, and booked direct
        </h2>
        <p className="mt-5 text-base leading-relaxed text-neutral-700">
          We are a family that fell for this stretch of Melbourne Beach and
          decided to share it. Four homes and two whole-compound campuses sit
          directly on an active sea turtle nesting beach — quiet, private, and
          close enough to Orlando to do a park day and still make sunset.
        </p>
        <p className="mt-4 text-base leading-relaxed text-neutral-700">
          Booking with us directly means no platform service fee, and you talk
          to the people who own the house.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <h2 className="font-display text-3xl text-ocean-700 sm:text-4xl">
          The Homes
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          Each home books on its own, or take a whole compound.
        </p>
        <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {HOMES.map((p) => (
            <li key={p.slug} className="group">
              <Link href={`/${p.slug}`} className="block">
                <div className="relative aspect-4/3 overflow-hidden rounded-sm">
                  <Image
                    src={p.hero}
                    alt={p.heroAlt}
                    fill
                    sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 font-display text-xl text-ocean-700">
                  {p.name}
                </h3>
                <p className="mt-1 text-sm text-neutral-600">
                  {p.locality} · {p.bedrooms} bedrooms · sleeps {p.sleeps}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl text-ocean-700 sm:text-4xl">
          Whole Compounds
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          For reunions, wedding parties and tournament weekends.
        </p>
        <ul className="mt-8 grid gap-8 md:grid-cols-2">
          {CAMPUSES.map((p) => (
            <li key={p.slug} className="group">
              <Link href={`/${p.slug}`} className="block">
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
                <p className="mt-1 text-sm text-neutral-600">{p.intro}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-ocean-700 px-4 py-16 text-center sm:px-6">
        <h2 className="font-display text-3xl text-white sm:text-4xl">
          Ready when you are
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/85">
          Questions about a date range, a group size, or which house fits?
          Call us.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/book/the-florida-havens"
            className="rounded-sm bg-white px-7 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ocean-700"
          >
            Check availability
          </Link>
          <a
            href={`tel:${SITE.phoneE164}`}
            className="rounded-sm border border-white/70 px-7 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white"
          >
            {SITE.phone}
          </a>
        </div>
      </section>
    </>
  )
}
