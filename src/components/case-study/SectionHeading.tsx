/**
 * Two-tone section heading with an optional intro paragraph.
 *
 * `stacked` puts the paragraph under the heading (used beside numbered lists);
 * `split` puts it in a second column (used above media).
 */
export function SectionHeading({
  title,
  titleMuted,
  body,
  layout = 'split',
}: {
  title?: string | null
  titleMuted?: string | null
  body?: string | null
  layout?: 'stacked' | 'split'
}) {
  if (!title && !titleMuted && !body) return null

  const heading =
    title || titleMuted ? (
      <h2 className="text-case-heading font-medium text-balance">
        {title}
        {titleMuted ? <span className="text-(--color-ink-muted) block">{titleMuted}</span> : null}
      </h2>
    ) : null

  const paragraph = body ? (
    <p className="text-case-body text-(--color-ink-muted) whitespace-pre-line">{body}</p>
  ) : null

  return (
    <div className={layout === 'split' ? 'grid gap-4 lg:grid-cols-2 lg:gap-8' : 'flex flex-col gap-3'}>
      {heading}
      {paragraph}
    </div>
  )
}

export const hasHeading = (value: {
  title?: string | null
  titleMuted?: string | null
  body?: string | null
}) => Boolean(value.title || value.titleMuted || value.body)
