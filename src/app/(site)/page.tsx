import { WorkGrid } from '@/components/WorkGrid'
import { GalleryWheel } from '@/components/home/GalleryWheel'
import { GalleryWord } from '@/components/home/GalleryWord'
import { HomeHero } from '@/components/home/HomeHero'
import { hasImage } from '@/lib/media'
import { getFeaturedCaseStudies, getHome, getSiteSettings } from '@/lib/content'

export default async function HomePage() {
  const [home, studies, settings] = await Promise.all([
    getHome(),
    getFeaturedCaseStudies(),
    getSiteSettings(),
  ])

  const externalLinkLabel = settings?.externalLinkLabel ?? ''
  const galleryPhotos = (home?.galleryImages ?? []).filter(hasImage)

  return (
    <main>
      {home ? (
        <HomeHero
          home={home}
          socialLinks={settings?.socialLinks ?? []}
          externalLinkLabel={externalLinkLabel}
        />
      ) : null}

      {/* scroll-mt keeps the first row clear of the floating nav when the
          hero button jumps here. */}
      <section
        id="work"
        className="px-(--spacing-gutter) scroll-mt-[calc(var(--header-height)+1rem)] pt-4"
      >
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

      {/* The wheel needs a few photos to read as a loop. */}
      {home && galleryPhotos.length >= 3 ? (
        <section
          className="relative mt-24 overflow-hidden pt-16 pb-20 md:mt-32 md:pt-[12vw]"
        >
          {home.galleryWord ? (
            <>
              <GalleryWord word={home.galleryWord} />
              {/* A plain title on phones, where the giant word is hidden. */}
              <h2 className="text-case-heading mb-6 px-(--spacing-gutter) text-center font-medium md:sr-only">
                {home.galleryWord}
              </h2>
            </>
          ) : null}
          <GalleryWheel
            photos={galleryPhotos}
            labels={{
              prev: home.galleryPrevLabel,
              next: home.galleryNextLabel,
              cursor: home.galleryCursorLabel,
            }}
          />
        </section>
      ) : null}
    </main>
  )
}
