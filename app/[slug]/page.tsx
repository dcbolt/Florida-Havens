import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PROPERTIES, getProperty, HOMES } from '@/content/properties'
import { PropertyJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'
import { SITE } from '@/content/site'

/**
 * Property pages keep their existing root-level slugs (/turtle-haven,
 * /the-dunes, …) so they are 1:1 URL matches at cutover and retain their
 * accumulated authority. Static segments like /about and /book win over this
 * dynamic segment in Next's routing, and `dynamicParams = false` makes any
 * other slug a 404 rather than a soft-200.
 */
export const dynamicParams = false

export function generateStaticParams() {
  return PROPERTIES.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const p = getProperty(slug)
  if (!p) return {}
  return {
    title: p.name,
    description: p.description,
    alternates: { canonical: `/${p.slug}` },
    openGraph: {
      title: p.title,
      description: p.description,
      url: `/${p.slug}`,
      images: [{ url: p.hero, width: 1920, height: 1080, alt: p.heroAlt }],
    },
  }
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const property = getProperty(slug)
  if (!property) notFound()

  const siblings = HOMES.filter(
    (h) => h.slug !== property.slug && h.campus === property.campus
  )

  return (
    <>
      <PropertyJsonLd property={property} />
      <BreadcrumbJsonLd
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Properties', path: '/properties' },
          { name: property.name, path: `/${property.slug}` },
        ]}
      />

      <div className="relative h-[58vh] min-h-[360px] w-full">
        <Image
          src={property.hero}
          alt={property.heroAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          {/* One h1, and it is the property name — not "HOME". */}
          <h1 className="font-display text-4xl font-semibold text-white drop-shadow-md sm:text-5xl">
            {property.name}
          </h1>
          <p className="mt-3 text-sm uppercase tracking-[0.18em] text-white/85">
            {property.locality}, Florida
          </p>
        </div>
      </div>

      <nav aria-label="Breadcrumb" className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <ol className="flex gap-2 text-xs text-neutral-500">
          <li>
            <Link href="/" className="hover:text-ocean-700">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/properties" className="hover:text-ocean-700">
              Properties
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-neutral-700">{property.name}</li>
        </ol>
      </nav>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        {/* Spec row — every value generated from the live site, not guessed. */}
        <dl className="flex flex-wrap gap-x-8 gap-y-3 border-y border-black/10 py-5 text-sm">
          {[
            ['Guests', `${property.sleeps}`],
            ['Bedrooms', `${property.bedrooms} king`],
            ['Baths', `${property.baths}`],
            ['Amenities', property.amenitySummary],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                {k}
              </dt>
              <dd className="mt-1 text-neutral-800">{v}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-12 font-display text-3xl text-ocean-700">
          Welcome to {property.name}
        </h2>
        {/* Body copy migrated verbatim from the live Wix page. */}
        {(property.welcome.length ? property.welcome : [property.intro]).map(
          (para) => (
            <p
              key={para.slice(0, 40)}
              className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-700"
            >
              {para}
            </p>
          )
        )}

        <h2 className="mt-14 font-display text-3xl text-ocean-700">
          Plan your visit
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {property.highlights.map((h) => (
            <li
              key={h}
              className="flex gap-3 rounded-sm border border-black/10 bg-sand-50 p-4 text-sm text-neutral-700"
            >
              <span aria-hidden className="text-brass-500">
                ◆
              </span>
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-14 rounded-sm bg-ocean-700 px-6 py-10 text-center">
          <h2 className="font-display text-2xl text-white sm:text-3xl">
            Book {property.name} direct
          </h2>
          <p className="mt-2 text-sm text-white/85">
            Our best available rate, with no platform service fee.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/book/${property.slug}`}
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
        </div>

        {siblings.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl text-ocean-700">
              Next door
            </h2>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2">
              {siblings.map((s) => (
                <li key={s.slug}>
                  <Link href={`/${s.slug}`} className="group block">
                    <div className="relative aspect-16/9 overflow-hidden rounded-sm">
                      <Image
                        src={s.hero}
                        alt={s.heroAlt}
                        fill
                        sizes="(min-width:640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="mt-3 font-display text-lg text-ocean-700">
                      {s.name}
                    </h3>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </section>
    </>
  )
}
