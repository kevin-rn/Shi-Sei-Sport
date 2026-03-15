import { NextRequest, NextResponse } from 'next/server'
import { createChallenge } from 'altcha-lib'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const hmacKey = process.env.ALTCHA_SECRET
    if (!hmacKey) {
      logger.error('ALTCHA_SECRET environment variable is not set', undefined, { route: '/api/altcha-challenge' })
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const challenge = await createChallenge({
      hmacKey,
      maxNumber: 100000,
      expires: new Date(Date.now() + 5 * 60 * 1000), 
    })

    return NextResponse.json(challenge)
  } catch (error) {
    logger.error('ALTCHA challenge creation failed', error, { route: '/api/altcha-challenge' })
    return NextResponse.json({ error: 'Failed to create challenge' }, { status: 500 })
  }
}