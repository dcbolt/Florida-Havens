/**
 * Property catalogue. Copy, titles and hero images are carried over from the
 * live Wix pages so look, feel and messaging are preserved 1:1.
 *
 * `slug` deliberately matches the existing Wix URL so every property page is a
 * 1:1 URL match at cutover and keeps its accumulated ranking. Do not rename.
 */
export type Property = {
  slug: string
  name: string
  /** <=60 chars — AUDIT FIX: 7 live titles exceeded 60 and were truncated in SERPs. */
  title: string
  /** <=155 chars — AUDIT FIX: 51 of 74 live descriptions exceeded 160 chars. */
  description: string
  hero: string
  heroAlt: string
  kind: 'home' | 'campus'
  /** Campus this home belongs to, for internal linking. */
  campus?: 'the-dunes' | 'beach-street'
  locality: string
  bedrooms?: number
  sleeps?: number
  /** Short factual bullets shown under "Plan your visit". */
  highlights: string[]
  intro: string
}

const W = 'https://static.wixstatic.com/media'

export const PROPERTIES: Property[] = [
  {
    slug: 'turtle-haven',
    name: 'Turtle Haven',
    kind: 'home',
    campus: 'the-dunes',
    title: 'Turtle Haven | The Florida Havens',
    description:
      'A secluded luxury beachfront rental on sea turtle nesting grounds. Private pool and spa, ocean views, family amenities on the Space Coast.',
    hero: `${W}/f054db_fead69fd7ac24407982b6f8375112ad1~mv2.png/v1/fill/w_1920,h_1080,al_c/f054db_fead69fd7ac24407982b6f8375112ad1~mv2.png`,
    heroAlt:
      'Turtle Haven beachfront villa at dusk with private pool overlooking the Atlantic in Melbourne Beach, Florida',
    locality: 'Melbourne Beach',
    bedrooms: 3,
    sleeps: 8,
    highlights: [
      'Private heated pool and spa',
      'Direct beach access on a protected sea turtle reserve',
      'Ocean views from the main living space',
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
    title: 'Shell Haven | The Florida Havens',
    description:
      'Luxury beachfront home on Florida’s Space Coast with three king bedrooms, private pool, ocean views and exclusive beach access.',
    hero: `${W}/f054db_4758d285759b4f6ba21c000e666a7771~mv2.png/v1/fill/w_1920,h_1080,al_c/f054db_4758d285759b4f6ba21c000e666a7771~mv2.png`,
    heroAlt:
      'Shell Haven luxury beachfront vacation home with private pool and ocean view on the Florida Space Coast',
    locality: 'Melbourne Beach',
    bedrooms: 3,
    sleeps: 8,
    highlights: [
      'Three king bedrooms',
      'Private pool and spa',
      'Ocean views and exclusive beach access',
      'On a protected sea turtle nesting beach',
    ],
    intro:
      'Three king bedrooms, a private pool, and the Atlantic directly out front. Shell Haven is the easiest of the Havens to fill with a multi-couple group.',
  },
  {
    slug: 'beach-haven',
    name: 'Beach Haven',
    kind: 'home',
    campus: 'beach-street',
    title: 'Beach Haven | The Florida Havens',
    description:
      'Spacious luxury beachfront home in Indialantic, FL. Private pool and spa, king bedrooms, minutes from beaches, dining and downtown Melbourne.',
    hero: `${W}/f054db_14bd6f0adcb24b29b6840742b464d19b~mv2.png/v1/fill/w_1920,h_1080,al_c/f054db_14bd6f0adcb24b29b6840742b464d19b~mv2.png`,
    heroAlt:
      'Beach Haven vacation home exterior with pool deck and palm trees in Indialantic, Florida',
    locality: 'Indialantic',
    bedrooms: 4,
    sleeps: 10,
    highlights: [
      'Private pool and spa',
      'Multiple king bedrooms',
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
    title: 'Sea Haven | The Florida Havens',
    description:
      'Luxury beachfront rental with ocean views, private amenities and direct beach access. Book direct for the best rate.',
    hero: `${W}/f054db_8e2ebd0f2b0049dd905a9a6ea3af7f81~mv2.png/v1/fill/w_1920,h_1080,al_c/f054db_8e2ebd0f2b0049dd905a9a6ea3af7f81~mv2.png`,
    heroAlt:
      'Sea Haven beachfront rental with ocean view terrace on the Florida Space Coast',
    locality: 'Indialantic',
    bedrooms: 4,
    sleeps: 10,
    highlights: [
      'Ocean views',
      'Private pool and spa',
      'Direct beach access',
      'Best rate guaranteed when you book direct',
    ],
    intro:
      'Sea Haven is the quieter half of the Beach Street campus — same beach, same pool deck, fewer footsteps.',
  },
  {
    slug: 'the-dunes',
    name: 'The Havens at The Dunes',
    kind: 'campus',
    title: 'The Havens at The Dunes | The Florida Havens',
    description:
      'A luxury beachfront compound on Florida’s Space Coast with 7 king suites, private pools and a protected sea turtle reserve next door.',
    hero: `${W}/f054db_f32efb37368249f89e2a9a4911f60e5f~mv2.png/v1/fill/w_1920,h_1080,al_c/f054db_f32efb37368249f89e2a9a4911f60e5f~mv2.png`,
    heroAlt:
      'Aerial view of The Havens at The Dunes beachfront compound with two private pools on the Atlantic',
    locality: 'Melbourne Beach',
    sleeps: 16,
    highlights: [
      '7 king suites across the compound',
      'Two private pools and spas',
      'Adjacent to a protected sea turtle reserve',
      'Books as one property for large groups',
    ],
    intro:
      'The Dunes is Turtle Haven and Shell Haven side by side — book the whole compound when one house is not enough.',
  },
  {
    slug: 'beach-street',
    name: 'The Havens at Beach Street',
    kind: 'campus',
    title: 'The Havens at Beach Street | The Florida Havens',
    description:
      'Beachfront vacation homes in Indialantic, FL with 8 king suites — built for large groups visiting Disney, Universal and the Space Coast.',
    hero: `${W}/f054db_0b86e68f7a0743eaacbfd4b4c8c36887~mv2.png/v1/fill/w_1920,h_1080,al_c/f054db_0b86e68f7a0743eaacbfd4b4c8c36887~mv2.png`,
    heroAlt:
      'The Havens at Beach Street beachfront homes with shared pool deck in Indialantic, Florida',
    locality: 'Indialantic',
    sleeps: 20,
    highlights: [
      '8 king suites across the campus',
      'Two private pools',
      'Walk to Indialantic dining and surf',
      'Ideal for reunions and tournament groups',
    ],
    intro:
      'Beach Street is Beach Haven and Sea Haven together — eight king suites for reunions, wedding parties and tournament weekends.',
  },
]

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
