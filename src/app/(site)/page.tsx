import { WorkGrid } from '@/components/WorkGrid'
import { HomeHero } from '@/components/home/HomeHero'
import { getFeaturedCaseStudies, getHome, getSiteSettings } from '@/lib/content'

export default async function HomePage() {
  const [home, studies, settings] = await Promise.all([
    getHome(),
    getFeaturedCaseStudies(),
    getSiteSettings(),
  ])

  const externalLinkLabel = settings?.externalLinkLabel ?? ''

  return (
    <main>
      {home ? (
        <HomeHero
          home={home}
          socialLinks={settings?.socialLinks ?? []}
          externalLinkLabel={externalLinkLabel}
        />
      ) : null}

      <section id="work" className="px-(--spacing-gutter) pt-4">
        <div className="mx-auto w-full max-w-[92rem]">
          {home?.workHeading ? <h2 className="sr-only">{home.workHeading}</h2> : null}
          <WorkGrid
            studies={studies}
            externalLinkLabel={externalLinkLabel}
            protectedLabel={settings?.protectedLabel ?? ''}
            enterOnLoad={3}
          />
        </div>
      </section>
    </main>
  )
}
