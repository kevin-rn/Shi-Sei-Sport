/**
 * OG injection server for /news/:id routes.
 *
 * Caddy proxies GET /news/* here. This server fetches the article
 * from the backend API, injects Open Graph meta tags into index.html,
 * and returns the modified HTML so social crawlers see correct previews.
 *
 * All other traffic (static assets, /api/*, etc.) is handled by Caddy directly.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX_HTML = fs.readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf-8');

const PORT = parseInt(process.env.PORT || '3001', 10);
const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:3000';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Extract plain text from Payload's Lexical rich-text node tree. */
function extractText(node, limit = 160) {
  let text = '';
  if (!node) return text;
  if (node.text) text += node.text;
  if (node.children) {
    for (const child of node.children) {
      text += extractText(child, limit);
      if (text.length >= limit) break;
    }
  }
  text = text.trim();
  if (text.length > limit) {
    const cut = text.lastIndexOf(' ', limit);
    text = (cut > 0 ? text.slice(0, cut) : text.slice(0, limit)) + '…';
  }
  return text;
}

/** Escape a string for safe insertion into an HTML attribute value. */
function escAttr(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Replace the content attribute of a specific <meta property="…"> tag. */
function setMeta(html, property, content) {
  return html.replace(
    new RegExp(`(<meta\\s[^>]*property="${property}"[^>]*content=")[^"]*(")`,'i'),
    `$1${escAttr(content)}$2`,
  );
}

/** Resolve an internal minio URL to the public /media/ proxy path. */
function resolveImageUrl(media) {
  if (!media || typeof media !== 'object') return '';
  const url = media.sizes?.thumbnail?.url || media.url || '';
  if (url.includes('minio:9000')) {
    return url.replace(/https?:\/\/minio:9000\/[^/]+\//, '/media/');
  }
  return url;
}

// ── Request handler ───────────────────────────────────────────────────────────

const NEWS_ROUTE = /^\/news\/([^/?#]+)/;

const server = http.createServer(async (req, res) => {
  const match = req.method === 'GET' && NEWS_ROUTE.exec(req.url);
  if (!match) {
    // Shouldn't normally be reached — Caddy only sends /news/* here
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(INDEX_HTML);
    return;
  }

  const id = match[1];
  const locale = new URL(req.url, 'http://localhost').searchParams.get('locale') || 'nl';

  try {
    const apiRes = await fetch(`${BACKEND_URL}/api/news/${encodeURIComponent(id)}?locale=${locale}`);
    if (!apiRes.ok) throw new Error(`API ${apiRes.status}`);
    const news = await apiRes.json();

    const title = `${news.title} – Shi-Sei Sport`;
    const description = extractText(news.content?.root, 160);
    const imageRelative = resolveImageUrl(news.coverImage);
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
    const origin = `${protocol}://${host}`;
    const image = imageRelative ? `${origin}${imageRelative}` : '';
    const pageUrl = `${origin}${req.url}`;

    let html = INDEX_HTML;
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escAttr(title)}</title>`);
    html = setMeta(html, 'og:title', title);
    html = setMeta(html, 'og:description', description);
    html = setMeta(html, 'og:url', pageUrl);
    html = setMeta(html, 'og:image', image);
    html = setMeta(html, 'og:type', 'article');

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
    res.end(html);
  } catch (err) {
    console.error('[og-server error]', err.message);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(INDEX_HTML);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[og-server] listening on :${PORT}`);
  console.log(`[og-server] backend → ${BACKEND_URL}`);
});
