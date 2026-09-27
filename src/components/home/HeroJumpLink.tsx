'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

/** Fades out once the visitor has scrolled this far into the page. */
const HIDE_AFTER = 0.6

/**
 * Floating "jump to the projects" button, pinned to the bottom of the screen.
 *
 * It only earns its place while the hero is on screen, so it fades out — and
 * stops taking clicks — once the visitor has scrolled past it on their own.
 */
export function HeroJumpLink({ label, href }: { label: string; href: string }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < window.innerHeight * HIDE_AFTER)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-5 left-1/2 z-40 -translate-x-1/2 transition-opacity duration-500 sm:bottom-8 ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="float-bob">
        <Link
          href={href}
          className="glass text-(--color-ink) flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full px-5 py-3 text-sm leading-none whitespace-nowrap tracking-[0.02em] uppercase transition-transform duration-300 ease-(--ease-out-quart) hover:scale-[1.04] sm:px-6 sm:py-3.5 sm:text-base"
        >
          <span className="truncate">{label}</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
            <path
              d="M8 3v10M3.5 8.5 8 13l4.5-4.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  )
}
