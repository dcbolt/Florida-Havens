/**
 * Single source of truth for brand-level facts.
 *
 * AUDIT FIX: the live Wix site publishes two different phone numbers — the
 * homepage JSON-LD carries 5087260695 while the visible footer/booking copy
 * uses 321-209-0495. Devin confirmed 321-209-0495 is the only correct number.
 * Every surface reads it from here so the two can never drift again.
 */
export const SITE = {
  name: 'The Florida Havens',
  legalName: 'The Florida Havens',
  url: 'https://www.thefloridahavens.com',
  /** Canonical brand phone. Do not hardcode a phone anywhere else. */
  phone: '321-209-0495',
  phoneE164: '+13212090495',
  email: 'Relax@thefloridahavens.com',
  address: {
    street: '4225 South Highway A1A',
    locality: 'Melbourne Beach',
    region: 'FL',
    postalCode: '32951',
    country: 'US',
  },
  geo: { lat: 28.0186, lng: -80.5403 },
  /** GA4 property already live on the Wix site — reused so history is continuous. */
  ga4: 'G-3669F4QWXJ',
  social: [] as string[],
} as const

/**
 * Media Haven guest portal — the destination for all in-stay content.
 *
 * REDLINE (Grok, 2026-07-26): `welcome.mediahaven.app` was assumed here and it
 * does not exist — no DNS record for it or for `mediahaven.app`. Verified
 * independently. The only reachable guest surface today is the Vercel preview
 * below (HTTP 200).
 *
 * A permanent redirect to a nonexistent host is worse than no redirect, so
 * while `hostConfirmed` is false the guest-ops URLs resolve to an on-domain
 * `/guest-portal` notice page instead. That page is noindex, so the index
 * bloat is still cleared, and nothing 301s into a void.
 *
 * DEVIN: confirm the production guest-portal host, set `url`, and flip
 * `hostConfirmed` to true. That single change converts all 42 guest-ops rows
 * to external 301s — no other edit needed.
 */
export const GUEST_PORTAL = {
  hostConfirmed: false,
  /** Reachable today, but a preview deployment — not a 301 target. */
  url: 'https://media-haven-lilac.vercel.app/welcome',
  fallbackPath: '/guest-portal',
} as const

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/properties', label: 'Properties' },
  { href: '/book/the-florida-havens', label: 'Book Your Stay' },
  { href: '/guides', label: 'Local Attractions' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/contact', label: 'Contact' },
] as const
