import { fields } from '@keystatic/core'
import { contentImage, contentMedia } from './fields/media'

/**
 * The case study "Lego set".
 *
 * A case study body is an ordered list of sections. Each one is a full-width
 * band with its own light or dark background. Adding a new kind of section to
 * the site means adding it here FIRST — never hardcoding a section into a
 * React component.
 */

const theme = () =>
  fields.select({
    label: 'Background',
    description:
      'Light or dark band behind this section. Alternating them gives the page rhythm; a dark band is good for spotlighting visuals.',
    options: [
      { label: 'Light', value: 'light' },
      { label: 'Dark', value: 'dark' },
    ],
    defaultValue: 'light',
  })

/** The two-tone heading plus intro paragraph most sections open with. */
const heading = () => ({
  title: fields.text({
    label: 'Title',
    description: 'First line of the section heading, in full colour, e.g. "User research".',
  }),
  titleMuted: fields.text({
    label: 'Title — second line',
    description: 'Optional continuation shown in grey on its own line, e.g. "process & plan".',
  }),
  body: fields.text({
    label: 'Intro text',
    description: 'Optional paragraph introducing the section.',
    multiline: true,
  }),
})

const sectionLabel = (fallback: string) =>
  (props: { fields: { title: { value: string } } }) =>
    props.fields.title.value ? `${fallback}: ${props.fields.title.value}` : fallback

export const caseStudySections = fields.blocks(
  {
    list: {
      label: 'Numbered list',
      itemLabel: sectionLabel('Numbered list'),
      schema: fields.object({
        theme: theme(),
        ...heading(),
        items: fields.array(
          fields.object({
            marker: fields.text({
              label: 'Marker',
              description:
                'The big figure at the left of the item, e.g. "67%" for a research stat. Leave empty to number automatically (01, 02, 03…).',
            }),
            heading: fields.text({ label: 'Heading' }),
            body: fields.text({ label: 'Text', multiline: true }),
          }),
          {
            label: 'Items',
            description: 'Shown to the right of the heading, one under another.',
            itemLabel: (props) => props.fields.heading.value || 'Item',
          }
        ),
      }),
    },

    statement: {
      label: 'Statement',
      itemLabel: (props) => props.fields.label.value || 'Statement',
      schema: fields.object({
        theme: theme(),
        label: fields.text({
          label: 'Label',
          description: 'Small heading above the statement, e.g. "Problem statement".',
        }),
        statement: fields.text({
          label: 'Statement',
          description: 'One or two big sentences — the idea the reader should remember.',
          multiline: true,
        }),
      }),
    },

    textMedia: {
      label: 'Text + media',
      itemLabel: sectionLabel('Text + media'),
      schema: fields.object({
        theme: theme(),
        ...heading(),
        media: contentMedia({ area: 'case-studies', label: 'Media' }),
        width: fields.select({
          label: 'Media width',
          description:
            'Contained lines up with the text; full bleed runs edge to edge of the screen. Images can be clicked to zoom either way.',
          options: [
            { label: 'Contained', value: 'contained' },
            { label: 'Full bleed', value: 'full' },
          ],
          defaultValue: 'contained',
        }),
      }),
    },

    imageGrid: {
      label: 'Image grid',
      itemLabel: sectionLabel('Image grid'),
      schema: fields.object({
        theme: theme(),
        ...heading(),
        columns: fields.select({
          label: 'Columns',
          options: [
            { label: 'Two', value: '2' },
            { label: 'Three', value: '3' },
          ],
          defaultValue: '2',
        }),
        wideLast: fields.checkbox({
          label: 'Make the last image full width',
          description: 'Handy for an odd number of images, e.g. two side by side and one wide underneath.',
          defaultValue: false,
        }),
        images: fields.array(contentImage({ area: 'case-studies', label: 'Image' }), {
          label: 'Images',
          itemLabel: (props) => props.fields.alt.value || 'Image',
        }),
      }),
    },

    beforeAfter: {
      label: 'Before / after',
      itemLabel: sectionLabel('Before / after'),
      schema: fields.object({
        theme: theme(),
        ...heading(),
        beforeLabel: fields.text({
          label: '"Before" label',
          description: 'Shown in red under every left-hand image.',
          defaultValue: 'Before',
        }),
        afterLabel: fields.text({
          label: '"After" label',
          description: 'Shown in green under every right-hand image.',
          defaultValue: 'After',
        }),
        pairs: fields.array(
          fields.object({
            before: contentImage({ area: 'case-studies', label: 'Before image' }),
            beforeCaption: fields.text({
              label: 'Before — what was wrong',
              multiline: true,
            }),
            after: contentImage({ area: 'case-studies', label: 'After image' }),
            afterCaption: fields.text({
              label: 'After — what changed',
              multiline: true,
            }),
          }),
          {
            label: 'Comparisons',
            description: 'Each comparison is one row: before on the left, after on the right.',
            itemLabel: (props) => props.fields.afterCaption.value?.slice(0, 50) || 'Comparison',
          }
        ),
      }),
    },

    showcase: {
      label: 'Showcase',
      itemLabel: sectionLabel('Showcase'),
      schema: fields.object({
        theme: theme(),
        ...heading(),
        background: contentImage({
          area: 'case-studies',
          label: 'Backdrop image',
          description:
            'Full-width image behind the media, like a desktop wallpaper behind a screen recording. Alt text can stay empty — it is decorative.',
        }),
        media: contentMedia({ area: 'case-studies', label: 'Media' }),
      }),
    },
  },
  {
    label: 'Sections',
    description:
      'Build the case study from full-width sections, top to bottom. Drag to reorder.',
  }
)
