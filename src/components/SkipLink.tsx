/**
 * Keyboard users land on the nav on every page load. Without this they have to
 * tab through it before reaching the content — on a case study with an in-page
 * section nav, that's a lot of stops.
 *
 * Visually hidden until focused.
 */
export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#main"
      className="bg-(--color-ink) text-(--color-bg) sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2"
    >
      {label}
    </a>
  )
}
