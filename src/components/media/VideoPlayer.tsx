'use client'

import { useEffect, useRef, useState } from 'react'
import type { VideoValue } from '@/lib/media'

export type PlayerLabels = { play: string; pause: string; soundOn: string; soundOff: string }

/**
 * A video with small glass play/pause and sound buttons in the corner.
 *
 * Browsers only autoplay muted video, so it always starts silent; the sound
 * button only appears when "Muted" is unticked in the CMS. The play state
 * follows the element's own events, so it stays right if the browser blocks
 * autoplay or the video ends.
 *
 * Unless `eager`, nothing downloads until the video nears the screen, and it
 * pauses while scrolled away — so a long clip at the bottom of a page doesn't
 * compete with the images at the top for a slow connection.
 */
export function VideoPlayer({
  value,
  className,
  labels,
  eager = false,
}: {
  value: VideoValue & { src: string }
  className?: string
  labels: PlayerLabels
  eager?: boolean
}) {
  const video = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [loaded, setLoaded] = useState(eager)
  const [sized, setSized] = useState(false)
  // A pause the visitor chose, as opposed to one from scrolling away.
  const userPaused = useRef(false)

  // Autoplay often starts before hydration, so its first play event is missed.
  useEffect(() => {
    if (video.current) setPlaying(!video.current.paused)
  }, [])

  useEffect(() => {
    const element = video.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true)
          if (value.autoplay && !userPaused.current) element.play().catch(() => {})
        } else if (!element.paused) {
          element.pause()
        }
      },
      { rootMargin: '200px 0px' }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [value.autoplay])

  const togglePlay = () => {
    const element = video.current
    if (!element) return
    setLoaded(true)
    userPaused.current = !element.paused
    if (element.paused) element.play().catch(() => {})
    else element.pause()
  }

  const toggleSound = () => {
    const element = video.current
    if (!element) return
    const next = !muted
    element.muted = next
    setMuted(next)
    if (!next && element.paused) {
      userPaused.current = false
      setLoaded(true)
      element.play().catch(() => {})
    }
  }

  // Holds the space before the file arrives, so the page doesn't jump.
  const ratio = value.width && value.height ? `${value.width} / ${value.height}` : sized ? undefined : '16 / 9'

  return (
    <div className="relative size-full">
      <video
        ref={video}
        className={className}
        src={loaded ? value.src : undefined}
        poster={value.poster ?? undefined}
        // Starts itself once the file is attached; later scroll-backs resume it in the observer.
        autoPlay={value.autoplay && loaded}
        loop={value.loop}
        muted
        playsInline
        preload={loaded ? 'metadata' : 'none'}
        width={value.width ?? undefined}
        height={value.height ?? undefined}
        style={{ aspectRatio: ratio }}
        onLoadedMetadata={() => setSized(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <div className="absolute right-3 bottom-3 flex gap-2 sm:right-4 sm:bottom-4">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? labels.pause : labels.play}
          className={button}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            {playing ? (
              <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
            ) : (
              <path d="M8 5.5v13a.5.5 0 0 0 .76.43l10.5-6.5a.5.5 0 0 0 0-.86L8.76 5.07A.5.5 0 0 0 8 5.5z" />
            )}
          </svg>
        </button>

        {!value.muted ? (
          <button
            type="button"
            onClick={toggleSound}
            aria-label={muted ? labels.soundOn : labels.soundOff}
            aria-pressed={!muted}
            className={button}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              {muted ? (
                <path d="m16 9.5 5 5m0-5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path
                  d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  )
}

const button =
  'glass text-(--color-ink) grid size-11 place-items-center rounded-full transition-transform duration-200 active:scale-95'
