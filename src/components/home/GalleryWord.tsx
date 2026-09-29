/**
 * The giant background word behind the gallery.
 *
 * An SVG rather than text: `preserveAspectRatio="none"` plus `textLength`
 * stretch the word to fill the box both ways, which is how a wide typeface
 * gets the tall, full-bleed look of a condensed one.
 */
export function GalleryWord({ word }: { word: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 hidden h-[calc(12vw+12rem)] px-(--spacing-gutter) md:block"
    >
      <svg
        viewBox="0 0 1000 300"
        preserveAspectRatio="none"
        className="size-full"
        style={{ fill: 'var(--color-bg-subtle)' }}
      >
        <text
          x="0"
          y="298"
          textLength="1000"
          lengthAdjust="spacingAndGlyphs"
          fontSize="300"
          fontWeight="500"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {word.toUpperCase()}
        </text>
      </svg>
      {/* Fades the word out towards the bottom, as in the reference. */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-(--color-bg) to-transparent" />
    </div>
  )
}
