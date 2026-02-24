import { NextRequest, NextResponse } from 'next/server'
import { verifySolution } from 'altcha-lib'
import { sendMail, emailTemplate, emailSection, emailRow, emailTable } from '@/lib/mail'
import { fillInschrijfformulier, fillMachtigingIncasso } from '@/lib/fill-pdf'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

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
    const emailHtml = emailTemplate(`
      <h2 style="margin:0 0 4px;font-size:20px;color:#1a1a1a;">Nieuwe Inschrijving</h2>
      <p style="margin:0 0 24px;font-size:14px;color:#888;">Ontvangen via het inschrijfformulier</p>

      ${emailSection('Persoonlijke Gegevens')}
      ${emailTable(
        emailRow('Naam', body.name) +
        emailRow('E-mail', body.email) +
        emailRow('Telefoon', body.phone || '-') +
        emailRow('Geboortedatum', body.dateOfBirth || '-') +
        (body.guardianName ? emailRow('Ouder/Voogd', body.guardianName) : '')
      )}

      ${body.address?.street ? `
        ${emailSection('Adres')}
        ${emailTable(
          emailRow('Straat', `${body.address.street} ${body.address.houseNumber || ''}`) +
          emailRow('Postcode / Plaats', `${body.address.postalCode || ''} ${body.address.city || ''}`)
        )}
      ` : ''}

      ${emailSection('Judo Informatie')}
      ${emailTable(
        emailRow('Ervaring', body.experience || 'Beginner') +
        emailRow('Huidige Graad', body.judoGrade || '-') +
        emailRow('Voorkeur Trainingsdagen', body.preferredTrainingDays?.join(', ') || '-') +
        emailRow('Medische Informatie', body.medicalInfo || '-')
      )}

      ${emailSection('Betalingsgegevens')}
      ${emailTable(
        emailRow('Betaalmethode', body.paymentMethod === 'ooievaarspas' ? 'Ooievaarspas' : 'Regulier (Machtiging)') +
        (body.paymentMethod === 'ooievaarspas' && body.ooievaarspasNumber ? emailRow('Ooievaarspas Nummer', body.ooievaarspasNumber) : '') +
        (body.paymentMethod === 'regular' && body.bankAccount ? emailRow('Rekeninghouder', body.bankAccount.accountHolder || '-') + emailRow('IBAN', body.bankAccount.iban || '-') : '')
      )}

      ${body.remarks ? `
        ${emailSection('Opmerkingen')}
        <p style="margin:0;font-size:14px;color:#333;line-height:1.6;">${body.remarks}</p>
      ` : ''}
    `)

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

    // Save copies locally
    const safeName = body.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '')
    const date = new Date().toISOString().slice(0, 10)
    const folderName = `${date}_${safeName}`
    const enrollmentDir = path.join(process.cwd(), 'data', 'enrollments', folderName)
    await mkdir(enrollmentDir, { recursive: true })
    for (const att of attachments) {
      await writeFile(path.join(enrollmentDir, att.filename), att.content)
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
      html: emailTemplate(`
        <h2 style="margin:0 0 16px;font-size:20px;color:#1a1a1a;">Bedankt voor uw inschrijving!</h2>
        <p style="margin:0 0 12px;font-size:15px;color:#333;line-height:1.6;">Beste ${body.name},</p>
        <p style="margin:0 0 12px;font-size:15px;color:#333;line-height:1.6;">Wij hebben uw inschrijving ontvangen. In de bijlage vindt u de ingevulde formulieren voor uw administratie.</p>
        <p style="margin:24px 0 0;font-size:15px;color:#333;line-height:1.6;">Met sportieve groet,<br><strong>Shi-Sei Sport</strong></p>
      `),
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
