'use client'

import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-client'
import { useEffect, useState } from 'react'
import { useMotionIntensity } from './MotionProvider'

/* Matches react-spring's default preset (tension 170, friction 26) — the feel
   of the phrase swap on the reference site. */
const spring = { type: 'spring', stiffness: 170, damping: 26, mass: 1 } as const

/**
 * Cycles through short phrases, sliding each new one up into place.
 *
 * Every phrase is also rendered invisibly in the same grid cell, so the box is
 * always as tall as the longest one — no measuring, and no layout jump when a
 * phrase wraps to a second line.
 *
 * The animated copy is aria-hidden and a visually hidden list carries every
 * phrase instead: screen readers hear them all once, rather than a live region
 * interrupting every couple of seconds.
 */
export function RotatingText({
  phrases,
  interval,
  className,
}: {
  phrases: string[]
  interval: number
  className?: string
}) {
  const intensity = useMotionIntensity()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const rotates = intensity === 'full' && phrases.length > 1

  useEffect(() => {
    if (!rotates || paused) return

    const id = window.setInterval(() => {
      // Don't burn through phrases in a background tab.
      if (document.hidden) return
      setIndex((current) => (current + 1) % phrases.length)
    }, Math.max(interval, 1) * 1000)

    return () => window.clearInterval(id)
  }, [rotates, paused, interval, phrases.length])

  if (!phrases.length) return null

  // Guards against a phrase being removed in the CMS while the index points past the end.
  const active = rotates ? index % phrases.length : 0

  return (
    <div
      className={className}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <ul className="sr-only">
        {phrases.map((phrase, i) => (
          <li key={i}>{phrase}</li>
        ))}
      </ul>

      {/* pb gives descenders room inside the clipping box. */}
      <div aria-hidden className="grid overflow-hidden pb-[0.12em]">
        {phrases.map((phrase, i) => (
          <span key={i} className="invisible col-start-1 row-start-1 text-balance">
            {phrase}
          </span>
        ))}

        <AnimatePresence initial={false}>
          <m.span
            key={active}
            className="col-start-1 row-start-1 text-balance"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={spring}
          >
            {phrases[active]}
          </m.span>
        </AnimatePresence>
      </div>
    </div>
  )
}
