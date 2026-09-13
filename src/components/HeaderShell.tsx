'use client'

import { useEffect, useState } from 'react'

/**
 * Header chrome behaviour.
 *
 * Over the hero the header is transparent and uses mix-blend-difference, so it
 * inverts against whatever is behind it. That breaks down once real content
 * scrolls underneath — large headings collide with the nav and both become
 * unreadable. So past the hero it takes a solid background and drops the blend
 * mode, which is the only way to guarantee legibility over arbitrary content.
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`px-(--spacing-gutter) h-(--header-height) fixed top-0 right-0 left-0 z-50 flex items-center transition-colors duration-300 ${
        scrolled
          ? 'bg-(--color-bg)/90 border-(--color-line) text-(--color-ink) border-b backdrop-blur-sm'
          : 'text-white mix-blend-difference'
      }`}
    >
      {children}
    </header>
  )
}
