import { SITE } from '@/content/site'
import type { Property } from '@/content/properties'
import type { Faq } from '@/content/faqs'

/**
 * Structured data.
 *
 * AUDIT FIX — 72 of 74 crawled pages carry ZERO structured data. The only
 * JSON-LD on the whole site is a LocalBusiness + WebSite pair on the homepage
 * and a BlogPosting on the single blog post. For a vacation-rental brand that
 * leaves every rich-result surface on the table: no per-home lodging markup,
 * no FAQ eligibility, no breadcrumbs.
 *
 * Escaping note: per the Next.js JSON-LD guide, `<` is replaced with its
 * unicode escape so a stray HTML tag in content can never break out of the
 * script element.
 */
function Script({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}

const POSTAL = {
  '@type': 'PostalAddress',
  streetAddress: SITE.address.street,
  addressLocality: SITE.address.locality,
  addressRegion: SITE.address.region,
  postalCode: SITE.address.postalCode,
  addressCountry: SITE.address.country,
}

/** Brand-level identity, emitted once in the root layout. */
export function OrganizationJsonLd() {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'LodgingBusiness',
        '@id': `${SITE.url}/#organization`,
        name: SITE.name,
        url: SITE.url,
        telephone: SITE.phone,
        email: SITE.email,
        address: POSTAL,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: SITE.geo.lat,
          longitude: SITE.geo.lng,
        },
        priceRange: '$$$',
        areaServed: 'Melbourne Beach, Indialantic, and the Florida Space Coast',
      }}
    />
  )
}

export function WebSiteJsonLd() {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        name: SITE.name,
        url: SITE.url,
        publisher: { '@id': `${SITE.url}/#organization` },
      }}
    />
  )
}

/** Per-home lodging markup — completely absent from the live site. */
export function PropertyJsonLd({ property }: { property: Property }) {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'VacationRental',
        '@id': `${SITE.url}/${property.slug}#lodging`,
        name: property.name,
        description: property.description,
        image: property.hero,
        url: `${SITE.url}/${property.slug}`,
        telephone: SITE.phone,
        brand: { '@id': `${SITE.url}/#organization` },
        address: {
          ...POSTAL,
          addressLocality: property.locality,
          postalCode: property.postalCode,
        },
        /**
         * These come from content/property-facts.ts, generated from the live
         * site. They were previously hand-guessed and wrong on five of six
         * homes — publishing an inflated occupancy is worse than omitting it,
         * so no fallbacks here: if the facts module is incomplete the build
         * fails rather than shipping a guess.
         */
        numberOfBedrooms: property.bedrooms,
        numberOfBathroomsTotal: property.baths,
        occupancy: {
          '@type': 'QuantitativeValue',
          maxValue: property.sleeps,
          unitText: 'guests',
        },
        amenityFeature: property.highlights.map((h) => ({
          '@type': 'LocationFeatureSpecification',
          name: h,
          value: true,
        })),
      }}
    />
  )
}

/** FAQPage — makes the 21 existing Q&As eligible for FAQ rich results. */
export function FaqJsonLd({ faqs }: { faqs: Faq[] }) {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }}
    />
  )
}

export function BreadcrumbJsonLd({
  trail,
}: {
  trail: { name: string; path: string }[]
}) {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: trail.map((t, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: t.name,
          item: `${SITE.url}${t.path}`,
        })),
      }}
    />
  )
}
