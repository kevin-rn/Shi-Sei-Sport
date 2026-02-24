import { NextRequest, NextResponse } from 'next/server'
import { verifySolution } from 'altcha-lib'
import { sendMail } from '@/lib/mail'

export async function POST(request: NextRequest) {
  try {
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
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required' },
        { status: 400 }
      )
    }

    const subjectMap: Record<string, string> = {
      proefles: 'Proefles',
      inschrijving: 'Inschrijving',
      vraag: 'Vraag',
      anders: 'Anders',
    }
    const subjectLabel = subjectMap[body.subject] || body.subject

    // Email to club
    const clubHtml = `
      <h2>[Contact] Nieuw Contactformulier</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px;">
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Naam</td><td style="padding:8px;border-bottom:1px solid #eee;">${body.name}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">E-mail</td><td style="padding:8px;border-bottom:1px solid #eee;">${body.email}</td></tr>
        ${body.phone ? `<tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Telefoon</td><td style="padding:8px;border-bottom:1px solid #eee;">${body.phone}</td></tr>` : ''}
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Onderwerp</td><td style="padding:8px;border-bottom:1px solid #eee;">${subjectLabel}</td></tr>
      </table>
      <h3>Bericht</h3>
      <p>${body.message}</p>
    `

    await sendMail({
      to: process.env.CONTACT_EMAIL,
      subject: `[Contact] ${subjectLabel} - ${body.name}`,
      html: clubHtml,
      replyTo: body.email,
    })

    // Confirmation to submitter
    await sendMail({
      to: body.email,
      subject: 'Bevestiging contactformulier Shi-Sei Sport',
      html: `
        <h2>Bedankt voor uw bericht!</h2>
        <p>Beste ${body.name},</p>
        <p>Wij hebben uw bericht ontvangen en zullen zo spoedig mogelijk reageren.</p>
        <p><strong>Onderwerp:</strong> ${subjectLabel}</p>
        <p><strong>Uw bericht:</strong></p>
        <p>${body.message}</p>
        <br>
        <p>Met sportieve groet,<br>Shi-Sei Sport</p>
      `,
    })

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
    })
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    )
  }
}
