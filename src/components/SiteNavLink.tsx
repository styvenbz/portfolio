'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/** Nav link that marks itself current, for both sighted and assistive users. */
export function SiteNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`transition-opacity hover:opacity-60 ${
        isActive ? 'opacity-100' : 'opacity-60'
      }`}
    >
      {label}
    </Link>
  )
}
