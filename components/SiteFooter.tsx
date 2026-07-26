import Link from 'next/link'
import { SITE } from '@/content/site'
import { HOMES, CAMPUSES } from '@/content/properties'

/**
 * Resolved once at module evaluation (build time) rather than per render.
 * Reading the clock inside a component would make an otherwise fully static
 * route depend on request time — see the Next.js "Building public pages" guide.
 */
const BUILD_YEAR = new Date().getFullYear()

/**
 * Footer.
 *
 * AUDIT FIX: the live footer is also where the second phone number appeared.
 * Everything here reads SITE.phone so there is one number, in one place.
 *
 * Guest-ops links (Wi-Fi, laundry, check-in, house manuals) are deliberately
 * absent — that content belongs to Media Haven, not the marketing domain.
 */
export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-black/10 bg-sand-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <p className="font-display text-lg text-ocean-700">{SITE.name}</p>
          <address className="mt-3 text-sm not-italic leading-relaxed text-neutral-600">
            {SITE.address.street}
            <br />
            {SITE.address.locality}, {SITE.address.region}{' '}
            {SITE.address.postalCode}
          </address>
          <p className="mt-3 text-sm">
            <a
              href={`tel:${SITE.phoneE164}`}
              className="text-ocean-700 hover:underline"
            >
              {SITE.phone}
            </a>
          </p>
          <p className="text-sm">
            <a
              href={`mailto:${SITE.email}`}
              className="text-ocean-700 hover:underline"
            >
              {SITE.email}
            </a>
          </p>
        </div>

        <nav aria-labelledby="footer-homes">
          <h2
            id="footer-homes"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500"
          >
            The Homes
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {HOMES.map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.slug}`} className="hover:text-ocean-700">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-campuses">
          <h2
            id="footer-campuses"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500"
          >
            Whole Compounds
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {CAMPUSES.map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.slug}`} className="hover:text-ocean-700">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-more">
          <h2
            id="footer-more"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500"
          >
            More
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-ocean-700">
                About
              </Link>
            </li>
            <li>
              <Link href="/guides" className="hover:text-ocean-700">
                Local Guides
              </Link>
            </li>
            <li>
              <Link href="/faqs" className="hover:text-ocean-700">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-ocean-700">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-ocean-700">
                Privacy
              </Link>
            </li>
            <li>
              <Link
                href="/terms-and-conditions"
                className="hover:text-ocean-700"
              >
                Terms
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:text-ocean-700">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link
                href="/accessibility-statement"
                className="hover:text-ocean-700"
              >
                Accessibility
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-black/5 px-4 py-6 text-center text-xs text-neutral-500 sm:px-6">
        © {BUILD_YEAR} {SITE.legalName}. Staying with us? Your
        house guide lives in the{' '}
        <a
          href="https://welcome.mediahaven.app"
          className="text-ocean-700 hover:underline"
        >
          guest portal
        </a>
        .
      </div>
    </footer>
  )
}
