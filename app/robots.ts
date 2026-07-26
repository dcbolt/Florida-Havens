import type { MetadataRoute } from 'next'
import { SITE } from '@/content/site'

/**
 * AUDIT FIX: the live Wix robots.txt is auto-generated and, critically, allows
 * everything — including ~40 guest-ops pages (Wi-Fi, laundry, check-in, waste,
 * emergency guides) that have no business in a search index for a marketing
 * domain. Those URLs are 301'd away in next.config.ts, so this file simply
 * declares the sitemap and blocks nothing that should be crawled.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
