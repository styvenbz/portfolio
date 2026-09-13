import type { MetadataRoute } from 'next'
import { getSeoDefaults } from '@/lib/content'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getSeoDefaults()
  const base = seo?.siteUrl?.replace(/\/$/, '')

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The CMS is not content, and protected work must stay out of search.
      disallow: ['/keystatic', '/api/'],
    },
    sitemap: base ? `${base}/sitemap.xml` : undefined,
  }
}
