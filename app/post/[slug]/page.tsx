import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { POSTS, getPost } from '@/content/blog'
import { BreadcrumbJsonLd, BlogPostingJsonLd } from '@/components/JsonLd'

/**
 * Blog post. Stays under /post/<slug> to match the live Wix URL exactly — the
 * matrix marks it KEEP 1:1, and this is the only post that currently carries
 * BlogPosting markup on the live site.
 */
export const dynamicParams = false

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    /** AUDIT FIX: the live post has no meta description at all. */
    description: post.description,
    alternates: { canonical: `/post/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      publishedTime: post.published,
      url: `/post/${post.slug}`,
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const out: React.ReactNode[] = []
  let list: string[] = []
  const flush = (key: string) => {
    if (!list.length) return
    out.push(
      <ul key={key} className="my-5 list-disc space-y-2 pl-6 text-neutral-700">
        {list.map((t, i) => (
          <li key={i} className="leading-relaxed">
            {t}
          </li>
        ))}
      </ul>
    )
    list = []
  }
  post.blocks.forEach((b, i) => {
    if (b.t === 'li') {
      list.push(b.text)
      return
    }
    flush(`ul-${i}`)
    if (b.t === 'h2') {
      out.push(
        <h2 key={i} className="mt-10 font-display text-2xl text-ocean-700">
          {b.text}
        </h2>
      )
    } else {
      out.push(
        <p key={i} className="mt-4 text-base leading-relaxed text-neutral-700">
          {b.text}
        </p>
      )
    }
  })
  flush('ul-end')

  return (
    <>
      <BlogPostingJsonLd post={post} />
      <BreadcrumbJsonLd
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Guest Stories', path: '/guest-blog' },
          { name: post.title, path: `/post/${post.slug}` },
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
              <Link href="/guest-blog" className="hover:text-ocean-700">
                Guest Stories
              </Link>
            </li>
          </ol>
        </nav>

        <h1 className="font-display text-4xl text-ocean-700 sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-3 text-xs uppercase tracking-[0.12em] text-neutral-500">
          <time dateTime={post.published}>
            {new Date(post.published + 'T00:00:00Z').toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'UTC',
            })}
          </time>
          {' · '}
          {post.readingTime}
        </p>

        <div className="mt-8">{out}</div>

        <p className="mt-12 text-sm text-neutral-600">
          Our beach is an active nesting reserve —{' '}
          <Link href="/properties" className="text-ocean-700 hover:underline">
            see the homes
          </Link>{' '}
          that sit on it.
        </p>
      </article>
    </>
  )
}
