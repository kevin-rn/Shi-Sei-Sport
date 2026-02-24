/** Email: basic RFC-compliant check */
export const isValidEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

/** Phone: allow +, digits, spaces, dashes, parens — at least 8 digits */
export const isValidPhone = (v: string) =>
  /^[+\d\s\-()]{8,}$/.test(v.trim()) && (v.match(/\d/g) || []).length >= 8;

/** Dutch IBAN: NL + 2 digits + 4 letters + 10 digits (spaces allowed) */
export const isValidIban = (v: string) =>
  /^[A-Z]{2}\d{2}\s?[A-Z]{4}\s?(\d{4}\s?){2}\d{2}$/.test(v.trim().toUpperCase());

/** Dutch postal code: 4 digits + 2 letters */
export const isValidPostalCode = (v: string) =>
  /^\d{4}\s?[A-Za-z]{2}$/.test(v.trim());
