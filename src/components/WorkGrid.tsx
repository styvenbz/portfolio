import { ProjectCard } from '@/components/ProjectCard'
import { Reveal } from '@/components/motion/Reveal'
import type { CaseStudy } from '@/lib/content'

export function WorkGrid({
  studies,
  externalLinkLabel,
  protectedLabel,
  enterOnLoad = 0,
}: {
  studies: CaseStudy[]
  externalLinkLabel: string
  protectedLabel: string
  /** How many leading cards join the page-load entrance instead of revealing on scroll. */
  enterOnLoad?: number
}) {
  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
      {studies.map((study, index) => {
        const card = (
          <ProjectCard
            study={study}
            externalLinkLabel={externalLinkLabel}
            protectedLabel={protectedLabel}
          />
        )

        return (
          <li key={study.slug}>
            {index < enterOnLoad ? (
              <div className="enter-up" style={{ animationDelay: `${250 + index * 100}ms` }}>
                {card}
              </div>
            ) : (
              <Reveal delay={(index % 3) * 0.1}>{card}</Reveal>
            )}
          </li>
        )
      })}
    </ul>
  )
}
