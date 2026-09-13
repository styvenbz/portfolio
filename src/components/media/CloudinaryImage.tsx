import { CldImage } from 'next-cloudinary'
import {
  hasImage,
  type CloudinaryImageValue,
} from '@/lib/cloudinary'
import { MediaPlaceholder } from './MediaPlaceholder'

export function CloudinaryImage({
  value,
  sizes = '100vw',
  priority = false,
  className,
}: {
  value: Partial<CloudinaryImageValue> | null | undefined
  sizes?: string
  priority?: boolean
  className?: string
}) {
  if (!hasImage(value)) return <MediaPlaceholder className={className} />

  return (
    <CldImage
      src={value.publicId}
      alt={value.alt ?? ''}
      width={value.width ?? 1600}
      height={value.height ?? 1000}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  )
}
