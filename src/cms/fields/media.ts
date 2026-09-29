import { fields } from '@keystatic/core'

/**
 * Media fields.
 *
 * Images and video are stored in the repository under `public/images/<area>/`
 * (per entry for case studies) and committed with the content, so they deploy
 * with the site — no third-party media service or keys. Keystatic writes the
 * file on upload; in production that becomes a GitHub commit.
 *
 * Keep files web-sized: large originals bloat the repo and every clone of it.
 * Next.js resizes and re-encodes images on request, so there is no need to
 * upload anything bigger than ~2400px wide.
 */

export type MediaArea = 'case-studies' | 'home' | 'about' | 'site' | 'seo'

const storage = (area: MediaArea) => ({
  directory: `public/images/${area}`,
  publicPath: `/images/${area}/`,
})

export function contentImage({
  label,
  description,
  area,
}: {
  label: string
  description?: string
  area: MediaArea
}) {
  return fields.object(
    {
      src: fields.image({
        label: 'Image file',
        description:
          'JPG, PNG or WebP — ideally under 1 MB and no wider than 2400px. Avoid AVIF and SVG for photos: the site can’t resize them, so phones download the full file. It is saved into the site’s repository.',
        ...storage(area),
      }),
      alt: fields.text({
        label: 'Alt text',
        description:
          'Describe the image for screen readers and for when it fails to load. Leave empty only if purely decorative.',
      }),
      caption: fields.text({
        label: 'Caption',
        description: 'Optional. Shown beneath the image.',
      }),
      width: fields.integer({
        label: 'Intrinsic width (px)',
        description:
          'Optional but recommended — lets the page reserve space and avoid layout shift.',
      }),
      height: fields.integer({ label: 'Intrinsic height (px)' }),
    },
    { label, description, layout: [12, 12, 12, 6, 6] }
  )
}

export function contentVideo({
  label,
  description,
  area,
}: {
  label: string
  description?: string
  area: MediaArea
}) {
  return fields.object(
    {
      src: fields.file({
        label: 'Video file',
        description: 'An MP4, ideally under 10 MB. It is saved into the site’s repository.',
        ...storage(area),
      }),
      poster: fields.image({
        label: 'Poster image',
        description: 'Optional. Shown before the video starts playing.',
        ...storage(area),
      }),
      caption: fields.text({ label: 'Caption' }),
      autoplay: fields.checkbox({
        label: 'Autoplay',
        description: 'Autoplaying video must be muted to play in browsers.',
        defaultValue: true,
      }),
      loop: fields.checkbox({ label: 'Loop', defaultValue: true }),
      muted: fields.checkbox({ label: 'Muted', defaultValue: true }),
      controls: fields.checkbox({ label: 'Show controls', defaultValue: false }),
      width: fields.integer({ label: 'Intrinsic width (px)' }),
      height: fields.integer({ label: 'Intrinsic height (px)' }),
    },
    { label, description, layout: [12, 12, 12, 6, 6, 6, 6, 6, 6] }
  )
}

/** A slot that can hold either an image or a video — used for covers and sections. */
export function contentMedia({ label, area }: { label: string; area: MediaArea }) {
  return fields.conditional(
    fields.select({
      label,
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
        { label: 'None', value: 'none' },
      ],
      defaultValue: 'image',
    }),
    {
      image: contentImage({ label: 'Image', area }),
      video: contentVideo({ label: 'Video', area }),
      none: fields.empty(),
    }
  )
}
