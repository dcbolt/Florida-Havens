import type { Metadata } from 'next'
import { Cormorant_Garamond, Raleway } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/JsonLd'
import { SITE } from '@/content/site'

/**
 * Fonts are self-hosted by next/font, which removes the render-blocking
 * round-trip to Wix's font CDN and eliminates the FOUT the live site shows.
 */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default:
      'The Florida Havens | Luxury Beachfront Rentals on the Space Coast',
    template: '%s | The Florida Havens',
  },
  description:
    'Luxury beachfront vacation homes on Florida’s Space Coast. Private pools, ocean views, an hour from Orlando. Book direct for our best rate.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: 'en_US',
    url: SITE.url,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${raleway.variable}`}>
      <head>
        {/*
          AUDIT FIX: the live site issues zero preconnects. Establishing the
          connection to the image origin early removes a DNS+TLS round-trip
          from the largest contentful paint.
        */}
        <link rel="preconnect" href="https://static.wixstatic.com" crossOrigin="" />
      </head>
      <body className="antialiased">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />

        <OrganizationJsonLd />
        <WebSiteJsonLd />

        {/*
          GA4 reuses the existing property so historical data stays continuous.
          `afterInteractive` keeps it off the critical path — on the live Wix
          site GTM is one of 12 external scripts loaded per page.
        */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${SITE.ga4}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${SITE.ga4}');`}
        </Script>
      </body>
    </html>
  )
}
