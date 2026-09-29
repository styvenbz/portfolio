import localFont from 'next/font/local'

/**
 * PP Neue Montreal — two-weight system.
 *
 * Book (400) carries body copy; Medium (500) carries headings, display type and
 * UI labels. Declaring them as one family with weight/style descriptors means
 * components just say `font-medium` or `<em>` and the browser picks the right
 * file — no manual class juggling, and no synthesised faux-bold or faux-italic.
 *
 * Thin, Bold and SemiBold Italic are deliberately not loaded: every extra face
 * is ~55KB on first paint, and the design doesn't use them.
 */
export const neueMontreal = localFont({
  src: [
    { path: './fonts/PPNeueMontreal-Book.woff2', weight: '400', style: 'normal' },
    { path: './fonts/PPNeueMontreal-Medium.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-neue-montreal',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
})

/**
 * Italic only appears inside case-study prose, so it isn't preloaded: the
 * browser fetches it the first time an <em> actually renders, instead of every
 * page paying ~50KB up front.
 */
export const neueMontrealItalic = localFont({
  src: [{ path: './fonts/PPNeueMontreal-Italic.woff2', weight: '400', style: 'italic' }],
  variable: '--font-neue-montreal-italic',
  display: 'swap',
  preload: false,
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
})
