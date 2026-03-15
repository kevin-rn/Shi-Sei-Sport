import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import crypto from 'crypto'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

/**
 * Lightweight analytics endpoint.
 * Creates a privacy-friendly page view record — no cookies, no PII stored.
 * The session hash is derived from IP + User-Agent + daily salt so it rotates
 * every day and cannot be reversed to identify the visitor.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)

    // Higher limit for tracking (30 req/min) — one per page navigation
    const { allowed } = checkRateLimit(`track:${ip}`, 30, 60_000)
    if (!allowed) {
      return new NextResponse(null, { status: 204 })
    }

    const body = await request.json()
    const path = typeof body.path === 'string' ? body.path.slice(0, 500) : '/'
    const referrer = typeof body.referrer === 'string' ? body.referrer.slice(0, 500) : ''

    // Parse user agent for device & browser
    const ua = request.headers.get('user-agent') ?? ''
    const device = parseDevice(ua)
    const browser = parseBrowser(ua)

    // Generate anonymous daily session hash (IP + UA + date → SHA-256 → first 12 chars)
    const dailySalt = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    const sessionHash = crypto
      .createHash('sha256')
      .update(`${ip}:${ua}:${dailySalt}`)
      .digest('hex')
      .slice(0, 12)

    // Get country from Caddy/proxy headers if available
    const country = request.headers.get('cf-ipcountry')
      ?? request.headers.get('x-country-code')
      ?? ''

    const payload = await getPayload({ config })

    await payload.create({
      collection: 'page-views',
      data: {
        path,
        referrer,
        sessionHash,
        device,
        browser,
        country,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch {
    // Silently fail — analytics should never break the user experience
    return new NextResponse(null, { status: 204 })
  }
}

function parseDevice(ua: string): 'mobile' | 'tablet' | 'desktop' {
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet'
  if (/mobile|iphone|ipod|android.*mobile|opera m(ob|in)i|windows phone/i.test(ua)) return 'mobile'
  return 'desktop'
}

function parseBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return 'Edge'
  if (/opr\//i.test(ua) || /opera/i.test(ua)) return 'Opera'
  if (/chrome\//i.test(ua) && !/edg/i.test(ua)) return 'Chrome'
  if (/safari\//i.test(ua) && !/chrome/i.test(ua)) return 'Safari'
  if (/firefox\//i.test(ua)) return 'Firefox'
  if (/samsung/i.test(ua)) return 'Samsung'
  return 'Other'
}
