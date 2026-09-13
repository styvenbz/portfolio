'use client'

import * as m from 'motion/react-client'
import { useMotionIntensity } from './MotionProvider'

/**
 * Entry transition for each route.
 *
 * Lives in template.tsx rather than layout.tsx because Next remounts a template
 * on every navigation — a layout would persist and never re-animate.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const intensity = useMotionIntensity()

  if (intensity === 'subtle') return <>{children}</>

  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </m.div>
  )
}
