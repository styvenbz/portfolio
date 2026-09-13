'use server'

import { revalidatePath } from 'next/cache'
import { grantAccess, verifyPassword } from '@/lib/gate'

export type UnlockState = { error?: string }

export async function unlockCaseStudy(
  _prev: UnlockState,
  formData: FormData
): Promise<UnlockState> {
  const slug = String(formData.get('slug') ?? '')
  const password = String(formData.get('password') ?? '')

  if (!slug) return { error: 'Something went wrong. Please reload the page.' }
  if (!password) return { error: 'Enter the password to continue.' }

  if (!(await verifyPassword(slug, password))) {
    return { error: 'That password is not correct.' }
  }

  await grantAccess(slug)
  revalidatePath(`/work/${slug}`)
  return {}
}
