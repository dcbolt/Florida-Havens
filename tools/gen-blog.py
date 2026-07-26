#!/usr/bin/env python3
"""Generate content/blog.ts from the live-site content snapshot.

These routes exist because content/url-matrix.ts marks /guest-blog and /post/*
as KEEP (1:1, no redirect) — yet the rebuild had no route for either, so both
would have 404'd at cutover and dropped an indexed page along with its
BlogPosting markup. The matrix said keep; nothing verified a route existed. CI
now asserts every KEEP URL resolves.

Usage:
  python3 tools/gen-blog.py backups/content-snapshot-2026-07-26.json.gz
"""
import gzip, json, re, sys

BASE = "https://www.thefloridahavens.com"
POST_SLUG = "sea-turtle-nesting-season-in-florida"

# Section headings on the live post, which Wix renders as plain text.
HEADINGS = {"Key Species", "Nesting Process", "Best Viewing Practices",
            "Conservation Efforts", "How to Help"}
# Bullet items, identified by their leading term on the live page.
BULLET = re.compile(
    r"^(Loggerhead|Green|Leatherback|Respect Wildlife|Use Red Lights|"
    r"Avoid Disturbances|Monitoring|Educating|Removing)")
FOOTER = "The Florida Havens are a collection"


def esc(s):
    return s.replace("\\", "\\\\").replace("'", "\\'")


def clean(s):
    s = s.replace("​", " ")
    # Markdown bold leaked into the Wix rich text; render as plain labels.
    s = re.sub(r"\*\*(.+?):\*\*", r"\1:", s)
    s = re.sub(r"\*\*(.+?)\*\*", r"\1", s)
    return re.sub(r"\s+", " ", s).strip()


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    d = json.load(gzip.open(sys.argv[1], "rt"))
    by = {p["url"].replace(BASE, ""): p for p in d["pages"]}

    post = by.get(f"/post/{POST_SLUG}")
    if not post:
        sys.exit(f"/post/{POST_SLUG} not in snapshot")
    t = post["text"]

    end = next((i for i, l in enumerate(t) if l.startswith(FOOTER)), len(t))
    # Skip chrome, then drop the leading date / reading-time / repeated-title
    # lines — those are already structured fields, not body copy.
    # Nav labels, the date/reading-time, and the repeated title are all chrome or
    # already-structured fields — never body copy.
    NAV = ("HOME", "ABOUT", "PROPERTIES", "BOOK YOUR STAY", "LOCAL ATTRACTIONS",
           "GUEST RESOURCES", "CONTACT", "All Posts", "top of page", "Menu",
           "Close", "SHARE YOUR STORY")
    DROP = re.compile(
        r"^(Aug \d+, \d{4}|\d+ min read|Sea Turtle Nesting Season|"
        r'"Memories From The Havens"|Sea Turtle Nesting Season in Florida|'
        + "|".join(re.escape(n) for n in NAV) + r")$")
    body = []
    for l in t[10:end]:
        c = clean(l)
        if not c or len(c) < 3 or DROP.match(c):
            continue
        body.append(c)

    if not body:
        sys.exit("extracted no body blocks — snapshot shape changed?")

    out = ['''/**
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
    slug: \'''' + POST_SLUG + '''\',
    title: 'Sea Turtle Nesting Season in Florida',
    description:
      "When sea turtles nest on Florida's Space Coast, which species you will see, and how to watch without disturbing them.",
    published: '2025-08-03',
    readingTime: '2 min read',
    excerpt:
      'Sea turtle nesting season in Florida typically runs from May through October, and our stretch of Melbourne Beach is an active nesting reserve.',
    blocks: [''']

    for c in body:
        kind = ("h2" if c.rstrip(":") in HEADINGS
                else "li" if BULLET.match(c) else "p")
        out.append(f"      {{ t: '{kind}', text: '{esc(c)}' }},")

    out.append("""    ],
  },
]

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug)
}
""")
    open("content/blog.ts", "w").write("\n".join(out))
    print(f"wrote content/blog.ts — {len(body)} blocks")


if __name__ == "__main__":
    main()
