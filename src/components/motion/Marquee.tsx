'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { useMotionIntensity } from './MotionProvider'

/**
 * Continuously scrolling text strip.
 *
 * The items are rendered twice and the track is animated to -50%, so the second
 * copy lands exactly where the first started and the loop is seamless. The
 * duplicate is aria-hidden — screen readers should hear the list once.
 *
 * At 'subtle' intensity (including reduced-motion) it renders as a static row
 * rather than animating, which is the honest fallback for infinite motion.
 */
export function Marquee({ items }: { items: string[] }) {
  const track = useRef<HTMLDivElement>(null)
  const intensity = useMotionIntensity()

  useGSAP(
    () => {
      if (intensity === 'subtle' || !track.current) return

      const tween = gsap.to(track.current, {
        xPercent: -50,
        duration: Math.max(items.length * 3, 12),
        ease: 'none',
        repeat: -1,
      })

      return () => {
        tween.kill()
      }
    },
    { dependencies: [intensity, items.length] }
  )

  if (items.length === 0) return null

  const Row = ({ hidden }: { hidden?: boolean }) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden}>
      {items.map((item, index) => (
        <li key={index} className="flex items-center">
          <span className="px-6">{item}</span>
          <span className="text-(--color-ink-faint)" aria-hidden>
            &bull;
          </span>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="border-(--color-line) overflow-hidden border-y py-5">
      <div
        ref={track}
        className="text-lead flex w-max will-change-transform"
        style={{ transform: 'translateZ(0)' }}
      >
        <Row />
        <Row hidden />
      </div>
    </div>
  )
}
