import type { Context, MiddlewareHandler } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import type { Child } from 'hono/jsx'

export type OwnerBindings = {
  DASHBOARD_OWNER_PASSWORD?: string
}

const SESSION_COOKIE = 'sparkmind_owner_session'
const SESSION_TTL_SECONDS = 6 * 60 * 60
const encoder = new TextEncoder()

const toBase64Url = (bytes: Uint8Array): string => {
  let binary = ''
  bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

const fromBase64Url = (value: string): Uint8Array | null => {
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0))
  } catch {
    return null
  }
}

const constantTimeEqual = (left: Uint8Array, right: Uint8Array): boolean => {
  const length = Math.max(left.length, right.length)
  let difference = left.length ^ right.length

  for (let index = 0; index < length; index += 1) {
    difference |= (left[index] ?? 0) ^ (right[index] ?? 0)
  }

  return difference === 0
}

const digest = async (value: string): Promise<Uint8Array> => {
  const hash = await crypto.subtle.digest('SHA-256', encoder.encode(value))
  return new Uint8Array(hash)
}

const passwordsMatch = async (submitted: string, configured: string | undefined): Promise<boolean> => {
  const comparisonTarget = configured?.trim() || 'sparkmind-unconfigured-owner-password'
  const [submittedHash, configuredHash] = await Promise.all([
    digest(submitted),
    digest(comparisonTarget)
  ])

  return Boolean(configured?.trim()) && constantTimeEqual(submittedHash, configuredHash)
}

const signingKey = async (secret: string): Promise<CryptoKey> => crypto.subtle.importKey(
  'raw',
  encoder.encode(secret),
  { name: 'HMAC', hash: 'SHA-256' },
  false,
  ['sign', 'verify']
)

const createSessionToken = async (secret: string): Promise<string> => {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  const payload = toBase64Url(encoder.encode(`${expiresAt}:${crypto.randomUUID()}`))
  const signature = await crypto.subtle.sign('HMAC', await signingKey(secret), encoder.encode(payload))

  return `${payload}.${toBase64Url(new Uint8Array(signature))}`
}

const verifySessionToken = async (token: string, secret: string): Promise<boolean> => {
  const [payload, encodedSignature, ...extraParts] = token.split('.')
  if (!payload || !encodedSignature || extraParts.length > 0) return false

  const payloadBytes = fromBase64Url(payload)
  const signature = fromBase64Url(encodedSignature)
  if (!payloadBytes || !signature) return false

  const expiresAt = Number(new TextDecoder().decode(payloadBytes).split(':', 1)[0])
  const now = Math.floor(Date.now() / 1000)
  if (!Number.isFinite(expiresAt) || expiresAt <= now) return false

  try {
    return crypto.subtle.verify('HMAC', await signingKey(secret), signature, encoder.encode(payload))
  } catch {
    return false
  }
}

export const safeDashboardPath = (value: string | undefined): string => {
  if (!value || !value.startsWith('/dashboard') || value.startsWith('//')) return '/dashboard'
  return value
}

export const hasValidOwnerSession = async (c: Context<{ Bindings: OwnerBindings }>): Promise<boolean> => {
  const secret = c.env.DASHBOARD_OWNER_PASSWORD?.trim()
  const token = getCookie(c, SESSION_COOKIE)
  if (!secret || !token) return false

  return verifySessionToken(token, secret)
}

export const authenticateOwner = async (
  c: Context<{ Bindings: OwnerBindings }>,
  submittedPassword: string
): Promise<boolean> => {
  const secret = c.env.DASHBOARD_OWNER_PASSWORD
  if (!(await passwordsMatch(submittedPassword, secret))) return false

  const token = await createSessionToken(secret!.trim())
  setCookie(c, SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: SESSION_TTL_SECONDS
  })
  return true
}

export const clearOwnerSession = (c: Context<{ Bindings: OwnerBindings }>): void => {
  deleteCookie(c, SESSION_COOKIE, {
    path: '/',
    secure: true,
    sameSite: 'Lax'
  })
}

export const requireOwner = (): MiddlewareHandler<{ Bindings: OwnerBindings }> => async (c, next) => {
  if (!(await hasValidOwnerSession(c))) {
    const nextPath = encodeURIComponent(safeDashboardPath(c.req.path))
    return c.redirect(`/login?next=${nextPath}`)
  }

  await next()
}

export const LoginPanel = (props: { error?: string; nextPath: string }): Child => (
  <main id="owner-login" class="login-page">
    <section class="login-card" aria-labelledby="login-title">
      <a href="/" class="brand-mark login-brand" aria-label="SparkMind — Beranda">
        <img class="brand-symbol" src="/static/brand/sparkmind-symbol.svg" alt="" aria-hidden="true" />
        <span>Spark<span>Mind</span></span>
      </a>
      <span class="section-number">Akses pemilik</span>
      <h1 id="login-title">Masuk ke dashboard.</h1>
      <p class="muted">Area ini hanya untuk pemilik SparkMind. Masukkan password dashboard untuk melanjutkan.</p>
      {props.error ? <p class="form-error" role="alert">{props.error}</p> : null}
      <form method="post" action={`/login?next=${encodeURIComponent(props.nextPath)}`} class="login-form">
        <div class="form-field">
          <label for="owner-password">Password</label>
          <input id="owner-password" name="password" type="password" autocomplete="current-password" required autofocus />
        </div>
        <button class="btn btn-gold" type="submit">Masuk <i class="fas fa-arrow-right" aria-hidden="true"></i></button>
      </form>
      <p class="form-note">Sesi berlaku selama beberapa jam dan disimpan dalam cookie aman yang tidak dapat dibaca JavaScript.</p>
    </section>
  </main>
)
