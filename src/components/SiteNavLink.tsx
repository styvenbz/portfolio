'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/** Nav link that marks itself current for assistive tech. */
export function SiteNavLink({
  href,
  label,
  className,
}: {
  href: string
  label: string
  className?: string
}) {
  const pathname = usePathname()
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <Link href={href} aria-current={isActive ? 'page' : undefined} className={className}>
      {label}
    </Link>
  )
}
