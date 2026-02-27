import { getPayload } from 'payload'
import config from '@payload-config'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.shi-sei.nl'

const STATIC_ROUTES: Array<{ path: string; priority: string }> = [
  { path: '/',            priority: '1.0' },
  { path: '/nieuws',      priority: '0.9' },
  { path: '/inschrijven', priority: '0.9' },
  { path: '/proefles',    priority: '0.9' },
  { path: '/rooster',     priority: '0.8' },
  { path: '/locaties',    priority: '0.8' },
  { path: '/tarieven',    priority: '0.8' },
  { path: '/contact',     priority: '0.7' },
  { path: '/team',        priority: '0.7' },
  { path: '/agenda',      priority: '0.7' },
  { path: '/media',       priority: '0.6' },
  { path: '/exameneisen', priority: '0.6' },
  { path: '/regels',      priority: '0.5' },
  { path: '/geschiedenis',priority: '0.5' },
  { path: '/privacy',     priority: '0.2' },
  { path: '/voorwaarden', priority: '0.2' },
]

function url(entry: { loc: string; lastmod?: string; priority: string }) {
  return `  <url>
    <loc>${entry.loc}</loc>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ''}
    <priority>${entry.priority}</priority>
  </url>`
}

export const dynamic = 'force-dynamic'

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
      loc: `${BASE_URL}/nieuws/${doc.slug}`,
      lastmod: doc.updatedAt ? (doc.updatedAt as string).slice(0, 10) : undefined,
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
