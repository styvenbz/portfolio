import type { Metadata } from 'next'
import { CloudinaryImage } from '@/components/media/CloudinaryImage'
import { Prose } from '@/components/Prose'
import { getAbout } from '@/lib/content'

export const metadata: Metadata = { title: 'About' }

export default async function AboutPage() {
  const about = await getAbout()

  return (
    <main className="px-(--spacing-gutter) pt-40">
      <div className="mx-auto w-full max-w-[92rem]">
        <h1 className="text-display max-w-[16ch] text-balance">{about?.heading}</h1>

        <div className="mt-(--spacing-section) grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <CloudinaryImage
              value={about?.portrait}
              sizes="(max-width: 768px) 100vw, 40vw"
              className="h-auto w-full"
            />
            {about?.cvFile ? (
              <a
                href={about.cvFile}
                className="border-(--color-ink) mt-8 inline-block border-b pb-1 hover:opacity-60 transition-opacity"
              >
                {about.cvLabel}
              </a>
            ) : null}
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <Prose>{about?.bio}</Prose>

            {about?.experience.length ? (
              <section className="mt-20">
                <h2 className="text-(--color-ink-faint) border-(--color-line) border-t pt-6 font-mono text-xs tracking-[0.2em] uppercase">
                  Experience
                </h2>
                <ul className="mt-8 flex flex-col gap-10">
                  {about.experience.map((item, index) => (
                    <li key={index}>
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="text-lg tracking-tight">{item.company}</h3>
                        <span className="text-(--color-ink-faint) font-mono text-xs">
                          {item.period}
                        </span>
                      </div>
                      <p className="text-(--color-ink-muted) mt-1 text-sm">{item.role}</p>
                      {item.description ? (
                        <p className="text-(--color-ink-muted) mt-3 max-w-prose text-sm">
                          {item.description}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {about?.skills.length ? (
              <section className="mt-20">
                <h2 className="text-(--color-ink-faint) border-(--color-line) border-t pt-6 font-mono text-xs tracking-[0.2em] uppercase">
                  Skills
                </h2>
                <ul className="mt-8 flex flex-wrap gap-x-3 gap-y-2 text-sm">
                  {about.skills.map((skill, index) => (
                    <li
                      key={index}
                      className="border-(--color-line) rounded-full border px-3 py-1"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  )
}
