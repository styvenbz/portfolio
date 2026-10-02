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
      Pages: ['home', 'about', 'contact'],
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
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Skills, tools and technologies',
          description:
            'Shown as small pills under the intro, e.g. "UX design", "Benchmarking", "Design system". Leave empty to hide them.',
          itemLabel: (props) => props.value || 'Tag',
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
        heroSummary: fields.text({
          label: 'Hero description — short version',
          description:
            'The version shown by default, under the greeting and rotating phrases. Start a line with "*" or "-" to make it a bullet; other lines read as paragraphs. Leave empty to always show the long version.',
          multiline: true,
        }),
        heroDescription: fields.text({
          label: 'Hero description — long version',
          description:
            'Shown when the visitor switches the toggle off. Plain paragraphs, no bullets. Leave empty to always show the short version.',
          multiline: true,
        }),
        heroSummaryToggleLabel: fields.text({
          label: 'Hero description — toggle label',
          description:
            'The little button that switches between the two versions, e.g. "🥱 TL; DR". It only appears when both versions are filled in.',
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
          label: 'Bio picture',
          description:
            'Square (1:1) photo at the top of the right-hand column of the hero, above the bio heading. Non-square images are cropped to fill the square from the centre; about 800×800px is plenty. Remember the alt text. Leave empty to hide it.',
        }),
        heroCtaLabel: fields.text({
          label: 'Hero jump button — label',
          description:
            'Floating button at the bottom of the screen on the home page, e.g. "Check the projects". It fades away once the visitor scrolls down. Leave empty to hide it.',
        }),
        heroCtaHref: fields.text({
          label: 'Hero jump button — link',
          description:
            'Where the button jumps to. "#work" scrolls down to the project grid on this page; a path like /work opens the work page.',
        }),
        experienceHeading: fields.text({
          label: 'Experience heading',
          description:
            'Heading above the experience list in the right-hand column of the hero, e.g. "Experience".',
        }),
        experience: fields.array(
          fields.object({
            role: fields.text({
              label: 'Role',
              description: 'Job title, e.g. "Product Design Lead, Ads AI".',
            }),
            period: fields.text({
              label: 'Period',
              description: 'Shown at the right of the role, e.g. "2022 — Present".',
            }),
            company: fields.text({
              label: 'Company',
              description: 'Shown under the role, next to the logo.',
            }),
            logo: contentImage({
              area: 'home',
              label: 'Company logo',
              description:
                'Optional small logo shown before the company name, about 16px tall. A transparent PNG/SVG in one colour works best. Without one, only the company name shows. Alt text can stay empty — the company name is right next to it.',
            }),
          }),
          {
            label: 'Experience',
            description:
              'Roles listed in the right-hand column of the hero, newest first. Your social links sit underneath.',
            itemLabel: (props) =>
              [props.fields.role.value, props.fields.company.value].filter(Boolean).join(' — ') ||
              'Role',
          }
        ),
        galleryWord: fields.text({
          label: 'Gallery — background word',
          description:
            'The giant word behind the photo wheel below your projects, e.g. "Gallery". On phones, where the giant word is hidden, it shows as a normal title above the wheel instead.',
        }),
        galleryImages: fields.array(
          contentImage({
            area: 'home',
            label: 'Photo',
            description: 'Shown as a square, cropped from the centre. The photo at the front is in colour; the rest are greyscale.',
          }),
          {
            label: 'Gallery — photos',
            description:
              'Photos on the wheel below your projects, in order. About 8–14 works best; fewer than 3 hides the section. The middle photo starts at the front.',
            itemLabel: (props) => props.fields.alt.value || 'Photo',
          }
        ),
        galleryCursorLabel: fields.text({
          label: 'Gallery — cursor label',
          description: 'The little pill that follows the mouse over the wheel on desktop, e.g. "Drag".',
        }),
        galleryPrevLabel: fields.text({
          label: 'Gallery — previous button name',
          description: 'Read out by screen readers for the « button, e.g. "Previous photo".',
        }),
        galleryNextLabel: fields.text({
          label: 'Gallery — next button name',
          description: 'Read out by screen readers for the » button, e.g. "Next photo".',
        }),
        workHeading: fields.text({
          label: 'Work section heading',
          description:
            'e.g. "Selected work". The big heading on the /work page. On the home page it is announced to screen readers above the project grid but not shown.',
        }),
      },
    }),

    contact: singleton({
      label: 'Contact page',
      path: 'src/content/contact/',
      format: { data: 'yaml' },
      schema: {
        title: fields.text({
          label: 'Page title',
          description:
            'Used for the browser tab and read out to screen readers at the top of the page, e.g. "Contact".',
        }),
        heading: fields.text({
          label: 'Heading',
          description: 'The big headline above the form, e.g. "Trying to get in touch?". Leave empty to show the page title only to screen readers.',
          multiline: true,
        }),
        intro: fields.text({
          label: 'Intro',
          description: 'A short paragraph between the heading and the form. Leave empty to hide it.',
          multiline: true,
        }),
        formEndpoint: fields.url({
          label: 'Form endpoint',
          description:
            'The address your form posts to, from Formspree: formspree.io → your form → Integration → the URL that looks like https://formspree.io/f/abcdwxyz. It is not a password — it travels in the page like a link. Until it is set, the form shows the error message below when someone submits.',
        }),
        nameLabel: fields.text({ label: 'Name field label' }),
        emailLabel: fields.text({ label: 'Email field label' }),
        messageLabel: fields.text({ label: 'Message field label' }),
        submitLabel: fields.text({
          label: 'Send button label',
          description: 'e.g. "Send message".',
        }),
        sendingLabel: fields.text({
          label: 'Send button label while sending',
          description: 'Shown on the button between pressing it and the message going through, e.g. "Sending…".',
        }),
        successMessage: fields.text({
          label: 'Success message',
          description: 'Replaces the form once a message is sent, e.g. "Thanks — I\'ll get back to you soon."',
          multiline: true,
        }),
        errorMessage: fields.text({
          label: 'Error message',
          description:
            'Shown under the form if sending fails, e.g. "Something went wrong. Please email me instead."',
          multiline: true,
        }),
      },
    }),

    about: singleton({
      label: 'About page',
      path: 'src/content/about/',
      format: { data: 'yaml' },
      schema: {
        heading: fields.text({
          label: 'Heading',
          description: 'The big headline at the top of the About page, e.g. "Design. Learn. Teach."',
          multiline: true,
        }),
        subtitle: fields.text({
          label: 'Subtitle',
          description:
            'The grey line under the headline — one sentence on what you do. Leave empty to hide it.',
          multiline: true,
        }),
        portrait: contentImage({
          area: 'about',
          label: 'Portrait',
          description: 'The wide photo at the top of the left column on the About page.',
        }),
        gallery: fields.array(
          contentImage({ area: 'about', label: 'Photo' }),
          {
            label: 'More photos',
            description:
              'Square photos shown two per row under the portrait, e.g. talks or events. Any shape is cropped to a square from the centre. Leave empty to hide them.',
            itemLabel: (props) => props.fields.alt.value || 'Photo',
          }
        ),
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
            'The image at the left of the floating nav on every page; clicking it goes to the home page. Shown about 48px tall, so a cut-out avatar or memoji (transparent PNG/WebP) works best. Alt text names the link, e.g. "Styven Bedoya, home". Without an image, "Your name" shows as text instead.',
        }),
        logoHoverFrames: fields.array(
          contentImage({
            area: 'site',
            label: 'Expression',
            description: 'Alt text can stay empty — the nav logo’s alt names the link.',
          }),
          {
            label: 'Nav logo — hover expressions',
            description:
              'While someone hovers the nav logo, it flips through these images in order, then back to the main logo, and repeats. Use the same avatar with different expressions, exported on the same canvas size and position as the main logo so the head doesn’t jump between frames. Leave empty for no hover effect.',
            itemLabel: (props) => props.fields.alt.value || 'Expression',
          }
        ),
        logoTooltip: fields.text({
          label: 'Nav logo — speech bubble',
          description:
            'Short line in a bubble that pops out under the avatar when someone hovers it, e.g. "Go back to home". Desktop only. Leave empty for no bubble.',
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
                'Shown in the home page hero under your bio, at about 24px. A single-colour SVG is tinted to match the text; a PNG or WebP keeps its own colours, so cut it out on a transparent background. Alt text can stay empty — the label above names the link. Without an icon, the label shows as text.',
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
        playLabel: fields.text({
          label: 'Play button label',
          description:
            'Read out by screen readers for the play button on case-study videos, e.g. "Play video".',
        }),
        pauseLabel: fields.text({
          label: 'Pause button label',
          description: 'The same button while the video is playing, e.g. "Pause video".',
        }),
        soundOnLabel: fields.text({
          label: 'Sound on button label',
          description:
            'Read out by screen readers for the speaker button on case-study videos that have "Muted" unticked, e.g. "Turn sound on".',
        }),
        soundOffLabel: fields.text({
          label: 'Sound off button label',
          description: 'The same button once the sound is playing, e.g. "Turn sound off".',
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
        favicon: contentImage({
          area: 'seo',
          label: 'Favicon',
          description:
            'The little icon in the browser tab and on phone home screens. A square PNG with a transparent background, at least 512×512px. Alt text isn’t used.',
        }),
      },
    }),
  },
})
