import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { verifySolution } from 'altcha-lib'

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
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      )
    }

    // Create form submission in database
    const submission = await payload.create({
      collection: 'form-submissions',
      data: {
        formType: 'trial-lesson',
        name: body.name,
        email: body.email,
        phone: body.phone,
        age: body.age ? parseInt(body.age) : null,
        experience: body.experience || 'beginner',
        preferredDay: body.preferredDay || '',
        message: body.message || '',
        status: 'new',
      },
    })

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
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
