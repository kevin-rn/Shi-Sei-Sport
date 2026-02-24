import { NextRequest, NextResponse } from 'next/server'
import { verifySolution } from 'altcha-lib'
import { sendMail } from '@/lib/mail'
import { fillInschrijfformulier, fillMachtigingIncasso } from '@/lib/fill-pdf'

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
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Prepare email content for club
    const emailHtml = `
      <h2>[Inschrijving] Nieuw Inschrijfformulier</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px;">
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Naam</td><td style="padding:8px;border-bottom:1px solid #eee;">${body.name}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">E-mail</td><td style="padding:8px;border-bottom:1px solid #eee;">${body.email}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Telefoon</td><td style="padding:8px;border-bottom:1px solid #eee;">${body.phone || '-'}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Geboortedatum</td><td style="padding:8px;border-bottom:1px solid #eee;">${body.dateOfBirth || '-'}</td></tr>
      </table>

      ${body.address?.street ? `
        <h3>Adres</h3>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Straat</td><td style="padding:8px;border-bottom:1px solid #eee;">${body.address.street} ${body.address.houseNumber || ''}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Postcode / Plaats</td><td style="padding:8px;border-bottom:1px solid #eee;">${body.address.postalCode || ''} ${body.address.city || ''}</td></tr>
        </table>
      ` : ''}

      ${body.emergencyContact?.name ? `
        <h3>Noodcontact</h3>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Naam</td><td style="padding:8px;border-bottom:1px solid #eee;">${body.emergencyContact.name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Telefoon</td><td style="padding:8px;border-bottom:1px solid #eee;">${body.emergencyContact.phone || '-'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Relatie</td><td style="padding:8px;border-bottom:1px solid #eee;">${body.emergencyContact.relation || '-'}</td></tr>
        </table>
      ` : ''}

      ${body.parentGuardian?.name ? `
        <h3>Ouder/Voogd</h3>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Naam</td><td style="padding:8px;border-bottom:1px solid #eee;">${body.parentGuardian.name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">E-mail</td><td style="padding:8px;border-bottom:1px solid #eee;">${body.parentGuardian.email || '-'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Telefoon</td><td style="padding:8px;border-bottom:1px solid #eee;">${body.parentGuardian.phone || '-'}</td></tr>
        </table>
      ` : ''}

      <h3>Judo Informatie</h3>
      <table style="border-collapse:collapse;width:100%;max-width:600px;">
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Ervaring</td><td style="padding:8px;border-bottom:1px solid #eee;">${body.experience || 'Beginner'}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Huidige Graad</td><td style="padding:8px;border-bottom:1px solid #eee;">${body.judoGrade || '-'}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Voorkeur Trainingsdagen</td><td style="padding:8px;border-bottom:1px solid #eee;">${body.preferredTrainingDays?.join(', ') || '-'}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Medische Informatie</td><td style="padding:8px;border-bottom:1px solid #eee;">${body.medicalInfo || '-'}</td></tr>
      </table>

      <h3>Betalingsgegevens</h3>
      <table style="border-collapse:collapse;width:100%;max-width:600px;">
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Betaalmethode</td><td style="padding:8px;border-bottom:1px solid #eee;">${body.paymentMethod === 'ooievaarspas' ? 'Ooievaarspas' : 'Regulier (Machtiging)'}</td></tr>
        ${body.paymentMethod === 'ooievaarspas' && body.ooievaarspasNumber ? `
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Ooievaarspas Nummer</td><td style="padding:8px;border-bottom:1px solid #eee;">${body.ooievaarspasNumber}</td></tr>
        ` : ''}
        ${body.paymentMethod === 'regular' && body.bankAccount ? `
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Rekeninghouder</td><td style="padding:8px;border-bottom:1px solid #eee;">${body.bankAccount.accountHolder || '-'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">IBAN</td><td style="padding:8px;border-bottom:1px solid #eee;">${body.bankAccount.iban || '-'}</td></tr>
        ` : ''}
      </table>

      ${body.remarks ? `
        <h3>Opmerkingen</h3>
        <p>${body.remarks}</p>
      ` : ''}
    `

    // Generate filled PDF forms
    const attachments: Array<{ filename: string; content: Uint8Array; contentType: string }> = []

    const inschrijfPdf = await fillInschrijfformulier(body)
    attachments.push({
      filename: `Inschrijfformulier-${body.name.replace(/\s+/g, '_')}.pdf`,
      content: inschrijfPdf,
      contentType: 'application/pdf',
    })

    if (body.paymentMethod !== 'ooievaarspas' && body.bankAccount) {
      const incassoPdf = await fillMachtigingIncasso(body)
      attachments.push({
        filename: `Machtiging-Incasso-${body.name.replace(/\s+/g, '_')}.pdf`,
        content: incassoPdf,
        contentType: 'application/pdf',
      })
    }

    // Send to club with full details
    await sendMail({
      to: process.env.CONTACT_EMAIL,
      subject: `[Inschrijving] Nieuwe inschrijving - ${body.name}`,
      html: emailHtml,
      replyTo: body.email,
      attachments,
    })

    // Send confirmation to submitter with filled PDFs
    await sendMail({
      to: body.email,
      subject: 'Bevestiging inschrijving Shi-Sei Sport',
      html: `
        <h2>Bedankt voor uw inschrijving!</h2>
        <p>Beste ${body.name},</p>
        <p>Wij hebben uw inschrijving ontvangen. In de bijlage vindt u de ingevulde formulieren voor uw administratie.</p>
        <p>Met sportieve groet,<br>Shi-Sei Sport</p>
      `,
      attachments,
    })

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
    })
  } catch (error) {
    console.error('Error submitting enrollment form:', error)
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    )
  }
}
