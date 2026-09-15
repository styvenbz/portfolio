import { config, collection, singleton, fields } from '@keystatic/core'
import { caseStudySections } from './src/cms/blocks'
import { contentImage, contentMedia, contentVideo } from './src/cms/fields/media'

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
        client: fields.text({
          label: 'Client / company',
          description: 'Shown on the card next to the year.',
        }),
        year: fields.text({
          label: 'Year',
          description: 'Shown on the card next to the client.',
        }),
        summary: fields.text({
          label: 'Summary',
          description: 'One or two sentences. Shown on the card and used as the meta description fallback.',
          multiline: true,
        }),

        // --- Page header ---
        subtitle: fields.text({
          label: 'Subtitle',
          description:
            'The large grey line under the title at the top of the case study, e.g. "Discord meets Robinhood. Adding NFT galleries to a fintech platform".',
          multiline: true,
        }),
        intro: fields.text({
          label: 'Intro',
          description: 'Opening paragraph under the subtitle: the context of the project in a few sentences.',
          multiline: true,
        }),
        keyPoints: fields.array(
          fields.object({
            label: fields.text({ label: 'Label', description: 'e.g. "Problem" or "Outcome".' }),
            body: fields.text({ label: 'Text', multiline: true }),
          }),
          {
            label: 'Key points',
            description:
              'Short labelled paragraphs under the intro, side by side, e.g. "Problem" and "Outcome". Two works best.',
            itemLabel: (props) => props.fields.label.value || 'Key point',
          }
        ),
        liveUrl: fields.url({
          label: 'Live site link',
          description:
            'Optional. Adds a link under the project facts to the shipped work, e.g. the live website. Its text comes from "Live site label" in Site settings.',
        }),
        facts: fields.array(
          fields.object({
            label: fields.text({ label: 'Label', description: 'e.g. "Role", "Timeline", "Team".' }),
            value: fields.text({ label: 'Value', description: 'e.g. "Lead product designer".' }),
          }),
          {
            label: 'Project facts',
            description: 'The column at the right of the intro, one fact under another.',
            itemLabel: (props) =>
              [props.fields.label.value, props.fields.value.value].filter(Boolean).join(': ') || 'Fact',
          }
        ),

        // --- Listing ---
        featured: fields.checkbox({
          label: 'Feature on the home page',
          defaultValue: false,
        }),
        order: fields.integer({
          label: 'Sort order',
          description: 'Lower numbers appear first. Leave empty to sort by year.',
        }),
        thumbnail: contentImage({
          area: 'case-studies',
          label: 'Card thumbnail',
          description: 'Shown in the work grid.',
        }),
        thumbnailVideo: contentVideo({
          area: 'case-studies',
          label: 'Card hover video',
          description:
            'Optional. Plays on the card while someone hovers over it, then pauses when they move away. Always muted and looping — the autoplay, loop and controls toggles are ignored on cards. Leave the public ID empty to show only the thumbnail.',
        }),
        status: fields.text({
          label: 'Status pill',
          description:
            'Optional short tag shown next to the title on the card, e.g. "Shipped" or "Acquired". Leave empty to hide it.',
        }),
        externalUrl: fields.url({
          label: 'External link',
          description:
            'Optional. When set, the card opens this URL in a new tab instead of the case study page, and the status pill shows an ↗ arrow. Use it for shipped work that lives elsewhere (a launch post, a live product).',
        }),
        // --- Cover ---
        heroMedia: contentMedia({
          area: 'case-studies',
          label: 'Cover (large rounded image at the top of the case study)',
        }),

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
        body: caseStudySections,

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
        ogImage: contentImage({
          area: 'case-studies',
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
        greeting: fields.text({
          label: 'Greeting',
          description:
            'The big first line of the home page, e.g. "Hello, I\'m Styven". This is the page\'s main heading.',
        }),
        rotatingPhrases: fields.array(fields.text({ label: 'Phrase' }), {
          label: 'Rotating phrases',
          description:
            'The grey lines under the greeting. They cycle one at a time, sliding up. Keep each one short enough to fit on two lines. With a single phrase it simply stays put.',
          itemLabel: (props) => props.value || 'Phrase',
        }),
        phraseInterval: fields.integer({
          label: 'Seconds per phrase',
          description: 'How long each rotating phrase stays on screen before the next one slides in.',
          defaultValue: 2,
          validation: { min: 1, max: 20 },
        }),
        highlights: fields.array(
          fields.object({
            label: fields.text({
              label: 'Label',
              description: 'The dark first line, e.g. "Currently".',
            }),
            value: fields.text({
              label: 'Value',
              description: 'The grey line beneath it, e.g. "Product design @ Huge".',
            }),
          }),
          {
            label: 'Highlights',
            description:
              'Short label/value pairs shown in a row under the rotating phrases, e.g. "Currently" and "Previously at".',
            itemLabel: (props) => props.fields.label.value || 'Highlight',
          }
        ),
        portrait: contentImage({
          area: 'home',
          label: 'Portrait',
          description:
            'Small round photo at the top of the right-hand column of the hero. A square image works best.',
        }),
        bioHeading: fields.text({
          label: 'Bio heading',
          description: 'Short dark line above your bio in the hero, e.g. "Nice to meet you".',
        }),
        bio: fields.text({
          label: 'Bio',
          description:
            'A few sentences in the right-hand column of the hero. Your social links (from Site settings) sit underneath it.',
          multiline: true,
        }),
        workHeading: fields.text({
          label: 'Work section heading',
          description:
            'e.g. "Selected work". The big heading on the /work page. On the home page it is announced to screen readers above the project grid but not shown.',
        }),
      },
    }),

    about: singleton({
      label: 'About page',
      path: 'src/content/about/',
      format: { data: 'yaml' },
      schema: {
        heading: fields.text({ label: 'Heading', multiline: true }),
        portrait: contentImage({ area: 'about', label: 'Portrait' }),
        experienceHeading: fields.text({
          label: 'Experience heading',
          description: 'Small heading above the experience list, e.g. "Experience".',
        }),
        skillsHeading: fields.text({
          label: 'Skills heading',
          description: 'Small heading above the skills tags, e.g. "Skills".',
        }),
        bio: fields.mdx.inline({
          label: 'Bio',
          options: { image: false, codeBlock: false, table: false },
        }),
        experience: fields.array(
          fields.object({
            company: fields.text({ label: 'Company' }),
            role: fields.text({ label: 'Role' }),
            period: fields.text({ label: 'Period', description: 'e.g. 2022 — Present' }),
            description: fields.text({
              label: 'Description',
              description: 'Put each project or responsibility on its own line; line breaks are kept.',
              multiline: true,
            }),
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
        logo: contentImage({
          area: 'site',
          label: 'Nav logo',
          description:
            'The image at the left of the floating nav; clicking it goes to the home page. Shown at about 58×64px and allowed to poke out of the pill, so a cut-out avatar or memoji (transparent PNG/WebP) works best. Alt text names the link, e.g. "Home". Without an image, "Your name" shows as text instead.',
        }),
        logoHover: contentImage({
          area: 'site',
          label: 'Nav logo — hover version',
          description:
            'Optional. Swapped in while someone hovers the logo, e.g. an animated GIF of the same avatar. Same size as the logo. Alt text can stay empty.',
        }),
        navLinks: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            href: fields.text({ label: 'Link' }),
          }),
          {
            label: 'Navigation links',
            description:
              'The plain links in the floating nav, in order, e.g. Work → /work, About → /about. Keep it to a few short words so the nav fits on phones.',
            itemLabel: (props) => props.fields.label.value || 'Link',
          }
        ),
        navCta: fields.object(
          {
            label: fields.text({ label: 'Label', description: 'e.g. "Contact".' }),
            href: fields.text({ label: 'Link', description: 'e.g. /contact or mailto:you@example.com.' }),
          },
          {
            label: 'Nav button',
            description:
              'The highlighted button at the right end of the floating nav. Leave the label empty to hide it.',
          }
        ),
        socialLinks: fields.array(
          fields.object({
            label: fields.text({
              label: 'Label',
              description:
                'The network name, e.g. "LinkedIn". Shown as text in the footer, and read out by screen readers for the hero icon.',
            }),
            href: fields.text({ label: 'URL' }),
            icon: contentImage({
          area: 'site',
              label: 'Icon',
              description:
                'Shown in the home page hero under your bio. Upload a single-colour SVG; it is tinted to match the text colour. Alt text can stay empty — the label above names the link. Without an icon, the label shows as text.',
            }),
          }),
          {
            label: 'Social links',
            description: 'Shown in the footer and under the bio on the home page.',
            itemLabel: (props) => props.fields.label.value || 'Link',
          }
        ),
        footerText: fields.text({ label: 'Footer text', multiline: true }),
        skipLinkLabel: fields.text({
          label: 'Skip link label',
          description:
            'The keyboard shortcut link that lets people jump past the navigation, e.g. "Skip to content". Only visible when focused via the Tab key.',
        }),
        externalLinkLabel: fields.text({
          label: 'New tab notice',
          description:
            'Read out by screen readers after any link that opens in a new tab (project cards with an external link, social icons), e.g. "(opens in a new tab)". Not visible on screen.',
        }),
        protectedLabel: fields.text({
          label: 'Protected label',
          description:
            'Read out by screen readers for the lock icon on password-protected project cards, e.g. "Protected".',
        }),
        liveSiteLabel: fields.text({
          label: 'Live site label',
          description: 'Text of the link to the live work on case studies that have one, e.g. "Visit site".',
        }),
        zoomImageLabel: fields.text({
          label: 'Zoom image label',
          description:
            'Read out by screen readers for images on case studies that can be clicked to view full screen, e.g. "Expand image".',
        }),
        closeLabel: fields.text({
          label: 'Close button label',
          description: 'The button that closes a full-screen image on case studies, e.g. "Close".',
        }),
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
        defaultOgImage: contentImage({ area: 'seo', label: 'Default social share image' }),
      },
    }),
  },
})
