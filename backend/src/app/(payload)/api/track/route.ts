import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import crypto from 'crypto'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

/**
 * Lightweight analytics endpoint.
 * Upserts a daily aggregate row per path + device + browser combination.
 * No cookies, no PII - the session hash rotates daily.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)

    const { allowed } = checkRateLimit(`track:${ip}`, 30, 60_000)
    if (!allowed) {
      return new NextResponse(null, { status: 204 })
    }

    const body = await request.json()
    const path = typeof body.path === 'string' ? body.path.slice(0, 500) : '/'
    const ua = request.headers.get('user-agent') ?? ''
    const device = parseDevice(ua)
    const browser = parseBrowser(ua)

    const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    const sessionHash = crypto
      .createHash('sha256')
      .update(`${ip}:${ua}:${today}`)
      .digest('hex')
      .slice(0, 12)

    const payload = await getPayload({ config })

    // Find existing aggregate row for today + path + device + browser
    const existing = await payload.find({
      collection: 'page-views',
      where: {
        and: [
          { date: { equals: today } },
          { path: { equals: path } },
          { device: { equals: device } },
          { browser: { equals: browser } },
        ],
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      const doc = existing.docs[0]
      const sessions = (doc.sessions as string) || ''
      const sessionList = sessions ? sessions.split(',') : []
      const isNewSession = !sessionList.includes(sessionHash)

      await payload.update({
        collection: 'page-views',
        id: doc.id,
        data: {
          views: ((doc.views as number) || 0) + 1,
          uniqueVisitors: ((doc.uniqueVisitors as number) || 0) + (isNewSession ? 1 : 0),
          sessions: isNewSession ? [...sessionList, sessionHash].join(',') : sessions,
        },
      })
    } else {
      await payload.create({
        collection: 'page-views',
        data: {
          date: today,
          path,
          device,
          browser,
          views: 1,
          uniqueVisitors: 1,
          sessions: sessionHash,
        },
      })
    }

    return new NextResponse(null, { status: 204 })
  } catch {
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
