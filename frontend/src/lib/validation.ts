/**
 * Client-side validation helpers.
 * Mirrors backend/src/lib/validation.ts logic but with typed params (string)
 * instead of type guards (unknown) — keep both in sync when changing rules.
 */

/** Email: basic RFC-compliant check */
export const isValidEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

/** Per-country digit length rules for the subscriber number (after country code) */
export const PHONE_RULES: Record<string, { min: number; max: number }> = {
  '+1':   { min: 10, max: 10 },
  '+27':  { min: 9,  max: 9  },
  '+31':  { min: 9,  max: 9  },
  '+32':  { min: 8,  max: 9  },
  '+33':  { min: 9,  max: 9  },
  '+34':  { min: 9,  max: 9  },
  '+39':  { min: 6,  max: 11 },
  '+41':  { min: 9,  max: 9  },
  '+43':  { min: 4,  max: 13 },
  '+44':  { min: 10, max: 10 },
  '+49':  { min: 10, max: 11 },
  '+55':  { min: 10, max: 11 },
  '+61':  { min: 9,  max: 9  },
  '+81':  { min: 10, max: 11 },
  '+82':  { min: 9,  max: 10 },
  '+351': { min: 9,  max: 9  },
  '+352': { min: 4,  max: 11 },
};

/** Phone: expects format "+CC-NNNN" produced by PhoneInput */
export const isValidPhone = (v: string) => {
  const stripped = v.trim();
  if (!stripped.startsWith('+')) return false;
  const dash = stripped.indexOf('-');
  if (dash === -1) return false;
  const code = stripped.slice(0, dash);
  const digits = stripped.slice(dash + 1).replace(/\D/g, '');
  const rules = PHONE_RULES[code] ?? { min: 6, max: 12 };
  return digits.length >= rules.min && digits.length <= rules.max;
};

/** IBAN lengths per country code (ISO 13616) */
export const IBAN_LENGTHS: Record<string, number> = {
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
};

/** Mod-97 checksum per ISO 13616 */
const ibanMod97 = (iban: string): number => {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const digits = rearranged.replace(/[A-Z]/g, (ch) => String(ch.charCodeAt(0) - 55));
  let remainder = 0;
  for (let i = 0; i < digits.length; i++) {
    remainder = (remainder * 10 + Number(digits[i])) % 97;
  }
  return remainder;
};

/** IBAN: validates country-specific length, alphanumeric format, and mod-97 checksum */
export const isValidIban = (v: string): boolean => {
  const normalized = v.trim().toUpperCase().replace(/\s/g, '');
  const country = normalized.slice(0, 2);
  const expectedLen = IBAN_LENGTHS[country];
  if (!expectedLen) return false;
  if (normalized.length !== expectedLen) return false;
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(normalized)) return false;
  return ibanMod97(normalized) === 1;
};

/** Dutch postal code: 4 digits + 2 letters */
export const isValidPostalCode = (v: string) =>
  /^\d{4}\s?[A-Za-z]{2}$/.test(v.trim());
