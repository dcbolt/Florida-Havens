/**
 * Property facts and long-form copy, GENERATED from the live site.
 *
 * Do not hand-edit. Regenerate with:
 *   python3 tools/gen-property-facts.py backups/content-snapshot-<stamp>.json.gz
 *
 * This module exists because the first hand-written pass invented occupancy and
 * bedroom counts and got them wrong on five of six homes. Those values feed
 * VacationRental JSON-LD, so a guess is published misinformation.
 *
 * GUEST FEEDBACK testimonials are deliberately excluded — they carry real guest
 * names and cities, and republishing attributed personal content on a new domain
 * needs sign-off first.
 */
export type PropertyFacts = {
  sleeps: number
  bedrooms: number
  baths: number
  amenitySummary: string
  locality: string
  postalCode: string
  /** "WELCOME TO …" body copy, verbatim from the live page. */
  welcome: string[]
}

export const PROPERTY_FACTS: Record<string, PropertyFacts> = {
  'turtle-haven': {
    sleeps: 8,
    bedrooms: 4,
    baths: 4.5,
    amenitySummary: 'Private Beach, Pool, Spa & Grill',
    locality: 'Melbourne Beach',
    postalCode: '32951',
    welcome: [
      'Welcome to Turtle Haven — an oceanfront sanctuary in Melbourne Beach, Florida. This 4-bedroom, 4.5-bath luxury vacation home combines modern boho design with relaxed coastal comfort. Each king suite includes a 65" TV, ensuite bathroom, and deluxe finishes that make your stay effortless.',
      'Unwind by your private waterfall pool and spa, or take a quiet stroll along the boardwalk overlooking 1.5 miles of untouched conservation land and sea turtle nesting territory. Enjoy exclusive private beach access for sunrise walks, fishing, or turtle watching right outside your door.',
      'After a day on the beach, fire up the grill on your private patio or cozy up indoors with (2) 85" TVs, high-speed internet, and a fully equipped kitchen perfect for family dinners. With EV chargers, seamless tech, and even private beach yoga sessions available, Turtle Haven is where luxury, privacy, and nature meet on Florida’s Space Coast.',
    ],
  },
  'shell-haven': {
    sleeps: 6,
    bedrooms: 3,
    baths: 2.5,
    amenitySummary: 'Private Beach, Pool, Spa & Grill',
    locality: 'Melbourne Beach',
    postalCode: '32951',
    welcome: [
      'Welcome to Shell Haven — a luxurious beachfront retreat in Melbourne Beach, Florida. This elegant 3-bedroom, 2.5-bath oceanfront vacation home blends coastal sophistication with relaxed comfort. Each king suite features a 65" TV and refined finishes designed for rest and rejuvenation. Step outside to your private waterfall pool and spa, framed by 1.5 miles of pristine conservation land and sea turtle nesting territory.',
      'Enjoy exclusive private beach access for morning walks, shell collecting, and world-class fishing just steps from your door. Inside, unwind with an 85" TV in the living room, high-speed internet, and a fully equipped kitchen perfect for family meals. With EV chargers, modern amenities, and private beach yoga available by request, Shell Haven offers the perfect balance of seclusion, style, and coastal luxury on Florida’s Space Coast.',
    ],
  },
  'beach-haven': {
    sleeps: 8,
    bedrooms: 4,
    baths: 4.5,
    amenitySummary: 'Private Beach, Pool, Spa & Grill',
    locality: 'Indialantic',
    postalCode: '32903',
    welcome: [
      'Welcome to Beach Haven — a spacious, modern coastal retreat in Indialantic, Florida. This brand-new 4-bedroom vacation home offers king beds in every suite, an open-concept living area, and an oversized, fully equipped kitchen ideal for family meals and gatherings. A private beach entrance just across the street brings you to one of Florida’s premier stretches of coastline. Enjoy breathtaking sunrises, long shoreline walks, great surf, excellent fishing, and hours of effortless family fun on the pristine sands of the Space Coast.',
      'Back at home, unwind in your private luxury pool and oversized spa, perfect for a refreshing break from the beach or a relaxing evening under the stars. And when you’re ready to explore, you’re only minutes from historic Downtown Melbourne, known for its vibrant selection of restaurants, cafés, boutique shops, art galleries, and nightlife.',
      'Beach Haven offers the perfect blend of peaceful coastal living with convenient access to everything Indialantic and Melbourne have to offer.',
    ],
  },
  'sea-haven': {
    sleeps: 8,
    bedrooms: 4,
    baths: 4.5,
    amenitySummary: 'Private Beach, Pool, Spa & Grill',
    locality: 'Indialantic',
    postalCode: '32903',
    welcome: [
      'Welcome to Sea Haven — Your Family’s Beachfront Escape on Florida’s Space Coast. A spacious coastal retreat just steps from a private beach entrance on the beautiful Indialantic shoreline. Enjoy endless family fun—from sunrise strolls and surf sessions to exceptional fishing and laid-back tanning. After a day on the sand, unwind by your private pool and oversized spa, then grill the day’s catch or explore historic Downtown Melbourne\'s local shops & restaurants. Sea Haven has 4 king suites, 4.5 bathrooms and all the amenities you could want. Only a 1 hour drive from Disney World and the Orlando theme parks, Sea Haven offers the perfect blend of coastal tranquility and family adventure. Paradise awaits!.',
    ],
  },
  'the-dunes': {
    sleeps: 14,
    bedrooms: 7,
    baths: 7.0,
    amenitySummary: 'Private Beach, 2x Pools, Spas & Grill',
    locality: 'Melbourne Beach',
    postalCode: '32951',
    welcome: [
      'Welcome to The Havens at The Dunes — a private oceanfront compound in Melbourne Beach, Florida, perfect for family reunions, multi-family vacations, weddings, and wellness retreats. By booking Turtle Haven and Shell Haven together, guests enjoy a sprawling 7-suite beachfront estate with unmatched privacy, stunning views, and direct access to a quiet stretch of Florida’s Space Coast.',
      'This exclusive coastal sanctuary features 7 king bedrooms, multiple living areas, and 2 gourmet kitchens ideal for shared meals and celebrations. Step outside to your solitary beachfront, framed by miles of pristine conservation land and sea turtle nesting territory — a natural setting rarely found in vacation rentals.',
      'Relax your way, whether by soaking in two private waterfall pools, unwinding in two luxury spas, or savoring peace on the boardwalk overlooking untouched shoreline. With high-end amenities, EV chargers, high-speed internet, and ample indoor–outdoor gathering spaces, The Dunes is uniquely designed for connection, restoration, and unforgettable coastal moments. Private beach yoga sessions are available upon request — simply include a note in your reservation.',
    ],
  },
  'beach-street': {
    sleeps: 16,
    bedrooms: 8,
    baths: 10.0,
    amenitySummary: 'Private Beach, 2x Pools, Spas & Grills',
    locality: 'Indialantic',
    postalCode: '32903',
    welcome: [
      'Welcome to Beach Street — Discover the perfect blend of beachside relaxation and vibrant coastal energy when you book Beach Haven and Sea Haven together. Located in the heart of Indialantic and just steps from a private beach entrance, this combined retreat offers 8 spacious king bedrooms, 10 bathrooms, two private pools with oversized spas, and plenty of room for families or groups to unwind in style.',
      'Enjoy sunrise strolls on miles of pristine shoreline, spend the day surfing, fishing, or exploring the area, then walk or bike to historic Downtown Melbourne for incredible dining, boutique shopping, cafés, and nightlife. With two fully equipped kitchens, high-speed internet, two gas grills, and modern coastal décor throughout, "The Havens at Beach Street" delivers the perfect balance of comfort, convenience, and coastal adventure. Ideal for multigenerational families, wedding groups, reunions, and friends’ getaways.',
      'Beach Street is your beachside paradise—twice the space, twice the fun.',
    ],
  },
}
