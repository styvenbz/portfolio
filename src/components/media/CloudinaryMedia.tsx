import { CloudinaryImage } from './CloudinaryImage'
import { CloudinaryVideo } from './CloudinaryVideo'

type MediaValue =
  | { discriminant: 'image'; value: unknown }
  | { discriminant: 'video'; value: unknown }
  | { discriminant: 'none'; value: unknown }

/** Renders the image-or-video slot produced by `cloudinaryMedia()`. */
export function CloudinaryMedia({
  media,
  className,
  priority,
}: {
  media: MediaValue | null | undefined
  className?: string
  priority?: boolean
}) {
  if (!media || media.discriminant === 'none') return null

  if (media.discriminant === 'video') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <CloudinaryVideo value={media.value as any} className={className} />
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <CloudinaryImage value={media.value as any} className={className} priority={priority} />
  )
}
