'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { useMotionIntensity } from './MotionProvider'

/**
 * Scroll-triggered reveal.
 *
 * The hidden state is applied by JS, never by CSS. If JS fails or is blocked,
 * the content is simply visible — a portfolio that animates in is nice, one
 * that stays blank because a script broke is a lost job.
 *
 * ScrollTriggers are created inside useGSAP with a scope, so they are reverted
 * automatically on unmount and don't leak across client-side navigations.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const scope = useRef<HTMLDivElement>(null)
  const intensity = useMotionIntensity()

  useGSAP(
    () => {
      if (intensity === 'subtle') return

      gsap.fromTo(
        scope.current,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: scope.current,
            start: 'top 85%',
            once: true,
          },
        }
      )
    },
    { scope, dependencies: [intensity] }
  )

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  )
}
