import type { MetadataRoute } from 'next'
import { SITE } from '@/content/site'
import { PROPERTIES, BOOKABLE } from '@/content/properties'
import { GUIDES } from '@/content/guides'

/**
 * Sitemap generated from the content model rather than hand-maintained.
 *
 * AUDIT FIX: the live Wix sitemap lists 76 URLs, ~40 of which are guest-ops
 * pages that dilute the index. This emits only marketing surfaces — 17 core +
 * property + guide + book routes — so Search Console coverage reflects pages
 * that are actually meant to rank.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url

  const core = [
    { path: '/', priority: 1.0 },
    { path: '/properties', priority: 0.9 },
    { path: '/about', priority: 0.6 },
    { path: '/contact', priority: 0.6 },
    { path: '/faqs', priority: 0.7 },
    { path: '/guides', priority: 0.7 },
    { path: '/privacy-policy', priority: 0.2 },
    { path: '/terms-and-conditions', priority: 0.2 },
    { path: '/refund-policy', priority: 0.2 },
    { path: '/accessibility-statement', priority: 0.2 },
  ]

  return [
    ...core.map((c) => ({
      url: `${base}${c.path}`,
      changeFrequency: 'monthly' as const,
      priority: c.priority,
    })),
    ...PROPERTIES.map((p) => ({
      url: `${base}/${p.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...GUIDES.map((g) => ({
      url: `${base}/guides/${g.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...BOOKABLE.map((slug) => ({
      url: `${base}/book/${slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
  ]
}
