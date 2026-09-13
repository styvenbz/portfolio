/** Stable anchor id for a section heading, used by the in-page navigation. */
export function headingId(text: string | null | undefined, index: number) {
  const slug = (text ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return slug ? `${slug}-${index}` : `section-${index}`
}
