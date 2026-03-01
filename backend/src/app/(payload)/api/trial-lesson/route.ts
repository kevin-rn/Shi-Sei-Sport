import { NextRequest, NextResponse } from 'next/server'
import { verifySolution } from 'altcha-lib'
import { sendMail, emailTemplate, emailSection, emailRow, emailTable, escapeHtml } from '@/lib/mail'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { isString, isValidEmail, sanitizeOneLine } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const { allowed, retryAfter } = checkRateLimit(`trial-lesson:${getClientIp(request)}`)
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
      console.error('ALTCHA_SECRET environment variable is not set')
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
    if (!isString(body.name) || !isValidEmail(body.email) || !isString(body.phone)) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required and must be valid' },
        { status: 400 }
      )
    }

    // Email to club
    const clubHtml = emailTemplate(`
      <h2 style="margin:0 0 4px;font-size:20px;color:#1a1a1a;">Nieuwe Proefles Aanvraag</h2>
      <p style="margin:0 0 24px;font-size:14px;color:#888;">Ontvangen via het proefles formulier</p>

      ${emailSection('Gegevens')}
      ${emailTable(
        emailRow('Naam', body.name) +
        emailRow('E-mail', body.email) +
        emailRow('Telefoon', body.phone) +
        emailRow('Leeftijd', body.age || '-') +
        emailRow('Ervaring', body.experience || 'Beginner') +
        emailRow('Voorkeur dag', body.preferredDay || '-')
      )}

      ${body.message ? `
        ${emailSection('Bericht')}
        <p style="margin:0;font-size:14px;color:#333;line-height:1.6;">${escapeHtml(body.message)}</p>
      ` : ''}
    `)

    await sendMail({
      to: process.env.TRIAL_LESSON_EMAIL,
      subject: `[Proefles] Nieuwe aanvraag - ${sanitizeOneLine(body.name)}`,
      html: clubHtml,
      replyTo: body.email,
      account: 'trial',
    })

    // Confirmation to submitter
    await sendMail({
      to: body.email,
      subject: 'Bevestiging proefles aanvraag Shi-Sei Sport',
      account: 'trial',
      html: emailTemplate(`
        <h2 style="margin:0 0 16px;font-size:20px;color:#1a1a1a;">Bedankt voor uw aanvraag!</h2>
        <p style="margin:0 0 12px;font-size:15px;color:#333;line-height:1.6;">Beste ${escapeHtml(body.name)},</p>
        <p style="margin:0 0 12px;font-size:15px;color:#333;line-height:1.6;">Wij hebben uw proefles aanvraag ontvangen en nemen zo spoedig mogelijk contact met u op om een geschikte dag en tijd af te spreken.</p>
        <p style="margin:24px 0 0;font-size:15px;color:#333;line-height:1.6;">Met sportieve groet,<br><strong>Shi-Sei Sport</strong></p>
      `),
    })

    return NextResponse.json({
      success: true,
      message: 'Trial lesson request submitted successfully',
    })
  } catch (error) {
    console.error('Error submitting trial lesson request:', error)
    return NextResponse.json(
      { error: 'Failed to submit request' },
      { status: 500 }
    )
  }
}
