'use client'

import { useState } from 'react'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export type ContactLabels = {
  endpoint: string
  name: string
  email: string
  message: string
  submit: string
  sending: string
  success: string
  error: string
}

const field =
  'border-(--color-line) bg-(--color-surface) w-full rounded-lg border px-4 py-3 text-base'

/**
 * Contact form, posted straight to a form service (Formspree).
 *
 * The page has no backend, so the browser posts the fields as JSON and the
 * service emails them on. Without an endpoint the submit fails loudly rather
 * than silently swallowing someone's message.
 */
export function ContactForm({ labels }: { labels: ContactLabels }) {
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))

    // Bots fill every field they find; people never see this one. Formspree
    // drops anything with `_gotcha` filled too, so direct posts are caught
    // server-side as well.
    if (data._gotcha) return

    setStatus('sending')
    try {
      if (!labels.endpoint) throw new Error('No form endpoint configured')
      const response = await fetch(labels.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        /* The visitor sees the friendly message; this line is for whoever has
           to work out why (a captcha challenge, a bad endpoint, a quota). */
        console.error('Contact form rejected:', response.status, await response.text())
        throw new Error(`Form service responded ${response.status}`)
      }
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <p className="text-lead text-(--color-ink-muted) max-w-[40ch]" role="status">
        {labels.success}
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-[34rem] flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="label text-(--color-ink-faint)">
          {labels.name}
        </label>
        <input id="name" name="name" type="text" required autoComplete="name" className={field} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="label text-(--color-ink-faint)">
          {labels.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={field}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="label text-(--color-ink-faint)">
          {labels.message}
        </label>
        <textarea id="message" name="message" required rows={6} className={field} />
      </div>

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="bg-(--color-ink) text-(--color-bg) rounded-full px-6 py-3 text-sm leading-none tracking-[0.02em] uppercase transition-colors duration-200 ease-(--ease-out-quart) hover:bg-(--color-ink-muted) disabled:opacity-60"
        >
          {status === 'sending' ? labels.sending : labels.submit}
        </button>

        <p role="alert" className="text-(--color-ink-muted) text-sm">
          {status === 'error' ? labels.error : null}
        </p>
      </div>
    </form>
  )
}
