/**
 * Media values as read from Keystatic. Files live in `public/images/…`, so a
 * `src` is already a site-relative URL like `/images/about/portrait.avif`.
 */

export type ImageValue = {
  src: string | null
  alt: string
  caption: string
  width: number | null
  height: number | null
}

export type VideoValue = {
  src: string | null
  poster: string | null
  caption: string
  autoplay: boolean
  loop: boolean
  muted: boolean
  controls: boolean
  width: number | null
  height: number | null
}

export function hasImage(
  value: Partial<ImageValue> | null | undefined
): value is ImageValue & { src: string } {
  return Boolean(value?.src)
}

export function hasVideo(
  value: Partial<VideoValue> | null | undefined
): value is VideoValue & { src: string } {
  return Boolean(value?.src)
}
