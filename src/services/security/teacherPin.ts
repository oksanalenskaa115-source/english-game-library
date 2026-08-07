const PIN_KEY = 'egl.teacherPin'
const SESSION_KEY = 'egl.teacherUnlocked'

interface StoredPin {
  salt: string
  hash: string
  failedAttempts: number
  lockedUntil: number
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function hashPin(pin: string, salt: string) {
  const data = new TextEncoder().encode(`${salt}:${pin}`)
  return bytesToHex(new Uint8Array(await crypto.subtle.digest('SHA-256', data)))
}

function loadPin(): StoredPin | null {
  try {
    const value = localStorage.getItem(PIN_KEY)
    return value ? JSON.parse(value) as StoredPin : null
  } catch {
    return null
  }
}

export function hasTeacherPin() { return Boolean(loadPin()) }
export function isTeacherUnlocked() { return sessionStorage.getItem(SESSION_KEY) === 'yes' }
export function lockTeacherSession() { sessionStorage.removeItem(SESSION_KEY) }

export async function createTeacherPin(pin: string) {
  const salt = bytesToHex(crypto.getRandomValues(new Uint8Array(16)))
  const value: StoredPin = { salt, hash: await hashPin(pin, salt), failedAttempts: 0, lockedUntil: 0 }
  localStorage.setItem(PIN_KEY, JSON.stringify(value))
  sessionStorage.setItem(SESSION_KEY, 'yes')
}

export async function verifyTeacherPin(pin: string) {
  const stored = loadPin()
  if (!stored) return { ok: false, lockedUntil: 0 }
  if (stored.lockedUntil > Date.now()) return { ok: false, lockedUntil: stored.lockedUntil }
  const ok = await hashPin(pin, stored.salt) === stored.hash
  if (ok) {
    localStorage.setItem(PIN_KEY, JSON.stringify({ ...stored, failedAttempts: 0, lockedUntil: 0 }))
    sessionStorage.setItem(SESSION_KEY, 'yes')
    return { ok: true, lockedUntil: 0 }
  }
  const failedAttempts = stored.failedAttempts + 1
  const lockedUntil = failedAttempts >= 5 ? Date.now() + 30_000 : 0
  localStorage.setItem(PIN_KEY, JSON.stringify({ ...stored, failedAttempts: lockedUntil ? 0 : failedAttempts, lockedUntil }))
  return { ok: false, lockedUntil }
}
