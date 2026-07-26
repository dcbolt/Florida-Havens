import type { Metadata } from 'next'
import Link from 'next/link'
import { BLOG_INDEX, POSTS } from '@/content/blog'
import { BreadcrumbJsonLd } from '@/components/JsonLd'

/**
 * Blog index. Kept at /guest-blog (not /blog) because content/url-matrix.ts
 * marks this URL KEEP 1:1 — it is indexed on the live site and renaming it would
 * throw away that history for no gain.
 */
export const metadata: Metadata = {
  title: BLOG_INDEX.title,
  description: BLOG_INDEX.description,
  alternates: { canonical: '/guest-blog' },
}

export default function GuestBlogPage() {
  return (
    <>
      <BreadcrumbJsonLd
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Guest Stories', path: '/guest-blog' },
        ]}
      />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl text-ocean-700 sm:text-5xl">
          {BLOG_INDEX.h1}
        </h1>
        {BLOG_INDEX.intro.map((p) => (
          <p
            key={p.slice(0, 30)}
            className="mt-4 text-base leading-relaxed text-neutral-700"
          >
            {p}
          </p>
        ))}

        <Link
          href="/guest-story-entry-form"
          className="mt-6 inline-block rounded-sm bg-ocean-700 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white"
        >
          Share your story
        </Link>

        <h2 className="mt-14 font-display text-2xl text-ocean-700">All posts</h2>
        <ul className="mt-6 divide-y divide-black/10">
          {POSTS.map((post) => (
            <li key={post.slug} className="py-6">
              <Link href={`/post/${post.slug}`} className="group block">
                <h3 className="font-display text-xl text-ocean-700 group-hover:underline">
                  {post.title}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-neutral-500">
                  <time dateTime={post.published}>
                    {new Date(post.published + 'T00:00:00Z').toLocaleDateString(
                      'en-US',
                      { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }
                    )}
                  </time>
                  {' · '}
                  {post.readingTime}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {post.excerpt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
