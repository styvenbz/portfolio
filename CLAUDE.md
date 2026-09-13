# Portfolio 2026

Personal portfolio for a product/UX designer. Next.js (App Router) + Keystatic + Tailwind v4,
deployed on Vercel.

## Non-negotiable rule

**Everything user-facing must be editable in Keystatic.** No hardcoded copy, images, video, or
labels in components. Before adding any feature, read `.claude/skills/keystatic-cms/SKILL.md`
and follow its workflow: schema → reader → render → verify the round-trip.

## Secrets

`src/content/` and `keystatic.config.ts` are committed to GitHub. Case-study passwords live in
Vercel env vars (`CASE_PASSWORD_<SLUG>`), never in the CMS.

## Media

Cloudinary only, via the helpers in `src/cms/fields/cloudinary.ts`. Never commit media files.

## Commands

- `npm run dev` — dev server, CMS at `/keystatic`
- `npm run typecheck` — tsc, no emit
- `npm run build` — production build
