'use client'

import { useRef } from 'react'
import { gsap, SplitText, useGSAP } from '@/lib/gsap'
import { useMotionIntensity } from './MotionProvider'

/**
 * Line-by-line heading reveal using GSAP SplitText.
 *
 * SplitText rewrites the DOM into per-line wrappers, so it must revert on
 * cleanup — otherwise the markup screen readers see drifts from the source and
 * re-running the split nests wrappers inside wrappers.
 */
export function SplitHeading({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const intensity = useMotionIntensity()

  useGSAP(
    () => {
      if (intensity === 'subtle' || !ref.current) return

      const split = new SplitText(ref.current, {
        type: 'lines',
        /* overflow-hidden is what makes lines slide up from behind a mask, but
           it also crops descenders (g, p, y). The padding gives them room and
           the negative margin cancels the space it would otherwise add. */
        linesClass: 'overflow-hidden pb-[0.18em] -mb-[0.18em]',
        // Keeps the heading readable as one string for assistive tech.
        aria: 'auto',
      })

      gsap.from(split.lines, {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.08,
        ease: 'expo.out',
      })

      return () => split.revert()
    },
    { dependencies: [intensity] }
  )

  return (
    <h1 ref={ref} className={className}>
      {children}
    </h1>
  )
}
