# Fonts

PP Neue Montreal, self-hosted and converted to `.woff2` (~53% smaller than the
source `.otf`).

## Loaded faces

| File | Weight / style | Used for |
|---|---|---|
| `PPNeueMontreal-Book.woff2` | 400 normal | Body copy, paragraphs, captions |
| `PPNeueMontreal-Italic.woff2` | 400 italic | Emphasis in rich text |
| `PPNeueMontreal-Medium.woff2` | 500 normal | Headings, display, nav, labels |

Thin, Bold and SemiBold Italic are intentionally **not** loaded — each face is
roughly 55KB on first paint and the design doesn't call for them. If a design
later needs one, add the file and register it in `src/app/fonts.ts`; don't
reach for a weight that isn't loaded, because `font-synthesis: none` means the
browser will not fake it (deliberately — synthesised weights look smeared at
display sizes).

## Regenerating the woff2 files

`wawoff2` is a devDependency:

```js
import { readFile, writeFile } from 'node:fs/promises'
import { compress } from 'wawoff2'
await writeFile('out.woff2', await compress(await readFile('in.otf')))
```

## ⚠️ Licence — resolve before going live

These files came from a third-party download site, not from the foundry.
**PP Neue Montreal is a commercial typeface** and web embedding requires a
webfont licence from Pangram Pangram (pangrampangram.com) — a desktop licence
does not cover it.

Buy the web licence and replace these three files before the site is publicly
deployed. Because the type system is tokenised, swapping them is a file drop:
nothing outside this directory and `src/app/fonts.ts` refers to the font.

A free, licence-clean alternative with a similar feel is **Switzer**
(fontshare.com), if you'd rather not licence Montreal.
