/**
 * Server-side validation helpers.
 * Uses type guards (v: unknown) for untrusted HTTP input.
 * Mirrors frontend/src/lib/validation.ts — keep both in sync when changing rules.
 */
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

/** IBAN lengths per country code (ISO 13616) */
const IBAN_LENGTHS: Record<string, number> = {
  AD: 24, AE: 23, AL: 28, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22,
  BR: 29, BY: 28, CH: 21, CR: 22, CY: 28, CZ: 24, DE: 22, DJ: 27, DK: 18,
  DO: 28, EE: 20, EG: 29, ES: 24, FI: 18, FK: 18, FO: 18, FR: 27, GB: 22,
  GE: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21, HU: 28, IE: 22, IL: 23,
  IQ: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28, LC: 32, LI: 21,
  LT: 20, LU: 20, LV: 21, LY: 25, MC: 27, MD: 24, ME: 22, MK: 19, MN: 20,
  MR: 27, MT: 31, MU: 30, NI: 28, NL: 18, NO: 15, OM: 23, PK: 24, PL: 28,
  PS: 29, PT: 25, QA: 29, RO: 24, RS: 22, RU: 33, SA: 24, SC: 31, SD: 18,
  SE: 24, SI: 19, SK: 24, SM: 27, SO: 23, ST: 25, SV: 28, TL: 23, TN: 24,
  TR: 26, UA: 29, VA: 22, VG: 24, XK: 20,
}

/** Mod-97 checksum per ISO 13616 */
function ibanMod97(iban: string): number {
  // Move first 4 chars to end, convert letters to digits (A=10, B=11, …)
  const rearranged = iban.slice(4) + iban.slice(0, 4)
  const digits = rearranged.replace(/[A-Z]/g, (ch) => String(ch.charCodeAt(0) - 55))
  // Process in chunks to avoid BigInt — standard mod-97 long-division approach
  let remainder = 0
  for (let i = 0; i < digits.length; i++) {
    remainder = (remainder * 10 + Number(digits[i])) % 97
  }
  return remainder
}

/** IBAN: validates country-specific length, alphanumeric format, and mod-97 checksum */
export function isValidIban(v: unknown): v is string {
  if (typeof v !== 'string') return false
  const normalized = v.trim().toUpperCase().replace(/\s/g, '')
  const country = normalized.slice(0, 2)
  const expectedLen = IBAN_LENGTHS[country]
  if (!expectedLen) return false
  if (normalized.length !== expectedLen) return false
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(normalized)) return false
  return ibanMod97(normalized) === 1
}
