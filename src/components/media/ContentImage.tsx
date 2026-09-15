import Image from 'next/image'
import { hasImage, type ImageValue } from '@/lib/media'
import { MediaPlaceholder } from './MediaPlaceholder'

export function ContentImage({
  value,
  sizes = '100vw',
  priority = false,
  className,
}: {
  value: Partial<ImageValue> | null | undefined
  sizes?: string
  priority?: boolean
  className?: string
}) {
  if (!hasImage(value)) return <MediaPlaceholder className={className} />

  return (
    <Image
      src={value.src}
      alt={value.alt ?? ''}
      width={value.width ?? 1600}
      height={value.height ?? 1000}
      sizes={sizes}
      priority={priority}
      // The optimiser rasterises by default; SVGs are already resolution-independent.
      unoptimized={value.src.endsWith('.svg')}
      className={className}
    />
  )
}
