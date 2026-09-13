import Link from 'next/link'
import { CloudinaryImage } from '@/components/media/CloudinaryImage'
import { Reveal } from '@/components/motion/Reveal'
import type { CaseStudy } from '@/lib/content'

function LockBadge() {
  return (
    <span className="bg-(--color-ink) text-(--color-bg) absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[0.65rem] tracking-widest uppercase">
      <svg width="9" height="11" viewBox="0 0 9 11" fill="none" aria-hidden>
        <path
          d="M1 4.5V3a3.5 3.5 0 1 1 7 0v1.5"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
        <rect x="0.5" y="4.5" width="8" height="6" rx="1" fill="currentColor" />
      </svg>
      Protected
    </span>
  )
}

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
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <h3 className="text-xl tracking-tight">{study.title}</h3>
              <span className="text-(--color-ink-faint) font-mono text-xs">{study.year}</span>
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
