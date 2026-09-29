import type { NextConfig } from 'next'

/*
 * Browser caching for media. Vercel serves /public with `max-age=0`, so every
 * visit re-requested every image and video. Files keep their name when
 * replaced in Keystatic (e.g. src.png), so they can't be cached forever: a day
 * is the trade-off, meaning returning visitors may see a replaced image up to
 * a day late.
 */
const MEDIA_MAX_AGE = 60 * 60 * 24

const nextConfig: NextConfig = {
  images: {
    // Also sets the browser Cache-Control on optimised /_next/image responses.
    minimumCacheTTL: MEDIA_MAX_AGE,
  },
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: `public, max-age=${MEDIA_MAX_AGE}` }],
      },
    ]
  },
}

export default nextConfig
