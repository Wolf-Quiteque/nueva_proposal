import { createHmac, timingSafeEqual } from "crypto"

export const ADMIN_COOKIE_NAME = "nueva_admin_session"

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ""
}

function sign(value: string) {
  const secret = getSecret()
  if (!secret) {
    return ""
  }

  return createHmac("sha256", secret).update(value).digest("hex")
}

function signaturesMatch(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer)
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD)
}

export function adminSessionMaxAge() {
  return SESSION_MAX_AGE_SECONDS
}

export function createAdminSessionValue() {
  const payload = `admin:${Date.now()}`
  return `${payload}.${sign(payload)}`
}

export function verifyAdminSessionValue(value?: string) {
  if (!value || !getSecret()) {
    return false
  }

  const separatorIndex = value.lastIndexOf(".")
  if (separatorIndex === -1) {
    return false
  }

  const payload = value.slice(0, separatorIndex)
  const signature = value.slice(separatorIndex + 1)
  const [, issuedAtValue] = payload.split(":")
  const issuedAt = Number(issuedAtValue)

  if (!Number.isFinite(issuedAt)) {
    return false
  }

  const ageMs = Date.now() - issuedAt
  if (ageMs < 0 || ageMs > SESSION_MAX_AGE_SECONDS * 1000) {
    return false
  }

  return signaturesMatch(signature, sign(payload))
}
