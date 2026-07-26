import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { GUIDES, getGuide } from '@/content/guides'
import { getProperty } from '@/content/properties'
import { BreadcrumbJsonLd } from '@/components/JsonLd'

export const dynamicParams = false

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const g = getGuide(slug)
  if (!g) return {}
  return {
    title: g.h1,
    description: g.description,
    alternates: { canonical: `/guides/${g.slug}` },
  }
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) notFound()

  const featured = guide.featured
    .map((s) => getProperty(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  return (
    <>
      <BreadcrumbJsonLd
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
          { name: guide.h1, path: `/guides/${guide.slug}` },
        ]}
      />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex gap-2 text-xs text-neutral-500">
            <li>
              <Link href="/" className="hover:text-ocean-700">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/guides" className="hover:text-ocean-700">
                Guides
              </Link>
            </li>
          </ol>
        </nav>

        <h1 className="font-display text-4xl text-ocean-700 sm:text-5xl">
          {guide.h1}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-neutral-700">
          {guide.intro}
        </p>

        <div className="mt-10 rounded-sm border border-dashed border-ocean-300 bg-ocean-50 p-5 text-sm text-ocean-700">
          <strong className="font-semibold">Content to migrate:</strong> the
          live Wix page{' '}
          <code className="rounded bg-white/70 px-1">/{guide.legacySlug}</code>{' '}
          holds the full body copy for this guide. Port it here at cutover — the
          301 is already wired in <code>next.config.ts</code>.
        </div>

        {featured.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl text-ocean-700">
              Where to stay
            </h2>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2">
              {featured.map((p) => (
                <li key={p.slug}>
                  <Link href={`/${p.slug}`} className="group block">
                    <div className="relative aspect-16/9 overflow-hidden rounded-sm">
                      <Image
                        src={p.hero}
                        alt={p.heroAlt}
                        fill
                        sizes="(min-width:640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="mt-3 font-display text-lg text-ocean-700">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-600">{p.intro}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </>
  )
}
