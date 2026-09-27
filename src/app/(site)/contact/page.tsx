import type { Metadata } from 'next'
import { ContactForm } from '@/components/ContactForm'
import { getContact } from '@/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const contact = await getContact()
  return { title: contact?.title || 'Contact' }
}

export default async function ContactPage() {
  const contact = await getContact()

  return (
    <main className="px-(--spacing-gutter) pt-[calc(var(--header-height)+2.5rem)] pb-(--spacing-section)">
      <div className="mx-auto w-full max-w-[92rem]">
        {contact?.heading ? (
          <h1 className="text-display max-w-[16ch] text-balance">{contact.heading}</h1>
        ) : (
          /* No heading set: the page is just the form, so name it for screen readers. */
          <h1 className="sr-only">{contact?.title}</h1>
        )}

        {contact?.intro ? (
          <p className="text-lead text-(--color-ink-muted) mt-6 max-w-[46ch] whitespace-pre-line">
            {contact.intro}
          </p>
        ) : null}

        <div className={contact?.heading || contact?.intro ? 'mt-14' : ''}>
          <ContactForm
            labels={{
              endpoint: contact?.formEndpoint ?? '',
              name: contact?.nameLabel ?? '',
              email: contact?.emailLabel ?? '',
              message: contact?.messageLabel ?? '',
              submit: contact?.submitLabel ?? '',
              sending: contact?.sendingLabel ?? '',
              success: contact?.successMessage ?? '',
              error: contact?.errorMessage ?? '',
            }}
          />
        </div>
      </div>
    </main>
  )
}
