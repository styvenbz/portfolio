import Link from 'next/link'
import { HeaderShell } from '@/components/HeaderShell'
import { SiteNavLink } from '@/components/SiteNavLink'
import { getSiteSettings } from '@/lib/content'

export async function SiteHeader() {
  const settings = await getSiteSettings()

  return (
    <HeaderShell>
      {/* text-inherit so the label follows the shell: inverted over the hero,
          normal ink once the solid background kicks in. */}
      <nav className="flex w-full items-baseline justify-between gap-6 text-sm">
        <Link href="/" className="font-medium tracking-tight">
          {settings?.name}
        </Link>
        <ul className="flex items-center gap-6">
          {settings?.navLinks.map((link) => (
            <li key={link.href}>
              <SiteNavLink href={link.href ?? '/'} label={link.label ?? ''} />
            </li>
          ))}
        </ul>
      </nav>
    </HeaderShell>
  )
}
