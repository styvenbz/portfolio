import Link from 'next/link'
import { CloudinaryMedia } from '@/components/media/CloudinaryMedia'
import { Prose } from '@/components/Prose'
import { WorkGrid } from '@/components/WorkGrid'
import { Reveal } from '@/components/motion/Reveal'
import { SplitHeading } from '@/components/motion/SplitHeading'
import { Marquee } from '@/components/motion/Marquee'
import { getFeaturedCaseStudies, getHome } from '@/lib/content'

export default async function HomePage() {
  const [home, studies] = await Promise.all([
    getHome(),
    getFeaturedCaseStudies(),
  ])

  return (
    <main>
      {/* Hero */}
      <section className="px-(--spacing-gutter) pt-40 pb-(--spacing-section)">
        <div className="mx-auto w-full max-w-[92rem]">
          <SplitHeading className="text-display max-w-[18ch] text-balance">
            {home?.heroHeadline}
          </SplitHeading>
          {home?.heroSubline ? (
            <Reveal delay={0.35}>
              <p className="text-lead text-(--color-ink-muted) mt-8 max-w-[46ch]">
                {home.heroSubline}
              </p>
            </Reveal>
          ) : null}
        </div>

        {home?.heroMedia ? (
          <div className="mx-auto mt-20 w-full max-w-[92rem]">
            <CloudinaryMedia media={home.heroMedia} priority className="h-auto w-full" />
          </div>
        ) : null}
      </section>

      {/* Intro */}
      {home?.introHeading || home?.introBody ? (
        <section className="px-(--spacing-gutter) pb-(--spacing-section)">
          <div className="mx-auto grid w-full max-w-[92rem] gap-10 md:grid-cols-12">
            {home?.introHeading ? (
              <Reveal className="md:col-span-5">
                <h2 className="text-title text-balance">{home.introHeading}</h2>
              </Reveal>
            ) : null}
            <Reveal delay={0.1} className="md:col-span-6 md:col-start-7">
              <Prose>{home?.introBody}</Prose>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Marquee */}
      {home?.marqueeItems.length ? (
        <section className="pb-(--spacing-section)">
          <Marquee items={home.marqueeItems.filter((item): item is string => Boolean(item))} />
        </section>
      ) : null}

      {/* Work */}
      <section id="work" className="px-(--spacing-gutter) pb-(--spacing-section)">
        <div className="mx-auto w-full max-w-[92rem]">
          {home?.workHeading ? (
            <h2 className="text-(--color-ink-faint) border-(--color-line) mb-12 border-t pt-6 label">
              {home.workHeading}
            </h2>
          ) : null}
          <WorkGrid studies={studies} />
        </div>
      </section>

      {/* Closing CTA */}
      {home?.ctaHeading ? (
        <section className="px-(--spacing-gutter) pb-(--spacing-section)">
          <div className="mx-auto w-full max-w-[92rem]">
            <Reveal>
              <h2 className="text-display max-w-[16ch] text-balance">{home.ctaHeading}</h2>
            </Reveal>
            {home.ctaLabel && home.ctaHref ? (
              <Link
                href={home.ctaHref}
                className="border-(--color-ink) mt-10 inline-block border-b pb-1 text-lg hover:opacity-60 transition-opacity"
              >
                {home.ctaLabel}
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}
    </main>
  )
}
