import { getSiteSettings } from '@/lib/content'

export async function SiteFooter() {
  const settings = await getSiteSettings()

  return (
    <footer className="px-(--spacing-gutter) border-(--color-line) mt-(--spacing-section) border-t py-16">
      <div className="mx-auto flex w-full max-w-[92rem] flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-md">
          {settings?.email ? (
            <a
              href={`mailto:${settings.email}`}
              className="text-title inline-block text-balance hover:opacity-60 transition-opacity"
            >
              {settings.email}
            </a>
          ) : null}
          {settings?.footerText ? (
            <p className="text-(--color-ink-faint) mt-6 text-sm">{settings.footerText}</p>
          ) : null}
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {settings?.socialLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href ?? '#'}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:opacity-60 transition-opacity"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
