'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ContentImage } from '@/components/media/ContentImage'
import { useMotionIntensity } from '@/components/motion/MotionProvider'
import { hasImage, type ImageValue } from '@/lib/media'

/** How long each expression shows while the logo is hovered. */
const FRAME_MS = 350

/**
 * The nav's home link: an avatar that flips through expressions on hover.
 *
 * Every frame is rendered up front and stacked, and hovering only changes
 * which one is visible — so there is no load flash between expressions.
 * With motion dialled down it swaps to the first expression and holds.
 */
export function NavLogo({
  logo,
  frames,
  label,
  name,
  textClassName,
}: {
  logo: Partial<ImageValue> | null | undefined
  frames: readonly (Partial<ImageValue> | null | undefined)[]
  label: string
  name: string
  textClassName: string
}) {
  const intensity = useMotionIntensity()
  const [hovered, setHovered] = useState(false)
  const [frame, setFrame] = useState(0)

  const images = [logo, ...frames].filter(hasImage)
  const animates = images.length > 1

  useEffect(() => {
    if (!hovered || !animates) {
      setFrame(0)
      return
    }
    setFrame(1)
    if (intensity !== 'full') return

    const id = window.setInterval(() => {
      setFrame((current) => (current + 1) % images.length)
    }, FRAME_MS)
    return () => window.clearInterval(id)
  }, [hovered, animates, intensity, images.length])

  if (!hasImage(logo)) {
    return (
      <Link href="/" className={textClassName}>
        {name}
      </Link>
    )
  }

  const start = () => setHovered(true)
  const stop = () => setHovered(false)

  return (
    <Link
      href="/"
      aria-label={label}
      // Hook for the speech bubble in SiteHeader.
      data-nav-logo=""
      onPointerEnter={start}
      onPointerLeave={stop}
      onFocus={start}
      onBlur={stop}
      /* A touch taller than the links (48px vs ~42px), like the reference;
         the negative margins stop it from stretching the pill. */
      className="relative -my-0.5 mr-3 h-10 w-9 shrink-0 rounded-lg sm:-my-1 sm:mr-4 sm:h-12 sm:w-10"
    >
      {images.map((image, index) => (
        <ContentImage
          key={image.src}
          value={{ ...image, alt: '' }}
          sizes="40px"
          priority={index === 0}
          className={`absolute inset-0 size-full object-contain ${
            index === frame ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </Link>
  )
}
