'use client'

import { useId, useState } from 'react'

/** Splits CMS text into paragraphs and runs of bullets ("*" or "-" lines). */
function blocks(text: string) {
  const out: { type: 'p' | 'ul'; lines: string[] }[] = []

  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (!line) continue

    const bullet = /^[*-]\s+/.test(line)
    const last = out[out.length - 1]
    const type = bullet ? 'ul' : 'p'

    if (last?.type === type && bullet) last.lines.push(line.replace(/^[*-]\s+/, ''))
    else out.push({ type, lines: [bullet ? line.replace(/^[*-]\s+/, '') : line] })
  }

  return out
}

/**
 * The hero blurb in two lengths: a skimmable summary by default, with a toggle
 * to the full text. The toggle only appears when both versions exist, so the
 * blurb still renders if an editor fills in just one.
 */
export function HeroDescription({
  summary,
  full,
  toggleLabel,
}: {
  summary: string
  full: string
  toggleLabel: string
}) {
  const [short, setShort] = useState(true)
  const id = useId()

  const canToggle = Boolean(summary && full && toggleLabel)
  const text = canToggle ? (short ? summary : full) : summary || full

  return (
    <div className="mt-10">
      {canToggle ? (
        <button
          type="button"
          role="switch"
          aria-checked={short}
          aria-controls={id}
          onClick={() => setShort((current) => !current)}
          className="text-(--color-ink) mb-5 inline-flex items-center gap-3 rounded-full text-sm leading-none tracking-[0.02em] uppercase transition-opacity duration-200 hover:opacity-70"
        >
          {toggleLabel}
          {/* The track and its knob: the switch itself, not just a pressed pill. */}
          <span
            aria-hidden
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ease-(--ease-out-quart) ${
              short ? 'bg-(--color-ink)' : 'bg-(--color-ink)/20'
            }`}
          >
            <span
              className={`bg-(--color-bg) absolute top-0.5 left-0.5 size-5 rounded-full shadow-sm transition-transform duration-200 ease-(--ease-out-quart) ${
                short ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </span>
        </button>
      ) : null}

      <div id={id} className="text-intro text-(--color-ink-muted) flex max-w-[52ch] flex-col gap-4">
        {blocks(text).map((block, index) =>
          block.type === 'ul' ? (
            <ul key={index} className="flex list-disc flex-col gap-2 pl-5">
              {block.lines.map((line, lineIndex) => (
                <li key={lineIndex}>{line}</li>
              ))}
            </ul>
          ) : (
            <p key={index}>{block.lines[0]}</p>
          )
        )}
      </div>
    </div>
  )
}
