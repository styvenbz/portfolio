'use client'

import { useEffect, useState } from 'react'

/**
 * Sticky section nav with scroll-spy for long case studies.
 *
 * Renders as plain anchor links, so it still works with JS disabled — the
 * highlight is the only part that needs scripting. Lenis is configured with
 * `anchors: true`, so clicks scroll smoothly through the same loop as
 * everything else rather than jumping natively.
 */
export function CaseStudyNav({
  sections,
}: {
  sections: { id: string; text: string }[]
}) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const headings = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element))

    if (headings.length === 0) return

    /* The band sits in the upper third of the viewport: a heading becomes
       "current" once it reaches reading position, not when it first appears. */
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    )

    headings.forEach((heading) => observer.observe(heading))
    return () => observer.disconnect()
  }, [sections])

  return (
    <nav
      aria-label="Sections"
      className="bg-(--color-bg)/95 border-(--color-line) sticky top-(--header-height) z-40 border-b backdrop-blur-sm"
    >
      <ol className="px-(--spacing-gutter) mx-auto flex w-full max-w-[92rem] gap-x-6 gap-y-1 overflow-x-auto py-4 font-mono text-xs whitespace-nowrap">
        {sections.map((section) => {
          const isActive = section.id === activeId
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? 'true' : undefined}
                className={`transition-colors ${
                  isActive
                    ? 'text-(--color-accent)'
                    : 'text-(--color-ink-faint) hover:text-(--color-ink)'
                }`}
              >
                {section.text}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
