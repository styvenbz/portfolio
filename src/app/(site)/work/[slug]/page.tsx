import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CaseStudyHeader } from '@/components/case-study/CaseStudyHeader'
import { CaseStudySections } from '@/components/case-study/CaseStudySections'
import { PasswordGate } from '@/components/PasswordGate'
import { getCaseStudies, getCaseStudy, getSiteSettings } from '@/lib/content'
import { gateMisconfigured, isUnlocked } from '@/lib/gate'
import { hasImage } from '@/lib/media'

/**
 * Only PUBLIC case studies are prerendered.
 *
 * A protected page depends on the unlock cookie, so it must render per-request.
 * If it were prerendered, the cached HTML would always be the locked gate and
 * entering the correct password would appear to do nothing. Protected slugs are
 * still valid routes — `dynamicParams` (on by default) renders them on demand.
 */
export async function generateStaticParams() {
  const studies = await getCaseStudies()
  return studies
    .filter((study) => study.access !== 'protected')
    .map((study) => ({ slug: study.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const study = await getCaseStudy(slug)
  if (!study) return {}

  const image = hasImage(study.ogImage)
    ? study.ogImage
    : hasImage(study.thumbnail)
      ? study.thumbnail
      : null

  return {
    title: study.metaTitle || study.title,
    description: study.metaDescription || study.summary || undefined,
    // Protected work should not be indexed or previewed by crawlers.
    robots: study.access === 'protected' ? { index: false, follow: false } : undefined,
    openGraph: {
      title: study.metaTitle || study.title,
      description: study.metaDescription || study.summary || undefined,
      // Relative paths resolve against metadataBase (the Site URL in SEO defaults).
      images: image ? [image.src] : undefined,
    },
  }
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [study, settings] = await Promise.all([getCaseStudy(slug), getSiteSettings()])
  if (!study) notFound()

  /* The gate is resolved on the server and the body is never rendered while
     locked — so protected content never reaches the client unauthenticated. */
  if (study.access === 'protected' && !(await isUnlocked(slug))) {
    return (
      <main className="pt-32">
        <PasswordGate
          slug={slug}
          title={study.title}
          misconfigured={gateMisconfigured(slug)}
        />
      </main>
    )
  }

  const playerLabels = {
    play: settings?.playLabel ?? '',
    pause: settings?.pauseLabel ?? '',
    soundOn: settings?.soundOnLabel ?? '',
    soundOff: settings?.soundOffLabel ?? '',
  }

  return (
    <main className="pt-[calc(var(--header-height)+1rem)]">
      <article>
        <CaseStudyHeader
          study={study}
          liveSiteLabel={settings?.liveSiteLabel ?? ''}
          externalLinkLabel={settings?.externalLinkLabel ?? ''}
          playerLabels={playerLabels}
        />
        <CaseStudySections
          sections={study.body}
          labels={{
            zoom: settings?.zoomImageLabel ?? '',
            close: settings?.closeLabel ?? '',
            ...playerLabels,
          }}
        />
      </article>
    </main>
  )
}
