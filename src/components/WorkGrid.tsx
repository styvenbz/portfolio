import Link from 'next/link'
import { CloudinaryImage } from '@/components/media/CloudinaryImage'
import { LockBadge } from '@/components/LockBadge'
import { Reveal } from '@/components/motion/Reveal'
import type { CaseStudy } from '@/lib/content'

export function WorkGrid({ studies }: { studies: CaseStudy[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2">
      {studies.map((study, index) => (
        <li key={study.slug}>
          <Reveal delay={(index % 2) * 0.08}>
          <Link href={`/work/${study.slug}`} className="group block">
            <div className="relative overflow-hidden">
              {study.access === 'protected' ? <LockBadge /> : null}
              <CloudinaryImage
                value={study.thumbnail}
                sizes="(max-width: 640px) 100vw, 50vw"
                className="h-auto w-full transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-[1.03]"
              />
            </div>
            <div
              aria-hidden
              className="mt-5 h-px w-full origin-left scale-x-0 bg-(--color-accent) transition-transform duration-500 ease-(--ease-out-expo) group-hover:scale-x-100"
              style={
                study.accentColor
                  ? ({ '--color-accent': study.accentColor } as React.CSSProperties)
                  : undefined
              }
            />
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <h3 className="text-xl tracking-tight">{study.title}</h3>
              <span className="text-(--color-ink-faint) text-xs">{study.year}</span>
            </div>
            {study.summary ? (
              <p className="text-(--color-ink-muted) mt-2 max-w-prose text-sm">
                {study.summary}
              </p>
            ) : null}
          </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}
