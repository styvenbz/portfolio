import { config, collection, singleton, fields } from '@keystatic/core'
import { caseStudyBlocks } from './src/cms/blocks'
import { cloudinaryImage, cloudinaryMedia } from './src/cms/fields/cloudinary'

/**
 * Storage mode.
 *
 * Local in development (writes straight to disk, no auth), GitHub in
 * production (you log in at /keystatic on the live site and your edits
 * become commits, which trigger a Vercel redeploy).
 *
 * Falls back to local if the repo env vars aren't set yet, so the CMS is
 * usable before the GitHub App exists.
 */
const repoOwner = process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER
const repoName = process.env.NEXT_PUBLIC_GITHUB_REPO_NAME
const useGitHub =
  process.env.NODE_ENV === 'production' && !!repoOwner && !!repoName

export default config({
  storage: useGitHub
    ? { kind: 'github', repo: { owner: repoOwner!, name: repoName! } }
    : { kind: 'local' },

  ui: {
    brand: { name: 'Portfolio' },
    navigation: {
      Work: ['caseStudies'],
      Pages: ['home', 'about'],
      Settings: ['siteSettings', 'seoDefaults'],
    },
  },

  collections: {
    caseStudies: collection({
      label: 'Case studies',
      slugField: 'title',
      path: 'src/content/case-studies/*/',
      format: { data: 'yaml' },
      columns: ['title', 'client', 'year'],
      entryLayout: 'form',
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            description: 'The project name as it appears in the grid and as the page heading.',
          },
        }),
        client: fields.text({ label: 'Client / company' }),
        role: fields.text({
          label: 'Your role',
          description: 'e.g. Lead Product Designer',
        }),
        year: fields.text({ label: 'Year' }),
        disciplines: fields.array(fields.text({ label: 'Discipline' }), {
          label: 'Disciplines',
          description: 'e.g. UX Research, Design System, Prototyping',
          itemLabel: (props) => props.value || 'Discipline',
        }),
        summary: fields.text({
          label: 'Summary',
          description: 'One or two sentences. Shown on the card and used as the meta description fallback.',
          multiline: true,
        }),

        // --- Listing ---
        featured: fields.checkbox({
          label: 'Feature on the home page',
          defaultValue: false,
        }),
        order: fields.integer({
          label: 'Sort order',
          description: 'Lower numbers appear first. Leave empty to sort by year.',
        }),
        thumbnail: cloudinaryImage({
          label: 'Card thumbnail',
          description: 'Shown in the work grid.',
        }),
        accentColor: fields.text({
          label: 'Accent color',
          description: 'Optional CSS color used for this project’s card and hero.',
        }),

        // --- Hero ---
        heroMedia: cloudinaryMedia({ label: 'Hero media' }),

        // --- Access ---
        access: fields.select({
          label: 'Visibility',
          description:
            'Protected case studies are teased in the grid with a lock, and require a password to read. The password itself is set as an environment variable in Vercel — never stored here, because this file is committed to GitHub.',
          options: [
            { label: 'Public', value: 'public' },
            { label: 'Password protected', value: 'protected' },
          ],
          defaultValue: 'public',
        }),

        // --- Body ---
        body: caseStudyBlocks,

        // --- SEO ---
        metaTitle: fields.text({
          label: 'Meta title',
          description: 'Optional override. Defaults to the project title.',
        }),
        metaDescription: fields.text({
          label: 'Meta description',
          description: 'Optional override. Defaults to the summary.',
          multiline: true,
        }),
        ogImage: cloudinaryImage({
          label: 'Social share image',
          description: 'Optional. Falls back to the thumbnail, then the site default.',
        }),
      },
    }),
  },

  singletons: {
    home: singleton({
      label: 'Home page',
      path: 'src/content/home/',
      format: { data: 'yaml' },
      schema: {
        heroHeadline: fields.text({ label: 'Hero headline', multiline: true }),
        heroSubline: fields.text({ label: 'Hero subline', multiline: true }),
        heroMedia: cloudinaryMedia({ label: 'Hero media' }),
        introHeading: fields.text({ label: 'Intro heading' }),
        introBody: fields.mdx.inline({
          label: 'Intro body',
          options: { image: false, codeBlock: false, table: false },
        }),
        workHeading: fields.text({
          label: 'Work section heading',
          description: 'Heading above the project grid, e.g. "Selected work".',
        }),
        marqueeItems: fields.array(fields.text({ label: 'Item' }), {
          label: 'Marquee / ticker items',
          description: 'Scrolling text strip. Leave empty to hide it.',
          itemLabel: (props) => props.value || 'Item',
        }),
        ctaHeading: fields.text({ label: 'Closing CTA heading', multiline: true }),
        ctaLabel: fields.text({ label: 'Closing CTA button label' }),
        ctaHref: fields.text({ label: 'Closing CTA link' }),
      },
    }),

    about: singleton({
      label: 'About page',
      path: 'src/content/about/',
      format: { data: 'yaml' },
      schema: {
        heading: fields.text({ label: 'Heading', multiline: true }),
        portrait: cloudinaryImage({ label: 'Portrait' }),
        bio: fields.mdx.inline({
          label: 'Bio',
          options: { image: false, codeBlock: false, table: false },
        }),
        experience: fields.array(
          fields.object({
            company: fields.text({ label: 'Company' }),
            role: fields.text({ label: 'Role' }),
            period: fields.text({ label: 'Period', description: 'e.g. 2022 — Present' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          {
            label: 'Experience',
            itemLabel: (props) =>
              [props.fields.company.value, props.fields.role.value]
                .filter(Boolean)
                .join(' — ') || 'Role',
          }
        ),
        skills: fields.array(fields.text({ label: 'Skill' }), {
          label: 'Skills',
          itemLabel: (props) => props.value || 'Skill',
        }),
        cvFile: fields.file({
          label: 'CV / resume (PDF)',
          directory: 'public/files',
          publicPath: '/files/',
        }),
        cvLabel: fields.text({
          label: 'CV link label',
          description: 'e.g. Download CV (PDF)',
        }),
      },
    }),

    siteSettings: singleton({
      label: 'Site settings',
      path: 'src/content/settings/site/',
      format: { data: 'yaml' },
      schema: {
        name: fields.text({ label: 'Your name' }),
        roleLine: fields.text({
          label: 'Role line',
          description: 'Short descriptor shown in the header/footer.',
        }),
        email: fields.text({ label: 'Contact email' }),
        navLinks: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            href: fields.text({ label: 'Link' }),
          }),
          {
            label: 'Navigation links',
            itemLabel: (props) => props.fields.label.value || 'Link',
          }
        ),
        socialLinks: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            href: fields.text({ label: 'URL' }),
          }),
          {
            label: 'Social links',
            itemLabel: (props) => props.fields.label.value || 'Link',
          }
        ),
        footerText: fields.text({ label: 'Footer text', multiline: true }),
        notFoundHeading: fields.text({
          label: 'Not found — heading',
          description: 'Shown on the 404 page when a URL does not exist.',
          multiline: true,
        }),
        notFoundBody: fields.text({
          label: 'Not found — body',
          multiline: true,
        }),
        notFoundLinkLabel: fields.text({
          label: 'Not found — link label',
          description: 'Label for the link back to the home page, e.g. "Back to work".',
        }),
        motionIntensity: fields.select({
          label: 'Motion intensity',
          description:
            'Dial the animation down without a code change. Reduced-motion users always get "Subtle" regardless of this setting.',
          options: [
            { label: 'Full', value: 'full' },
            { label: 'Subtle', value: 'subtle' },
          ],
          defaultValue: 'full',
        }),
      },
    }),

    seoDefaults: singleton({
      label: 'SEO defaults',
      path: 'src/content/settings/seo/',
      format: { data: 'yaml' },
      schema: {
        siteUrl: fields.url({
          label: 'Site URL',
          description: 'Full production URL, e.g. https://example.com. Used for canonical tags and the sitemap.',
        }),
        titleTemplate: fields.text({
          label: 'Title template',
          description: 'Use %s for the page title, e.g. "%s — Jane Doe".',
        }),
        defaultTitle: fields.text({ label: 'Default title' }),
        defaultDescription: fields.text({
          label: 'Default description',
          multiline: true,
        }),
        defaultOgImage: cloudinaryImage({ label: 'Default social share image' }),
      },
    }),
  },
})
