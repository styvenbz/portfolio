/**
 * Shown when a media slot is empty or Cloudinary isn't configured yet.
 * Keeps layout intact so an unfinished case study still reads as a page.
 */
export function MediaPlaceholder({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`bg-(--color-bg-subtle) border-(--color-line) flex aspect-[16/10] w-full items-center justify-center border ${className ?? ''}`}
    >
      <span className="text-(--color-ink-faint) label">
        Media
      </span>
    </div>
  )
}
