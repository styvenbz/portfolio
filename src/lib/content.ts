import 'server-only'
import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../../keystatic.config'

/**
 * The single entry point for reading content.
 *
 * Nothing outside this file should touch the filesystem or Keystatic's reader
 * directly — see .claude/skills/keystatic-cms/SKILL.md.
 */
export const reader = createReader(process.cwd(), keystaticConfig)

export type CaseStudy = NonNullable<
  Awaited<ReturnType<typeof reader.collections.caseStudies.read>>
> & { slug: string }

/** All case studies, ordered by `order` then descending year. */
export async function getCaseStudies(): Promise<CaseStudy[]> {
  const entries = await reader.collections.caseStudies.all()

  return entries
    .map((entry) => ({ ...entry.entry, slug: entry.slug }))
    .sort((a, b) => {
      const aOrder = a.order ?? Number.MAX_SAFE_INTEGER
      const bOrder = b.order ?? Number.MAX_SAFE_INTEGER
      if (aOrder !== bOrder) return aOrder - bOrder
      return (b.year ?? '').localeCompare(a.year ?? '')
    })
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  const entry = await reader.collections.caseStudies.read(slug)
  return entry ? { ...entry, slug } : null
}

export async function getFeaturedCaseStudies(): Promise<CaseStudy[]> {
  const all = await getCaseStudies()
  const featured = all.filter((study) => study.featured)
  return featured.length > 0 ? featured : all
}

export const getHome = () => reader.singletons.home.read()
export const getAbout = () => reader.singletons.about.read()
export const getContact = () => reader.singletons.contact.read()
export const getSiteSettings = () => reader.singletons.siteSettings.read()
export const getSeoDefaults = () => reader.singletons.seoDefaults.read()
