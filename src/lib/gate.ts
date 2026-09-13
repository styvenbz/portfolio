import 'server-only'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

/**
 * Password gating for NDA case studies.
 *
 * Passwords are NEVER stored in Keystatic — `src/content/` is committed to
 * GitHub, so a password there would be public. The CMS stores only the
 * `access` flag; the secret lives in Vercel environment variables.
 *
 *   CASE_PASSWORD_<SLUG_IN_CAPS>   per-project password
 *   CASE_PASSWORD_DEFAULT          shared fallback
 *   AUTH_SECRET                    signs the unlock cookie
 *
 * The gate FAILS CLOSED: if no password or no AUTH_SECRET is configured, a
 * protected case study stays locked rather than silently becoming public.
 */

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

const envKey = (slug: string) =>
  `CASE_PASSWORD_${slug.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`

export const cookieName = (slug: string) =>
  `case_access_${slug.replace(/[^a-zA-Z0-9]/g, '_')}`

function secret() {
  const value = process.env.AUTH_SECRET
  return value ? new TextEncoder().encode(value) : null
}

function expectedPassword(slug: string) {
  return process.env[envKey(slug)] || process.env.CASE_PASSWORD_DEFAULT || null
}

/** Constant-time-ish comparison to avoid leaking length via early exit. */
function matches(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function isUnlocked(slug: string) {
  const key = secret()
  if (!key) return false

  const token = (await cookies()).get(cookieName(slug))?.value
  if (!token) return false

  try {
    const { payload } = await jwtVerify(token, key)
    return payload.slug === slug
  } catch {
    return false
  }
}

export async function verifyPassword(slug: string, submitted: string) {
  const expected = expectedPassword(slug)
  if (!expected) return false
  return matches(submitted, expected)
}

export async function grantAccess(slug: string) {
  const key = secret()
  if (!key) return

  const token = await new SignJWT({ slug })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_MAX_AGE}s`)
    .sign(key)

  ;(await cookies()).set(cookieName(slug), token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  })
}

/** True when the server is missing the config needed to ever unlock this case. */
export function gateMisconfigured(slug: string) {
  return !secret() || !expectedPassword(slug)
}
