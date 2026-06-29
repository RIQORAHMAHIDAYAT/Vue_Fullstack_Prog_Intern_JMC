import { createError } from "h3"

const attempts = new Map<string, { count: number; resetAt: number }>()

const MAX_ATTEMPTS = 5
const WINDOW_MS = 60 * 1000

export function checkRateLimit(key: string): void {
  const now = Date.now()
  const record = attempts.get(key)

  if (record && record.resetAt > now) {
    if (record.count >= MAX_ATTEMPTS) {
      throw createError({
        statusCode: 429,
        message: "Terlalu banyak percobaan login. Coba lagi dalam 1 menit.",
      })
    }
    record.count++
  } else {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS })
  }
}

export function clearRateLimit(key: string): void {
  attempts.delete(key)
}
