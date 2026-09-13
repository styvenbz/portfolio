'use client'

import { useActionState } from 'react'
import { unlockCaseStudy, type UnlockState } from '@/app/actions'

export function PasswordGate({
  slug,
  title,
  misconfigured,
}: {
  slug: string
  title: string
  misconfigured: boolean
}) {
  const [state, formAction, pending] = useActionState<UnlockState, FormData>(
    unlockCaseStudy,
    {}
  )

  return (
    <div className="px-(--spacing-gutter) flex min-h-[70vh] items-center">
      <div className="mx-auto w-full max-w-[36rem]">
        <p className="text-(--color-ink-faint) mb-4 font-mono text-xs tracking-[0.2em] uppercase">
          Protected
        </p>
        <h1 className="text-title text-balance">{title}</h1>
        <p className="text-(--color-ink-muted) mt-6">
          This work is covered by a non-disclosure agreement. Enter the password
          to read the full case study.
        </p>

        {misconfigured ? (
          <p className="border-(--color-line) text-(--color-ink-muted) mt-8 border-l-2 pl-4 text-sm">
            This case study has no password configured yet, so it cannot be
            unlocked.
          </p>
        ) : (
          <form action={formAction} className="mt-8">
            <input type="hidden" name="slug" value={slug} />
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="off"
                autoFocus
                aria-describedby={state.error ? 'password-error' : undefined}
                aria-invalid={state.error ? true : undefined}
                className="border-(--color-line) bg-(--color-surface) flex-1 border px-4 py-3"
                placeholder="Password"
              />
              <button
                type="submit"
                disabled={pending}
                className="bg-(--color-ink) text-(--color-bg) px-6 py-3 disabled:opacity-50"
              >
                {pending ? 'Checking…' : 'View case study'}
              </button>
            </div>
            <p aria-live="polite" className="min-h-6 mt-3 text-sm">
              {state.error ? (
                <span id="password-error" className="text-(--color-ink)">
                  {state.error}
                </span>
              ) : null}
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
