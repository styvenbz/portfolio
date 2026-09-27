import { ContentImage } from '@/components/media/ContentImage'
import { HeroDescription } from '@/components/home/HeroDescription'
import { HeroJumpLink } from '@/components/home/HeroJumpLink'
import { RotatingText } from '@/components/motion/RotatingText'
import { hasImage } from '@/lib/media'
import type { getHome, getSiteSettings } from '@/lib/content'

type Home = NonNullable<Awaited<ReturnType<typeof getHome>>>
type SocialLink = NonNullable<Awaited<ReturnType<typeof getSiteSettings>>>['socialLinks'][number]

/** Inline stagger for the CSS `enter-up` entrance, in ms. */
const delay = (ms: number) => ({ animationDelay: `${ms}ms` })

/**
 * Home intro: greeting, rotating phrases and highlights on the left; portrait,
 * bio and social icons on the right. Stacks into one column below `lg`.
 *
 * The entrance stagger follows the reference: left text first, portrait and
 * bio shortly after, highlights at half a second, socials last.
 */
export function HomeHero({
  home,
  socialLinks,
  externalLinkLabel,
}: {
  home: Home
  socialLinks: readonly SocialLink[]
  externalLinkLabel: string
}) {
  const phrases = home.rotatingPhrases.filter((phrase): phrase is string => Boolean(phrase))
  const socials = socialLinks.filter((link) => link.href)

  return (
    <section className="px-(--spacing-gutter) pt-[calc(var(--header-height)+0.5rem)]">
      <div className="mx-auto grid w-full max-w-[92rem] lg:grid-cols-3">
        {/* Left */}
        <div className="flex flex-col py-8 lg:col-span-2 lg:border-r lg:border-(--color-line) lg:pt-12 lg:pr-12 lg:pb-16">
          <div className="enter-up flex-1">
            {home.greeting ? <h1 className="text-hero text-balance">{home.greeting}</h1> : null}
            <RotatingText
              phrases={phrases}
              interval={home.phraseInterval ?? 2}
              className="text-hero text-(--color-ink-muted) font-medium"
            />
          </div>

          {home.heroSummary || home.heroDescription ? (
            <div className="enter-up" style={delay(350)}>
              <HeroDescription
                summary={home.heroSummary}
                full={home.heroDescription}
                toggleLabel={home.heroSummaryToggleLabel}
              />
            </div>
          ) : null}

          {home.highlights.length ? (
            <dl
              className="enter-up text-intro mt-14 grid gap-x-8 gap-y-6 sm:grid-cols-2"
              style={delay(500)}
            >
              {home.highlights.map((item, index) => (
                <div key={index} className="enter-up" style={delay(index * 500)}>
                  <dt className="font-medium">{item.label}</dt>
                  <dd className="text-(--color-ink-muted)">{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        {/* Right */}
        <div className="text-intro flex flex-col gap-6 border-t border-(--color-line) py-8 lg:border-t-0 lg:pt-12 lg:pb-16 lg:pl-12">
          {hasImage(home.portrait) ? (
            <div
              className="enter-up aspect-square w-50 max-w-full overflow-hidden rounded-2xl bg-(--color-bg-subtle)"
              style={delay(200)}
            >
              <ContentImage
                value={home.portrait}
                sizes="200px"
                priority
                className="size-full object-cover"
              />
            </div>
          ) : null}

          <div>
            {home.experienceHeading || home.experience.length ? (
              <div className="enter-up" style={delay(230)}>
                {home.experienceHeading ? (
                  <h2 className="text-intro font-medium">{home.experienceHeading}</h2>
                ) : null}

                {home.experience.length ? (
                  <ol className="mt-4 flex flex-col gap-5">
                    {home.experience.map((item, index) => (
                      <li key={index} className="border-l-2 border-(--color-ink) pl-4">
                        {/* Wraps to two lines in the narrow column rather than
                            squeezing the role against the period. */}
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                          <h3 className="text-base font-medium">{item.role}</h3>
                          {item.period ? (
                            <span className="text-(--color-ink-faint) text-sm">{item.period}</span>
                          ) : null}
                        </div>
                        <div className="text-(--color-ink-muted) mt-1.5 flex items-center gap-2 text-sm">
                          {hasImage(item.logo) ? (
                            <ContentImage
                              value={item.logo}
                              sizes="70px"
                              /* 70px wide, height capped so a tall logo can't
                                 tower over the role above it. */
                              className="h-7 w-[70px] object-contain object-left"
                            />
                          ) : null}
                          {item.company ? <span>{item.company}</span> : null}
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : null}
              </div>
            ) : null}

            {socials.length ? (
              <ul className="-ml-3 mt-5 flex flex-wrap gap-1">
                {socials.map((link, index) => (
                  <li key={link.href} className="enter-up" style={delay(700 + index * 100)}>
                    <SocialIcon link={link} externalLinkLabel={externalLinkLabel} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>

      {home.heroCtaLabel && home.heroCtaHref ? (
        <HeroJumpLink label={home.heroCtaLabel} href={home.heroCtaHref} />
      ) : null}
    </section>
  )
}

function SocialIcon({
  link,
  externalLinkLabel,
}: {
  link: SocialLink
  externalLinkLabel: string
}) {
  const name = [link.label, externalLinkLabel].filter(Boolean).join(' ')

  if (!hasImage(link.icon)) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={name}
        className="inline-flex h-12 items-center rounded-full px-3 text-base font-medium transition-colors duration-300 hover:bg-(--color-ink)/10"
      >
        {link.label}
      </a>
    )
  }

  /* A mask takes its shape from the file's transparency, which only works for
     a single-colour SVG cut-out. Anything else (a PNG logo, say) is drawn as a
     normal image and keeps its own colours. */
  const mask = `url(${link.icon.src}) center / contain no-repeat`
  const tintable = link.icon.src.toLowerCase().endsWith('.svg')

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      className="grid size-12 place-items-center rounded-full transition-colors duration-300 hover:bg-(--color-ink)/10"
    >
      {tintable ? (
        <span aria-hidden className="size-6 bg-current" style={{ mask, WebkitMask: mask }} />
      ) : (
        <ContentImage
          value={{ ...link.icon, alt: '' }}
          sizes="24px"
          className="size-6 object-contain"
        />
      )}
    </a>
  )
}
