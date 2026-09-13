# Portfolio 2026

Personal portfolio for a product/UX designer. Next.js App Router, Keystatic CMS,
Tailwind v4, deployed on Vercel.

See [SETUP.md](SETUP.md) for first-time deployment.

## Develop

```bash
npm install
npm run dev
```

- Site: http://localhost:3000
- CMS: http://localhost:3000/keystatic

Copy `.env.example` to `.env.local` and fill in what you need. Nothing is
required to run locally — media falls back to placeholders and protected case
studies stay locked.

## Commands

| Command | Does |
|---|---|
| `npm run dev` | Dev server with the CMS in local mode |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |

## How it's put together

| Path | What |
|---|---|
| `keystatic.config.ts` | The whole content model |
| `src/cms/blocks.ts` | Case-study block types |
| `src/cms/fields/cloudinary.ts` | Media field shapes |
| `src/lib/content.ts` | The only way to read content |
| `src/lib/gate.ts` | Password gating for NDA work |
| `src/components/motion/` | Lenis, GSAP and page transitions |
| `src/app/globals.css` | Design tokens — the single re-skin point |

## The one rule

Everything user-facing is editable in Keystatic. No hardcoded copy, images or
labels in components. See `.claude/skills/keystatic-cms/SKILL.md`.
