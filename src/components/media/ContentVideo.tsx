import { hasVideo, type VideoValue } from '@/lib/media'
import { MediaPlaceholder } from './MediaPlaceholder'
import { VideoPlayer, type PlayerLabels } from './VideoPlayer'

/**
 * A plain <video>: muted looping showreel clips don't need a player UI.
 *
 * Pass `player` labels where visitors should be able to pause it (and hear it,
 * when "Muted" is unticked): it then gets glass buttons (see VideoPlayer),
 * unless the CMS turned on the browser's own controls.
 */
export function ContentVideo({
  value,
  className,
  player,
}: {
  value: Partial<VideoValue> | null | undefined
  className?: string
  player?: PlayerLabels
}) {
  if (!hasVideo(value)) return <MediaPlaceholder className={className} />

  if (player && !value.controls) {
    return <VideoPlayer value={value} className={className} labels={player} />
  }

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
