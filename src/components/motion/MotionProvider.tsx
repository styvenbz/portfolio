'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type MotionIntensity = 'full' | 'subtle'

const MotionContext = createContext<{ intensity: MotionIntensity }>({
  intensity: 'full',
})

/**
 * Resolves how much motion to run.
 *
 * `prefers-reduced-motion` always wins over the CMS setting — a visitor's
 * accessibility preference is not something an editor gets to override.
 */
export function MotionProvider({
  intensity,
  children,
}: {
  intensity: MotionIntensity
  children: React.ReactNode
}) {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return (
    <MotionContext.Provider value={{ intensity: reduced ? 'subtle' : intensity }}>
      {children}
    </MotionContext.Provider>
  )
}

export const useMotionIntensity = () => useContext(MotionContext).intensity
