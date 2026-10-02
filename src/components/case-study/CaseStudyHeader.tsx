import { ContentImage } from '@/components/media/ContentImage'
import { ContentVideo } from '@/components/media/ContentVideo'
import type { PlayerLabels } from '@/components/media/VideoPlayer'
import { hasImage, hasVideo } from '@/lib/media'
import type { CaseStudy } from '@/lib/content'
import { Container } from './Container'

const delay = (ms: number) => ({ animationDelay: `${ms}ms` })

/**
 * Case study opening: a large rounded cover, then title and subtitle, the
 * intro with its key points, and a narrow column of project facts.
 */
export function CaseStudyHeader({
  study,
  liveSiteLabel,
  externalLinkLabel,
  playerLabels,
}: {
  study: CaseStudy
  liveSiteLabel: string
  externalLinkLabel: string
  playerLabels: PlayerLabels
}) {
  const cover = study.heroMedia
  const hasIntro = Boolean(study.intro || study.keyPoints.length)

  return (
    <header>
      {cover.discriminant !== 'none' ? (
        <div className="px-(--spacing-gutter)">
          <div className="enter-up mx-auto w-full max-w-[75rem]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-(--color-bg-subtle) sm:aspect-[1200/550]">
              {cover.discriminant === 'image' && hasImage(cover.value) ? (
                <ContentImage
                  value={cover.value}
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                  className="size-full object-cover"
                />
              ) : null}
              {cover.discriminant === 'video' && hasVideo(cover.value) ? (
                <ContentVideo value={cover.value} className="size-full object-cover" player={playerLabels} eager />
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <Container className="grid gap-x-16 gap-y-10 pt-10 pb-(--spacing-band) lg:grid-cols-4">
        <div className="enter-up lg:col-span-3" style={delay(100)}>
          <h1 className="text-case-title font-medium text-balance">{study.title}</h1>
          {study.subtitle ? (
            <p className="text-case-heading text-(--color-ink-muted) text-balance">{study.subtitle}</p>
          ) : null}
        </div>

        {hasIntro ? (
          <div className="enter-up lg:col-span-3 lg:row-start-2" style={delay(200)}>
            {study.intro ? (
              <p className="text-case-body text-(--color-ink-muted) max-w-[48rem] whitespace-pre-line">{study.intro}</p>
            ) : null}
            {study.tags.length ? (
              <ul className="mt-8 flex flex-wrap gap-2">
                {study.tags.map((tag, index) => (
                  <li
                    key={index}
                    className="border-(--color-line) text-case-body rounded-full border px-4 py-1.5"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}

            {study.keyPoints.length ? (
              <dl className={`grid gap-8 sm:grid-cols-2 ${study.intro ? 'mt-8' : ''}`}>
                {study.keyPoints.map((point, index) => (
                  <div key={index}>
                    <dt className="text-case-body font-medium">{point.label}</dt>
                    <dd className="text-case-body text-(--color-ink-muted) mt-1 whitespace-pre-line">{point.body}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        ) : null}

        {study.facts.length || (study.liveUrl && liveSiteLabel) ? (
          <div className="enter-up lg:col-start-4 lg:row-start-2" style={delay(300)}>
            {study.facts.length ? (
              <dl className="flex flex-col gap-4">
                {study.facts.map((fact, index) => (
                  <div key={index}>
                    <dt className="text-case-body font-medium">{fact.label}</dt>
                    <dd className="text-case-body text-(--color-ink-muted) whitespace-pre-line">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {study.liveUrl && liveSiteLabel ? (
              <a
                href={study.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-case-body mt-6 inline-flex items-center gap-1.5 font-medium underline decoration-(--color-line) underline-offset-4 transition-colors hover:decoration-(--color-ink)"
              >
                {liveSiteLabel}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M5 11 11 5M6 5h5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {externalLinkLabel ? <span className="sr-only">{externalLinkLabel}</span> : null}
              </a>
            ) : null}
          </div>
        ) : null}
      </Container>
    </header>
  )
}
