import { hasVideo, type VideoValue } from '@/lib/media'
import { MediaPlaceholder } from './MediaPlaceholder'

/** A plain <video>: muted looping showreel clips don't need a player UI. */
export function ContentVideo({
  value,
  className,
}: {
  value: Partial<VideoValue> | null | undefined
  className?: string
}) {
  if (!hasVideo(value)) return <MediaPlaceholder className={className} />

  // Browsers only permit autoplay when muted.
  const muted = value.muted || value.autoplay

  return (
    <video
      className={className}
      src={value.src}
      poster={value.poster ?? undefined}
      autoPlay={value.autoplay}
      loop={value.loop}
      muted={muted}
      controls={value.controls}
      playsInline
      preload="metadata"
      width={value.width ?? undefined}
      height={value.height ?? undefined}
    />
  )
}
