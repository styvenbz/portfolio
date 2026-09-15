import { ContentVideo } from '@/components/media/ContentVideo'
import { ZoomableImage } from '@/components/media/ZoomableImage'
import { hasVideo, type ImageValue, type VideoValue } from '@/lib/media'

type Media =
  | { discriminant: 'image'; value: Partial<ImageValue> }
  | { discriminant: 'video'; value: Partial<VideoValue> }
  | { discriminant: 'none'; value: null }

/** Renders a `contentMedia` slot inside a section: zoomable image, or video. */
export function SectionMedia({
  media,
  sizes,
  labels,
  aspect,
  emptyClassName = 'bg-(--color-bg-subtle)',
}: {
  media: Media
  sizes: string
  labels: { zoom: string; close: string }
  aspect?: string
  emptyClassName?: string
}) {
  if (media.discriminant === 'none') return null

  if (media.discriminant === 'video') {
    if (!hasVideo(media.value)) {
      return <div aria-hidden className={`w-full ${emptyClassName} ${aspect ?? 'aspect-video'}`} />
    }
    return (
      <figure>
        <ContentVideo value={media.value} className="h-auto w-full" />
        {media.value.caption ? (
          <figcaption className="text-case-body text-(--color-ink-muted) mt-3">
            {media.value.caption}
          </figcaption>
        ) : null}
      </figure>
    )
  }

  return (
    <ZoomableImage
      value={media.value}
      sizes={sizes}
      labels={labels}
      aspect={aspect}
      emptyClassName={emptyClassName}
    />
  )
}
