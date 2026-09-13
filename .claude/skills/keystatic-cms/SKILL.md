---
name: keystatic-cms
description: Enforces that every user-facing thing on this portfolio is editable in Keystatic. Use whenever adding, changing, or removing ANY section, component, page, copy, image, video, link, label, or setting — including "just add a heading", "hardcode this for now", or "put a placeholder". Also use when adding a new content block type, wiring media, or reviewing whether content belongs in the CMS.
---

# Keystatic CMS is the source of truth

The owner is a designer, not a maintainer of this codebase. **If they cannot change it at
`/keystatic`, it is broken** — even if it renders perfectly.

## The rule

> No user-facing string, image, video, link, or label may be hardcoded in a React component.
> If it renders, it comes from Keystatic.

This includes the things people usually skip: nav labels, button text, footer copy, alt text,
section headings, empty states, 404 copy, meta titles, and the CV link label.

## Required workflow for any new feature

Do these in order. Do not write the component first and "add CMS later" — that is how
placeholder copy ships to production.

1. **Schema first.** Add the field to `keystatic.config.ts`, or a new block to
   `src/cms/blocks.ts`. Give every field a `label` AND a `description` written for a designer,
   not a developer — say what it does and where it shows up.
2. **Reader.** Read via `src/lib/content.ts`. Never `fs.readFile` content directly.
3. **Render.** The component takes content as props. It contains layout and behavior only.
4. **Verify the round-trip.** Run the dev server, edit the field at `/keystatic`, confirm the
   change appears on the page. Schema that typechecks but doesn't round-trip is not done.

## Where a field belongs

| Kind of content | Goes in |
|---|---|
| Anything specific to one project | `caseStudies` collection |
| A new kind of case-study section | a block in `src/cms/blocks.ts` |
| Home page content | `home` singleton |
| Bio, experience, CV | `about` singleton |
| Nav, footer, socials, email, motion intensity | `siteSettings` singleton |
| Titles, descriptions, share images | `seoDefaults` singleton |

## Media

All images and video go to **Cloudinary**, referenced by public ID through the helpers in
`src/cms/fields/cloudinary.ts` (`cloudinaryImage`, `cloudinaryVideo`, `cloudinaryMedia`).

- **Never commit images or video to the repo.** Video in git bloats the repo and slows builds.
- Reuse the helpers — don't hand-roll another media field shape. One shape, one renderer.
- Every image field carries `alt`. Rendering an image without alt is a bug.

## Security boundary — do not put secrets in the CMS

`keystatic.config.ts` and everything under `src/content/` is **committed to GitHub**.

Case-study passwords therefore live in Vercel environment variables
(`CASE_PASSWORD_<SLUG_IN_CAPS>`, falling back to `CASE_PASSWORD_DEFAULT`). The CMS stores only
`access: public | protected`. Never add a password, token, or key field to a schema.

## Checklist before calling a feature done

- [ ] Every string and asset it renders comes from Keystatic
- [ ] Each new field has a designer-readable `description`
- [ ] Media uses the Cloudinary helpers; nothing binary added to the repo
- [ ] Images have alt text
- [ ] Edited it live at `/keystatic` and saw the page change
- [ ] `npm run typecheck` and `npm run build` pass
