import { NextRequest, NextResponse } from 'next/server'
import { verifySolution } from 'altcha-lib'
import { sendMail, emailTemplate, emailSection, emailRow, emailTable, escapeHtml } from '@/lib/mail'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { isString, isValidEmail, isValidMessage, sanitizeOneLine } from '@/lib/validation'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const { allowed, retryAfter } = checkRateLimit(`contact:${getClientIp(request)}`)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } },
      )
    }

    const body = await request.json()

    // Verify ALTCHA challenge
    const altchaPayload = body.altcha
    if (!altchaPayload) {
      return NextResponse.json(
        { error: 'CAPTCHA verification required' },
        { status: 400 }
      )
    }

    const hmacKey = process.env.ALTCHA_SECRET
    if (!hmacKey) {
      logger.error('ALTCHA_SECRET environment variable is not set', undefined, { route: '/api/contact' })
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    const verified = await verifySolution(altchaPayload, hmacKey)

    if (!verified) {
      return NextResponse.json(
        { error: 'Invalid CAPTCHA verification' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!isString(body.name) || !isValidEmail(body.email) || !isString(body.subject) || !isValidMessage(body.message)) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required and must be valid' },
        { status: 400 }
      )
    }

    const subjectMap: Record<string, string> = {
      proefles: 'Proefles',
      inschrijving: 'Inschrijving',
      vraag: 'Vraag',
      anders: 'Anders',
    }
    const subjectLabel = sanitizeOneLine(subjectMap[body.subject] || 'Anders')

    // Email to club
    const clubHtml = emailTemplate(`
      <h2 style="margin:0 0 4px;font-size:20px;color:#1a1a1a;">Nieuw Contactformulier</h2>
      <p style="margin:0 0 24px;font-size:14px;color:#888;">Ontvangen via het contactformulier</p>

      ${emailSection('Gegevens')}
      ${emailTable(
        emailRow('Naam', body.name) +
        emailRow('E-mail', body.email) +
        (body.phone ? emailRow('Telefoon', body.phone) : '') +
        emailRow('Onderwerp', subjectLabel)
      )}

      ${emailSection('Bericht')}
      <p style="margin:0;font-size:14px;color:#333;line-height:1.6;">${escapeHtml(body.message)}</p>
    `)

    await sendMail({
      to: process.env.CONTACT_EMAIL,
      subject: `[Contact] ${subjectLabel} - ${sanitizeOneLine(body.name)}`,
      html: clubHtml,
      replyTo: body.email,
      bcc: true,
    })

    // Confirmation to submitter
    await sendMail({
      to: body.email,
      subject: 'Bevestiging contactformulier Shi-Sei Sport',
      html: emailTemplate(`
        <h2 style="margin:0 0 16px;font-size:20px;color:#1a1a1a;">Bedankt voor uw bericht!</h2>
        <p style="margin:0 0 12px;font-size:15px;color:#333;line-height:1.6;">Beste ${escapeHtml(body.name)},</p>
        <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.6;">Wij hebben uw bericht ontvangen en zullen zo spoedig mogelijk reageren.</p>

        ${emailSection('Uw bericht')}
        ${emailTable(emailRow('Onderwerp', subjectLabel))}
        <p style="margin:12px 0 0;font-size:14px;color:#333;line-height:1.6;">${escapeHtml(body.message)}</p>

        <p style="margin:24px 0 0;font-size:15px;color:#333;line-height:1.6;">Met sportieve groet,<br><strong>Shi-Sei Sport</strong></p>
      `),
    })

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
    })
  } catch (error) {
    logger.error('Contact form submission failed', error, { route: '/api/contact' })
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    )
  }
}
