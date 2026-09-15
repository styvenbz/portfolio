import { ContentImage } from '@/components/media/ContentImage'
import { ZoomableImage } from '@/components/media/ZoomableImage'
import { Reveal } from '@/components/motion/Reveal'
import { hasImage } from '@/lib/media'
import type { CaseStudy } from '@/lib/content'
import { Container } from './Container'
import { SectionHeading, hasHeading } from './SectionHeading'
import { SectionMedia } from './SectionMedia'

type Section = CaseStudy['body'][number]
type Labels = { zoom: string; close: string }

const CONTAINED_SIZES = '(max-width: 1100px) 100vw, 1068px'
/* Space between a section heading and the media under it. */
const afterHeading = 'mt-10 lg:mt-12'

/**
 * Case study body: one full-width band per section.
 *
 * A dark band is just the `band-dark` utility re-pointing colour tokens, so the
 * section components never branch on theme.
 */
export function CaseStudySections({
  sections,
  labels,
}: {
  sections: readonly Section[]
  labels: Labels
}) {
  return (
    <>
      {sections.map((section, index) => {
        // A showcase with no heading is pure backdrop, so it runs flush.
        const flush = section.discriminant === 'showcase' && !hasHeading(section.value)
        const padding =
          section.discriminant === 'showcase'
            ? flush
              ? ''
              : 'pt-(--spacing-band)'
            : 'py-(--spacing-band)'

        return (
          <section
            key={index}
            className={`${section.value.theme === 'dark' ? 'band-dark' : ''} bg-(--color-bg) text-(--color-ink) ${padding}`}
          >
            <Reveal>
              <SectionBody section={section} labels={labels} />
            </Reveal>
          </section>
        )
      })}
    </>
  )
}

function SectionBody({ section, labels }: { section: Section; labels: Labels }) {
  switch (section.discriminant) {
    case 'list': {
      const { value } = section
      return (
        <Container className="grid gap-10 lg:grid-cols-8 lg:gap-8">
          <div className="lg:col-span-3">
            <SectionHeading {...value} layout="stacked" />
          </div>
          {value.items.length ? (
            <ol className="flex flex-col gap-10 lg:col-span-5">
              {value.items.map((item, index) => (
                <li key={index} className="grid grid-cols-4 gap-6 lg:gap-8">
                  <p className="text-case-body font-medium">
                    {item.marker || String(index + 1).padStart(2, '0')}
                  </p>
                  <div className="col-span-3">
                    <h3 className="text-case-body font-medium">{item.heading}</h3>
                    {item.body ? (
                      <p className="text-case-body text-(--color-ink-muted) mt-1 whitespace-pre-line">{item.body}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          ) : null}
        </Container>
      )
    }

    case 'statement': {
      const { value } = section
      return (
        <Container>
          {value.label ? <h2 className="text-case-body font-medium">{value.label}</h2> : null}
          <p className="text-case-heading mt-2 max-w-[60rem] text-balance">{value.statement}</p>
        </Container>
      )
    }

    case 'textMedia': {
      const { value } = section
      const heading = hasHeading(value)
      const spacing = heading ? afterHeading : ''

      return (
        <>
          <Container>
            <SectionHeading {...value} />
          </Container>
          {value.width === 'full' ? (
            <div className={spacing}>
              <SectionMedia media={value.media} sizes="100vw" labels={labels} aspect="aspect-[16/9]" />
            </div>
          ) : (
            <Container className={spacing}>
              <SectionMedia media={value.media} sizes={CONTAINED_SIZES} labels={labels} />
            </Container>
          )}
        </>
      )
    }

    case 'imageGrid': {
      const { value } = section
      const three = value.columns === '3'
      return (
        <Container>
          <SectionHeading {...value} />
          <div
            className={`grid gap-6 lg:gap-8 ${three ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} ${
              hasHeading(value) ? afterHeading : ''
            }`}
          >
            {value.images.map((image, index) => {
              const wide = value.wideLast && index === value.images.length - 1
              return (
                <div key={index} className={wide ? (three ? 'sm:col-span-3' : 'sm:col-span-2') : ''}>
                  <ZoomableImage
                    value={image}
                    sizes={wide ? CONTAINED_SIZES : three ? '(max-width: 640px) 100vw, 356px' : '(max-width: 640px) 100vw, 534px'}
                    labels={labels}
                    aspect={wide ? 'aspect-[16/9]' : 'aspect-[4/3]'}
                  />
                </div>
              )
            })}
          </div>
        </Container>
      )
    }

    case 'beforeAfter': {
      const { value } = section
      return (
        <Container>
          <SectionHeading {...value} />
          <div className={`grid gap-x-8 gap-y-14 sm:grid-cols-2 ${hasHeading(value) ? afterHeading : ''}`}>
            {value.pairs.flatMap((pair, index) => [
              <Comparison
                key={`before-${index}`}
                image={pair.before}
                label={value.beforeLabel}
                caption={pair.beforeCaption}
                tone="before"
                labels={labels}
              />,
              <Comparison
                key={`after-${index}`}
                image={pair.after}
                label={value.afterLabel}
                caption={pair.afterCaption}
                tone="after"
                labels={labels}
              />,
            ])}
          </div>
        </Container>
      )
    }

    case 'showcase': {
      const { value } = section
      const heading = hasHeading(value)
      return (
        <>
          {heading ? (
            <Container>
              <SectionHeading {...value} />
            </Container>
          ) : null}
          <div className={`relative overflow-hidden bg-(--color-bg-subtle) ${heading ? afterHeading : ''}`}>
            {hasImage(value.background) ? (
              <ContentImage
                value={{ ...value.background, alt: '' }}
                sizes="100vw"
                className="absolute inset-0 size-full object-cover"
              />
            ) : null}
            <div className="relative mx-auto w-[86%] py-[clamp(3rem,1rem+10vw,15rem)] sm:w-[60%]">
              <SectionMedia
                media={value.media}
                sizes="(max-width: 640px) 86vw, 60vw"
                labels={labels}
                aspect="aspect-video"
                // Sits on the backdrop, so an empty slot needs its own tone to stay visible.
                emptyClassName="bg-(--color-bg) shadow-2xl"
              />
            </div>
          </div>
        </>
      )
    }

    default:
      return null
  }
}

function Comparison({
  image,
  label,
  caption,
  tone,
  labels,
}: {
  image: Parameters<typeof ZoomableImage>[0]['value']
  label: string
  caption: string
  tone: 'before' | 'after'
  labels: Labels
}) {
  const colour = tone === 'before' ? 'border-(--color-before)' : 'border-(--color-after)'
  const text = tone === 'before' ? 'text-(--color-before)' : 'text-(--color-after)'

  return (
    <div>
      <div className={`border-b-4 ${colour}`}>
        <ZoomableImage
          value={image}
          sizes="(max-width: 640px) 100vw, 534px"
          labels={labels}
          aspect="aspect-square"
          withCaption={false}
        />
      </div>
      {label ? <p className={`text-case-body mt-4 font-medium ${text}`}>{label}</p> : null}
      {caption ? <p className="text-case-body text-(--color-ink-muted) mt-1">{caption}</p> : null}
    </div>
  )
}
