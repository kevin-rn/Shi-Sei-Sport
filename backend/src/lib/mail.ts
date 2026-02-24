import nodemailer from 'nodemailer'

const DEFAULT_EMAIL = 'info@shiseisport.nl'

export function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    } : undefined,
  })
}

export async function sendMail(options: {
  to?: string
  subject: string
  html: string
  replyTo?: string
  attachments?: Array<{
    filename: string
    content: Buffer | Uint8Array
    contentType?: string
  }>
}) {
  const transporter = createTransporter()
  await transporter.verify()
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER || `noreply@shiseisport.nl`,
    to: options.to || process.env.CONTACT_EMAIL || DEFAULT_EMAIL,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
    attachments: options.attachments,
  })
}
