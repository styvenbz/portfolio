import { fields } from '@keystatic/core'
import { cloudinaryImage, cloudinaryVideo } from './fields/cloudinary'

/**
 * The case study "Lego set".
 *
 * A case study body is an ordered list of these blocks. Adding a new kind of
 * section to the site means adding a block here FIRST — never hardcoding a
 * section into a React component.
 */
export const caseStudyBlocks = fields.blocks(
  {
    richText: {
      label: 'Text',
      schema: fields.mdx.inline({
        label: 'Text',
        options: {
          image: false,
          codeBlock: false,
          table: false,
          blockquote: false,
        },
      }),
    },

    sectionHeading: {
      label: 'Section heading',
      itemLabel: (props) => props.fields.text.value || 'Section heading',
      schema: fields.object({
        text: fields.text({ label: 'Heading' }),
        eyebrow: fields.text({
          label: 'Eyebrow',
          description: 'Optional small label above the heading, e.g. "02 — Research".',
        }),
        anchorInNav: fields.checkbox({
          label: 'Show in the in-page navigation',
          defaultValue: true,
        }),
      }),
    },

    imageFull: {
      label: 'Image — full bleed',
      itemLabel: (props) => props.fields.image.fields.publicId.value || 'Full-bleed image',
      schema: fields.object({
        image: cloudinaryImage({ label: 'Image' }),
        bleed: fields.select({
          label: 'Width',
          options: [
            { label: 'Content width', value: 'content' },
            { label: 'Wide', value: 'wide' },
            { label: 'Full bleed', value: 'full' },
          ],
          defaultValue: 'wide',
        }),
        background: fields.text({
          label: 'Backing color',
          description:
            'Optional CSS color painted behind the image — useful for screenshots that need breathing room.',
        }),
      }),
    },

    imageGrid: {
      label: 'Image grid',
      itemLabel: (props) => `Image grid (${props.fields.images.elements.length})`,
      schema: fields.object({
        columns: fields.select({
          label: 'Columns',
          options: [
            { label: 'Two', value: '2' },
            { label: 'Three', value: '3' },
          ],
          defaultValue: '2',
        }),
        images: fields.array(cloudinaryImage({ label: 'Image' }), {
          label: 'Images',
          itemLabel: (props) => props.fields.publicId.value || 'Image',
        }),
      }),
    },

    video: {
      label: 'Video',
      itemLabel: (props) => props.fields.video.fields.publicId.value || 'Video',
      schema: fields.object({
        video: cloudinaryVideo({ label: 'Video' }),
        bleed: fields.select({
          label: 'Width',
          options: [
            { label: 'Content width', value: 'content' },
            { label: 'Wide', value: 'wide' },
            { label: 'Full bleed', value: 'full' },
          ],
          defaultValue: 'wide',
        }),
      }),
    },

    quote: {
      label: 'Pull quote',
      itemLabel: (props) => props.fields.quote.value?.slice(0, 60) || 'Pull quote',
      schema: fields.object({
        quote: fields.text({ label: 'Quote', multiline: true }),
        attribution: fields.text({ label: 'Attribution' }),
        role: fields.text({ label: 'Role / company' }),
      }),
    },
  },
  {
    label: 'Body',
    description: 'Compose the case study from blocks. Drag to reorder.',
  }
)
