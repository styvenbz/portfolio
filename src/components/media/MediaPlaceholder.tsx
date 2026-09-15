/**
 * Shown when a media slot is empty.
 * Keeps layout intact so an unfinished case study still reads as a page.
 */
export function MediaPlaceholder({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`bg-(--color-bg-subtle) aspect-[16/10] w-full ${className ?? ''}`}
    />
  )
}
