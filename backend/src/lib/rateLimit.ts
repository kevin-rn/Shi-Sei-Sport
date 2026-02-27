interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

/**
 * Checks whether the given key has exceeded the rate limit.
 *
 * @param key      Scoped key identifying the caller, e.g. `"contact:1.2.3.4"`.
 * @param limit    Maximum number of requests allowed per window. Defaults to 5.
 * @param windowMs Window duration in milliseconds. Defaults to 60 000.
 * @returns `allowed` — whether the request may proceed; `retryAfter` — seconds until the window resets.
 */
export function checkRateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000,
): { allowed: boolean; retryAfter: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfter: 0 }
  }

  if (entry.count >= limit) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count++
  return { allowed: true, retryAfter: 0 }
}

/** Returns the real client IP from the `x-forwarded-for` header set by Caddy. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return 'unknown'
}
