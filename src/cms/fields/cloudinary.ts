import { fields } from '@keystatic/core'

/**
 * Cloudinary media fields.
 *
 * Media lives in Cloudinary, never in the repo — video in git would bloat
 * the repo and slow every build. Keystatic stores only the reference.
 *
 * This is the stable DATA SHAPE. A richer editing UI (an inline Cloudinary
 * upload widget as a Keystatic custom field) can be layered on later
 * without changing these keys, so nothing downstream has to change.
 *
 * For now: upload in the Cloudinary dashboard, paste the public ID here.
 */

const publicIdDescription =
  'The Cloudinary public ID, e.g. portfolio/acme/hero. Not the full URL.'

export function cloudinaryImage({
  label,
  description,
}: {
  label: string
  description?: string
}) {
  return fields.object(
    {
      publicId: fields.text({
        label: 'Cloudinary public ID',
        description: publicIdDescription,
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

export function cloudinaryVideo({
  label,
  description,
}: {
  label: string
  description?: string
}) {
  return fields.object(
    {
      publicId: fields.text({
        label: 'Cloudinary public ID',
        description: publicIdDescription,
      }),
      posterPublicId: fields.text({
        label: 'Poster image public ID',
        description:
          'Optional. Shown before the video loads. Defaults to the first frame.',
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

/** A slot that can hold either an image or a video — used for heroes. */
export function cloudinaryMedia({ label }: { label: string }) {
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
      image: cloudinaryImage({ label: 'Image' }),
      video: cloudinaryVideo({ label: 'Video' }),
      none: fields.empty(),
    }
  )
}
