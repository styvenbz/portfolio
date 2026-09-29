import { HeaderShell } from '@/components/HeaderShell'
import { NavLogo } from '@/components/NavLogo'
import { SiteNavLink } from '@/components/SiteNavLink'
import { getSiteSettings } from '@/lib/content'

/* Shared by the plain links and the button so they line up on one baseline. */
const item =
  'block rounded-lg p-[0.7em] text-sm leading-none transition-colors duration-200 ease-(--ease-out-quart) sm:p-[0.8em] sm:text-base'

export async function SiteHeader() {
  const settings = await getSiteSettings()
  const logo = settings?.logo
  const cta = settings?.navCta
  const links = settings?.navLinks.filter((link) => link.href && link.label) ?? []
  const homeLabel = logo?.alt || settings?.name || ''

  return (
    <HeaderShell motion={settings?.motionIntensity ?? 'full'}>
      <div className="glass flex items-center rounded-3xl py-3 pr-3 pl-2.5 sm:py-4 sm:pr-4 sm:pl-3">
        <NavLogo
          logo={logo}
          frames={settings?.logoHoverFrames ?? []}
          label={homeLabel}
          name={settings?.name ?? ''}
          textClassName={`${item} font-medium tracking-tight`}
        />

        <nav>
          <ul className="flex items-center">
            {links.map((link) => (
              <li key={link.href}>
                <SiteNavLink
                  href={link.href}
                  label={link.label}
                  className={`${item} uppercase tracking-[0.02em] underline-offset-4 hover:text-(--color-ink-muted) hover:underline`}
                />
              </li>
            ))}
            {cta?.label && cta.href ? (
              <li className="ml-[0.6em] sm:ml-[0.8em]">
                <SiteNavLink
                  href={cta.href}
                  label={cta.label}
                  className={`${item} bg-(--color-ink) text-(--color-bg) px-3.5 uppercase tracking-[0.02em] hover:bg-(--color-ink-muted) sm:px-4`}
                />
              </li>
            ) : null}
          </ul>
        </nav>
      </div>

      {/* The avatar's speech bubble; the link's own label already names it,
          so screen readers skip this. */}
      {logo?.src && settings?.logoTooltip ? (
        <div
          aria-hidden
          className="nav-bubble pointer-events-none absolute top-full left-3 mt-3 sm:left-4"
        >
          <span className="glass absolute -top-1.5 left-4 size-3 rotate-45 rounded-[3px] [clip-path:polygon(0_0,100%_0,0_100%)] sm:left-5" />
          <span className="glass text-(--color-ink) block rounded-2xl px-4 py-2.5 text-sm leading-none whitespace-nowrap">
            {settings.logoTooltip}
          </span>
        </div>
      ) : null}
    </HeaderShell>
  )
}
