import ReactMarkdown from 'react-markdown'

/**
 * Renders the markdown string produced by Keystatic's inline rich text fields.
 * The editor is restricted to bold/italic/links/lists/headings, so a full MDX
 * pipeline would be dead weight here.
 */
export function Prose({
  children,
  className = '',
}: {
  children: string | null | undefined
  className?: string
}) {
  if (!children?.trim()) return null

  return (
    <div
      className={`text-lead text-(--color-ink-muted) [&_a]:text-(--color-ink) [&_a]:underline [&_a]:underline-offset-4 [&_li]:mb-2 [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-6 [&_strong]:text-(--color-ink) [&_strong]:font-medium [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-5 [&>*:last-child]:mb-0 ${className}`}
    >
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  )
}
