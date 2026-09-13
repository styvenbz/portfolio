# Fonts

Drop the licensed PP Neue Montreal webfont files in this directory.

## Files needed (two-weight system)

| File | Used for |
|---|---|
| `PPNeueMontreal-Book.woff2` | Body copy, paragraphs, captions |
| `PPNeueMontreal-Medium.woff2` | Headings, display, nav, buttons |
| `PPNeueMontreal-Italic.woff2` | Emphasis in rich text (optional) |

`.woff2` is strongly preferred — roughly half the size of `.otf` and the only
format that matters for modern browsers. If you only have `.otf`/`.ttf`,
convert them (e.g. https://transfonter.org) rather than shipping them raw.

## Licence

PP Neue Montreal is commercial. Desktop licences do **not** cover web use —
a webfont licence from Pangram Pangram is required before this goes live.

Self-hosting keeps the files private to this origin, which is what most
webfont licences require. Do not load them from a public CDN.
