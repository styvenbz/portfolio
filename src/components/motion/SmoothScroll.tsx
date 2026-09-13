'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useMotionIntensity } from './MotionProvider'

/**
 * Lenis smooth scroll, driven by GSAP's ticker.
 *
 * Both libraries want their own requestAnimationFrame loop; running two loops
 * makes ScrollTrigger read positions Lenis hasn't applied yet, which shows up
 * as jitter on pinned sections. So Lenis is stepped from gsap.ticker and tells
 * ScrollTrigger to update on every scroll — one loop, one source of truth.
 *
 * Disabled entirely at 'subtle' intensity, which includes reduced-motion users.
 */
export function SmoothScroll() {
  const intensity = useMotionIntensity()

  useEffect(() => {
    if (intensity === 'subtle') return

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      // Let Lenis handle in-page #anchor links. Without this, clicking a link
      // in the case-study section nav performs a native jump that Lenis never
      // sees, so its internal position desyncs from the real scroll position.
      anchors: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    /* Safety net for scrolls that don't originate from Lenis — browser scroll
       restoration, find-in-page, keyboard paging, anything calling
       window.scrollTo. Those fire a native scroll event but not a Lenis one,
       which would otherwise leave reveal animations stuck hidden. */
    const onNativeScroll = () => ScrollTrigger.update()
    window.addEventListener('scroll', onNativeScroll, { passive: true })

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    /* Fonts and images settle after first paint and change element positions,
       so trigger start/end values measured earlier go stale. */
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)

    return () => {
      window.removeEventListener('scroll', onNativeScroll)
      window.removeEventListener('load', refresh)
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
    }
  }, [intensity])

  return null
}
