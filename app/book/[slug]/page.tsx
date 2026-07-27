import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PROPERTIES, getProperty } from '@/content/properties'
import { BookingMount } from '@/components/BookingMount'
import { BreadcrumbJsonLd } from '@/components/JsonLd'
import { SITE } from '@/content/site'

/**
 * Lean booking route — the replacement for the live /book-* pages.
 *
 * Measured problem on the live site: each /book-* page ships 942–960 KB of
 * HTML to deliver 122–132 words and carries no structured data at all. The
 * booking widget is injected client-side by a Wix HtmlComponent, so there is
 * nothing above it for a guest (or a crawler) to read while it loads.
 *
 * This route inverts that: real trust content renders first and the widget
 * mounts on demand (see components/BookingMount.tsx).
 */
export const dynamicParams = false

const BRAND_SLUG = 'the-florida-havens'

export function generateStaticParams() {
  return [...PROPERTIES.map((p) => ({ slug: p.slug })), { slug: BRAND_SLUG }]
}

function resolve(slug: string) {
  if (slug === BRAND_SLUG) {
    return {
      name: 'The Florida Havens',
      description:
        'Check availability across all of our Space Coast beachfront homes and book direct for our best rate.',
      hero: PROPERTIES.find((p) => p.slug === 'the-dunes')!.hero,
      // Same file, same description. The string here previously claimed "private
      // pools", which are not visible in this aerial — AUDIT.md finding 16.
      heroAlt: PROPERTIES.find((p) => p.slug === 'the-dunes')!.heroAlt,
      href: '/properties',
      isBrand: true as const,
    }
  }
  const p = getProperty(slug)
  if (!p) return undefined
  return {
    name: p.name,
    description: p.description,
    hero: p.hero,
    heroAlt: p.heroAlt,
    href: `/${p.slug}`,
    isBrand: false as const,
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const t = resolve(slug)
  if (!t) return {}
  return {
    title: `Book ${t.name}`,
    description: t.description,
    alternates: { canonical: `/book/${slug}` },
    /**
     * Booking routes are intentionally indexable but low priority — the
     * property page is the canonical entry point for search. We keep them
     * indexable so branded "book <house name>" queries land correctly.
     */
    openGraph: { title: `Book ${t.name}`, url: `/book/${slug}` },
  }
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const target = resolve(slug)
  if (!target) notFound()

  return (
    <>
      <BreadcrumbJsonLd
        trail={[
          { name: 'Home', path: '/' },
          { name: target.name, path: target.href },
          { name: `Book ${target.name}`, path: `/book/${slug}` },
        ]}
      />

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex gap-2 text-xs text-neutral-500">
            <li>
              <Link href="/" className="hover:text-ocean-700">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={target.href} className="hover:text-ocean-700">
                {target.name}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-neutral-700">Book</li>
          </ol>
        </nav>

        <h1 className="font-display text-4xl text-ocean-700">
          Book {target.name}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-700">
          {target.description}
        </p>

        {/* Trust content ABOVE the widget — P0 item 7. */}
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              h: 'Best rate, direct',
              p: 'No platform service fee. The price you see is ours, not a marketplace markup.',
            },
            {
              h: 'Owners, not agents',
              p: 'You are talking to the family who owns and maintains the house.',
            },
            {
              h: 'On the sand',
              p: 'Every home is genuinely beachfront on a protected sea turtle reserve.',
            },
          ].map((c) => (
            <li
              key={c.h}
              className="rounded-sm border border-black/10 bg-sand-50 p-5"
            >
              <h2 className="font-display text-lg text-ocean-700">{c.h}</h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {c.p}
              </p>
            </li>
          ))}
        </ul>

        <div className="relative mt-10 aspect-16/9 overflow-hidden rounded-sm">
          <Image
            src={target.hero}
            alt={target.heroAlt}
            fill
            sizes="(min-width:1024px) 900px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="mt-10">
          {/*
            embedUrl is intentionally undefined until Devin supplies the Guesty
            listing IDs / widget URLs (tracked under "Access needed" in
            docs/TFH-WEBSITE.md). The component renders an explicit placeholder
            rather than a broken frame.
          */}
          <BookingMount propertyName={target.name} />
        </div>

        <p className="mt-8 text-sm text-neutral-600">
          Prefer to talk it through? Call{' '}
          <a
            href={`tel:${SITE.phoneE164}`}
            className="font-medium text-ocean-700 hover:underline"
          >
            {SITE.phone}
          </a>{' '}
          or email{' '}
          <a
            href={`mailto:${SITE.email}`}
            className="font-medium text-ocean-700 hover:underline"
          >
            {SITE.email}
          </a>
          .
        </p>
      </section>
    </>
  )
}
