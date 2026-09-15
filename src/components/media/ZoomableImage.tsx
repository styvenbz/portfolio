'use client'

import { useRef, useState } from 'react'
import { hasImage, type ImageValue } from '@/lib/media'
import { ContentImage } from './ContentImage'

/**
 * An image that opens full screen when clicked.
 *
 * Uses a native modal <dialog>: focus moves into it, Escape closes it and the
 * rest of the page is inert while it's open, with no focus-trap code of our
 * own. The full-size image only mounts when opened, so zoom costs nothing
 * until someone asks for it.
 *
 * Empty or unconfigured images render a neutral box at `aspect`, so a
 * half-finished case study still shows its layout.
 */
export function ZoomableImage({
  value,
  sizes,
  labels,
  aspect = 'aspect-[16/10]',
  emptyClassName = 'bg-(--color-bg-subtle)',
  withCaption = true,
}: {
  value: Partial<ImageValue> | null | undefined
  sizes: string
  labels: { zoom: string; close: string }
  aspect?: string
  /** Fill for the neutral box shown while the image is empty. */
  emptyClassName?: string
  withCaption?: boolean
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)

  if (!hasImage(value)) {
    return <div aria-hidden className={`w-full ${emptyClassName} ${aspect}`} />
  }

  const name = [labels.zoom, value.alt].filter(Boolean).join(': ')
  const openZoom = () => {
    setOpen(true)
    dialogRef.current?.showModal()
  }
  const close = () => dialogRef.current?.close()

  return (
    <figure>
      <button
        type="button"
        onClick={openZoom}
        aria-label={name}
        aria-haspopup="dialog"
        className="block w-full cursor-zoom-in"
      >
        <ContentImage value={value} sizes={sizes} className="h-auto w-full" />
      </button>

      {withCaption && value.caption ? (
        <figcaption className="text-case-body text-(--color-ink-muted) mt-3">{value.caption}</figcaption>
      ) : null}

      <dialog
        ref={dialogRef}
        aria-label={value.alt || labels.zoom}
        onClose={() => setOpen(false)}
        onClick={close}
        /* Browsers close modal dialogs on Escape natively; handling it here too
           keeps that working where the native close request doesn't fire. */
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault()
            close()
          }
        }}
        // Stops Lenis from scrolling the page underneath while the viewer is open.
        data-lenis-prevent
        className="zoom-dialog m-0 size-full max-h-none max-w-none cursor-zoom-out border-0 bg-transparent p-4 backdrop:bg-black/90 sm:p-12"
      >
        {open ? (
          <ContentImage value={value} sizes="100vw" className="size-full object-contain" />
        ) : null}
        <button
          type="button"
          onClick={close}
          className="fixed top-4 right-4 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md transition-colors hover:bg-white/20"
        >
          {labels.close}
        </button>
      </dialog>
    </figure>
  )
}
