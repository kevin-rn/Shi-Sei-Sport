const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.shi-sei.nl'

export async function GET() {
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`,
    { headers: { 'Content-Type': 'text/plain' } }
  )
}
