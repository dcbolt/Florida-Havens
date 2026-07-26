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

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/properties', label: 'Properties' },
  { href: '/book/the-florida-havens', label: 'Book Your Stay' },
  { href: '/guides', label: 'Local Attractions' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/contact', label: 'Contact' },
] as const
