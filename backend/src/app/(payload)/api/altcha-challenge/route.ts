import { NextRequest, NextResponse } from 'next/server'
import { createChallenge } from 'altcha-lib'

export async function GET(request: NextRequest) {
  try {
    const hmacKey = process.env.ALTCHA_SECRET
    if (!hmacKey) {
      console.error('ALTCHA_SECRET environment variable is not set')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const challenge = await createChallenge({
      hmacKey,
      maxNumber: 100000,
      expires: new Date(Date.now() + 5 * 60 * 1000), 
    })

    return NextResponse.json(challenge)
  } catch (error) {
    console.error('Error creating ALTCHA challenge:', error)
    return NextResponse.json({ error: 'Failed to create challenge' }, { status: 500 })
  }
}