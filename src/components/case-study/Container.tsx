/** The case study reading column: gutters on small screens, 1068px max on large. */
export function Container({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="px-(--spacing-gutter)">
      <div className={`mx-auto w-full max-w-[67rem] ${className}`}>{children}</div>
    </div>
  )
}
