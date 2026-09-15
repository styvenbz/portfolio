'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { LockIcon } from '@/components/LockIcon'
import { ContentImage } from '@/components/media/ContentImage'
import { useMotionIntensity } from '@/components/motion/MotionProvider'
import { hasImage, hasVideo } from '@/lib/media'
import type { CaseStudy } from '@/lib/content'

/**
 * Work card.
 *
 * Hover mirrors the reference: the whole card scales to 1.05 and the media
 * scales a further 1.05 inside it, unclipped, so the image visibly leads.
 *
 * The hover video attaches its sources on first hover/focus, so a grid of
 * cards costs no video bytes until someone shows interest. It never plays on
 * touch-only devices or when motion is dialled down.
 */
export function ProjectCard({
  study,
  externalLinkLabel,
  protectedLabel,
}: {
  study: CaseStudy
  externalLinkLabel: string
  protectedLabel: string
}) {
  const intensity = useMotionIntensity()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [armed, setArmed] = useState(false)
  const [playing, setPlaying] = useState(false)

  const animated = intensity === 'full'
  const video = hasVideo(study.thumbnailVideo) ? study.thumbnailVideo : null
  const external = Boolean(study.externalUrl)

  useEffect(() => {
    if (armed) videoRef.current?.load()
  }, [armed])

  useEffect(() => {
    const element = videoRef.current
    if (!element || !armed) return
    if (playing) element.play().catch(() => setPlaying(false))
    else element.pause()
  }, [armed, playing])

  const start = () => {
    if (!video || !animated || !window.matchMedia('(hover: hover)').matches) return
    setArmed(true)
    setPlaying(true)
  }
  const stop = () => setPlaying(false)

  const scale = animated
    ? 'hover:scale-[1.05] focus-visible:scale-[1.05]'
    : ''
  const mediaScale = animated
    ? 'group-hover:scale-[1.05] group-focus-visible:scale-[1.05]'
    : ''
  const meta = [study.client, study.year].filter(Boolean)

  const content = (
    <>
      <div
        className={`relative aspect-[100/65] overflow-hidden rounded-xl bg-(--color-bg-subtle) transition-transform duration-400 ease-(--ease-out-expo) ${mediaScale}`}
      >
        {hasImage(study.thumbnail) ? (
          <ContentImage
            value={study.thumbnail}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="size-full object-cover"
          />
        ) : video?.poster ? (
          // Decorative still: the card title already names the link.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={video.poster} alt="" className="size-full object-cover" />
        ) : null}

        {video ? (
          <video
            ref={videoRef}
            aria-hidden
            muted
            loop
            playsInline
            preload="none"
            // No src until first hover, so a grid of cards loads no video bytes.
            src={armed ? video.src : undefined}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ${
              playing ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        <h3 className="text-2xl tracking-tight">{study.title}</h3>

        {study.access === 'protected' ? (
          <span className="text-(--color-ink-muted) grid size-7 place-items-center rounded-full border-[1.5px] border-(--color-line)">
            <LockIcon />
            <span className="sr-only">{protectedLabel}</span>
          </span>
        ) : null}

        {study.status || external ? (
          <span
            className={`text-(--color-ink-muted) inline-flex h-7 items-center gap-1 rounded-full border-[1.5px] border-(--color-line) text-[0.8125rem] font-medium uppercase tracking-[0.01em] backdrop-blur-md ${
              study.status ? 'pr-2 pl-2.5' : 'w-7 justify-center'
            }`}
          >
            {study.status}
            {external ? <ArrowUpRight /> : null}
          </span>
        ) : null}
      </div>

      {study.summary ? (
        <p className="text-(--color-ink-muted) mt-3 text-base">{study.summary}</p>
      ) : null}

      {meta.length ? (
        <p className="mt-3 flex gap-2 text-base font-medium">
          {meta.map((item, index) => (
            <span key={index} className="contents">
              {index > 0 ? <span aria-hidden>·</span> : null}
              <span>{item}</span>
            </span>
          ))}
        </p>
      ) : null}

      {external && externalLinkLabel ? <span className="sr-only">{externalLinkLabel}</span> : null}
    </>
  )

  const className = `group block rounded-xl transition-transform duration-400 ease-(--ease-out-expo) ${scale}`
  const handlers = {
    onPointerEnter: start,
    onPointerLeave: stop,
    onFocus: start,
    onBlur: stop,
  }

  return external ? (
    <a
      href={study.externalUrl!}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...handlers}
    >
      {content}
    </a>
  ) : (
    <Link href={`/work/${study.slug}`} className={className} {...handlers}>
      {content}
    </Link>
  )
}

function ArrowUpRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="opacity-30">
      <path
        d="M5 11 11 5M6 5h5v5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
