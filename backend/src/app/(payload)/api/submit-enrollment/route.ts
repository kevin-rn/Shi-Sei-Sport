import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { verifySolution } from 'altcha-lib'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    // Verify ALTCHA challenge
    const altchaPayload = body.altcha
    if (!altchaPayload) {
      return NextResponse.json(
        { error: 'CAPTCHA verification required' },
        { status: 400 }
      )
    }

    const hmacKey = process.env.ALTCHA_SECRET || 'default-secret-key-change-in-production'
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

    // Prepare email content
    const emailHtml = `
      <h2>Nieuw Inschrijfformulier</h2>
      <h3>Persoonlijke Gegevens</h3>
      <p><strong>Naam:</strong> ${body.name}</p>
      <p><strong>E-mail:</strong> ${body.email}</p>
      <p><strong>Telefoon:</strong> ${body.phone || '-'}</p>
      <p><strong>Geboortedatum:</strong> ${body.dateOfBirth || '-'}</p>

      ${body.address?.street ? `
        <h3>Adres</h3>
        <p>${body.address.street} ${body.address.houseNumber || ''}</p>
        <p>${body.address.postalCode || ''} ${body.address.city || ''}</p>
      ` : ''}

      ${body.emergencyContact?.name ? `
        <h3>Noodcontact</h3>
        <p><strong>Naam:</strong> ${body.emergencyContact.name}</p>
        <p><strong>Telefoon:</strong> ${body.emergencyContact.phone || '-'}</p>
        <p><strong>Relatie:</strong> ${body.emergencyContact.relation || '-'}</p>
      ` : ''}

      ${body.parentGuardian?.name ? `
        <h3>Ouder/Voogd</h3>
        <p><strong>Naam:</strong> ${body.parentGuardian.name}</p>
        <p><strong>E-mail:</strong> ${body.parentGuardian.email || '-'}</p>
        <p><strong>Telefoon:</strong> ${body.parentGuardian.phone || '-'}</p>
      ` : ''}

      <h3>Judo Informatie</h3>
      <p><strong>Ervaring:</strong> ${body.experience || 'beginner'}</p>
      <p><strong>Huidige Graad:</strong> ${body.judoGrade || '-'}</p>
      <p><strong>Voorkeur Trainingsdagen:</strong> ${body.preferredTrainingDays?.join(', ') || '-'}</p>
      <p><strong>Medische Informatie:</strong> ${body.medicalInfo || '-'}</p>

      <h3>Betalingsgegevens</h3>
      <p><strong>Betaalmethode:</strong> ${body.paymentMethod === 'ooievaarspas' ? 'Ooievaarspas' : 'Regulier (Machtiging)'}</p>
      ${body.paymentMethod === 'regular' && body.bankAccount ? `
        <p><strong>Rekeninghouder:</strong> ${body.bankAccount.accountHolder || '-'}</p>
        <p><strong>IBAN:</strong> ${body.bankAccount.iban || '-'}</p>
      ` : ''}

      ${body.remarks ? `
        <h3>Opmerkingen</h3>
        <p>${body.remarks}</p>
      ` : ''}
    `

    // Send email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      } : undefined,
    })

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@shiseisport.nl',
      to: process.env.ENROLLMENT_EMAIL || process.env.CONTACT_EMAIL || 'info@shiseisport.nl',
      subject: `Nieuwe inschrijving: ${body.name}`,
      html: emailHtml,
      replyTo: body.email,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
    })
  } catch (error) {
    console.error('Error submitting enrollment form:', error)
    return NextResponse.json(
      { error: 'Failed to submit form', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
