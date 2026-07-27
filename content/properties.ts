import { PROPERTY_FACTS, type PropertyFacts } from './property-facts'

/**
 * Property catalogue.
 *
 * Editorial fields (titles, descriptions, hero imagery, positioning) live here.
 * **Factual fields — occupancy, bedrooms, baths, locality — do not.** Those come
 * from `content/property-facts.ts`, which is generated from the live site.
 *
 * That split exists for a reason. The first version of this file carried
 * hand-entered bedroom and sleeps counts, and they were wrong on five of the six
 * homes (Shell Haven sleeps 6 not 8; The Dunes 14 not 16; Beach Street 16 not
 * 20; Turtle Haven has 4 king bedrooms not 3). Those values feed
 * `VacationRental` JSON-LD, so a wrong guess is published misinformation about
 * how many people can stay — worse than no markup at all.
 *
 * If a number belongs in this file, it is probably in the wrong file.
 *
 * `slug` deliberately matches the existing Wix URL so every property page is a
 * 1:1 match at cutover and keeps its accumulated authority. Do not rename.
 */
type PropertyBase = {
  slug: string
  name: string
  /**
   * <=60 chars, and must name the property's town — CI asserts both against
   * built output. The Search Console baseline showed the entire named-impression
   * tail is generic "sea haven" / "beach haven" collisions with unrelated
   * businesses at average position 33.7, so a house name alone cannot rank.
   * Feeds the document <title> via `absolute`, bypassing the layout template.
   */
  title: string
  /** <=155 chars — AUDIT FIX: 51 of 74 live descriptions exceeded 160. */
  description: string
  hero: string
  /**
   * UNVERIFIED — see AUDIT.md finding 16. These were written in a sandbox with no
   * image rendering, so they are inferred from marketing copy, not descriptions
   * of the actual photographs. Checked against the live gallery photos on
   * 2026-07-26, two of six were plain wrong: Turtle Haven's showed an interior
   * sunroom, not a villa at dusk; Sea Haven's showed a kitchen, not an ocean-view
   * terrace. Wrong alt text is worse than none — it misinforms a screen-reader
   * user and misdescribes the page to Google. Anyone who can see images should
   * open the six `hero` URLs and correct these to match.
   */
  heroAlt: string
  kind: 'home' | 'campus'
  /** Campus this home belongs to, for internal linking. */
  campus?: 'the-dunes' | 'beach-street'
  /**
   * Editorial positioning only — no counts, no measurements. Anything countable
   * belongs in property-facts.ts.
   */
  highlights: string[]
  intro: string
  /**
   * 360/virtual tour embed URL.
   *
   * Turtle Haven had a dedicated tour page on the live site
   * (/turtle-haven-virtual-tour, now 301'd here). The embed could NOT be
   * recovered: like the booking widget it is injected client-side by a Wix
   * HtmlComponent, so no provider URL appears in the server HTML at all —
   * checked for Matterport, Kuula, Cupix, iGuide, YouTube and Vimeo, zero hits.
   *
   * Devin needs to supply it from the Wix editor. Until then the property page
   * renders an explicit "not yet connected" note rather than pretending the tour
   * does not exist — visitors arriving from a "turtle haven virtual tour" search
   * land here and should not be silently disappointed.
   */
  virtualTourUrl?: string
}

export type Property = PropertyBase & PropertyFacts

const W = 'https://static.wixstatic.com/media'

const BASE_PROPERTIES: PropertyBase[] = [
  {
    slug: 'turtle-haven',
    name: 'Turtle Haven',
    kind: 'home',
    campus: 'the-dunes',
    title: 'Turtle Haven | Beachfront Rental, Melbourne Beach FL',
    description:
      'A secluded luxury beachfront rental on sea turtle nesting grounds. Private pool and spa, ocean views, family amenities on the Space Coast.',
    hero: `${W}/f054db_fead69fd7ac24407982b6f8375112ad1~mv2.png/v1/fill/w_1920,h_1080,al_c/f054db_fead69fd7ac24407982b6f8375112ad1~mv2.png`,
    heroAlt:
      'Turtle Haven beachfront villa at dusk with private pool overlooking the Atlantic in Melbourne Beach, Florida',
    highlights: [
      'Private waterfall pool and spa',
      'Direct beach access on a protected sea turtle reserve',
      'Boardwalk over untouched conservation land',
      'About an hour to Orlando theme parks',
    ],
    intro:
      'Turtle Haven sits directly on a protected sea turtle nesting beach — quiet, private, and built for families who want the ocean a few steps from the door.',
  },
  {
    slug: 'shell-haven',
    name: 'Shell Haven',
    kind: 'home',
    campus: 'the-dunes',
    title: 'Shell Haven | Beachfront Rental, Melbourne Beach FL',
    description:
      'Luxury beachfront home on Florida’s Space Coast with king bedrooms, a private pool and spa, and exclusive beach access.',
    hero: `${W}/f054db_4758d285759b4f6ba21c000e666a7771~mv2.png/v1/fill/w_1920,h_1080,al_c/f054db_4758d285759b4f6ba21c000e666a7771~mv2.png`,
    heroAlt:
      'Shell Haven luxury beachfront vacation home with private pool and ocean view in Melbourne Beach, Florida',
    highlights: [
      'Private pool and spa',
      'Exclusive private beach access',
      'World-class fishing steps from the door',
      'On a protected sea turtle nesting beach',
    ],
    intro:
      'A private pool, exclusive beach access, and the Atlantic directly out front. Shell Haven is the easiest of the Havens to fill with a multi-couple group.',
  },
  {
    slug: 'beach-haven',
    name: 'Beach Haven',
    kind: 'home',
    campus: 'beach-street',
    title: 'Beach Haven | Beachfront Rental, Indialantic FL',
    description:
      'Spacious, brand-new coastal retreat in Indialantic, FL. Private pool and oversized spa, minutes from beaches, dining and downtown Melbourne.',
    hero: `${W}/f054db_14bd6f0adcb24b29b6840742b464d19b~mv2.png/v1/fill/w_1920,h_1080,al_c/f054db_14bd6f0adcb24b29b6840742b464d19b~mv2.png`,
    heroAlt:
      'Beach Haven vacation home exterior with pool deck and palm trees in Indialantic, Florida',
    highlights: [
      'Private luxury pool and oversized spa',
      'King bed in every bedroom',
      'Walk to Indialantic beaches and dining',
      'Minutes from downtown Melbourne',
    ],
    intro:
      'Beach Haven trades seclusion for walkability — Indialantic’s restaurants, surf breaks and downtown Melbourne are all close by.',
  },
  {
    slug: 'sea-haven',
    name: 'Sea Haven',
    kind: 'home',
    campus: 'beach-street',
    title: 'Sea Haven | Beachfront Rental, Indialantic FL',
    description:
      'Spacious beachfront escape on Florida’s Space Coast, steps from a private beach entrance. Book direct for the best rate.',
    hero: `${W}/f054db_8e2ebd0f2b0049dd905a9a6ea3af7f81~mv2.png/v1/fill/w_1920,h_1080,al_c/f054db_8e2ebd0f2b0049dd905a9a6ea3af7f81~mv2.png`,
    heroAlt:
      'Sea Haven beachfront rental with ocean view terrace in Indialantic, Florida',
    highlights: [
      'Steps from a private beach entrance',
      'Private pool and spa',
      'Built for family stays',
      'Best rate guaranteed when you book direct',
    ],
    intro:
      'Sea Haven is the quieter half of the Beach Street campus — same beach, same pool deck, fewer footsteps.',
  },
  {
    slug: 'the-dunes',
    name: 'The Havens at The Dunes',
    kind: 'campus',
    title: 'The Havens at The Dunes | Beachfront, Melbourne Beach FL',
    description:
      'A private oceanfront compound in Melbourne Beach for reunions and large groups — two pools, two kitchens, protected reserve next door.',
    hero: `${W}/f054db_f32efb37368249f89e2a9a4911f60e5f~mv2.png/v1/fill/w_1920,h_1080,al_c/f054db_f32efb37368249f89e2a9a4911f60e5f~mv2.png`,
    heroAlt:
      'Aerial view of The Havens at The Dunes beachfront compound with two private pools on the Atlantic',
    highlights: [
      'Turtle Haven and Shell Haven booked together',
      'Two private waterfall pools and two luxury spas',
      'Two gourmet kitchens and multiple living areas',
      'Boardwalk over a protected sea turtle reserve',
    ],
    intro:
      'The Dunes is Turtle Haven and Shell Haven side by side — book the whole compound when one house is not enough.',
  },
  {
    slug: 'beach-street',
    name: 'The Havens at Beach Street',
    kind: 'campus',
    title: 'The Havens at Beach Street | Beachfront, Indialantic FL',
    description:
      'Beach Haven and Sea Haven booked together in Indialantic — twice the space for reunions, wedding parties and tournament groups.',
    hero: `${W}/f054db_0b86e68f7a0743eaacbfd4b4c8c36887~mv2.png/v1/fill/w_1920,h_1080,al_c/f054db_0b86e68f7a0743eaacbfd4b4c8c36887~mv2.png`,
    heroAlt:
      'The Havens at Beach Street beachfront homes with shared pool deck in Indialantic, Florida',
    highlights: [
      'Beach Haven and Sea Haven booked together',
      'Two private pools, spas and grills',
      'Walk or bike to historic downtown Melbourne',
      'Ideal for reunions and tournament groups',
    ],
    intro:
      'Beach Street is Beach Haven and Sea Haven together — twice the space for reunions, wedding parties and tournament weekends.',
  },
]

/**
 * Merge editorial copy with the generated facts. Throws at module load if a
 * property has no facts entry — better a hard build failure than silently
 * shipping `undefined` occupancy into JSON-LD.
 */
export const PROPERTIES: Property[] = BASE_PROPERTIES.map((p) => {
  const facts = PROPERTY_FACTS[p.slug]
  if (!facts) {
    throw new Error(
      `No PROPERTY_FACTS entry for "${p.slug}". Regenerate with ` +
        `tools/gen-property-facts.py before building.`
    )
  }
  return { ...p, ...facts }
})

export const HOMES = PROPERTIES.filter((p) => p.kind === 'home')
export const CAMPUSES = PROPERTIES.filter((p) => p.kind === 'campus')

export function getProperty(slug: string): Property | undefined {
  return PROPERTIES.find((p) => p.slug === slug)
}

/** Bookable targets = every property plus the whole-brand enquiry route. */
export const BOOKABLE = [
  ...PROPERTIES.map((p) => p.slug),
  'the-florida-havens',
]
