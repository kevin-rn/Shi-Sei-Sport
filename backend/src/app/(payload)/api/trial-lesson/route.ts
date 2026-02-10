import { NextRequest, NextResponse } from 'next/server'
import { verifySolution } from 'altcha-lib'
import nodemailer from 'nodemailer'

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

    const hmacKey = process.env.ALTCHA_SECRET || 'default-secret-key-change-in-production'
    const verified = await verifySolution(altchaPayload, hmacKey)

    if (!verified) {
      return NextResponse.json(
        { error: 'Invalid CAPTCHA verification' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      )
    }

    // Prepare email content
    const emailHtml = `
      <h2>Nieuwe Proefles Aanvraag</h2>
      <h3>Contactgegevens</h3>
      <p><strong>Naam:</strong> ${body.name}</p>
      <p><strong>E-mail:</strong> ${body.email}</p>
      <p><strong>Telefoon:</strong> ${body.phone}</p>
      <p><strong>Leeftijd:</strong> ${body.age || '-'}</p>

      <h3>Judo Informatie</h3>
      <p><strong>Ervaring:</strong> ${body.experience || 'beginner'}</p>
      <p><strong>Voorkeur Dag:</strong> ${body.preferredDay || '-'}</p>

      ${body.message ? `
        <h3>Bericht</h3>
        <p>${body.message}</p>
      ` : ''}
    `

    // Send email
    const transporter = nodemailer.createTransporter({
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
      to: process.env.TRIAL_LESSON_EMAIL || process.env.CONTACT_EMAIL || 'info@shiseisport.nl',
      subject: `Nieuwe proefles aanvraag: ${body.name}`,
      html: emailHtml,
      replyTo: body.email,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: 'Trial lesson request submitted successfully',
    })
  } catch (error) {
    console.error('Error submitting trial lesson request:', error)
    return NextResponse.json(
      { error: 'Failed to submit request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
