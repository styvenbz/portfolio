/**
 * Cloudinary URL construction.
 *
 * The cloud name is read from NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME. Until that is
 * set, media components fall back to a neutral placeholder so the site still
 * builds and renders — the portfolio must never fail to deploy just because a
 * media account isn't wired up yet.
 */

export const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? ''

export type CloudinaryImageValue = {
  publicId: string
  alt: string
  caption: string
  width: number | null
  height: number | null
}

export type CloudinaryVideoValue = {
  publicId: string
  posterPublicId: string
  caption: string
  autoplay: boolean
  loop: boolean
  muted: boolean
  controls: boolean
  width: number | null
  height: number | null
}

export function hasImage(
  value: Partial<CloudinaryImageValue> | null | undefined
): value is CloudinaryImageValue {
  return Boolean(cloudName && value?.publicId)
}

export function hasVideo(
  value: Partial<CloudinaryVideoValue> | null | undefined
): value is CloudinaryVideoValue {
  return Boolean(cloudName && value?.publicId)
}

const base = (kind: 'image' | 'video') =>
  `https://res.cloudinary.com/${cloudName}/${kind}/upload`

/** Video sources. Cloudinary transcodes on the fly; webm first, mp4 fallback. */
export function videoSources(publicId: string) {
  return [
    { src: `${base('video')}/q_auto/${publicId}.webm`, type: 'video/webm' },
    { src: `${base('video')}/q_auto/${publicId}.mp4`, type: 'video/mp4' },
  ]
}

/** A still frame from a video, or a dedicated poster image. */
export function videoPoster(publicId: string, posterPublicId?: string) {
  if (posterPublicId) return `${base('image')}/q_auto,f_auto/${posterPublicId}`
  return `${base('video')}/q_auto,f_auto/${publicId}.jpg`
}

/** Absolute image URL — used for Open Graph tags, which need a full URL. */
export function ogImageUrl(publicId: string) {
  return `${base('image')}/c_fill,w_1200,h_630,q_auto,f_jpg/${publicId}`
}
