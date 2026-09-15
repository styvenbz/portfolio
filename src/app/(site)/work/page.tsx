import type { Metadata } from 'next'
import { WorkGrid } from '@/components/WorkGrid'
import { getCaseStudies, getHome, getSiteSettings } from '@/lib/content'

export const metadata: Metadata = { title: 'Work' }

export default async function WorkPage() {
  const [studies, home, settings] = await Promise.all([
    getCaseStudies(),
    getHome(),
    getSiteSettings(),
  ])

  return (
    <main className="px-(--spacing-gutter) pt-40">
      <div className="mx-auto w-full max-w-[92rem]">
        <h1 className="text-display max-w-[14ch] text-balance">
          {home?.workHeading}
        </h1>
        <div className="mt-(--spacing-section)">
          <WorkGrid
            studies={studies}
            externalLinkLabel={settings?.externalLinkLabel ?? ''}
            protectedLabel={settings?.protectedLabel ?? ''}
          />
        </div>
      </div>
    </main>
  )
}
