import Link from 'next/link'
import { LockBadge } from '@/components/LockBadge'
import { CloudinaryImage } from '@/components/media/CloudinaryImage'
import type { CaseStudy } from '@/lib/content'

/**
 * The end of a case study is the highest-intent moment a visitor has — they
 * just read the whole thing. Sending them to the next project beats sending
 * them back to a grid, or to nothing.
 */
export function NextProject({
  study,
  label,
}: {
  study: CaseStudy
  label: string
}) {
  return (
    <section className="px-(--spacing-gutter) mt-(--spacing-section)">
      <div className="border-(--color-line) mx-auto w-full max-w-[92rem] border-t pt-10">
        <p className="text-(--color-ink-faint) label">
          {label}
        </p>

        <Link href={`/work/${study.slug}`} className="group mt-8 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="relative overflow-hidden">
              {study.access === 'protected' ? <LockBadge /> : null}
              <CloudinaryImage
                value={study.thumbnail}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="h-auto w-full transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-[1.03]"
              />
            </div>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <h2 className="text-title text-balance">{study.title}</h2>
            {study.summary ? (
              <p className="text-(--color-ink-muted) mt-4 max-w-prose">{study.summary}</p>
            ) : null}
          </div>
        </Link>
      </div>
    </section>
  )
}
