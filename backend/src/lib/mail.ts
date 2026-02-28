import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

const DEFAULT_EMAIL = 'info@shiseisport.nl'
const LOGO_CID = 'shi-sei-logo@shiseisport.nl'

function getLogoAttachment() {
  const logoPath = path.join(process.cwd(), 'public', 'shi-sei-logo.png')
  return {
    filename: 'shi-sei-logo.png',
    content: fs.readFileSync(logoPath),
    contentType: 'image/png',
    cid: LOGO_CID,
  }
}

/** Escapes HTML special characters to prevent injection in email templates. */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Wraps email body content in the Shi-Sei Sport branded HTML template. */
export function emailTemplate(body: string): string {
  return `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background-color:#1a1a1a;padding:28px 32px;text-align:center;">
            <img src="cid:${LOGO_CID}" alt="Shi-Sei Sport" width="56" height="54" style="display:inline-block;vertical-align:middle;">
            <span style="display:inline-block;vertical-align:middle;margin-left:14px;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">Shi-Sei Sport</span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            ${body}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background-color:#fafafa;border-top:1px solid #e5e5e5;padding:20px 32px;text-align:center;">
            <p style="margin:0;font-size:13px;color:#888;">Shi-Sei Sport &mdash; Judovereniging Den Haag</p>
            <p style="margin:6px 0 0;font-size:12px;color:#aaa;">info@shiseisport.nl</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

/** Returns a styled section heading for use in email templates. */
export function emailSection(title: string): string {
  return `<h3 style="margin:24px 0 12px;font-size:15px;font-weight:600;color:#E60000;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #E60000;padding-bottom:6px;">${title}</h3>`
}

/** Returns a styled two-column table row for use in email templates. */
export function emailRow(label: string, value: string): string {
  return `<tr>
  <td style="padding:10px 12px;font-size:14px;font-weight:600;color:#555;white-space:nowrap;border-bottom:1px solid #f0f0f0;width:40%;">${escapeHtml(label)}</td>
  <td style="padding:10px 12px;font-size:14px;color:#1a1a1a;border-bottom:1px solid #f0f0f0;">${escapeHtml(value)}</td>
</tr>`
}

/** Wraps pre-built rows in a full-width presentation table. */
export function emailTable(rows: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows}</table>`
}

/** Creates a nodemailer transporter authenticated as the given email address. */
export function createTransporter(account: 'contact' | 'trial') {
  const user = account === 'trial'
    ? process.env.TRIAL_LESSON_EMAIL
    : process.env.CONTACT_EMAIL
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: user ? { user, pass: process.env.SMTP_PASS } : undefined,
  })
}

/** Sends an email via the configured SMTP transporter. */
export async function sendMail(options: {
  to?: string
  subject: string
  html: string
  replyTo?: string
  account?: 'contact' | 'trial'
  attachments?: Array<{
    filename: string
    content: Buffer | Uint8Array
    contentType?: string
  }>
}) {
  const account = options.account ?? 'contact'
  const from = account === 'trial'
    ? process.env.TRIAL_LESSON_EMAIL
    : process.env.CONTACT_EMAIL
  const transporter = createTransporter(account)
  await transporter.sendMail({
    from: from || DEFAULT_EMAIL,
    to: options.to || process.env.CONTACT_EMAIL || DEFAULT_EMAIL,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
    attachments: [
      getLogoAttachment(),
      ...(options.attachments?.map((att) => ({
        filename: att.filename,
        content: Buffer.isBuffer(att.content) ? att.content : Buffer.from(att.content),
        contentType: att.contentType,
      })) ?? []),
    ],
  })
}
