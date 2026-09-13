import type { MetadataRoute } from 'next'
import { getCaseStudies, getSeoDefaults } from '@/lib/content'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [seo, studies] = await Promise.all([getSeoDefaults(), getCaseStudies()])

  const base = seo?.siteUrl?.replace(/\/$/, '')
  if (!base) return []

  const staticRoutes = ['', '/work', '/about'].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.8,
  }))

  /* Protected case studies are deliberately omitted — listing an NDA project's
     URL in a public sitemap invites exactly the crawling it's meant to avoid. */
  const caseRoutes = studies
    .filter((study) => study.access !== 'protected')
    .map((study) => ({
      url: `${base}/work/${study.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  return [...staticRoutes, ...caseRoutes]
}
