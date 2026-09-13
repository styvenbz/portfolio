import Link from 'next/link'
import { getSiteSettings } from '@/lib/content'

export default async function NotFound() {
  const settings = await getSiteSettings()

  return (
    <main className="px-(--spacing-gutter) flex min-h-screen items-center">
      <div className="mx-auto w-full max-w-[92rem]">
        <p className="text-(--color-ink-faint) mb-6 font-mono text-xs tracking-[0.2em] uppercase">
          404
        </p>
        <h1 className="text-display max-w-[14ch] text-balance">
          {settings?.notFoundHeading}
        </h1>
        {settings?.notFoundBody ? (
          <p className="text-lead text-(--color-ink-muted) mt-8 max-w-[40ch]">
            {settings.notFoundBody}
          </p>
        ) : null}
        <Link
          href="/work"
          className="border-(--color-ink) mt-10 inline-block border-b pb-1 text-lg hover:opacity-60 transition-opacity"
        >
          {settings?.notFoundLinkLabel}
        </Link>
      </div>
    </main>
  )
}
