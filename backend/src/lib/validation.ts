const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_FIELD_LENGTH = 1000
const MAX_MESSAGE_LENGTH = 5000

/** Validate that a value is a non-empty string within length limits */
export function isString(v: unknown, maxLen = MAX_FIELD_LENGTH): v is string {
  return typeof v === 'string' && v.trim().length > 0 && v.length <= maxLen
}

/** Validate email format (mirrors frontend validation) */
export function isValidEmail(v: unknown): v is string {
  return typeof v === 'string' && v.length <= 254 && EMAIL_RE.test(v.trim())
}

/** Validate a message/long-text field */
export function isValidMessage(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0 && v.length <= MAX_MESSAGE_LENGTH
}

/** Strip control characters (CR, LF, tabs) from a string for use in email subjects */
export function sanitizeOneLine(v: string): string {
  return v.replace(/[\r\n\t]/g, ' ').trim()
}
