import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { CloudinaryMedia } from '@/components/media/CloudinaryMedia'
import { PasswordGate } from '@/components/PasswordGate'
import { getCaseStudies, getCaseStudy } from '@/lib/content'
import { gateMisconfigured, isUnlocked } from '@/lib/gate'
import { hasImage, ogImageUrl } from '@/lib/cloudinary'
import { headingId } from '@/lib/headings'

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
      images: image ? [ogImageUrl(image.publicId)] : undefined,
    },
  }
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const study = await getCaseStudy(slug)
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

  const sections = study.body
    .map((block, index) => ({ block, index }))
    .filter(
      ({ block }) =>
        block.discriminant === 'sectionHeading' &&
        (block.value as { anchorInNav?: boolean }).anchorInNav
    )
    .map(({ block, index }) => {
      const value = block.value as { text: string }
      return { id: headingId(value.text, index), text: value.text }
    })

  return (
    <main>
      <header className="px-(--spacing-gutter) pt-40">
        <div className="mx-auto w-full max-w-[92rem]">
          <h1 className="text-display max-w-[16ch] text-balance">{study.title}</h1>

          <dl className="border-(--color-line) mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t pt-8 md:grid-cols-4">
            {[
              { label: 'Client', value: study.client },
              { label: 'Role', value: study.role },
              { label: 'Year', value: study.year },
              {
                label: 'Disciplines',
                value: study.disciplines.length ? study.disciplines.join(', ') : null,
              },
            ]
              .filter((item) => item.value)
              .map((item) => (
                <div key={item.label}>
                  <dt className="text-(--color-ink-faint) font-mono text-xs tracking-[0.2em] uppercase">
                    {item.label}
                  </dt>
                  <dd className="mt-2 text-sm">{item.value}</dd>
                </div>
              ))}
          </dl>

          {study.summary ? (
            <p className="text-lead mt-16 max-w-[46ch]">{study.summary}</p>
          ) : null}
        </div>
      </header>

      {study.heroMedia ? (
        <div className="px-(--spacing-gutter) mt-20">
          <div className="mx-auto w-full max-w-[92rem]">
            <CloudinaryMedia media={study.heroMedia} priority className="h-auto w-full" />
          </div>
        </div>
      ) : null}

      {sections.length > 1 ? (
        <nav
          aria-label="Sections"
          className="px-(--spacing-gutter) mt-(--spacing-section)"
        >
          <ol className="text-(--color-ink-faint) mx-auto flex w-full max-w-[72ch] flex-wrap gap-x-6 gap-y-2 font-mono text-xs">
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="hover:text-(--color-ink) transition-colors">
                  {section.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="px-(--spacing-gutter) mt-(--spacing-section)">
        <BlockRenderer blocks={study.body} />
      </div>
    </main>
  )
}
