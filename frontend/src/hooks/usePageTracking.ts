import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const BACKEND_URL = import.meta.env.VITE_API_URL ?? ''

const VALID_ROUTES = new Set([
  '/',
  '/rooster',
  '/contact',
  '/team',
  '/locaties',
  '/geschiedenis',
  '/tarieven',
  '/exameneisen',
  '/regels',
  '/inschrijven',
  '/nieuws',
  '/proefles',
  '/agenda',
  '/media',
  '/privacy',
  '/voorwaarden',
])

function isValidRoute(pathname: string): boolean {
  if (VALID_ROUTES.has(pathname)) return true
  // Match /nieuws/:slug
  if (/^\/nieuws\/[^/]+$/.test(pathname)) return true
  return false
}

/**
 * Tracks page views by sending a lightweight POST to /api/track on each
 * route change. No cookies, no PII — the backend hashes IP + UA + date
 * for anonymous session tracking.
 *
 * Only known routes are tracked by their actual path.
 * Unknown routes are grouped under "/overig".
 */
export const usePageTracking = () => {
  const location = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => {
      const path = isValidRoute(location.pathname)
        ? location.pathname
        : '/404'

      fetch(`${BACKEND_URL}/api/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path,
          referrer: document.referrer,
        }),
        keepalive: true,
      }).catch(() => {
        // Silently fail — analytics should never affect UX
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [location.pathname])
}
