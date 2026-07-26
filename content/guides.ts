/**
 * SEO demand pages. These are the ~10 pages on the live site that actually
 * chase non-brand search intent ("stay near Brevard Zoo", "beach house near
 * Orlando theme parks", …) and they are the pages worth investing in.
 *
 * They move from flat root slugs to /guides/* in the rebuild, so 301s are
 * required — see content/url-matrix.ts for the full mapping.
 */
export type Guide = {
  slug: string
  /** Live Wix slug this replaces; drives the 308 in next.config.ts. */
  legacySlug: string
  title: string
  description: string
  h1: string
  intro: string
  /** Properties to cross-link from this guide — internal linking was thin. */
  featured: string[]
}

export const GUIDES: Guide[] = [
  {
    slug: 'orlando-theme-parks',
    legacySlug: 'beach-house-near-orlando-theme-parks',
    title: 'Beach House Near Orlando Theme Parks | The Florida Havens',
    description:
      'Stay beachfront and drive to Disney and Universal in about an hour. Luxury Space Coast homes with private pools.',
    h1: 'Beach House Near Orlando Theme Parks',
    intro:
      'You do not have to choose between the parks and the ocean. The Florida Havens sit about an hour east of Disney and Universal, so you can do a park day and still watch the sunset from the beach.',
    featured: ['the-dunes', 'beach-street'],
  },
  {
    slug: 'space-coast-rocket-launches',
    legacySlug:
      'stay-near-space-coast-rocket-launches-kennedy-space-center-beach-house',
    title: 'Watch Rocket Launches from the Beach | The Florida Havens',
    description:
      'Beachfront homes with a clear northern view toward Kennedy Space Center. Watch SpaceX and NASA launches from the sand.',
    h1: 'Watch Space Coast Rocket Launches from the Beach',
    intro:
      'Our stretch of Melbourne Beach looks north up the coast toward Kennedy Space Center. On launch nights you can walk down to the sand and watch it climb. This guide also absorbs the old Beach Street shuttle-launch page, including launch-day transportation notes for guests staying at the Beach Street campus.',
    featured: ['turtle-haven', 'shell-haven'],
  },
  {
    slug: 'brevard-zoo',
    legacySlug: 'stay-near-brevard-zoo-melbourne-beach-house',
    title: 'Stay Near Brevard Zoo | The Florida Havens',
    description:
      'Melbourne Beach vacation homes a short drive from Brevard Zoo in Viera — a easy family day on the Space Coast.',
    h1: 'Stay Near Brevard Zoo',
    intro:
      'Brevard Zoo in Viera is one of the Space Coast’s best family days out, and it is a short drive inland from every one of our homes.',
    featured: ['beach-haven', 'sea-haven'],
  },
  {
    slug: 'cape-canaveral-cruise-port',
    legacySlug: 'cape-canaveral-cruise-port-beach-stay',
    title: 'Cape Canaveral Cruise Port Beach Stay | The Florida Havens',
    description:
      'Beachfront homes for the night before or after your cruise from Port Canaveral. Room for the whole party.',
    h1: 'Beach Stay Near Cape Canaveral Cruise Port',
    intro:
      'Flying in the day before a cruise is far less stressful from a beach house than from an airport hotel. Port Canaveral is a straightforward drive north.',
    featured: ['the-dunes', 'beach-street'],
  },
  {
    slug: 'sebastian-inlet',
    legacySlug: 'beach-house-near-sebastian-inlet',
    title: 'Beach House Near Sebastian Inlet | The Florida Havens',
    description:
      'Stay minutes from Sebastian Inlet State Park — fishing, surfing and some of the best snook water in Florida.',
    h1: 'Beach House Near Sebastian Inlet',
    intro:
      'Sebastian Inlet is the fishing and surfing anchor of this coast, and it is a short run south from the Havens.',
    featured: ['turtle-haven', 'shell-haven'],
  },
  {
    slug: 'usssa-space-coast-complex',
    legacySlug: 'usssa-space-coast-complex-vacation-rental',
    title: 'USSSA Space Coast Complex Vacation Rental | The Florida Havens',
    description:
      'Tournament weekends made easy — beachfront homes with 7–8 king suites for baseball and softball teams and families.',
    h1: 'Vacation Rental Near the USSSA Space Coast Complex',
    intro:
      'Tournament weekends mean a lot of people and a lot of early mornings. Our campuses sleep whole teams and their families under one roof.',
    featured: ['beach-street', 'the-dunes'],
  },
  {
    slug: 'local-attractions',
    legacySlug: 'local-attractions-melbourne-beach',
    title: 'Local Attractions in Melbourne Beach | The Florida Havens',
    description:
      'What to do around Melbourne Beach and Indialantic — beaches, wildlife, launches, golf, fishing and dining.',
    h1: 'Local Attractions Around Melbourne Beach',
    intro:
      'Everything worth doing on this stretch of the Space Coast, from sea turtle walks to launch viewing to the best breakfast in Indialantic.',
    featured: ['the-dunes', 'beach-street'],
  },
  {
    slug: 'things-to-do-indialantic',
    legacySlug: 'things-to-do-indialantic-melbourne-beach',
    title: 'Things to Do in Indialantic & Melbourne Beach | The Florida Havens',
    description:
      'Surf breaks, sandbars, state parks and small-town dining within minutes of our Indialantic beach homes.',
    h1: 'Things to Do in Indialantic and Melbourne Beach',
    intro:
      'Indialantic is small, walkable and genuinely good — here is how we would spend a week.',
    featured: ['beach-haven', 'sea-haven'],
  },
  {
    slug: 'best-restaurants',
    legacySlug: 'best-restaurants-near-melbourne-beach-indialantic',
    title: 'Best Restaurants Near Melbourne Beach | The Florida Havens',
    description:
      'Where we actually eat around Melbourne Beach and Indialantic — seafood, breakfast, tacos and sunset drinks.',
    h1: 'Best Restaurants Near Melbourne Beach and Indialantic',
    intro:
      'The short list we give every guest who asks, sorted by the meal you need it for.',
    featured: ['beach-haven', 'turtle-haven'],
  },
  {
    slug: 'travel-with-pets',
    legacySlug: 'travel-with-your-pets',
    title: 'Travelling With Pets on the Space Coast | The Florida Havens',
    description:
      'Our homes sit on a protected sea turtle reserve and are pet-free. Here are the nearby boarding options we recommend.',
    h1: 'Travelling With Pets on the Space Coast',
    intro:
      'Because our beach is an active sea turtle nesting reserve, the Havens are pet-free. These are the boarding and daycare options our guests use.',
    featured: ['the-dunes', 'beach-street'],
  },
]

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug)
}
