import Link from 'next/link'
import { NAV, SITE } from '@/content/site'

/**
 * Site navigation.
 *
 * AUDIT FIX — this is the single most damaging bug on the live site. Wix
 * renders every nav label (HOME, ABOUT, PROPERTIES, BOOK YOUR STAY, LOCAL
 * ATTRACTIONS, GUEST RESOURCES, CONTACT) as an <h1>. Measured across 74
 * crawled pages: 0 pages had exactly one <h1>; the distribution was 7 h1s on
 * 20 pages, 8 on 43 pages, 9 on 9 pages and 10 on one. Every page therefore
 * told Google its primary topic was "HOME ABOUT PROPERTIES…".
 *
 * Here the nav is a plain <nav> with a list of links and no heading tags at
 * all, which leaves exactly one <h1> per page — owned by the page itself.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
        {/* Brand lockup is a link, not a heading. */}
        <Link
          href="/"
          className="font-display text-lg leading-tight tracking-wide text-ocean-700 sm:text-xl"
        >
          The Florida Havens
        </Link>

        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-700 transition-colors hover:text-ocean-700"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${SITE.phoneE164}`}
            className="hidden text-sm font-medium text-ocean-700 sm:inline"
          >
            {SITE.phone}
          </a>
          <Link
            href="/book/the-florida-havens"
            className="rounded-sm bg-ocean-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
          >
            Book
          </Link>
        </div>
      </div>

      {/* Mobile nav: no JS, no hamburger state, no layout shift. */}
      <nav aria-label="Main navigation (mobile)" className="lg:hidden">
        <ul className="flex gap-5 overflow-x-auto border-t border-black/5 px-4 py-2">
          {NAV.map((item) => (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-600"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
