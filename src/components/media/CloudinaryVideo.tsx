import {
  hasVideo,
  videoPoster,
  videoSources,
  type CloudinaryVideoValue,
} from '@/lib/cloudinary'
import { MediaPlaceholder } from './MediaPlaceholder'

/**
 * A plain <video> rather than next-cloudinary's CldVideoPlayer.
 *
 * The player bundles video.js (~150kb) and a full chrome UI, which is the wrong
 * trade for muted looping showreel clips. Cloudinary still does the transcoding
 * and compression via the URL.
 */
export function CloudinaryVideo({
  value,
  className,
}: {
  value: Partial<CloudinaryVideoValue> | null | undefined
  className?: string
}) {
  if (!hasVideo(value)) return <MediaPlaceholder className={className} />

  // Browsers only permit autoplay when muted.
  const muted = value.muted || value.autoplay

  return (
    <video
      className={className}
      poster={videoPoster(value.publicId, value.posterPublicId || undefined)}
      autoPlay={value.autoplay}
      loop={value.loop}
      muted={muted}
      controls={value.controls}
      playsInline
      preload="metadata"
      width={value.width ?? undefined}
      height={value.height ?? undefined}
    >
      {videoSources(value.publicId).map((source) => (
        <source key={source.type} src={source.src} type={source.type} />
      ))}
    </video>
  )
}
