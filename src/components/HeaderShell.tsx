'use client'

import { useEffect, useState } from 'react'
import type { MotionIntensity } from '@/components/motion/MotionProvider'

/** Scroll distance after which the pill tucks up towards the top edge. */
const TUCK_AFTER = 208

/**
 * Floating nav chrome: a pill fixed at the top centre of the viewport.
 *
 * It fades up into place on first load, then tucks 2rem higher once the
 * visitor scrolls past the top of the page, so it covers less content while
 * reading. Lives in the layout, so the entrance runs once per visit rather
 * than on every navigation.
 */
export function HeaderShell({
  motion,
  children,
}: {
  motion: MotionIntensity
  children: React.ReactNode
}) {
  const [tucked, setTucked] = useState(false)

  useEffect(() => {
    const onScroll = () => setTucked(window.scrollY > TUCK_AFTER)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      data-motion={motion}
      className={`nav-in fixed top-10 left-1/2 z-50 w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 sm:top-16 ${
        motion === 'full' ? 'transition-[translate] duration-500 ease-(--ease-out-quart)' : ''
      } ${tucked ? '-translate-y-6 sm:-translate-y-8' : ''}`}
    >
      {children}
    </header>
  )
}
