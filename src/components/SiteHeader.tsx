import Link from 'next/link'
import { HeaderShell } from '@/components/HeaderShell'
import { SiteNavLink } from '@/components/SiteNavLink'
import { ContentImage } from '@/components/media/ContentImage'
import { hasImage } from '@/lib/media'
import { getSiteSettings } from '@/lib/content'

/* Shared by the plain links and the button so they line up on one baseline. */
const item =
  'block rounded-lg p-[0.7em] text-sm leading-none transition-colors duration-200 ease-(--ease-out-quart) sm:p-[0.8em] sm:text-base'

export async function SiteHeader() {
  const settings = await getSiteSettings()
  const logo = settings?.logo
  const logoHover = settings?.logoHover
  const cta = settings?.navCta
  const links = settings?.navLinks.filter((link) => link.href && link.label) ?? []
  const homeLabel = logo?.alt || settings?.name || ''

  return (
    <HeaderShell motion={settings?.motionIntensity ?? 'full'}>
      <div className="border-(--color-line) bg-(--color-bg)/60 flex items-center rounded-3xl border py-3 pr-3 pl-2.5 shadow-[0_8px_24px_-12px_oklch(0.18_0.01_100/0.18)] backdrop-blur-[20px] sm:py-4 sm:pr-4 sm:pl-3">
        {hasImage(logo) ? (
          <Link
            href="/"
            aria-label={homeLabel}
            /* The avatar is taller than the links and deliberately overflows
               the pill, like a sticker; the negative margins keep it from
               stretching the pill's height. */
            className="group relative -mt-2 -mb-4 mr-1 h-14 w-[50px] shrink-0 rounded-lg sm:-mb-[18px] sm:h-16 sm:w-[58px]"
          >
            <ContentImage
              value={{ ...logo, alt: '' }}
              sizes="58px"
              priority
              className={`size-full object-contain ${
                hasImage(logoHover) ? 'transition-opacity group-hover:opacity-0' : ''
              }`}
            />
            {hasImage(logoHover) ? (
              <ContentImage
                value={{ ...logoHover, alt: '' }}
                sizes="58px"
                className="absolute inset-0 size-full object-contain opacity-0 group-hover:opacity-100"
              />
            ) : null}
          </Link>
        ) : (
          <Link href="/" className={`${item} font-medium tracking-tight`}>
            {settings?.name}
          </Link>
        )}

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
    </HeaderShell>
  )
}
