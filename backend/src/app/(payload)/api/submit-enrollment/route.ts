import { NextRequest, NextResponse } from 'next/server'
import { verifySolution } from 'altcha-lib'
import { sendMail, emailTemplate, emailSection, emailRow, emailTable, escapeHtml } from '@/lib/mail'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { isString, isValidEmail, isValidIban, sanitizeOneLine } from '@/lib/validation'
import { fillInschrijfformulier, fillMachtigingIncasso } from '@/lib/fill-pdf'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'eu-central-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_KEY || '',
  },
  forcePathStyle: true,
})

export async function POST(request: NextRequest) {
  try {
    const { allowed, retryAfter } = checkRateLimit(`enrollment:${getClientIp(request)}`)
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
    if (!isString(body.firstName) || !isString(body.lastName) || !isValidEmail(body.email)) {
      return NextResponse.json(
        { error: 'First name, last name and email are required and must be valid' },
        { status: 400 }
      )
    }

    // Validate IBAN if provided
    if (body.bankAccount?.iban && !isValidIban(body.bankAccount.iban)) {
      return NextResponse.json({ error: 'Invalid IBAN' }, { status: 400 })
    }

    // Validate signature data URL if provided
    if (body.signature) {
      const SIG_PREFIX = 'data:image/png;base64,'
      if (!body.signature.startsWith(SIG_PREFIX)) {
        return NextResponse.json({ error: 'Invalid signature data' }, { status: 400 })
      }
      const base64Part = body.signature.slice(SIG_PREFIX.length)
      if (!/^[A-Za-z0-9+/]+=*$/.test(base64Part)) {
        return NextResponse.json({ error: 'Invalid signature data' }, { status: 400 })
      }
      if (Buffer.from(base64Part, 'base64').byteLength > 2 * 1024 * 1024) {
        return NextResponse.json({ error: 'Signature image too large' }, { status: 400 })
      }
    }

    // Compose full name: "Roepnaam [Tussenvoegsel] Achternaam"
    const fullName = [body.firstName, body.middleName, body.lastName]
      .filter(Boolean)
      .join(' ')

    // Prepare email content for club
    const emailHtml = emailTemplate(`
      <h2 style="margin:0 0 4px;font-size:20px;color:#1a1a1a;">Nieuwe Inschrijving</h2>
      <p style="margin:0 0 24px;font-size:14px;color:#888;">Ontvangen via het inschrijfformulier</p>

      ${emailSection('Persoonlijke Gegevens')}
      ${emailTable(
        emailRow('Naam', fullName) +
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
        <p style="margin:0;font-size:14px;color:#333;line-height:1.6;">${escapeHtml(body.remarks)}</p>
      ` : ''}
    `)

    // Generate filled PDF forms
    const attachments: Array<{ filename: string; content: Uint8Array; contentType: string }> = []

    const inschrijfPdf = await fillInschrijfformulier(body)
    attachments.push({
      filename: `Inschrijfformulier-${fullName.replace(/\s+/g, '_')}.pdf`,
      content: inschrijfPdf,
      contentType: 'application/pdf',
    })

    if (body.paymentMethod !== 'ooievaarspas' && body.bankAccount) {
      const incassoPdf = await fillMachtigingIncasso(body)
      attachments.push({
        filename: `Machtiging-Incasso-${fullName.replace(/\s+/g, '_')}.pdf`,
        content: incassoPdf,
        contentType: 'application/pdf',
      })
    }

    // Save copies to MinIO
    const safeName = fullName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '')
    const date = new Date().toISOString().slice(0, 10)
    const folder = `enrollments/${date}_${safeName}`
    await Promise.all(
      attachments.map((att) =>
        s3.send(new PutObjectCommand({
          Bucket: process.env.S3_BUCKET || 'judo-bucket',
          Key: `${folder}/${att.filename}`,
          Body: att.content,
          ContentType: att.contentType,
        }))
      )
    )

    // Send to club with full details
    await sendMail({
      to: process.env.CONTACT_EMAIL,
      subject: `[Inschrijving] Nieuwe inschrijving - ${sanitizeOneLine(fullName)}`,
      html: emailHtml,
      replyTo: body.email,
      attachments,
      bcc: true,
    })

    // Send confirmation to submitter with filled PDFs
    await sendMail({
      to: body.email,
      subject: 'Bevestiging inschrijving Shi-Sei Sport',
      html: emailTemplate(`
        <h2 style="margin:0 0 16px;font-size:20px;color:#1a1a1a;">Bedankt voor uw inschrijving!</h2>
        <p style="margin:0 0 12px;font-size:15px;color:#333;line-height:1.6;">Beste ${escapeHtml(body.firstName)},</p>
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
