/**
 * Blog content, GENERATED from the live-site snapshot. Do not hand-edit.
 *
 * Regenerate:
 *   python3 tools/gen-blog.py backups/content-snapshot-<stamp>.json.gz
 *
 * Why these routes exist: content/url-matrix.ts marks /guest-blog and /post/*
 * as KEEP (1:1, no redirect), but the rebuild had no route for either — both
 * would have 404'd at cutover and dropped an indexed page. CI now asserts every
 * KEEP URL in the matrix resolves.
 */
export type BlogBlock = { t: 'h2' | 'p' | 'li'; text: string }

export type Post = {
  slug: string
  title: string
  description: string
  /** Publication date as shown on the live post. */
  published: string
  readingTime: string
  excerpt: string
  blocks: BlogBlock[]
}

export const BLOG_INDEX = {
  title: 'Guest Stories',
  h1: 'Memories From The Havens',
  description:
    "Guest reviews and vacation stories from The Florida Havens — beachfront rentals on Florida's Space Coast near Orlando.",
  intro: [
    'Enjoy stories from other guests who have stayed at The Florida Havens. Get tips for things to do, places to eat, and more to help you plan your own stay.',
    'If you enjoyed your time with us and want to share it with future guests, we would love to hear from you.',
  ],
} as const

export const POSTS: Post[] = [
  {
    slug: 'sea-turtle-nesting-season-in-florida',
    title: 'Sea Turtle Nesting Season in Florida',
    description:
      "When sea turtles nest on Florida's Space Coast, which species you will see, and how to watch without disturbing them.",
    published: '2025-08-03',
    readingTime: '2 min read',
    excerpt:
      'Sea turtle nesting season in Florida typically runs from May through October, and our stretch of Melbourne Beach is an active nesting reserve.',
    blocks: [
      { t: 'p', text: 'Sea turtle nesting season in Florida typically runs from May through October. During this time, various species of sea turtles, including the loggerhead, green, and leatherback turtles, come ashore to lay their eggs.' },
      { t: 'h2', text: 'Key Species' },
      { t: 'li', text: 'Loggerhead Turtle: The most common species found in Florida, known for its large head and strong jaws.' },
      { t: 'li', text: 'Green Turtle: Recognized by its olive-brown shell, this species primarily feeds on seagrass.' },
      { t: 'li', text: 'Leatherback Turtle: The largest of all sea turtle species, distinguished by its leathery shell.' },
      { t: 'h2', text: 'Nesting Process' },
      { t: 'p', text: '1. Arrival on Shore: Female sea turtles typically return to the same beach where they were born to nest. 2. Digging the Nest: Using their flippers, the turtles dig a nest in the sand, usually above the high tide line. 3. Laying Eggs: The female lays an average of 100-150 eggs, which are then covered with sand to protect them from predators. 4. Incubation Period: The eggs incubate for about 60 days before hatching.' },
      { t: 'h2', text: 'Best Viewing Practices' },
      { t: 'li', text: 'Respect Wildlife: Keep a safe distance from nesting turtles and hatchlings.' },
      { t: 'li', text: 'Use Red Lights: If you are observing at night, use red filters to avoid disturbing the turtles.' },
      { t: 'li', text: 'Avoid Disturbances: Stay off nesting sites and do not interfere with the nesting process.' },
      { t: 'h2', text: 'Conservation Efforts' },
      { t: 'p', text: 'Florida has numerous organizations and volunteer programs dedicated to protecting sea turtles during nesting season. These initiatives include:' },
      { t: 'li', text: 'Monitoring nesting sites.' },
      { t: 'li', text: 'Educating the public about sea turtle conservation.' },
      { t: 'li', text: 'Removing debris from beaches to create safer nesting environments.' },
      { t: 'h2', text: 'How to Help' },
      { t: 'p', text: 'Participate in Beach Cleanups: Help keep nesting sites clean and free of debris.' },
      { t: 'p', text: 'Report Nesting Activities: Notify local wildlife agencies if you see a nesting turtle or hatchlings.' },
      { t: 'p', text: 'Spread Awareness: Educate others about the importance of sea turtle conservation.' },
      { t: 'p', text: 'Conclusion' },
      { t: 'p', text: 'Sea turtle nesting season in Florida is a critical time for these magnificent creatures. By understanding their nesting habits and participating in conservation efforts, we can help ensure their survival for future generations.' },
    ],
  },
]

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug)
}
