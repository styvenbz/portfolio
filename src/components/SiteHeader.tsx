import Link from 'next/link'
import { getSiteSettings } from '@/lib/content'

export async function SiteHeader() {
  const settings = await getSiteSettings()

  return (
    <header className="px-(--spacing-gutter) fixed top-0 right-0 left-0 z-50 py-6 mix-blend-difference">
      <nav className="flex items-baseline justify-between gap-6 text-sm text-white">
        <Link href="/" className="font-medium tracking-tight">
          {settings?.name}
        </Link>
        <ul className="flex items-center gap-6">
          {settings?.navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href ?? '/'} className="hover:opacity-60 transition-opacity">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
