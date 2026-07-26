import type { NextConfig } from 'next'
import { INTERNAL_REDIRECTS, EXTERNAL_REDIRECTS } from './content/url-matrix'

const nextConfig: NextConfig = {
  images: {
    /**
     * Hero imagery still lives in Wix media storage during the transition, so
     * next/image is allowed to optimise from there. Once assets are migrated
     * into /public (or a proper DAM) this block can go away.
     *
     * AUDIT FIX: the live site ships 2,772 PNG/JPG references against only 53
     * WebP/AVIF. Routing them through next/image converts to AVIF/WebP and
     * emits width/height, which fixes both the byte weight and the 245
     * dimensionless <img> tags causing layout shift.
     */
    remotePatterns: [
      { protocol: 'https', hostname: 'static.wixstatic.com', pathname: '/media/**' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  async redirects() {
    return [
      ...INTERNAL_REDIRECTS.map((r) => ({
        source: r.from,
        destination: r.to,
        permanent: true,
      })),
      ...EXTERNAL_REDIRECTS.map((r) => ({
        source: r.from,
        destination: r.to,
        permanent: true,
      })),
    ]
  },
}

export default nextConfig
