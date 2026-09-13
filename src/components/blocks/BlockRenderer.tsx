import { CloudinaryImage } from '@/components/media/CloudinaryImage'
import { CloudinaryVideo } from '@/components/media/CloudinaryVideo'
import { Prose } from '@/components/Prose'
import { headingId } from '@/lib/headings'

/* Keystatic's reader types these as a wide union; the renderer narrows on
   `discriminant`. Kept loose here so adding a block doesn't fight the compiler. */
type Block = { discriminant: string; value: unknown }
/* eslint-disable @typescript-eslint/no-explicit-any */

const widthClass: Record<string, string> = {
  content: 'mx-auto w-full max-w-[72ch]',
  wide: 'mx-auto w-full max-w-[92rem]',
  full: 'w-full',
}

function Figure({
  caption,
  children,
}: {
  caption?: string
  children: React.ReactNode
}) {
  return (
    <figure>
      {children}
      {caption ? (
        <figcaption className="text-(--color-ink-faint) mt-3 text-sm">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

export function BlockRenderer({ blocks }: { blocks: readonly Block[] }) {
  return (
    <div className="flex flex-col gap-(--spacing-section)">
      {blocks.map((block, index) => {
        const key = `${block.discriminant}-${index}`
        const value = block.value as any

        switch (block.discriminant) {
          case 'richText':
            return (
              <div key={key} className={widthClass.content}>
                <Prose>{value as string}</Prose>
              </div>
            )

          case 'sectionHeading':
            return (
              <header
                key={key}
                id={headingId(value.text, index)}
                className={`${widthClass.content} scroll-mt-28`}
              >
                {value.eyebrow ? (
                  <p className="text-(--color-accent) mb-4 font-mono text-xs tracking-[0.2em] uppercase">
                    {value.eyebrow}
                  </p>
                ) : null}
                <h2 className="text-title text-balance">{value.text}</h2>
              </header>
            )

          case 'imageFull':
            return (
              <div key={key} className={widthClass[value.bleed] ?? widthClass.wide}>
                <Figure caption={value.image?.caption}>
                  <div style={value.background ? { background: value.background } : undefined}>
                    <CloudinaryImage
                      value={value.image}
                      sizes={value.bleed === 'content' ? '(max-width: 72ch) 100vw, 72ch' : '100vw'}
                      className="h-auto w-full"
                    />
                  </div>
                </Figure>
              </div>
            )

          case 'imageGrid':
            return (
              <div key={key} className={widthClass.wide}>
                <div
                  className={`grid gap-4 sm:gap-6 ${
                    value.columns === '3'
                      ? 'grid-cols-1 sm:grid-cols-3'
                      : 'grid-cols-1 sm:grid-cols-2'
                  }`}
                >
                  {(value.images as any[]).map((image, imageIndex) => (
                    <Figure key={imageIndex} caption={image?.caption}>
                      <CloudinaryImage
                        value={image}
                        sizes={value.columns === '3' ? '(max-width: 640px) 100vw, 33vw' : '(max-width: 640px) 100vw, 50vw'}
                        className="h-auto w-full"
                      />
                    </Figure>
                  ))}
                </div>
              </div>
            )

          case 'video':
            return (
              <div key={key} className={widthClass[value.bleed] ?? widthClass.wide}>
                <Figure caption={value.video?.caption}>
                  <CloudinaryVideo value={value.video} className="h-auto w-full" />
                </Figure>
              </div>
            )

          case 'quote':
            return (
              <blockquote key={key} className={widthClass.content}>
                <p className="text-title text-balance">&ldquo;{value.quote}&rdquo;</p>
                {value.attribution ? (
                  <footer className="text-(--color-ink-faint) mt-6 text-sm">
                    {value.attribution}
                    {value.role ? <span> — {value.role}</span> : null}
                  </footer>
                ) : null}
              </blockquote>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
