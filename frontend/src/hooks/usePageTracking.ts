import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const BACKEND_URL = import.meta.env.VITE_API_URL ?? ''

/**
 * Tracks page views by sending a lightweight POST to /api/track on each
 * route change. No cookies, no PII — the backend hashes IP + UA + date
 * for anonymous session tracking.
 */
export const usePageTracking = () => {
  const location = useLocation()

  useEffect(() => {
    // Small delay so the page has time to render (avoids tracking aborted navigations)
    const timer = setTimeout(() => {
      fetch(`${BACKEND_URL}/api/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: location.pathname,
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
