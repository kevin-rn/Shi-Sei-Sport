import { getPayload } from 'payload'
import config from '@payload-config'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.shi-sei.nl'

const STATIC_ROUTES: Array<{ path: string; priority: string }> = [
  { path: '/',                  priority: '1.0' },
  { path: '/news',              priority: '0.9' },
  { path: '/enrollment',        priority: '0.9' },
  { path: '/trial-lesson',      priority: '0.9' },
  { path: '/schedule',          priority: '0.8' },
  { path: '/locations',         priority: '0.8' },
  { path: '/pricing',           priority: '0.8' },
  { path: '/contact',           priority: '0.7' },
  { path: '/team',              priority: '0.7' },
  { path: '/events',            priority: '0.7' },
  { path: '/media',             priority: '0.6' },
  { path: '/exam-requirements', priority: '0.6' },
  { path: '/rules',             priority: '0.5' },
  { path: '/history',           priority: '0.5' },
  { path: '/privacy',           priority: '0.2' },
  { path: '/terms',             priority: '0.2' },
]

function url(entry: { loc: string; lastmod?: string; priority: string }) {
  return `  <url>
    <loc>${entry.loc}</loc>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ''}
    <priority>${entry.priority}</priority>
  </url>`
}

export async function GET() {
  const payload = await getPayload({ config })

  const newsResult = await payload.find({
    collection: 'news',
    limit: 1000,
    depth: 0,
    select: { slug: true, updatedAt: true },
  })

  const staticEntries = STATIC_ROUTES.map((r) =>
    url({ loc: `${BASE_URL}${r.path}`, priority: r.priority })
  )

  const newsEntries = newsResult.docs.map((doc) =>
    url({
      loc: `${BASE_URL}/news/${doc.slug}`,
      lastmod: doc.updatedAt ? doc.updatedAt.slice(0, 10) : undefined,
      priority: '0.7',
    })
  )

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...newsEntries].join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
