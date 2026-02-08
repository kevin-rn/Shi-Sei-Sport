'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@payloadcms/ui'
import styles from './ThemeToggle.module.css'

// Helper to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

// Helper to set cookie
const setCookie = (name: string, value: string, days: number = 365) => {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`
}

const ThemeToggle = () => {
  const [theme, setTheme] = useState<string | null>(null)
  const pathname = usePathname()
  const { t } = useTranslation()

  // Helper for custom translations (bypasses type checking)
  const tc = (key: string) => t(key as any)

  // Sync with Payload's theme system
  useEffect(() => {
    // Read from cookie (Payload's storage method) or data-theme attribute
    const cookieTheme = getCookie('payload-theme')
    const currentActiveTheme = document.documentElement.getAttribute('data-theme')
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const finalTheme = cookieTheme || currentActiveTheme || (systemDark ? 'dark' : 'light')

    setTheme(finalTheme)
    document.documentElement.setAttribute('data-theme', finalTheme)

    // Listen for theme changes from Payload's user settings or other sources
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme')
          if (newTheme && newTheme !== theme) {
            setTheme(newTheme)
          }
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    // Cleanup
    return () => observer.disconnect()
  }, [theme])

  const toggleTheme = () => {
    const current = theme || 'light'
    const newTheme = current === 'light' ? 'dark' : 'light'

    // Update state
    setTheme(newTheme)

    // Update DOM (what Payload reads)
    document.documentElement.setAttribute('data-theme', newTheme)

    // Update cookie (Payload's storage)
    setCookie('payload-theme', newTheme)

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: newTheme } }))
  }

  if (theme === null) return null

  // Check if we are on the login page
  const isLoginPage = pathname?.includes('/login')

  return (
    <div
      onClick={toggleTheme}
      // Apply base container class AND conditionally apply the login override
      className={`${styles.container} ${isLoginPage ? styles.loginPosition : ''}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggleTheme()
        }
      }}
      aria-label={`${tc('custom:theme')}: ${theme === 'light' ? tc('custom:light') : tc('custom:dark')}`}
    >
      <div className={styles.track}>
        <div
          className={`${styles.knob} ${theme === 'dark' ? styles.knobDark : ''}`}
        />
      </div>

      <span className={styles.label}>
        {tc('custom:theme')}: {theme === 'light' ? tc('custom:light') : tc('custom:dark')}
      </span>
    </div>
  )
}

export default ThemeToggle
