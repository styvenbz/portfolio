'use client'

import { useRef, useState } from 'react'
import { ContentImage } from '@/components/media/ContentImage'
import { useMotionIntensity } from '@/components/motion/MotionProvider'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import type { ImageValue } from '@/lib/media'

/* Tuning, matched to the reference wheel. */
const INACTIVE_SCALE = 0.68
const MOVE = { duration: 0.75, ease: 'power3.out' }
const DIAL_STEP = 30 // degrees the dial's marks turn per photo
const RING_FACTOR = 0.4 // the background ring turns slower than the photos
const SWIPE_MIN = 50 // px of travel before a drag counts as a swipe
const INTRO = { spread: 2, duration: 1.6, ease: 'expo.out' }
const WHEEL_DIAMETER_REM = 80

type Photo = ImageValue & { src: string }

/**
 * Radial photo wheel.
 *
 * Every photo sits on one big circle, turned to face outward, and the wheel
 * rotates so one photo at a time sits at the front — full size and in colour,
 * the rest smaller and greyscale. A swipe (mouse or touch) moves exactly one
 * photo; the buttons, arrow keys and clicking a photo move it too. It loops.
 *
 * Positions live in GSAP, not React state, so moving never re-renders the
 * cards. React only tracks the front photo for the screen-reader announcement.
 */
export function GalleryWheel({
  photos,
  labels,
}: {
  photos: Photo[]
  labels: { prev: string; next: string; cursor: string }
}) {
  const scope = useRef<HTMLDivElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const cursor = useRef<HTMLDivElement>(null)
  const controls = useRef<{ go: (to: number) => void; current: () => number } | null>(null)
  const intensity = useMotionIntensity()
  const [front, setFront] = useState(Math.floor(photos.length / 2))

  useGSAP(
    () => {
      const view = viewport.current
      if (!view) return

      const track = view.querySelector<HTMLElement>('[data-track]')!
      const ring = view.querySelector<SVGElement>('[data-ring]')
      const marks = view.querySelector<SVGElement>('[data-marks]')
      const hand = view.querySelector<SVGElement>('[data-hand]')
      const cards = gsap.utils.toArray<HTMLElement>('[data-card]', view)
      const images = cards.map((card) => card.querySelector('img'))
      const count = cards.length
      const animate = intensity === 'full'
      const move = animate ? MOVE : { duration: 0, ease: 'none' }

      let current = Math.floor(count / 2)
      let radius = 0
      let step = 0 // degrees between neighbouring photos
      let ringRotation = 0
      let marksRotation = 0
      const offsets = cards.map(() => ({ value: 0 }))
      const signal = new AbortController()
      const on = { signal: signal.signal }

      /** Shortest distance around the loop, in photos. */
      const wrap = (distance: number) => {
        const d = ((distance % count) + count) % count
        return d > count / 2 ? d - count : d
      }

      const measure = () => {
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
        const gap = (parseFloat(getComputedStyle(view).getPropertyValue('--card-gap')) || 6) * rem
        const size = cards[0].offsetWidth
        const half = (WHEEL_DIAMETER_REM / 2) * rem
        radius = half - INACTIVE_SCALE * (size / 2)
        step = ((size + gap) / half) * (180 / Math.PI)
        // Circle centre sits so the front photo's top lines up with the padding.
        const padding = 2 * rem
        gsap.set(track, { top: padding + size + radius })
      }

      const place = (index: number) => {
        const angle = offsets[index].value * step
        const rad = (angle * Math.PI) / 180
        gsap.set(cards[index], { x: radius * Math.sin(rad), y: -radius * Math.cos(rad), rotation: angle })
      }

      const highlight = (tween: boolean) => {
        cards.forEach((card, index) => {
          const isFront = index === current
          const vars = { scale: isFront ? 1 : INACTIVE_SCALE }
          const filter = { filter: isFront ? 'saturate(1)' : 'saturate(0)' }
          if (tween) {
            gsap.to(card, { ...vars, ...move, overwrite: 'auto' })
            if (images[index]) gsap.to(images[index], { ...filter, ...move, overwrite: 'auto' })
          } else {
            gsap.set(card, vars)
            if (images[index]) gsap.set(images[index], filter)
          }
          card.toggleAttribute('data-front', isFront)
        })
      }

      const layout = (spread = 0) => {
        measure()
        cards.forEach((_, index) => {
          offsets[index].value = wrap(index - current) + spread
          place(index)
        })
      }

      let intro: gsap.core.Timeline | null = null

      const go = (target: number) => {
        intro?.progress(1)
        const to = ((target % count) + count) % count
        if (to === current) return
        const delta = wrap(to - current)
        current = to
        setFront(to)

        cards.forEach((_, index) => {
          const next = wrap(index - current)
          const previous = offsets[index].value
          // A photo that crosses the hidden back of the wheel jumps instead of
          // spinning all the way round the front.
          if (Math.abs(next - previous) > Math.abs(delta) + 0.01) {
            gsap.killTweensOf(offsets[index])
            offsets[index].value = next
            place(index)
          } else {
            gsap.to(offsets[index], { value: next, ...move, overwrite: 'auto', onUpdate: () => place(index) })
          }
        })
        highlight(true)

        ringRotation -= delta * step * RING_FACTOR
        if (ring) gsap.to(ring, { rotation: ringRotation, ...move, overwrite: 'auto' })

        marksRotation -= delta * DIAL_STEP
        if (marks) gsap.to(marks, { rotation: marksRotation, duration: move.duration, ease: animate ? 'power3.inOut' : 'none', overwrite: 'auto' })

        // The needle is dragged along with the marks, then springs back upright.
        if (hand && animate) {
          const swing = gsap.utils.clamp(-90, 90, -delta * DIAL_STEP)
          gsap
            .timeline({ overwrite: 'auto' })
            .to(hand, { rotation: swing, duration: MOVE.duration - 0.3, ease: 'power3.inOut' })
            .to(hand, { rotation: 0, duration: 0.2, ease: 'power3.out' })
        }
      }
      controls.current = { go, current: () => current }

      // --- Initial state -------------------------------------------------
      gsap.set(cards, { xPercent: -50, yPercent: -100, transformOrigin: '50% 100%' })
      if (ring) gsap.set(ring, { xPercent: -50, yPercent: -50, transformOrigin: '50% 50%' })
      if (marks) gsap.set(marks, { transformOrigin: '50% 50%' })
      if (hand) gsap.set(hand, { transformOrigin: '50% 50%' })

      if (animate) {
        // Fan in from a spread-out wheel when the section scrolls into view.
        const reset = () => {
          intro?.kill()
          intro = null
          layout(INTRO.spread)
          cards.forEach((card, index) => {
            gsap.set(card, { scale: INACTIVE_SCALE })
            if (images[index]) gsap.set(images[index], { filter: 'saturate(0)' })
            card.removeAttribute('data-front')
          })
          if (marks) gsap.set(marks, { rotation: marksRotation + 90 })
          if (hand) gsap.set(hand, { rotation: 180 })
        }
        const play = () => {
          if (intro) return
          intro = gsap.timeline()
          cards.forEach((_, index) => {
            intro!.to(offsets[index], { value: wrap(index - current), duration: INTRO.duration, ease: INTRO.ease, onUpdate: () => place(index) }, 0)
          })
          if (marks) intro.to(marks, { rotation: marksRotation, duration: INTRO.duration, ease: INTRO.ease }, 0)
          if (hand) intro.to(hand, { rotation: 0, duration: INTRO.duration, ease: INTRO.ease }, 0)
          intro.add(() => highlight(true), 0.35)
        }
        reset()
        ScrollTrigger.create({ trigger: view, start: 'top 80%', end: 'bottom top', onEnter: play, onEnterBack: play })
        ScrollTrigger.create({ trigger: view, start: 'top bottom', end: 'bottom top', onLeaveBack: reset })
      } else {
        layout()
        highlight(false)
      }
      gsap.set(track, { autoAlpha: 1 })

      // --- Swipe: one photo per gesture, mouse or touch --------------------
      let startX: number | null = null
      let swiped = false
      view.addEventListener('pointerdown', (event) => {
        startX = event.clientX
        swiped = false
      }, on)
      window.addEventListener('pointerup', (event) => {
        if (startX === null) return
        const dx = event.clientX - startX
        startX = null
        if (Math.abs(dx) >= SWIPE_MIN) {
          swiped = true
          go(current + (dx < 0 ? 1 : -1))
        }
      }, on)
      window.addEventListener('pointercancel', () => (startX = null), on)

      cards.forEach((card, index) =>
        card.addEventListener('click', () => {
          if (swiped) {
            swiped = false
            return
          }
          go(index)
        }, on)
      )

      // --- Arrow keys while the wheel is mostly on screen -------------------
      let inView = false
      const observer = new IntersectionObserver(([entry]) => (inView = entry.isIntersecting), { threshold: 0.5 })
      observer.observe(view)
      window.addEventListener('keydown', (event) => {
        if (!inView) return
        const target = event.target as HTMLElement | null
        if (target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName ?? '')) return
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          go(current + 1)
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault()
          go(current - 1)
        }
      }, on)

      // --- Resize ------------------------------------------------------------
      let width = window.innerWidth
      let timer: ReturnType<typeof setTimeout>
      window.addEventListener('resize', () => {
        if (window.innerWidth === width) return
        width = window.innerWidth
        clearTimeout(timer)
        timer = setTimeout(() => {
          intro?.progress(1)
          layout()
          highlight(false)
          ScrollTrigger.refresh()
        }, 150)
      }, on)

      // --- Drag cursor (desktop pointers only) -------------------------------
      const pill = cursor.current
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      if (pill && fine) {
        const moveX = gsap.quickTo(pill, 'x', { duration: 0.35, ease: 'power3.out' })
        const moveY = gsap.quickTo(pill, 'y', { duration: 0.35, ease: 'power3.out' })
        view.addEventListener('pointermove', (event) => {
          moveX(event.clientX)
          moveY(event.clientY)
        }, on)
        view.addEventListener('pointerenter', (event) => {
          gsap.set(pill, { x: event.clientX, y: event.clientY })
          gsap.to(pill, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power3.out', overwrite: 'auto' })
        }, on)
        view.addEventListener('pointerleave', () => {
          gsap.to(pill, { autoAlpha: 0, scale: 0.9, duration: 0.3, ease: 'power3.out', overwrite: 'auto' })
        }, on)
      }

      return () => {
        signal.abort()
        observer.disconnect()
        clearTimeout(timer)
        controls.current = null
      }
    },
    { scope, dependencies: [intensity, photos.length] }
  )

  return (
    <div ref={scope} className="relative flex flex-col items-center gap-8">
      <div
        ref={viewport}
        className="relative h-[34rem] w-full cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing max-[480px]:h-[29rem] [--card-gap:10] [--card:min(17rem,66vw)] max-lg:[--card-gap:4] max-[480px]:[--card-gap:0.5]"
      >
        <div data-track className="invisible absolute left-1/2 size-0">
          {/* Faint ring and spokes that turn with the wheel. */}
          <svg
            data-ring
            aria-hidden
            viewBox="0 0 200 200"
            className="absolute top-0 left-0 size-[80rem] overflow-visible"
          >
            <circle cx="100" cy="100" r="99.8" fill="none" stroke="var(--color-line)" strokeWidth="0.12" />
            {Array.from({ length: 16 }, (_, i) => {
              const a = (i / 16) * Math.PI * 2
              return (
                <line
                  key={i}
                  x1={round(100 + Math.sin(a) * 30)}
                  y1={round(100 - Math.cos(a) * 30)}
                  x2={round(100 + Math.sin(a) * 99.8)}
                  y2={round(100 - Math.cos(a) * 99.8)}
                  stroke="var(--color-line)"
                  strokeWidth="0.12"
                />
              )
            })}
          </svg>

          {photos.map((photo, index) => (
            <div
              key={photo.src + index}
              data-card
              className="absolute top-0 left-0 h-(--card) w-(--card) overflow-hidden rounded-2xl bg-(--color-bg-subtle) [&_img]:pointer-events-none [&_img]:[-webkit-user-drag:none]"
            >
              <ContentImage value={photo} sizes="(max-width: 480px) 66vw, 272px" className="size-full object-cover" />
            </div>
          ))}
        </div>

        {/* Fades the lower wheel into the page. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-48 bg-linear-to-t from-(--color-bg) to-transparent" />

        {/* Dial: marks turn one notch per photo; the needle swings and settles. */}
        <div aria-hidden className="absolute bottom-8 left-1/2 z-20 h-[4.25rem] w-[7.875rem] -translate-x-1/2 overflow-hidden">
          <svg data-marks viewBox="0 0 126 126" className="absolute inset-x-0 top-0 size-[7.875rem]">
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i / 12) * Math.PI * 2
              return (
                <line
                  key={i}
                  x1={round(63 + Math.sin(a) * 50)}
                  y1={round(63 - Math.cos(a) * 50)}
                  x2={round(63 + Math.sin(a) * 58)}
                  y2={round(63 - Math.cos(a) * 58)}
                  stroke="var(--color-ink-muted)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              )
            })}
          </svg>
          <svg data-hand viewBox="0 0 126 126" className="absolute inset-x-0 top-0 size-[7.875rem]">
            <line x1="63" y1="4" x2="63" y2="20" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <span className="absolute top-[calc(3.9375rem-0.375rem)] left-1/2 size-3 -translate-x-1/2 rounded-sm bg-(--color-ink)" />
          <span className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-t from-(--color-bg) to-transparent" />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          aria-label={labels.prev}
          onClick={() => controls.current?.go(controls.current.current() - 1)}
          className="glass text-(--color-ink) grid place-items-center rounded-full px-8 py-4 transition-transform duration-200 active:scale-95"
        >
          <Chevrons />
        </button>
        <button
          type="button"
          aria-label={labels.next}
          onClick={() => controls.current?.go(controls.current.current() + 1)}
          className="glass text-(--color-ink) grid place-items-center rounded-full px-8 py-4 transition-transform duration-200 active:scale-95"
        >
          <Chevrons flip />
        </button>
      </div>

      {/* Announces the photo now at the front. */}
      <p className="sr-only" aria-live="polite">
        {photos[front]?.alt}
      </p>

      {/* Drag cursor: follows the pointer over the wheel on desktop only. */}
      <div
        ref={cursor}
        aria-hidden
        className="pointer-events-none invisible fixed top-0 left-0 z-50 opacity-0"
      >
        {/* Offset lives on the inner pill: GSAP owns the outer transform. */}
        <div className="glass text-(--color-ink) flex translate-x-3 -translate-y-[110%] items-center gap-2 rounded-full px-4 py-2.5 text-xs leading-none tracking-[0.02em] uppercase">
          {labels.cursor}
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M5 4 1 8l4 4M11 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}

function Chevrons({ flip = false }: { flip?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className={flip ? 'rotate-180' : ''}>
      <path d="M8 4 4 8l4 4M12 4 8 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Trims float noise so server and client render identical SVG coordinates. */
const round = (n: number) => Math.round(n * 1000) / 1000
