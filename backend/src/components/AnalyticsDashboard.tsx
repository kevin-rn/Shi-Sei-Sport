'use client'

import React, { useEffect, useState, useCallback } from 'react'

interface AnalyticsData {
  totalViews: number
  uniqueVisitors: number
  topPages: { path: string; views: number }[]
  devices: { device: string; count: number }[]
  browsers: { browser: string; count: number }[]
  viewsByDay: { date: string; views: number; unique: number }[]
}

type Period = '7d' | '30d' | '90d'

const PERIOD_LABELS: Record<Period, string> = {
  '7d': '7 dagen',
  '30d': '30 dagen',
  '90d': '90 dagen',
}

const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<Period>('30d')

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    try {
      const days = period === '7d' ? 7 : period === '90d' ? 90 : 30
      const since = new Date()
      since.setDate(since.getDate() - days)

      const res = await fetch(
        `/api/page-views?limit=0&where[createdAt][greater_than]=${since.toISOString()}`,
        { credentials: 'include' },
      )
      const json = await res.json()
      const docs: { path: string; sessionHash: string; device: string; browser: string; createdAt: string }[] = json.docs ?? []

      // Aggregate
      const uniqueSessions = new Set(docs.map((d) => d.sessionHash))

      // Top pages
      const pageCounts = new Map<string, number>()
      for (const doc of docs) {
        pageCounts.set(doc.path, (pageCounts.get(doc.path) ?? 0) + 1)
      }
      const topPages = [...pageCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([path, views]) => ({ path, views }))

      // Devices
      const deviceCounts = new Map<string, number>()
      for (const doc of docs) {
        const d = doc.device || 'unknown'
        deviceCounts.set(d, (deviceCounts.get(d) ?? 0) + 1)
      }
      const devices = [...deviceCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([device, count]) => ({ device, count }))

      // Browsers
      const browserCounts = new Map<string, number>()
      for (const doc of docs) {
        const b = doc.browser || 'Unknown'
        browserCounts.set(b, (browserCounts.get(b) ?? 0) + 1)
      }
      const browsers = [...browserCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([browser, count]) => ({ browser, count }))

      // Views by day
      const dayMap = new Map<string, { views: number; sessions: Set<string> }>()
      for (const doc of docs) {
        const day = doc.createdAt.slice(0, 10)
        const entry = dayMap.get(day) ?? { views: 0, sessions: new Set() }
        entry.views++
        entry.sessions.add(doc.sessionHash)
        dayMap.set(day, entry)
      }
      const viewsByDay = [...dayMap.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, { views, sessions }]) => ({ date, views, unique: sessions.size }))

      setData({
        totalViews: docs.length,
        uniqueVisitors: uniqueSessions.size,
        topPages,
        devices,
        browsers,
        viewsByDay,
      })
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const maxDayViews = data ? Math.max(...data.viewsByDay.map((d) => d.views), 1) : 1

  return (
    <div className="analytics-dashboard">
      <div className="analytics-dashboard__header">
        <h3 className="analytics-dashboard__title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 8 }}>
            <path d="M3 3v18h18" />
            <path d="M18 17V9" />
            <path d="M13 17V5" />
            <path d="M8 17v-3" />
          </svg>
          Bezoekers
        </h3>
        <div className="analytics-dashboard__periods">
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`analytics-dashboard__period-btn ${p === period ? 'analytics-dashboard__period-btn--active' : ''}`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="analytics-dashboard__loading">Laden...</div>
      ) : !data ? (
        <div className="analytics-dashboard__empty">Geen data beschikbaar</div>
      ) : (
        <>
          {/* Stats cards */}
          <div className="analytics-dashboard__stats">
            <div className="analytics-dashboard__stat-card">
              <div className="analytics-dashboard__stat-value">{data.totalViews.toLocaleString('nl-NL')}</div>
              <div className="analytics-dashboard__stat-label">Paginaweergaven</div>
            </div>
            <div className="analytics-dashboard__stat-card">
              <div className="analytics-dashboard__stat-value">{data.uniqueVisitors.toLocaleString('nl-NL')}</div>
              <div className="analytics-dashboard__stat-label">Unieke bezoekers</div>
            </div>
            <div className="analytics-dashboard__stat-card">
              <div className="analytics-dashboard__stat-value">
                {data.totalViews > 0 ? (data.totalViews / data.uniqueVisitors).toFixed(1) : '0'}
              </div>
              <div className="analytics-dashboard__stat-label">Pagina's / bezoeker</div>
            </div>
          </div>

          {/* Bar chart */}
          {data.viewsByDay.length > 0 && (
            <div className="analytics-dashboard__chart">
              <div className="analytics-dashboard__chart-title">Weergaven per dag</div>
              <div className="analytics-dashboard__chart-bars">
                {data.viewsByDay.map((day) => (
                  <div key={day.date} className="analytics-dashboard__chart-col" title={`${day.date}: ${day.views} weergaven, ${day.unique} uniek`}>
                    <div className="analytics-dashboard__chart-bar-wrapper">
                      <div
                        className="analytics-dashboard__chart-bar analytics-dashboard__chart-bar--views"
                        style={{ height: `${(day.views / maxDayViews) * 100}%` }}
                      />
                      <div
                        className="analytics-dashboard__chart-bar analytics-dashboard__chart-bar--unique"
                        style={{ height: `${(day.unique / maxDayViews) * 100}%` }}
                      />
                    </div>
                    <div className="analytics-dashboard__chart-label">
                      {day.date.slice(5)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="analytics-dashboard__chart-legend">
                <span className="analytics-dashboard__legend-item">
                  <span className="analytics-dashboard__legend-dot analytics-dashboard__legend-dot--views" />
                  Weergaven
                </span>
                <span className="analytics-dashboard__legend-item">
                  <span className="analytics-dashboard__legend-dot analytics-dashboard__legend-dot--unique" />
                  Uniek
                </span>
              </div>
            </div>
          )}

          {/* Tables */}
          <div className="analytics-dashboard__tables">
            {/* Top pages */}
            <div className="analytics-dashboard__table-section">
              <div className="analytics-dashboard__table-title">Populaire pagina's</div>
              <table className="analytics-dashboard__table">
                <tbody>
                  {data.topPages.map((page) => (
                    <tr key={page.path}>
                      <td className="analytics-dashboard__table-path">{page.path}</td>
                      <td className="analytics-dashboard__table-count">{page.views}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Devices & Browsers */}
            <div className="analytics-dashboard__table-section">
              <div className="analytics-dashboard__table-title">Apparaten</div>
              <table className="analytics-dashboard__table">
                <tbody>
                  {data.devices.map((d) => (
                    <tr key={d.device}>
                      <td className="analytics-dashboard__table-path">{d.device === 'desktop' ? 'Desktop' : d.device === 'mobile' ? 'Mobiel' : d.device === 'tablet' ? 'Tablet' : d.device}</td>
                      <td className="analytics-dashboard__table-count">{d.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="analytics-dashboard__table-title" style={{ marginTop: 16 }}>Browsers</div>
              <table className="analytics-dashboard__table">
                <tbody>
                  {data.browsers.map((b) => (
                    <tr key={b.browser}>
                      <td className="analytics-dashboard__table-path">{b.browser}</td>
                      <td className="analytics-dashboard__table-count">{b.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AnalyticsDashboard
