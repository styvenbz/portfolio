import { ContentImage } from '@/components/media/ContentImage'
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
    <section className="px-(--spacing-gutter) pt-[calc(var(--header-height)+2.5rem)]">
      <div className="mx-auto grid w-full max-w-[92rem] lg:grid-cols-3">
        {/* Left */}
        <div className="flex flex-col py-12 lg:col-span-2 lg:border-r lg:border-(--color-line) lg:py-16 lg:pr-12">
          <div className="enter-up flex-1">
            {home.greeting ? <h1 className="text-hero text-balance">{home.greeting}</h1> : null}
            <RotatingText
              phrases={phrases}
              interval={home.phraseInterval ?? 2}
              className="text-hero text-(--color-ink-muted) font-medium"
            />
          </div>

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
        <div className="text-intro flex flex-col justify-end border-t border-(--color-line) py-12 lg:border-t-0 lg:py-16 lg:pl-12">
          {hasImage(home.portrait) ? (
            <div className="enter-up mb-5 size-25 overflow-hidden rounded-full" style={delay(200)}>
              <ContentImage
                value={home.portrait}
                sizes="100px"
                priority
                className="size-full object-cover"
              />
            </div>
          ) : null}

          {home.bioHeading || home.bio ? (
            <div className="enter-up" style={delay(230)}>
              {home.bioHeading ? <h2 className="text-intro font-medium">{home.bioHeading}</h2> : null}
              {home.bio ? <p className="text-(--color-ink-muted) max-w-[34ch]">{home.bio}</p> : null}
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

  const mask = `url(${link.icon.src}) center / contain no-repeat`

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      className="grid size-12 place-items-center rounded-full transition-colors duration-300 hover:bg-(--color-ink)/10"
    >
      {/* A mask rather than <img>, so the SVG takes the current text colour. */}
      <span
        aria-hidden
        className="size-6 bg-current"
        style={{ mask, WebkitMask: mask }}
      />
    </a>
  )
}
